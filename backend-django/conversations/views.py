from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation
from .serializers import ConversationSerializer
from users.models import User

class CreateConversationView(APIView):
    def post(self, request):
        try:
            # Generate the conversation ID
            conversation_id = f"{request.user.id}{request.data['to']}" if request.user.isSeller else f"{request.data['to']}{request.user.id}"

            # Create a new conversation
            conversation = Conversation(
                id=conversation_id,
                sellerId=request.user.id if request.user.isSeller else request.data['to'],
                buyerId=request.user.id if request.user.isSeller else request.data['to'],
                buyerName=request.data['buyerName'],
                sellerName=request.data['sellerName'],
                readBySeller=request.user.isSeller,
                readByBuyer=not request.user.isSeller,
            )

            # Save the conversation
            saved_convo = conversation.save()
            return Response(ConversationSerializer(saved_convo).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetConversationsView(APIView):
    def get(self, request):
        try:
            # Get conversations based on the role (seller or buyer)
            filter_field = 'sellerId' if request.user.isSeller else 'buyerId'
            conversations = Conversation.objects.filter(**{filter_field: request.user.id}).order_by('-updatedAt')

            # Populate conversation with seller and buyer data
            populated_conversations = []
            for convo in conversations:
                seller = User.objects.filter(id=convo.sellerId).values('fullname', 'img').first()
                buyer = User.objects.filter(id=convo.buyerId).values('fullname', 'img').first()

                populated_conversations.append({
                    **convo.to_dict(),
                    "sellerData": seller,
                    "buyerData": buyer
                })

            return Response(populated_conversations, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateConversationView(APIView):
    def put(self, request, convo_id):
        try:
            # Update the conversation read status based on user role
            update_field = 'readBySeller' if request.user.isSeller else 'readByBuyer'
            updated_convo = Conversation.objects.filter(id=convo_id).update(**{update_field: True})

            if not updated_convo:
                return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"message": "Conversation updated successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetSingleConversationView(APIView):
    def get(self, request, convo_id):
        try:
            conversation = Conversation.objects.filter(id=convo_id).first()
            if not conversation:
                return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(ConversationSerializer(conversation).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
