from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from .models import Order
from .serializers import OrderSerializer
from gigs.models import Gig
from users.models import User

@api_view(['POST'])
def create_order(request, gig_id):
    try:
        gig = Gig.objects.get(id=gig_id)

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

        # Update counters
        User.objects.filter(id=gig.userId).update(orders=F('orders') + 1)
        Gig.objects.filter(id=gig.id).update(sales=F('sales') + 1)

        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    except Gig.DoesNotExist:
        return Response({"error": "Gig not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_orders(request):
    try:
        orders = Order.objects.filter(
            sellerId=request.user.id if request.user.isSeller else request.user.id,
            isCompleted=True
        ).order_by('-created_at')

        return Response(OrderSerializer(orders, many=True).data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
