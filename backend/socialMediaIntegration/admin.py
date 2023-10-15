from django.contrib import admin
from .models import SocialMedia,AccountSocialMedia,Conversation,Message
# Register your models here.
admin.site.register(SocialMedia)
admin.site.register(AccountSocialMedia)
admin.site.register(Conversation)
admin.site.register(Message)