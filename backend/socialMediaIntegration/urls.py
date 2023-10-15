from django.urls import path
from .views.facebookViews import facebookWebhook,linkFacebookPage,sendFacebookMessage,unlinkFacebookPage
from .views.instagramViews import instagramWebhook,linkInstagram,sendInstagramMessage,unlinkInstagram
from .views.whatsappViews import whatsappWebhook,linkWhatsapp,whatsappSendMessage,unlinkWhatsapp
from .views.telegramViews import telegramWebhook,linkTelegram,unlinkTelegram ,sendTelegramMessage
from .views.routingConversationsViews import routeConversation,unrouteConversation,getConversation,getMessages,conversationRead,SocialMediaAndUnreadConversations
urlpatterns = [
    path("route-conversation/<int:conversation_id>/<int:department_id>",routeConversation.as_view()),
    path("unroute-conversation/<int:conversation_id>/<int:department_id>",unrouteConversation.as_view()),
    path("get-conversation",getConversation.as_view()),
    path("get-messages",getMessages.as_view()),
    path("conversation-read/<str:conversation_id>",conversationRead.as_view()),
    path("social-media-and-unread-conversations",SocialMediaAndUnreadConversations.as_view()),


    path('telegram/webhook', telegramWebhook.as_view() ),
    path('telegram/link-account',linkTelegram.as_view()),
    path('telegram/unlink-account',unlinkTelegram.as_view()),
    path('telegram/send_message',sendTelegramMessage.as_view()),




    path('facebook/webhook', facebookWebhook.as_view()),
    path('facebook/link-account',linkFacebookPage.as_view()),
    path('facebook/send_message',sendFacebookMessage.as_view()),
    path('facebook/unlink-account',unlinkFacebookPage.as_view()),


    path('instagram/webhook', instagramWebhook.as_view()),
    path('instagram/link-account',linkInstagram.as_view()),
    path('instagram/send_message',sendInstagramMessage.as_view()),
    path('instagram/unlink-account',unlinkInstagram.as_view()),

    path('whatsapp/webhook', whatsappWebhook.as_view() ),
    path('whatsapp/link-account',linkWhatsapp.as_view()),
    path('whatsapp/send_message',whatsappSendMessage.as_view()),
    path('whatsapp/unlink-account',unlinkWhatsapp.as_view()),
]
"""
    path('webhook/facebook', facebookWebhook.as_view()),
    path('link-facebook',linkFacebookPage.as_view()),
    path('get_all_facebook_conversations',getFacebookConversations.as_view()),
    path('send_facebook_message',sendFacebookMessage.as_view()),

    path('webhook/instagram', instagramWebhook.as_view()),
    path('link-instagram',linkInstagram.as_view()),
    path('send_instagram_message',sendInstagramMessage.as_view()),

    path('webhook/whatsapp', whatsappWebhook.as_view() ),
"""