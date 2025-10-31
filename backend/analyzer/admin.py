from django.contrib import admin
from .models import UserSubscription, MessageLog

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['email', 'plan', 'messages_used', 'message_limit', 'is_active', 'created_at']
    list_filter = ['plan', 'is_active']
    search_fields = ['email', 'user_id']

@admin.register(MessageLog)
class MessageLogAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'timestamp', 'query']
    list_filter = ['timestamp']
    search_fields = ['user_id', 'query']
