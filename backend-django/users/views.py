from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404

class DeleteUserView(APIView):
    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        if str(request.user.id) != str(user.id):
            return Response({"error": "You can delete only your account"}, status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


class GetUserView(APIView):
    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FetchCurrentUserView(APIView):
    def get(self, request):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
