from django.urls import re_path
from .consumers import SocialMediaIntegrationConsumer


websocket_urlpatterns_socialMedia = [
    #path for revieced message from social media and send them  to the user
    re_path(r"api/ws/socialMediaIntegration", SocialMediaIntegrationConsumer.as_asgi()),
]
