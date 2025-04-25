from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Gig
from .serializers import GigSerializer

@api_view(['POST'])
def create_gig(request):
    if not request.user.isSeller:
        return Response({"message": "Only sellers can create gigs"}, status=status.HTTP_403_FORBIDDEN)

    try:
        new_gig = Gig(userId=request.user.id, **request.data)
        new_gig.save()
        return Response(GigSerializer(new_gig).data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_gig(request, id):
    try:
        gig = Gig.objects.filter(id=id).first()
        if not gig:
            return Response({"message": "Gig already deleted/not found"}, status=status.HTTP_404_NOT_FOUND)

        if gig.userId != request.user.id:
            return Response({"message": "You can delete only your gigs"}, status=status.HTTP_403_FORBIDDEN)

        gig.delete()
        return Response({"message": "Gig has been deleted successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_gig(request, id):
    try:
        gig = Gig.objects.filter(id=id).first()
        if not gig:
            return Response({"message": "Gig not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(GigSerializer(gig).data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_gigs(request):
    q = request.query_params
    filters = {}

    if q.get('category'):
        filters['category'] = q.get('category')
    if q.get('min') or q.get('max'):
        filters['price__gte'] = q.get('min', 0)
        filters['price__lte'] = q.get('max', 9999999)
    if q.get('search'):
        filters['title__icontains'] = q.get('search')
    if q.get('userId'):
        filters['userId'] = q.get('userId')

    try:
        sort_order = q.get('sort', '-createdAt')
        gigs = Gig.objects.filter(**filters).order_by(sort_order)
        return Response(GigSerializer(gigs, many=True).data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": "Something went wrong", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_top_gigs(request):
    try:
        gigs = Gig.objects.all().order_by('-sales')[:10]
        return Response(GigSerializer(gigs, many=True).data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": "Something went wrong", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def edit_gig(request, id):
    if not request.user.isSeller:
        return Response({"message": "Only sellers can edit gigs"}, status=status.HTTP_403_FORBIDDEN)

    try:
        gig = Gig.objects.filter(id=id).first()
        if not gig:
            return Response({"message": "Gig not found"}, status=status.HTTP_404_NOT_FOUND)

        if gig.userId != request.user.id:
            return Response({"message": "You can only edit your own gigs"}, status=status.HTTP_403_FORBIDDEN)

        for key, value in request.data.items():
            setattr(gig, key, value)

        gig.save()
        return Response({"updatedGig": GigSerializer(gig).data, "message": "Gig updated successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
