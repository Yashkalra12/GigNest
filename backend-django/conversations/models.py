from django.db import models

class Conversation(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    seller_id = models.CharField(max_length=255)
    buyer_id = models.CharField(max_length=255)
    buyer_name = models.CharField(max_length=255)
    seller_name = models.CharField(max_length=255)
    read_by_seller = models.BooleanField()
    read_by_buyer = models.BooleanField()
    last_message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
