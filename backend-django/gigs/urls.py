from django.urls import path
from . import views

urlpatterns = [
    path('topgigs/', views.get_top_gigs, name='get_top_gigs'),
    path('', views.create_gig, name='create_gig'),
    path('edit/<str:id>/', views.edit_gig, name='edit_gig'),
    path('delete/<str:id>/', views.delete_gig, name='delete_gig'),
    path('single/<str:id>/', views.get_gig, name='get_gig'),
    path('', views.get_gigs, name='get_gigs'),
]
