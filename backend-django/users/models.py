from django.db import models

class User(models.Model):
    fullname = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    img = models.URLField(blank=True, null=True)
    expertise = models.CharField(max_length=255, blank=True, null=True)
    orders = models.IntegerField(default=0)
    desc = models.TextField(blank=True, null=True)
    is_seller = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
