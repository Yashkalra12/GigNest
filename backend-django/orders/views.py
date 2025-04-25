from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer
from gigs.models import Gig
from users.models import User

class CreateOrderView(APIView):
    def post(self, request, gig_id):
        try:
            # Check if the gig exists
            gig = Gig.objects.get(id=gig_id)
            if not gig:
                return Response({"error": "Gig not found"}, status=status.HTTP_404_NOT_FOUND)

            # Sellers cannot buy gigs
            if request.user.isSeller:
                return Response({"error": "Sellers cannot buy a gig"}, status=status.HTTP_400_BAD_REQUEST)

            order = Order(
                gigId=gig.id,
                img=gig.cover,
                title=gig.title,
                price=gig.price,
                sellerId=gig.userId,
                buyerId=request.user.id,
                buyerName=request.data.get("buyerName"),
                sellerName=request.data.get("sellerName"),
                payment_intent=request.data.get("orderId")
            )

            # Update seller's order count and gig's sales count
            User.objects.filter(id=gig.userId).update(orders=F('orders') + 1)
            Gig.objects.filter(id=gig.id).update(sales=F('sales') + 1)

            order.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

        except Gig.DoesNotExist:
            return Response({"error": "Gig not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetOrdersView(APIView):
    def get(self, request):
        # Filter orders based on the user (whether buyer or seller)
        orders = Order.objects.filter(
            sellerId=request.user.id if request.user.isSeller else request.user.id,
            isCompleted=True
        ).order_by('-created_at')
        
        # Serialize the orders
        return Response(OrderSerializer(orders, many=True).data, status=status.HTTP_200_OK)
