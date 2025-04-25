from django.db import models

class Message(models.Model):
    conversation_id = models.CharField(max_length=255)
    user_id = models.CharField(max_length=255)
    desc = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
