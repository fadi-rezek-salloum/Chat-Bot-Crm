from django.db import models
from users.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync,sync_to_async
# Create your models here.





class Notification(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='received_notifications',null=True,blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    conversation_id = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        ordering = ['-created_at']
    def __str__(self):
        return self.message
    
    def save(self, *args,**kwargs):
        channel_layer=get_channel_layer()
        print(f"this is channel layer {channel_layer}")
        super(Notification,self).save(*args ,**kwargs)
        notif={
            'id':self.id,
            'message':self.message,
            'created_at':self.created_at.strftime("%b %d %Y %H:%M:%S"),
            'is_read':self.is_read,
            'conversation_id':self.conversation_id
        }
        async_to_sync(channel_layer.group_send)(
            self.user.username,
            {
                'type':'notification.send',
                'value':notif
            }
        )
        print("notification sent to user")
