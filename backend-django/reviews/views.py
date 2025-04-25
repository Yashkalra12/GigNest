from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer
from gigs.models import Gig

class CreateReviewView(APIView):
    def post(self, request):
        if request.user.isSeller:
            return Response({"message": "Only Clients can review Gigs"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userId=request.user.id)
            gig = get_object_or_404(Gig, pk=request.data.get("gigId"))
            gig.totalStar += request.data.get("star", 0)
            gig.starNumber += 1
            gig.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetReviewsView(APIView):
    def get(self, request, gig_id):
        reviews = Review.objects.filter(gigId=gig_id).order_by("-created_at")
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteReviewView(APIView):
    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        if str(review.userId) != str(request.user.id):
            return Response({"error": "You can delete only your own review"}, status=status.HTTP_403_FORBIDDEN)
        review.delete()
        return Response({"message": "Review deleted successfully"}, status=status.HTTP_200_OK)
