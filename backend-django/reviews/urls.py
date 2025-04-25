from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_review, name='create_review'),
    path('<str:gig_id>/', views.get_reviews, name='get_reviews'),
    path('delete/<str:id>/', views.delete_review, name='delete_review'),
]
