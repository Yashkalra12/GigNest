from django.urls import path
from . import views

urlpatterns = [
    # URL for creating a new message
    path('create/', views.CreateMessageView.as_view(), name='create_message'),

    # URL for getting messages of a specific conversation
    path('conversation/<int:conversation_id>/', views.GetMessagesView.as_view(), name='get_messages'),
]
