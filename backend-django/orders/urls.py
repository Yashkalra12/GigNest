from django.urls import path
from . import views

urlpatterns = [
    path('<str:gig_id>/', views.create_order, name='create_order'),
    path('', views.get_orders, name='get_orders'),
]
