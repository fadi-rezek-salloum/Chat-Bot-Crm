from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse
import requests
import json
from project.settings import env
from ..functions import exchange_token, subscribe_webhook_for_messaging, get_all_facebook_conversations,sendMessage
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from ..models import SocialMedia,AccountSocialMedia,Conversation,Message
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.db import transaction
import datetime
from users.models import Account

class facebookWebhook(GenericAPIView):
    def get(self, request):
        # test the verify toekn to validate the webhook
        if request.GET.get('hub.verify_token')==env("faceboob_webhook_verify_token"):
            challenge=self.request.GET.get('hub.challenge')
            return HttpResponse(challenge,content_type='text/plain')
        else:
            return HttpResponse('Error, invalid token', status=403)
    def post(self, request):
        #message_time=datetime.datetime.fromtimestamp(request.data['entry'][0]['messaging'][0]['timestamp'])
        message_id=request.data['entry'][0]['messaging'][0]['message']['mid']
        if not  Message.objects.filter(message_id=message_id).exists() and request.data['entry'][0]['messaging'][0]['message'].get('text'):
            sender_id=request.data['entry'][0]['messaging'][0]['sender']['id']
            recipient_id=request.data['entry'][0]['messaging'][0]['recipient']['id']
            sociamediaaccount,created_acc=AccountSocialMedia.objects.get_or_create(social_media__name=SocialMedia.FACEBOOK,social_media_account_id=recipient_id)
            # get sender info
            url=f"https://graph.facebook.com/v17.0/{sender_id}?fields=name&access_token={sociamediaaccount.token}"
            res=requests.get(url)
            res_format_json=json.loads(res.content)
            sender_username=res_format_json['name']
            #test if the message exists
            message_text=request.data['entry'][0]['messaging'][0]['message']['text']
            created_at=datetime.datetime.now()
            with transaction.atomic():
                conversation,created_conv=Conversation.objects.get_or_create(account_social_media=sociamediaaccount,conversation_id=sender_id)
                if created_conv:
                    conversation.sender_username=sender_username
                    conversation.sender_first_name=""
                    conversation.sender_last_name=""
                    #conversation.conversation_id=sender_id
                    conversation.save()
                    sociamediaaccount.account.department_set.filter(department_name=env("default_department_name")).first().conversation_set.add(conversation)
                    Message.objects.create(conversation=conversation,message=message_text,message_id=message_id,created_at=created_at)
                else:
                    Message.objects.create(conversation=conversation,message=message_text,message_id=message_id,created_at=created_at)
        return HttpResponse()


class linkFacebookPage(GenericAPIView):
    app_secret = env("facebook_app_secret")
    app_id = env("facebook_app_id")

    @extend_schema(
        parameters=[
            OpenApiParameter("short-live-token", OpenApiTypes.STR, OpenApiParameter.QUERY),
        ],
    )
    def post(self, request):
        short_live_token = request.query_params.get("short-live-token")

        if not short_live_token:
            raise ValidationError("Missing 'short-live-token' query parameter.")
        if request.user.role.role!="owner":
            return Response({"error":"you are not allowed to do this"},status=status.HTTP_403_FORBIDDEN)
        long_live_token,social_media_account_id = exchange_token(short_live_token, self.app_id, self.app_secret)
        if not long_live_token and not social_media_account_id:
            return Response({"error":"an error occured"},status=status.HTTP_400_BAD_REQUEST)
        
        if AccountSocialMedia.objects.filter(social_media__name=SocialMedia.FACEBOOK,social_media_account_id=social_media_account_id).exists():
            return Response({"error":"this account is already linked to another account"},status=status.HTTP_400_BAD_REQUEST)
        res = subscribe_webhook_for_messaging(long_live_token, objet="messenger")
        
        if res["success"]:
            socialmedia,created=SocialMedia.objects.get_or_create(name=SocialMedia.FACEBOOK)
            account,created=AccountSocialMedia.objects.get_or_create(social_media=socialmedia,account=request.user.account)
            account.token=long_live_token
            account.social_media_account_id=social_media_account_id
            account.is_active=True
            account.save()
            print(res)
            return Response(data=res,status=status.HTTP_200_OK)
        else:
            return Response(data=res,status=status.HTTP_400_BAD_REQUEST)



"""
class getFacebookConversations(GenericAPIView):
    @extend_schema(
        parameters=[
            OpenApiParameter("conversation_id", OpenApiTypes.STR, OpenApiParameter.QUERY, description="Conversation ID"),
        ],
    )
    def get(self, request):
        conversation_id = request.query_params.get("conversation_id")
        if not conversation_id:
            raise ValidationError("Missing 'conversation_id' query parameter.")
        
        
        try:

            conversations = get_all_facebook_conversations(conversation_id, access_token)
            return Response(conversations, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""






class sendFacebookMessage(GenericAPIView):
    permission_classes=[IsAuthenticated]
    @extend_schema(
    parameters=[
            OpenApiParameter("conversation_id", OpenApiTypes.STR, OpenApiParameter.QUERY, description="conversation id and not the id"),
            OpenApiParameter("message", OpenApiTypes.STR, OpenApiParameter.QUERY, description="Message content"),
        ],
    )
    def post(self,request):
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
            socialmediaaccount=AccountSocialMedia.objects.get(account=account,social_media__name=SocialMedia.FACEBOOK)
        except AccountSocialMedia.DoesNotExist:
            return Response({"error":"you are not allowed to do this"},status=status.HTTP_403_FORBIDDEN)
        access_token=socialmediaaccount.token
        try:
            res=sendMessage(access_token, recipient_id, message)
            if res["recipient_id"]==recipient_id:
                Message.objects.create(conversation=Conversation.objects.get(conversation_id=recipient_id,account_social_media__account=account),message=message,from_customer=False)
                return Response({"message":"message sent successfully"},status=status.HTTP_200_OK)
            else:
                return Response({"error":"message not sent"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class unlinkFacebookPage(GenericAPIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        if request.user.role.role!="owner":
            return Response({"error":"you are not allowed to do this"},status=status.HTTP_403_FORBIDDEN)
        account=request.user.account
        try:
            socialmediaaccount=AccountSocialMedia.objects.get(account=account,social_media__name=SocialMedia.FACEBOOK)
        except AccountSocialMedia.DoesNotExist:
            return Response({"error":"you are not allowed to do this"},status=status.HTTP_403_FORBIDDEN)
        """
        url=f"https://graph.facebook.com/v17.0/me/subscribed_apps?access_token={socialmediaaccount.token}"
        res=requests.delete(url)
        if res.status_code!=200:
            return Response({"error":"an error occured"},status=status.HTTP_400_BAD_REQUEST)
        """
        socialmediaaccount.delete()
        return Response({"message":"account unlinked successfully"},status=status.HTTP_200_OK)
