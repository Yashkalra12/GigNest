from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Gig
from .serializers import GigSerializer
from users.models import User

class CreateGigView(APIView):
    def post(self, request):
        if not request.user.isSeller:
            return Response({"message": "Only sellers can create gigs"}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Create a new gig
            new_gig = Gig(userId=request.user.id, **request.data)
            new_gig.save()

            return Response(GigSerializer(new_gig).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteGigView(APIView):
    def delete(self, request, gig_id):
        try:
            gig = Gig.objects.filter(id=gig_id).first()
            if not gig:
                return Response({"message": "Gig already deleted/not found"}, status=status.HTTP_404_NOT_FOUND)

            if gig.userId != request.user.id:
                return Response({"message": "You can delete only your gigs"}, status=status.HTTP_403_FORBIDDEN)

            gig.delete()
            return Response({"message": "Gig has been deleted successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetGigView(APIView):
    def get(self, request, gig_id):
        try:
            gig = Gig.objects.filter(id=gig_id).first()
            if not gig:
                return Response({"message": "Gig not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(GigSerializer(gig).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetGigsView(APIView):
    def get(self, request):
        q = request.query_params
        filters = {}

        # Category filter
        if q.get('category'):
            filters['category'] = q.get('category')

        # Price range filter
        if q.get('min') or q.get('max'):
            filters['price__gte'] = q.get('min', 0)
            filters['price__lte'] = q.get('max', 9999999)

        # Search by title
        if q.get('search'):
            filters['title__icontains'] = q.get('search')

        # User filter
        if q.get('userId'):
            filters['userId'] = q.get('userId')

        try:
            sort_order = q.get('sort', '-createdAt')
            gigs = Gig.objects.filter(**filters).order_by(sort_order)

            return Response(GigSerializer(gigs, many=True).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": "Something went wrong", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTopGigsView(APIView):
    def get(self, request):
        try:
            gigs = Gig.objects.all().order_by('-sales')[:10]
            return Response(GigSerializer(gigs, many=True).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": "Something went wrong", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EditGigView(APIView):
    def put(self, request, gig_id):
        if not request.user.isSeller:
            return Response({"message": "Only sellers can edit gigs"}, status=status.HTTP_403_FORBIDDEN)

        try:
            gig = Gig.objects.filter(id=gig_id).first()
            if not gig:
                return Response({"message": "Gig not found"}, status=status.HTTP_404_NOT_FOUND)

            if gig.userId != request.user.id:
                return Response({"message": "You can only edit your own gigs"}, status=status.HTTP_403_FORBIDDEN)

            # Update the gig
            for key, value in request.data.items():
                setattr(gig, key, value)

            gig.save()
            return Response({"updatedGig": GigSerializer(gig).data, "message": "Gig updated successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
