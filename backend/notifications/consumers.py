import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from .serializers import NotificationSerializer
from asgiref.sync import sync_to_async
class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.user = self.scope['user']
        await self.channel_layer.group_add(
            self.user.username,
            self.channel_name
        )
        """
        print("Connected")
        self.notifications = await self.get_notifications()
        await self.send(text_data=json.dumps({
            'notifications': self.notifications
        }))
        """

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user.username,
            self.channel_name
        )

    async def notification_send(self, event):
        notification = event['value']
        await self.send(text_data=json.dumps({
            'notification': notification
        }))
    @sync_to_async
    def get_notifications(self):
        notifications = []
        queryset = Notification.objects.filter(user=self.user)
        for notification in queryset:
            notifications.append({
                'id': notification.id,
                'message': notification.message,
                'created_at': notification.created_at.strftime("%b %d %Y %H:%M:%S"),
                'is_read': notification.is_read,
                'conversation_id': notification.conversation_id
            })
        return notifications