"""
Supabase client for subscription and message log management
"""
from supabase import create_client, Client
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)


class SubscriptionManager:
    """Manage user subscriptions in Supabase"""
    
    PLAN_LIMITS = {
        'free': 3,
        'premium': 10,
        'pro': 20
    }
    
    @staticmethod
    def get_subscription(user_id: str):
        """Get user subscription by user_id"""
        try:
            response = supabase.table('user_subscriptions').select('*').eq('user_id', user_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error getting subscription: {e}")
            return None
    
    @staticmethod
    def create_subscription(user_id: str, email: str, plan: str = 'free', transaction_id: str = None, amount: float = 0, pending_verification: bool = False):
        """Create a new subscription"""
        try:
            message_limit = SubscriptionManager.PLAN_LIMITS.get(plan, 3)
            subscription_end = None
            
            if plan != 'free':
                subscription_end = (datetime.now() + timedelta(days=30)).isoformat()
            
            data = {
                'user_id': user_id,
                'email': email,
                'plan': plan,
                'message_limit': message_limit,
                'messages_used': 0,
                'subscription_start': datetime.now().isoformat(),
                'subscription_end': subscription_end,
                'is_active': True
            }
            
            # Add transaction details if provided
            if transaction_id:
                data['transaction_id'] = transaction_id
                data['payment_amount'] = amount
                data['payment_verified'] = not pending_verification
                data['requested_plan'] = plan if pending_verification else None
            
            response = supabase.table('user_subscriptions').insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating subscription: {e}")
            return None
    
    @staticmethod
    def update_subscription(user_id: str, plan: str):
        """Update user subscription plan"""
        try:
            message_limit = SubscriptionManager.PLAN_LIMITS.get(plan, 3)
            subscription_end = None
            
            if plan != 'free':
                subscription_end = (datetime.now() + timedelta(days=30)).isoformat()
            
            data = {
                'plan': plan,
                'message_limit': message_limit,
                'messages_used': 0,  # Reset on plan change
                'subscription_start': datetime.now().isoformat(),
                'subscription_end': subscription_end
            }
            
            response = supabase.table('user_subscriptions').update(data).eq('user_id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating subscription: {e}")
            return None
    
    @staticmethod
    def can_send_message(user_id: str):
        """Check if user can send a message"""
        subscription = SubscriptionManager.get_subscription(user_id)
        if not subscription:
            return False
        
        return (subscription['is_active'] and 
                subscription['messages_used'] < subscription['message_limit'])
    
    @staticmethod
    def increment_message_count(user_id: str):
        """Increment user's message count"""
        try:
            subscription = SubscriptionManager.get_subscription(user_id)
            if not subscription:
                print(f"No subscription found for user: {user_id}")
                return False
            
            print(f"Current messages_used: {subscription['messages_used']}, limit: {subscription['message_limit']}, plan: {subscription['plan']}")
            
            if subscription['messages_used'] >= subscription['message_limit']:
                print(f"Message limit reached for user: {user_id}")
                return False
            
            new_count = subscription['messages_used'] + 1
            response = supabase.table('user_subscriptions').update({
                'messages_used': new_count
            }).eq('user_id', user_id).execute()
            
            print(f"Incremented messages_used to: {new_count} for user: {user_id}")
            return True
        except Exception as e:
            print(f"Error incrementing message count: {e}")
            return False
    
    @staticmethod
    def get_remaining_messages(user_id: str):
        """Get remaining messages for user"""
        subscription = SubscriptionManager.get_subscription(user_id)
        if not subscription:
            return 0
        
        return max(0, subscription['message_limit'] - subscription['messages_used'])


class MessageLogger:
    """Log user messages in Supabase"""
    
    @staticmethod
    def log_message(user_id: str, subscription_id: str, query: str, response: str = None):
        """Log a user message"""
        try:
            data = {
                'user_id': user_id,
                'subscription_id': subscription_id,
                'query': query,
                'response': response[:500] if response else None,  # Store first 500 chars
                'timestamp': datetime.now().isoformat()
            }
            
            supabase.table('message_logs').insert(data).execute()
            return True
        except Exception as e:
            print(f"Error logging message: {e}")
            return False
    
    @staticmethod
    def get_user_logs(user_id: str, limit: int = 100):
        """Get user's message logs"""
        try:
            response = supabase.table('message_logs').select('*').eq('user_id', user_id).order('timestamp', desc=True).limit(limit).execute()
            return response.data
        except Exception as e:
            print(f"Error getting logs: {e}")
            return []
