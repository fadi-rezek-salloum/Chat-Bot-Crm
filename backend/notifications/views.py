from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from .serializers import NotificationSerializer

# Create your views here.
class ReadNotificationView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,pk):
        #get the notification
        try:
            notification=request.user.received_notifications.get(pk=pk)
        except:
            return Response({"message":"notification does not exist"},status=status.HTTP_400_BAD_REQUEST)
        notification.is_read=True
        notification.save()
        return Response({"message":"notification read successfully"},status=status.HTTP_200_OK)

class ReadAllNotificationView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        #get the notifications
        notifications=request.user.received_notifications.all()
        for notification in notifications:
            notification.is_read=True
            notification.save()
        return Response({"message":"notifications read successfully"},status=status.HTTP_200_OK)
    
class NotificationView(GenericAPIView):
    permission_classes=[IsAuthenticated]
    pagination_class = LimitOffsetPagination
    serializer_class = NotificationSerializer
    @extend_schema(
        parameters=[
            OpenApiParameter("limit", OpenApiTypes.INT, OpenApiParameter.QUERY, description="Number of items to return per page"),
            OpenApiParameter("offset", OpenApiTypes.INT, OpenApiParameter.QUERY, description="Number of items to skip"),
        ],
    )
    def get(self,request):
        #get the notifications
        notifications=request.user.received_notifications.all()
        page = self.paginate_queryset(notifications)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
        

