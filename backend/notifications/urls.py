from .views import ReadNotificationView,ReadAllNotificationView,NotificationView
from django.urls import path

urlpatterns = [
    path('read/<int:pk>',ReadNotificationView.as_view()),
    path('readAll',ReadAllNotificationView.as_view()),
    path('',NotificationView.as_view()),
]
