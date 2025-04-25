import razorpay
import hashlib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from django.conf import settings

# Set up Razorpay instance
instance = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreatePaymentView(APIView):
    def post(self, request):
        if request.user.isSeller:
            return Response({"error": "Sellers cannot buy gigs"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            amount = request.data.get("amount") * 100  # Razorpay expects the amount in paise
            order = instance.orders.create(dict(amount=amount, currency="INR"))
            return Response({"success": True, "order": order}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "message": "Something went wrong", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentVerificationView(APIView):
    def post(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        # Creating the expected signature
        body = f"{razorpay_order_id}|{razorpay_payment_id}"
        expected_signature = hashlib.sha256(body.encode("utf-8")).hexdigest()

        if expected_signature == razorpay_signature:
            # Save payment details to the database
            Payment.objects.create(
                razorpay_order_id=razorpay_order_id,
                razorpay_payment_id=razorpay_payment_id,
                razorpay_signature=razorpay_signature
            )
            return Response({
                "success": True,
                "orderId": razorpay_order_id,
                "paymentId": razorpay_payment_id
            }, status=status.HTTP_200_OK)
        else:
            return Response({"success": False}, status=status.HTTP_400_BAD_REQUEST)
