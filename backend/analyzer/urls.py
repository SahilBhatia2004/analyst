from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.analyze_query, name='analyze_query'),
    path('health/', views.health_check, name='health_check'),
    path('subscription/create/', views.create_subscription, name='create_subscription'),
    path('subscription/get/', views.get_subscription, name='get_subscription'),
]
