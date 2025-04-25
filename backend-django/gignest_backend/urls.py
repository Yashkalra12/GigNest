from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth.urls')),
    path('api/users/', include('user.urls')),
    path('api/gigs/', include('gig.urls')),
    path('api/orders/', include('order.urls')),
    path('api/messages/', include('message.urls')),
    path('api/conversations/', include('conversation.urls')),
    path('api/reviews/', include('review.urls')),
    path('api/payment/', include('payment.urls')),
]
