from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Message
from .serializers import MessageSerializer
from conversations.models import Conversation
from users.models import User

class CreateMessageView(APIView):
    def post(self, request):
        try:
            # Create a new message
            new_message = Message(
                conversationId=request.data.get("conversationId"),
                userId=request.user.id,
                desc=request.data.get("desc")
            )
            saved_message = new_message.save()

            # Update the conversation with the last message and read status
            conversation = Conversation.objects.filter(id=request.data.get("conversationId")).first()
            if conversation:
                conversation.readBySeller = request.user.isSeller
                conversation.readByBuyer = not request.user.isSeller
                conversation.lastMessage = request.data.get("desc")
                conversation.save()

            return Response(MessageSerializer(saved_message).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetMessagesView(APIView):
    def get(self, request, conversation_id):
        try:
            # Retrieve all messages for the given conversationId
            messages = Message.objects.filter(conversationId=conversation_id)

            # Add user image to each message
            messages_with_user_image = []
            for message in messages:
                user = User.objects.filter(id=message.userId).values('img').first()
                messages_with_user_image.append({
                    **MessageSerializer(message).data,
                    'userImage': user.get('img') if user else None
                })

            return Response(messages_with_user_image, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
