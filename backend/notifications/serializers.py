from .models import Notification
from rest_framework import serializers

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'message', 'created_at', 'is_read', 'conversation_id')
        read_only_fields = ('id', 'created_at', 'is_read', 'conversation_id')