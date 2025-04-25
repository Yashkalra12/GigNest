from django.urls import path
from . import views

urlpatterns = [
    # Corrected pattern for get_user view (using .as_view())
    path('<str:id>/', views.get_user.as_view(), name='get_user'),
    
    # Corrected pattern for delete_user view (using .as_view())
    path('delete/<str:id>/', views.delete_user.as_view(), name='delete_user'),
    
    # Corrected pattern for fetch_user view (using .as_view())
    path('fetchUser/', views.fetch_user.as_view(), name='fetch_user'),
]
