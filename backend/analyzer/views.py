from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services import GrokService, DataProcessor, ChartGenerator
from .supabase_client import SubscriptionManager, MessageLogger
import traceback


@api_view(['POST'])
def analyze_query(request):
    """
    Main endpoint to process natural language queries
    
    Expected request body:
    {
        "query": "Show total sales by month",
        "chart_type": "bar chart",
        "files": ["user_id/file1.csv"],
        "user_id": "user_uuid"
    }
    """
    try:
        query = request.data.get('query')
        chart_type = request.data.get('chart_type', 'bar chart')
        files = request.data.get('files', [])
        user_id = request.data.get('user_id')
        
        if not query:
            return Response(
                {'error': 'Query is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not files:
            return Response(
                {'error': 'At least one file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check message limit
        if user_id:
            subscription = SubscriptionManager.get_subscription(user_id)
            
            if not subscription:
                # Create free subscription for new users
                subscription = SubscriptionManager.create_subscription(
                    user_id=user_id,
                    email=request.data.get('email', ''),
                    plan='free'
                )
            
            if subscription and not SubscriptionManager.can_send_message(user_id):
                return Response(
                    {
                        'error': 'Message limit reached',
                        'message': f'You have reached your message limit of {subscription["message_limit"]} messages. Please upgrade your plan.',
                        'remaining_messages': 0
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Initialize services
        grok_service = GrokService()
        data_processor = DataProcessor()
        chart_generator = ChartGenerator()
        
        # Load data from first file (can be extended to handle multiple files)
        file_path = files[0]
        df = data_processor.load_file_from_supabase(file_path)
        
        # Get schema information
        schema_info = data_processor.get_schema_info(df)
        
        # Generate SQL query using Grok
        sql_query = grok_service.generate_sql(query, schema_info)
        
        # Execute SQL query
        result_df = data_processor.execute_sql_on_dataframe(df, sql_query)
        
        # Generate chart data
        chart_data = chart_generator.generate_chart(result_df, chart_type, query)
        
        # Generate insights
        results_summary = data_processor.get_results_summary(result_df)
        insights = grok_service.generate_insights(query, results_summary)
        
        # Increment message count and log
        if user_id and subscription:
            SubscriptionManager.increment_message_count(user_id)
            MessageLogger.log_message(
                user_id=user_id,
                subscription_id=subscription['id'],
                query=query,
                response=insights
            )
            # Refetch subscription to get updated count
            subscription = SubscriptionManager.get_subscription(user_id)
        
        response_data = {
            'sql_query': sql_query,
            'chart_data': chart_data,
            'insights': insights,
            'row_count': len(result_df)
        }
        
        # Add subscription info if available
        if user_id and subscription:
            response_data['subscription'] = {
                'plan': subscription['plan'],
                'messages_remaining': SubscriptionManager.get_remaining_messages(user_id),
                'message_limit': subscription['message_limit'],
                'messages_used': subscription['messages_used']
            }
        
        return Response(response_data)
        
    except Exception as e:
        print(f"Error in analyze_query: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'ok', 'message': 'AI Analyst API is running'})


@api_view(['POST'])
def create_subscription(request):
    """
    Create or update user subscription
    
    Expected request body:
    {
        "user_id": "user_uuid",
        "email": "user@example.com",
        "plan": "free|premium|pro"
    }
    """
    try:
        user_id = request.data.get('user_id')
        email = request.data.get('email')
        plan = request.data.get('plan', 'free')
        
        if not user_id or not email:
            return Response(
                {'error': 'user_id and email are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get optional transaction details
        transaction_id = request.data.get('transaction_id')
        amount = request.data.get('amount', 0)
        pending_verification = request.data.get('pending_verification', False)
        
        # Check if subscription exists
        existing_subscription = SubscriptionManager.get_subscription(user_id)
        
        if existing_subscription:
            # Update existing subscription
            subscription = SubscriptionManager.update_subscription(user_id, plan)
            message = 'Subscription updated successfully'
        else:
            # Create new subscription
            subscription = SubscriptionManager.create_subscription(
                user_id, 
                email, 
                plan, 
                transaction_id, 
                amount, 
                pending_verification
            )
            message = 'Subscription created successfully'
        
        if not subscription:
            return Response(
                {'error': 'Failed to create/update subscription'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'message': message,
            'subscription': {
                'user_id': subscription['user_id'],
                'email': subscription['email'],
                'plan': subscription['plan'],
                'message_limit': subscription['message_limit'],
                'messages_used': subscription['messages_used'],
                'messages_remaining': SubscriptionManager.get_remaining_messages(user_id)
            }
        })
        
    except Exception as e:
        print(f"Error in create_subscription: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_subscription(request):
    """
    Get user subscription details
    
    Query params:
    - user_id: user UUID
    """
    try:
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subscription = SubscriptionManager.get_subscription(user_id)
        
        if not subscription:
            return Response(
                {'error': 'Subscription not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'subscription': {
                'user_id': subscription['user_id'],
                'email': subscription['email'],
                'plan': subscription['plan'],
                'message_limit': subscription['message_limit'],
                'messages_used': subscription['messages_used'],
                'messages_remaining': SubscriptionManager.get_remaining_messages(user_id),
                'is_active': subscription['is_active'],
                'subscription_start': subscription['subscription_start'],
                'subscription_end': subscription['subscription_end']
            }
        })
        
    except Exception as e:
        print(f"Error in get_subscription: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
