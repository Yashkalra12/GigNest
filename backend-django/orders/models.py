from django.db import models

class Order(models.Model):
    gig_id = models.CharField(max_length=255)
    img = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=255)
    price = models.FloatField()
    seller_id = models.CharField(max_length=255)
    buyer_id = models.CharField(max_length=255)
    buyer_name = models.CharField(max_length=255)
    seller_name = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=True)
    payment_intent = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
