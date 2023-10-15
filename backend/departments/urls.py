from .views import DepartmentView,DepartmentDetailView
from django.urls import path,include
from rest_framework import routers
from .views import agentView,agentDetailView

urlpatterns = [
    path('',DepartmentView.as_view(),name='departments'),
    path('<int:pk>',DepartmentDetailView.as_view(),name='department-detail'),
        
    path('agents/', agentView.as_view(), name='agents'),
    path('agents/<str:pk>/', agentDetailView.as_view(), name='agent-detail' ),
]
