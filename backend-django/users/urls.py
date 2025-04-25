from django.urls import path
from . import views

urlpatterns = [
    path('delete/<str:id>/', views.delete_user, name='delete_user'),
    path('fetchUser/', views.fetch_user, name='fetch_user'),
    path('<str:id>/', views.get_user, name='get_user'),
]
