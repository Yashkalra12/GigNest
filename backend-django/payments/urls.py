from django.urls import path
from . import views

urlpatterns = [
    path('checkout/', views.create_payment, name='create_payment'),
    path('verify-payment/', views.payment_verification, name='payment_verification'),
]
