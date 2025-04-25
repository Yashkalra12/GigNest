from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation
from .serializers import ConversationSerializer
from users.models import User

@api_view(['POST'])
def create_conversation(request):
    try:
        # Generate unique conversation ID
        conversation_id = f"{request.user.id}{request.data['to']}" if request.user.isSeller else f"{request.data['to']}{request.user.id}"

        conversation = Conversation(
            id=conversation_id,
            sellerId=request.user.id if request.user.isSeller else request.data['to'],
            buyerId=request.user.id if not request.user.isSeller else request.data['to'],
            buyerName=request.data['buyerName'],
            sellerName=request.data['sellerName'],
            readBySeller=request.user.isSeller,
            readByBuyer=not request.user.isSeller,
        )

        conversation.save()
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_conversations(request):
    try:
        filter_field = 'sellerId' if request.user.isSeller else 'buyerId'
        conversations = Conversation.objects.filter(**{filter_field: request.user.id}).order_by('-updatedAt')

        populated_conversations = []
        for convo in conversations:
            seller = User.objects.filter(id=convo.sellerId).values('fullname', 'img').first()
            buyer = User.objects.filter(id=convo.buyerId).values('fullname', 'img').first()

            populated_conversations.append({
                **ConversationSerializer(convo).data,
                "sellerData": seller,
                "buyerData": buyer
            })

        return Response(populated_conversations, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_single_conversation(request, id):
    try:
        conversation = Conversation.objects.filter(id=id).first()
        if not conversation:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(ConversationSerializer(conversation).data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def update_conversation(request, id):
    try:
        update_field = 'readBySeller' if request.user.isSeller else 'readByBuyer'
        updated_convo = Conversation.objects.filter(id=id).update(**{update_field: True})

        if not updated_convo:
            return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Conversation updated successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
