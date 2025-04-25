from django.db import models

class Gig(models.Model):
    user_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    desc = models.TextField()
    total_star = models.IntegerField(default=0)
    star_number = models.IntegerField(default=0)
    category = models.CharField(max_length=255)
    price = models.FloatField()
    cover = models.URLField()
    images = models.JSONField()
    short_title = models.CharField(max_length=255)
    short_desc = models.CharField(max_length=255)
    delivery_time = models.IntegerField()
    revision = models.IntegerField()
    features = models.JSONField()
    sales = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
