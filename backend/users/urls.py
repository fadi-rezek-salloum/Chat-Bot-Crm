from .views import emailVerificationView, roleView,ownerView,requestPasswordResetView,passwordResetView,resendVerificationEmailView,changePasswordView,blockUserView,unblockUserView,ownerDetailView,getAllOwnersView,MyTokenView,ownerDashboardView

from django.urls import path,include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView

urlpatterns = [
    path('roles',roleView.as_view({'get':'list'}),name='roles'),

    path('owner',ownerView.as_view(),name='owner'),
    path('owners',getAllOwnersView.as_view(),name='owners'),
    path('owner/details',ownerDetailView.as_view(),name='owner-detail'),

    
    path('dashboard',ownerDashboardView.as_view(),name='owner-dashboard'),



    path('token',MyTokenView.as_view(),name='token_obtain_pair'),
    path('token/refresh',TokenRefreshView.as_view(),name='token_refresh'),
    path('token/verify',TokenVerifyView.as_view(),name='token_verify'),


    path('verify-email/<str:uidb64>/<str:token>/', emailVerificationView.as_view(), name='verify-email'),
    path('resend-verification-email',resendVerificationEmailView.as_view(),name='resend-verification-email'),


    path('change-password',changePasswordView.as_view(),name='change-password'),
    path('request-password-reset',requestPasswordResetView.as_view(),name='request-password-reset'),
    path('reset-password/<str:uidb64>/<str:token>/', passwordResetView.as_view(), name='reset-password'),
    
    path('block-user',blockUserView.as_view(),name='block-user'),
    path('unblock-user',unblockUserView.as_view(),name='unblock-user'),
]

