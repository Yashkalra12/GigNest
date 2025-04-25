from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_conversation, name='create_conversation'),
    path('', views.get_conversations, name='get_conversations'),
    path('single/<str:id>/', views.get_single_conversation, name='get_single_conversation'),
    path('<str:id>/', views.update_conversation, name='update_conversation'),
]
