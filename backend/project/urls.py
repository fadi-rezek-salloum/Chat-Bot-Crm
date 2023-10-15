from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


def render_react(request):
    return render(request, "index.html")


def render_admin_react(request):
    return render(request, "index_admin.html")


urlpatterns = [ 
    path('api/admin/', admin.site.urls),

    path('api/socialMediaIntegration/',include("socialMediaIntegration.urls")),

    path('api/users/',include("users.urls")),

    path('api/departments/',include("departments.urls")),
    
    path('api/payments/',include("payments.urls")),

    path('api/notifications/',include("notifications.urls")),

    # YOUR PATTERNS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    #path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

#    re_path(r"^$", render_react),
 #   re_path(r"^(?:.*)/?$", render_react),

#    path("/", render_react),
    re_path(r'^admin/.*$', render_admin_react),
    re_path(r'^.*$', render_react),
]
