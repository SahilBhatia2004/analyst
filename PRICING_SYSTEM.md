# Pricing & Subscription System

## Overview
The AI Analyst now includes a comprehensive pricing and subscription system with three tiers and message-based usage limits.

## Subscription Plans

### 1. Free Plan
- **Price**: ₹0
- **Message Limit**: 3 messages (lifetime)
- **Features**:
  - Basic data analysis
  - CSV & Excel upload
  - Standard visualizations
  - Chat interface

### 2. Premium Plan
- **Price**: ₹1,500/month
- **Message Limit**: 10 messages per month
- **Features**:
  - All Free features
  - Advanced data analysis
  - All file formats
  - Interactive visualizations
  - Priority support
  - Custom themes

### 3. Pro Plan
- **Price**: ₹2,500/month
- **Message Limit**: 20 messages per month
- **Features**:
  - All Premium features
  - Premium data analysis
  - Unlimited file uploads
  - Advanced visualizations
  - Priority support
  - All themes & customization
  - Export capabilities

## User Flow

### 1. Homepage → Pricing Page
- When users click "Sign In" or "Get Started Free" on the homepage, they are redirected to `/pricing`
- Users can view all three plans and their features
- Users select a plan (Free, Premium, or Pro)

### 2. Plan Selection
- **Free Plan**: Redirects directly to signup page
- **Premium/Pro Plans**: Shows payment modal with QR code for UPI payment

### 3. Payment Process (Premium/Pro)
- Payment modal displays:
  - Selected plan details
  - Total amount
  - QR code for UPI payment
  - Instructions
- User scans QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
- After payment, user clicks "Payment Done" button

### 4. Signup & Subscription Creation
- User is redirected to signup page with selected plan
- Signup form shows the selected plan
- Upon successful signup:
  - User account is created in Supabase
  - Subscription record is created in Django backend
  - User receives appropriate message limit based on plan

### 5. Dashboard Usage
- Chatbot header displays remaining messages: "X / Y messages left"
- Color coding:
  - Green: More than 1 message remaining
  - Red: 1 or 0 messages remaining
- When limit is reached:
  - Yellow warning: "Upgrade to continue"
  - Queries are blocked with error message

## Technical Implementation

### Backend (Django)

#### Models (`analyzer/models.py`)
```python
- UserSubscription: Stores user plan, limits, and usage
  - user_id: Supabase user UUID
  - email: User email
  - plan: free/premium/pro
  - message_limit: Plan-specific limit
  - messages_used: Current usage count
  - subscription_start/end: Subscription period
  
- MessageLog: Tracks all user queries
  - user_id: Supabase user UUID
  - subscription: FK to UserSubscription
  - query: User's question
  - response: AI response (first 500 chars)
  - timestamp: Query time
```

#### API Endpoints
1. **POST /api/subscription/create/**
   - Creates or updates user subscription
   - Called during signup
   - Request: `{user_id, email, plan}`

2. **GET /api/subscription/get/**
   - Retrieves user subscription details
   - Query param: `user_id`
   - Returns: plan, limits, usage

3. **POST /api/analyze/** (Modified)
   - Now includes message limit checking
   - Increments message count on success
   - Returns subscription info in response
   - Returns 403 error when limit reached

### Frontend (React)

#### New Components
1. **Pricing.jsx** (`components/Auth/Pricing.jsx`)
   - Displays three pricing tiers
   - Handles plan selection
   - Shows payment modal for paid plans
   - Includes QR code for UPI payments

#### Modified Components
1. **App.js**
   - Added `/pricing` route
   - Changed dashboard redirect from `/login` to `/pricing`

2. **HomePage.jsx**
   - All CTA buttons now navigate to `/pricing`

3. **Signup.jsx**
   - Accepts plan from navigation state
   - Displays selected plan
   - Creates subscription after signup

4. **Chatbot.jsx**
   - Fetches and displays subscription info
   - Shows remaining messages in header
   - Sends user_id with queries
   - Updates message count after each query
   - Handles message limit errors

## Message Counting

### How It Works
1. User sends a query through chatbot
2. Backend checks if user can send message (`can_send_message()`)
3. If limit reached, returns 403 error
4. If allowed, processes query and increments count (`increment_message_count()`)
5. Response includes updated subscription info
6. Frontend updates display with new remaining count

### Strict Enforcement
- Message limits are enforced at the backend level
- Each query counts as 1 message (regardless of number of sub-queries)
- No queries are processed once limit is reached
- Users must upgrade to continue

## Database Migrations

Run these commands to set up the database:
```bash
cd backend
python manage.py makemigrations analyzer
python manage.py migrate
```

## Environment Variables

No new environment variables required. Uses existing:
- `REACT_APP_BACKEND_URL` (Frontend)
- Supabase credentials (Backend)

## Testing the System

### 1. Test Free Plan
- Go to homepage → Click "Get Started Free"
- Select Free plan
- Sign up with new account
- Send 3 messages in chatbot
- Verify 4th message is blocked

### 2. Test Premium Plan
- Go to pricing page
- Select Premium plan
- View payment modal
- Complete signup
- Verify 10 message limit

### 3. Test Pro Plan
- Select Pro plan
- Verify 20 message limit

### 4. Test Message Counter
- Watch message counter decrease with each query
- Verify color changes (green → red)
- Verify upgrade warning appears at 0 messages

## Future Enhancements

1. **Payment Integration**
   - Integrate actual payment gateway (Razorpay, Stripe)
   - Automatic subscription activation after payment
   - Payment history tracking

2. **Subscription Management**
   - User dashboard to view/upgrade plan
   - Automatic monthly reset for paid plans
   - Subscription renewal reminders

3. **Usage Analytics**
   - Track query patterns
   - Usage reports for users
   - Admin analytics dashboard

4. **Plan Customization**
   - Allow admins to modify plan limits
   - Create custom enterprise plans
   - Promotional discounts

## Notes

- Message limits are strict and enforced at backend
- Free plan has lifetime limit (no monthly reset)
- Premium/Pro plans reset monthly (30 days)
- QR code is placeholder - replace with actual payment QR
- Subscription data is stored in Django SQLite database
- User authentication is handled by Supabase
