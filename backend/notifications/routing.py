from django.urls import re_path

from .consumers import NotificationConsumer

websocket_urlpatterns = [
    re_path(r"ws/notification", NotificationConsumer.as_asgi()),
]

# call the route example
# ws://localhost:8000/ws/notification
