from django.urls import path,include
from .views import featureView,featureDetailView,planView,planDetailView,subscriptionView,subscriptionWebhook,ownerSubscriptionView, DashBoardinfoForadmin,paymentView

urlpatterns = [
    path('features',featureView.as_view(),name='features'),
    path('features/<int:pk>',featureDetailView.as_view(),name='feature-detail'),

    path('plans',planView.as_view(),name='plans'),
    path('plans/<int:pk>',planDetailView.as_view(),name='plan-detail'),

    path('subscriptions',subscriptionView.as_view(),name='subscriptions'),

    path('subscriptions/<str:owner_id>',ownerSubscriptionView.as_view(),name='subscription-detail'),

    path('dashboard',DashBoardinfoForadmin.as_view(),name='dashboard'),



    path('webhook/clickpay/<str:owner_id>',subscriptionWebhook.as_view(),name='click-webhook'),

    path('payment',paymentView.as_view(),name='payment'),

]
