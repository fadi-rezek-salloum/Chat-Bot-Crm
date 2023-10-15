import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")

django.setup()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from notifications.routing import websocket_urlpatterns
from project.middleware import TokenAuthMiddleware
from socialMediaIntegration.routing import websocket_urlpatterns_socialMedia

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddleware(
            AllowedHostsOriginValidator(
                AuthMiddlewareStack(
                    URLRouter(websocket_urlpatterns + websocket_urlpatterns_socialMedia)
                )
            )
        ),
    }
)
# example to call notification route
