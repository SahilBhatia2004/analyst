from django.db import models
from django.utils import timezone

class UserSubscription(models.Model):
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('premium', 'Premium'),
        ('pro', 'Pro'),
    ]
    
    user_id = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField()
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    message_limit = models.IntegerField(default=3)
    messages_used = models.IntegerField(default=0)
    subscription_start = models.DateTimeField(default=timezone.now)
    subscription_end = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_subscriptions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.plan}"
    
    def reset_monthly_usage(self):
        """Reset message usage for monthly plans"""
        self.messages_used = 0
        self.save()
    
    def can_send_message(self):
        """Check if user can send a message"""
        return self.is_active and self.messages_used < self.message_limit
    
    def increment_message_count(self):
        """Increment message usage"""
        if self.can_send_message():
            self.messages_used += 1
            self.save()
            return True
        return False
    
    def get_remaining_messages(self):
        """Get remaining messages"""
        return max(0, self.message_limit - self.messages_used)


class MessageLog(models.Model):
    user_id = models.CharField(max_length=255, db_index=True)
    subscription = models.ForeignKey(UserSubscription, on_delete=models.CASCADE, related_name='messages')
    query = models.TextField()
    response = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user_id} - {self.timestamp}"
