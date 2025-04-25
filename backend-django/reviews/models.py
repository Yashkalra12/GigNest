from django.db import models

class Review(models.Model):
    gig_id = models.CharField(max_length=255)
    user_id = models.CharField(max_length=255)
    star = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    desc = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
