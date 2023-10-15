import datetime
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.request import Request
import requests
from departments.models import Department
from ..models import SocialMedia,AccountSocialMedia,Conversation,Message
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.db import transaction
from ..serializers import ConversationSerializer,MessageSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from rest_framework.pagination import LimitOffsetPagination
from notifications.models import Notification
from departments.models import AgentDepartment
class routeConversation(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request,conversation_id, department_id):
        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response(data={"error": "Department not found"}, status=404)
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response(data={"error": "Conversation not found"}, status=404)
        with transaction.atomic():
            conversation.deparetment.add(department)
            conversation.save()
            #create notification for department membres
            for p in AgentDepartment.objects.filter(department=department):
                Notification.objects.create(message="you have a new conversation",user=p.agent)
        return Response(data={"message": "Conversation routed successfully"}, status=200)

class unrouteConversation(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request,conversation_id, department_id):
        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response(data={"error": "Department not found"}, status=404)
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response(data={"error": "Conversation not found"}, status=404)
        with transaction.atomic():
            conversation.deparetment.remove(department)
            conversation.save()
        return Response(data={"message": "Conversation unrouted successfully"}, status=200)
    

class getConversation(GenericAPIView):

    permission_classes = [IsAuthenticated]
    pagination_class = LimitOffsetPagination
    """choices:
        - facebook
        - instagram
        - telegram
        - whatsapp"""
    @extend_schema(
        parameters=[
            OpenApiParameter("choice", OpenApiTypes.STR, OpenApiParameter.QUERY, description="choice"),
            OpenApiParameter("limit", OpenApiTypes.INT, OpenApiParameter.QUERY, description="Number of items to return per page"),
            OpenApiParameter("offset", OpenApiTypes.INT, OpenApiParameter.QUERY, description="Number of items to skip"),
        ],
    )
    def get(self, request):
            # return all conversations of department of the user
            choice = request.query_params.get("choice")
            
            if request.user.role.role == "owner":
                conversations = request.user.account.department_set.first().conversation_set.filter(
                    account_social_media__social_media__name=choice
                )
            elif request.user.role.role == "agent":
                conversations = request.user.department_set.first().conversation_set.filter(
                    account_social_media__social_media__name=choice
                )
            else:
                return Response(data={"error": "user has no role"}, status=404)

            # Apply pagination using the global settings
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(conversations, request)
            
            serializer = ConversationSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)

class getMessages(GenericAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = LimitOffsetPagination  # Use the same paginator class

    @extend_schema(
        parameters=[
            OpenApiParameter("conversation_id", OpenApiTypes.STR, OpenApiParameter.QUERY, description="conversation_id"),
            OpenApiParameter("limit", OpenApiTypes.INT, OpenApiParameter.QUERY, description="Number of items to return per page"),
            OpenApiParameter("offset", OpenApiTypes.INT, OpenApiParameter.QUERY, description="Number of items to skip"),
        ],
    )
    def get(self, request):
        # Return all messages of a conversation
        conversation_id = request.query_params.get("conversation_id")
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            conversation.is_read = True
            conversation.save()
        except :
            return Response(data={"error": "Conversation not found"}, status=404)
        
        messages = Message.objects.filter(conversation__id=conversation_id)

        # Apply pagination using the global settings
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(messages, request)

        serializer = MessageSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class conversationRead(GenericAPIView):
    permission_classes = [IsAuthenticated]
    """
    mark conversation as read
    conversation_id == id
    """
    def post(self, request,conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            conversation.is_read = True
            conversation.save()
        except Conversation.DoesNotExist:
            return Response(data={"error": "Conversation not found"}, status=404)
        return Response(data={"message": "Conversation read successfully"}, status=200)


class SocialMediaAndUnreadConversations(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def get(self ,request):
        # return all unread conversations of department of the user
        if request.user.role.role == "owner":
            #get if there is conversations of the account that are not read
            account=request.user.account
            social_media_accounts=AccountSocialMedia.objects.filter(account=account)
            social_media_list=[]
            for social_media_account in social_media_accounts:
                #get all conversations of the account
                if Conversation.objects.filter(account_social_media=social_media_account,is_read=False).exists():
                    res={"social_media":social_media_account.social_media.name,"unread_conversations":True}
                    social_media_list.append(res)
                else:
                    res={"social_media":social_media_account.social_media.name,"unread_conversations":False}
                    social_media_list.append(res)
        elif request.user.role.role == "agent":
            account=request.user.department_set.first().account
            social_media_accounts=AccountSocialMedia.objects.filter(account=account)
            social_media_list=[]
            for social_media_account in social_media_accounts:
                #get all conversations of the account
                if request.user.department_set.first().conversation_set.filter(account_social_media=social_media_account,is_read=False).exists():
                    res={"social_media":social_media_account.social_media.name,"unread_conversations":True}
                    social_media_list.append(res)
                else:
                    res={"social_media":social_media_account.social_media.name,"unread_conversations":False}
                    social_media_list.append(res)
        #get all social media accounts of the account
        
        return Response(data=social_media_list,status=200)