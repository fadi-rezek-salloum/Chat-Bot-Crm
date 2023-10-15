from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.request import Request
from django.http import HttpResponse
import requests
import json
from project.settings import env
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from ..models import SocialMedia,AccountSocialMedia,Conversation,Message
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.db import transaction
from ..functions import exchange_token, exchange_token_whatsapp, sendWhatsappMessage
from rest_framework import status
import datetime


class whatsappWebhook(GenericAPIView):
    def get(self, request):
        # test the verify toekn to validate the webhook
        if request.GET.get('hub.verify_token')==env("faceboob_webhook_verify_token"):
            challenge=self.request.GET.get('hub.challenge')
            return HttpResponse(challenge,content_type='text/plain')
    def post(self, request):
        print(request.data)
        if request.data['entry'][0]['changes'][0]['value'].get('messages'):
            message_id=request.data['entry'][0]['changes'][0]['value']['messages'][0]["id"]
            if not  Message.objects.filter(message_id=message_id).exists() :
                if request.data['entry'][0]['changes'][0]['value']['messages'][0].get("from") and request.data['entry'][0]['changes'][0]['value']['metadata'].get('phone_number_id'):
                    sender_id=request.data['entry'][0]['changes'][0]['value']['messages'][0]["from"]
                    recipient_id=request.data['entry'][0]['changes'][0]['value']['metadata']['phone_number_id']
                    sociamediaaccount,created_acc=AccountSocialMedia.objects.get_or_create(social_media__name=SocialMedia.WHATSAPP,social_media_account_id=recipient_id)
                    if request.data['entry'][0]['changes'][0]['value']['contacts'][0]["profile"].get("name"):
                        sender_username=request.data['entry'][0]['changes'][0]['value']['contacts'][0]["profile"]["name"]
                    else:
                        sender_username=""
                    if request.data['entry'][0]['changes'][0]['value']['messages'][0]['text'].get("body"):
                        print(request.data['entry'][0]['changes'][0]['value']['messages'][0]['text'].get("body"))
                        message_text=request.data['entry'][0]['changes'][0]['value']['messages'][0]['text']['body']
                        if request.data['entry'][0]['changes'][0]['value']['messages'][0].get('timestamp'):
                            message_time=datetime.datetime.fromtimestamp(float(request.data['entry'][0]['changes'][0]['value']['messages'][0]['timestamp']))
                        else:
                            message_time=datetime.datetime.now()
                        with transaction.atomic():
                            conversation,created_conv=Conversation.objects.get_or_create(account_social_media=sociamediaaccount, conversation_id=sender_id)
                            if created_conv:
                                conversation.sender_username=sender_username
                                conversation.sender_first_name=""
                                conversation.sender_last_name=""
                                #conversation.conversation_id=sender_id
                                conversation.save()
                                sociamediaaccount.account.department_set.filter(department_name=env("default_department_name")).first().conversation_set.add(conversation)
                                Message.objects.create(conversation=conversation,message=message_text,message_id=message_id,created_at=message_time)
                            else:
                                Message.objects.create(conversation=conversation,message=message_text,message_id=message_id,created_at=message_time)
        return HttpResponse()

class linkWhatsapp(GenericAPIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(
    parameters=[
            OpenApiParameter("short-live-token", OpenApiTypes.STR, OpenApiParameter.QUERY),
        ],
    )
    def post(self, request):
        if request.user.role.role!="owner":
            return Response({"message":"you are not allowed to link whatsapp account"},status=400)
        token=request.query_params.get("short-live-token")
        #exchange token to long live token
        #exchange the token and get the whatsapp buisness account id
        access_token,waba,account_id=exchange_token_whatsapp(token,env("facebook_app_id"),env("facebook_app_secret"))

        if not access_token or not waba or not account_id:
            return Response({"error":"there is no whatsapp account linked to this account"},status=400)
        
        if AccountSocialMedia.objects.filter(social_media__name=SocialMedia.WHATSAPP,social_media_account_id=account_id).exists():
            return Response({"error":"this account is already linked to another account"},status=status.HTTP_400_BAD_REQUEST)
        
        subscribe_webhook_for_messaging_url=f"https://graph.facebook.com/v17.0/{waba}/subscribed_apps"
        headers = {
            'Content-Type': 'application/json',
            "Authorization": f"Bearer {access_token}"
        }
        res=requests.post(subscribe_webhook_for_messaging_url,headers=headers)
        if res.status_code==200:
            socialmedia,created=SocialMedia.objects.get_or_create(name=SocialMedia.WHATSAPP)
            account,created=AccountSocialMedia.objects.get_or_create(social_media=socialmedia,account=request.user.account)
            account.social_media_account_id=account_id
            account.token=access_token
            account.is_active=True
            account.save()
        res_txt=json.loads(res.text)
        return Response(data=res_txt, status=res.status_code)


class whatsappSendMessage(GenericAPIView):

    permission_classes = [IsAuthenticated]
    @extend_schema(
    parameters=[
            OpenApiParameter("conversation_id", OpenApiTypes.STR, OpenApiParameter.QUERY),
            OpenApiParameter("message", OpenApiTypes.STR, OpenApiParameter.QUERY),
        ],
    )
    def post(self, request):
        #conversation_id is the phone number 
        recipient_id = request.query_params.get("conversation_id")
        message = request.query_params.get("message")
        if not recipient_id or not message:
            return Response({"error": "Missing required parameters"}, status=status.HTTP_400_BAD_REQUEST)
        #get user account
        if request.user.role.role=="owner":
            account=request.user.account
        else:
            account=request.user.department_set.first().account
        print(account)
        #get account social media token
        try:
            socialmediaaccount=AccountSocialMedia.objects.get(account=account,social_media__name=SocialMedia.WHATSAPP)
        except AccountSocialMedia.DoesNotExist:
            return Response({"error":"you are not allowed to do this"},status=status.HTTP_403_FORBIDDEN)
        access_token=socialmediaaccount.token
        waba=socialmediaaccount.social_media_account_id
        res=sendWhatsappMessage(access_token,waba, recipient_id, message)
        print(res)
        return Response(data=res)
        """
        if res["recipient_id"]==recipient_id:
            Message.objects.create(conversation=Conversation.objects.get(conversation_id=recipient_id),message=message,from_customer=False)
            return Response({"message":"message sent successfully"},status=status.HTTP_200_OK)
        else:
            return Response({"error":"message not sent"},status=status.HTTP_400_BAD_REQUEST)
        """


class unlinkWhatsapp(GenericAPIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        if request.user.role.role!="owner":
            return Response({"error":"you are not allowed to do this"},status=status.HTTP_403_FORBIDDEN)
        account=request.user.account
        try:
            socialmediaaccount=AccountSocialMedia.objects.get(account=account,social_media__name=SocialMedia.WHATSAPP)
        except AccountSocialMedia.DoesNotExist:
            return Response({"error":"you are not allowed to do this"},status=status.HTTP_403_FORBIDDEN)
        """
        url=f"https://graph.facebook.com/v17.0/{socialmediaaccount.social_media_account_id}/subscribed_apps?access_token={socialmediaaccount.token}"
        res=requests.delete(url)
        if res.status_code!=200:
            return Response({"error":"an error occured"},status=status.HTTP_400_BAD_REQUEST)
        """
        socialmediaaccount.delete()
        return Response({"message":"account unlinked successfully"},status=status.HTTP_200_OK)
