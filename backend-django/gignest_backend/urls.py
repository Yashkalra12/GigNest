from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to GigNest!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/gigs/', include('gigs.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/messages/', include('chat_messages.urls')),
    path('api/conversations/', include('conversations.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/payment/', include('payments.urls')),

    path('', home, name='home'),
]
