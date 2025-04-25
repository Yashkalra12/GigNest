from django.urls import path
from . import views

urlpatterns = [
    path('checkout/', views.CreatePaymentView.as_view(), name='create_payment'),
    path('verify-payment/', views.PaymentVerificationView.as_view(), name='payment_verification'),
]
