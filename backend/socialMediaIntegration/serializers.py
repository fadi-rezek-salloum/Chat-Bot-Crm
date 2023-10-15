from .models import Conversation, Message
from rest_framework import serializers

class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField("get_last_message")
    last_message_time = serializers.SerializerMethodField("get_last_message_time")
    account_social_media_name = serializers.CharField(source="account_social_media.social_media.name", read_only=True)
    class Meta:
        model = Conversation
        fields = "__all__"
    def get_last_message(self, obj):
        try:
            last_message = obj.message_set.first().message
        except:
            last_message = ""
        return last_message
    def get_last_message_time(self, obj):
        try:
            last_message_time = obj.message_set.first().created_at
        except:
            last_message_time = ""
        return last_message_time

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"