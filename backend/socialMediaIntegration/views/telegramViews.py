import datetime
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.request import Request
from django.http import HttpResponse
import requests
import json
from project.settings import env
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from users.models import Account
from ..models import SocialMedia,AccountSocialMedia,Conversation,Message
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.db import transaction


class linkTelegram(GenericAPIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(
    parameters=[
            OpenApiParameter("token", OpenApiTypes.STR, OpenApiParameter.QUERY),
        ],
    )
    def post(self, request):
        if request.user.role.role!="owner":
            return Response({"message":"you are not allowed to link telegram account"},status=400)
        token=request.query_params.get("token")
        if AccountSocialMedia.objects.filter(social_media__name=SocialMedia.TELEGRAM,token=token).exists():
            return Response({"message":"this account is already linked to another account"},status=400)
        #send telegram api token to link telegram account
        url=f"https://api.telegram.org/bot{token}/deletewebhook"
        res=requests.get(url)

        url=f"https://api.telegram.org/bot{token}/setWebhook?url={env('ngrok_host')}/api/socialMediaIntegration/telegram/webhook?account_id={request.user.account.id}"
        res=requests.get(url)
        if res.status_code==200:
            socialmedia,created=SocialMedia.objects.get_or_create(name=SocialMedia.TELEGRAM)
            account,created=AccountSocialMedia.objects.get_or_create(social_media=socialmedia,account=request.user.account)
            account.token=token
            account.is_active=True
            account.save()
        return Response(data=res, status=res.status_code)
    
class unlinkTelegram(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        if request.user.role.role!="owner":
            return Response({"message":"you are not allowed to unlink telegram account"},status=400)
        #send telegram api token to link telegram account

        account=AccountSocialMedia.objects.get(social_media__name=SocialMedia.TELEGRAM,account=request.user.account)
        url=f"https://api.telegram.org/bot{account.token}/deletewebhook"
        res=requests.get(url)
        if res.status_code==200:
            account.delete()
            return Response(data={"message":"account unlinked successfully"}, status=200)
        else:
            return Response(data={"error": "Request failed"}, status=res.status_code)

class telegramWebhook(GenericAPIView):
    def get(self, request):
        pass
        
    def post(self, request):
        #recieve telegram webhook messages and save them in database
        """{'update_id': 338173674, 
            'message': 
                    {'message_id': 13, 'from': 
                                {'id': 1660339899, 'is_bot': False, 'first_name': 'Rabah', 'last_name': 'Aouar', 'username': 'rabah_aouar', 'language_code': 'en'},
                                'chat': {'id': 1660339899, 'first_name': 'Rabah', 'last_name': 'Aouar', 'username': 'rabah_aouar', 'type': 'private'},
                                'date': 1693006977, 'text': 'gg'}}
        """
        with transaction.atomic():
            print(request.data)
            account_id=request.query_params.get('account_id')
            chat_id=request.data['message']['chat']['id']
            message_id=request.data['message']['message_id']
            date=float(request.data['message']['date'])
            date=datetime.datetime.fromtimestamp(date)
            # test if the username exists or no in the message
            if 'username' in request.data['message']['from']:
                sender_username=request.data['message']['from']['username']
            else:
                sender_username=""
            if 'first_name' in request.data['message']['from']:
                sender_first_name=request.data['message']['from']['first_name']
            else:
                sender_first_name=""
            if 'last_name' in request.data['message']['from']:
                sender_last_name=request.data['message']['from']['last_name']
            else:
                sender_last_name=""
            if 'text' in request.data['message']:
                message_text=request.data['message']['text']
                with transaction.atomic():
                    account,created=Account.objects.get_or_create(id=account_id)
                    sociamediaaccount,created_acc=AccountSocialMedia.objects.get_or_create(social_media__name=SocialMedia.TELEGRAM,account__id=account_id)
                    conversation,created_conv=Conversation.objects.get_or_create(conversation_id=chat_id,account_social_media=sociamediaaccount)
                    if created_conv:
                        conversation.sender_username=sender_username
                        conversation.sender_first_name=sender_first_name
                        conversation.sender_last_name=sender_last_name
                        conversation.save()
                        sociamediaaccount.account.department_set.filter(department_name=env("default_department_name")).first().conversation_set.add(conversation)
                        Message.objects.create(conversation=conversation,message=message_text,message_id=message_id,created_at=date)
                    else:
                        Message.objects.create(conversation=conversation,message=message_text,message_id=message_id,created_at=date)
        return HttpResponse()



class sendTelegramMessage(GenericAPIView):
    permission_classes = [IsAuthenticated]
    #send message to telegram
    @extend_schema(
    parameters=[
            OpenApiParameter("conversation_id", OpenApiTypes.STR, OpenApiParameter.QUERY),
            OpenApiParameter("message", OpenApiTypes.STR, OpenApiParameter.QUERY),
        ],
    )
    def post(self,request):
        if request.user.role.role=="owner":
            account=request.user.account
        else:
            account=request.user.department_set.first().account
        token=AccountSocialMedia.objects.get(account=account,social_media__name=SocialMedia.TELEGRAM).token
        conversation_id=request.query_params.get("conversation_id")
        message=request.query_params.get("message")
        url=f"https://api.telegram.org/bot{token}/sendMessage?chat_id={conversation_id}&text={message}"
        res=requests.get(url)
        if res.status_code == 200:
            try:
                with transaction.atomic():
                    result_data = res.json()  # Parse JSON response
                    message_id = result_data['result']['message_id']
                    chat_id=result_data['result']['chat']['id']
                    conv=Conversation.objects.get(conversation_id=chat_id,account_social_media__account=account)
                    Message.objects.create(conversation=conv, message=message, message_id=message_id,from_customer=False)
                return Response(data=result_data, status=res.status_code)
            except ValueError:
                return Response(data={"error": "Invalid JSON response"}, status=500)
        else:
            return Response(data={"error": "Request failed"}, status=res.status_code)
