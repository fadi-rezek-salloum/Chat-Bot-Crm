from django.db import close_old_connections
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from users.models import User

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    @sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    async def __call__(self, scope, receive, send):
        close_old_connections()
        query_string = scope.get("query_string", b"").decode("utf8")
        token = parse_qs(query_string).get("token", [None])[0]

        if not token:
            return None

        try:
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            # Handle token validation errors
            print(f"Token validation error: {e}")
            return None

        decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        if "user_id" in decoded_data:
            user_id = decoded_data["user_id"]
            user = await self.get_user(user_id)
            if user:
                scope['user'] = user

        return await self.inner(scope, receive, send)