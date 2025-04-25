from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_conversations, name='get_conversations'),  # GET
    path('create/', views.create_conversation, name='create_conversation'),  # POST
    path('single/<str:id>/', views.get_single_conversation, name='get_single_conversation'),  # GET
    path('<str:id>/', views.update_conversation, name='update_conversation'),  # PUT
]
