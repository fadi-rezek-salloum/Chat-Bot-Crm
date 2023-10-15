from django.db import models
from users.models import Account
from departments.models import Department
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync,sync_to_async
from datetime import datetime
# Create your models here.
class SocialMedia(models.Model):
    #social media choices
    FACEBOOK="facebook"
    TELEGRAM="telegram"
    INSTAGRAM="instagram"
    WHATSAPP="whatsapp"
    CHOICES=(
        (FACEBOOK,"facebook"),
        (TELEGRAM,"telegram"),
        (INSTAGRAM,"instagram"),
        (WHATSAPP,"whatsapp")
    )
    name=models.CharField(max_length=100,unique=True,choices=CHOICES)
    def __str__(self):
        return self.name

class AccountSocialMedia(models.Model):
    account=models.ForeignKey(Account,on_delete=models.CASCADE)
    social_media=models.ForeignKey(SocialMedia,on_delete=models.CASCADE)
    social_media_account_id=models.CharField(max_length=100,null=True,blank=True)
    token=models.CharField(max_length=100)
    is_active=models.BooleanField(default=True)
    def __str__(self):
        return self.social_media.name+"  account of " +self.account.user.username
    
class Conversation(models.Model):
    conversation_id=models.CharField(max_length=100)
    created_at=models.DateTimeField(auto_now_add=True)
    last_message_time=models.DateTimeField(null=True,blank=True)
    sender_username=models.CharField(max_length=100,default="")
    sender_first_name=models.CharField(max_length=100,default="")
    sender_last_name=models.CharField(max_length=100,default="")
    account_social_media=models.ForeignKey(AccountSocialMedia,on_delete=models.CASCADE)
    deparetment=models.ManyToManyField(Department)
    is_read=models.BooleanField(default=False)
    class Meta:
        ordering = ['-last_message_time']
    def __str__(self):
        return self.conversation_id

class Message(models.Model):
    message_id=models.CharField(max_length=400,null=True)
    created_at=models.DateTimeField(default=datetime.now)
    message=models.TextField()
    from_customer=models.BooleanField(default=True)
    conversation=models.ForeignKey(Conversation,on_delete=models.CASCADE)

    class Meta: 
        ordering = ['-created_at']
    def __str__(self):
        return self.message
    # send the message to all conversation deparments when it is created
    def save(self,*args,**kwargs):
        channel_layer=get_channel_layer()
        print(f"this is channel layer {channel_layer}")
        super(Message,self).save(*args,**kwargs)
        msg={
            'id':self.id,
            'message':self.message,
            'from_customer':self.from_customer,
            'created_at':self.created_at.strftime("%b %d %Y %H:%M:%S"),
            "conversation_real_id":self.conversation.id,
            'conversation_id':self.conversation.conversation_id,
            'sender_username':self.conversation.sender_username,
            'sender_first_name':self.conversation.sender_first_name,
            'sender_last_name':self.conversation.sender_last_name,
            'account_social_media':self.conversation.account_social_media.social_media.name
        }
        for department in self.conversation.deparetment.all():
            print(str(department.id)+" "+department.department_name)
            async_to_sync(channel_layer.group_send)(
                str(department.id),
                {
                    'type':'message.send',
                    'value':msg
                }
            )
        self.conversation.last_message_time=self.created_at
        self.conversation.is_read=not self.from_customer
        self.conversation.save()




