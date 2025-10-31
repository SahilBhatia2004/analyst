# User Flow Diagram - Pricing & Subscription System

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                          HOMEPAGE                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  • "Sign In" button (top right)                            │    │
│  │  • "Get Started Free" button (hero section)                │    │
│  │  • "Get Started Free" button (CTA section)                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              ↓                                       │
│                    All buttons navigate to                           │
│                         /pricing                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       PRICING PAGE                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  FREE PLAN   │  │ PREMIUM PLAN │  │   PRO PLAN   │             │
│  │              │  │              │  │              │             │
│  │    ₹0        │  │  ₹1,500/mo   │  │  ₹2,500/mo   │             │
│  │ 3 messages   │  │ 10 messages  │  │ 20 messages  │             │
│  │              │  │              │  │              │             │
│  │ [Get Started]│  │[Choose Plan] │  │[Choose Plan] │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│         ↓                 ↓                  ↓                       │
└─────────────────────────────────────────────────────────────────────┘
         │                 │                  │
         │                 └──────────────────┘
         │                          ↓
         │              ┌─────────────────────────┐
         │              │   PAYMENT MODAL         │
         │              │  ┌───────────────────┐  │
         │              │  │ Plan: Premium/Pro │  │
         │              │  │ Amount: ₹1500/2500│  │
         │              │  │                   │  │
         │              │  │   [QR CODE]       │  │
         │              │  │                   │  │
         │              │  │ Scan with UPI app │  │
         │              │  └───────────────────┘  │
         │              │                         │
         │              │ [Cancel] [Payment Done] │
         │              └─────────────────────────┘
         │                          ↓
         └──────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       SIGNUP PAGE                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Selected Plan: [Free/Premium/Pro]                         │    │
│  │                                                             │    │
│  │  Full Name:    [________________]                          │    │
│  │  Email:        [________________]                          │    │
│  │  Password:     [________________]                          │    │
│  │                                                             │    │
│  │               [Create Account]                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              ↓                                       │
│         Creates user in Supabase + Subscription in Django           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        LOGIN PAGE                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Email:        [________________]                          │    │
│  │  Password:     [________________]                          │    │
│  │                                                             │    │
│  │               [Sign In]                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  CHATBOT HEADER                                            │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │ 🤖 AI Analyst                                        │  │    │
│  │  │ 2 files uploaded                                     │  │    │
│  │  │ 8 / 10 messages left  ← MESSAGE COUNTER             │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                             │    │
│  │  [Chat Messages]                                           │    │
│  │                                                             │    │
│  │  [Input Box]                                               │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Message Counter Behavior

### Initial State (Premium Plan Example)
```
┌─────────────────────────────┐
│ 🤖 AI Analyst               │
│ 2 files uploaded            │
│ 10 / 10 messages left       │ ← Green color
└─────────────────────────────┘
```

### After 5 Queries
```
┌─────────────────────────────┐
│ 🤖 AI Analyst               │
│ 2 files uploaded            │
│ 5 / 10 messages left        │ ← Still green
└─────────────────────────────┘
```

### After 9 Queries (1 Left)
```
┌─────────────────────────────┐
│ 🤖 AI Analyst               │
│ 2 files uploaded            │
│ 1 / 10 messages left        │ ← Red color (warning)
└─────────────────────────────┘
```

### After 10 Queries (Limit Reached)
```
┌─────────────────────────────┐
│ 🤖 AI Analyst               │
│ 2 files uploaded            │
│ 0 / 10 messages left        │ ← Red color
│ • Upgrade to continue       │ ← Yellow warning
└─────────────────────────────┘

Chat shows error:
┌─────────────────────────────────────────┐
│ 🚫 Message Limit Reached                │
│                                         │
│ You have reached your message limit of │
│ 10 messages. Please upgrade your plan. │
│                                         │
│ Please upgrade your plan to continue   │
│ using AI Analyst.                      │
└─────────────────────────────────────────┘
```

## Backend Flow

### Query Processing with Message Limits

```
User sends query
      ↓
┌─────────────────────────────────────┐
│ Backend: /api/analyze/              │
│                                     │
│ 1. Extract user_id from request    │
│ 2. Get UserSubscription             │
│    ↓                                │
│    ├─ Not found? Create free plan  │
│    └─ Found? Continue               │
│                                     │
│ 3. Check: can_send_message()?      │
│    ↓                                │
│    ├─ NO → Return 403 Error        │
│    │        "Message limit reached"│
│    │                                │
│    └─ YES → Continue                │
│         ↓                           │
│         4. Process query            │
│         5. Generate SQL             │
│         6. Create visualization     │
│         7. increment_message_count()│
│         8. Create MessageLog        │
│         9. Return response +        │
│            subscription info        │
└─────────────────────────────────────┘
      ↓
Frontend updates counter
```

## Database Operations

### On Signup
```
Supabase                          Django Backend
   ↓                                    ↓
Create user                    POST /api/subscription/create/
   ↓                                    ↓
Return user_id              ┌──────────────────────────┐
   ↓                        │ UserSubscription.create()│
   └────────────────────────→│ - user_id               │
                             │ - email                 │
                             │ - plan (from selection) │
                             │ - message_limit (3/10/20)│
                             │ - messages_used = 0     │
                             └──────────────────────────┘
```

### On Each Query
```
┌──────────────────────────────────────────┐
│ UserSubscription                         │
│ ┌──────────────────────────────────────┐ │
│ │ messages_used: 5                     │ │
│ │ message_limit: 10                    │ │
│ └──────────────────────────────────────┘ │
│              ↓                           │
│    increment_message_count()             │
│              ↓                           │
│ ┌──────────────────────────────────────┐ │
│ │ messages_used: 6  ← Incremented      │ │
│ │ message_limit: 10                    │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ MessageLog.create()                      │
│ - user_id                                │
│ - subscription_id                        │
│ - query                                  │
│ - response (first 500 chars)             │
│ - timestamp                              │
└──────────────────────────────────────────┘
```

## Plan Comparison Visual

```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│   Feature   │     FREE     │   PREMIUM    │     PRO      │
├─────────────┼──────────────┼──────────────┼──────────────┤
│   Price     │     ₹0       │  ₹1,500/mo   │  ₹2,500/mo   │
├─────────────┼──────────────┼──────────────┼──────────────┤
│  Messages   │      3       │      10      │      20      │
│             │  (lifetime)  │  (per month) │  (per month) │
├─────────────┼──────────────┼──────────────┼──────────────┤
│   Upload    │      ✓       │      ✓       │      ✓       │
├─────────────┼──────────────┼──────────────┼──────────────┤
│   Charts    │    Basic     │   Advanced   │   Premium    │
├─────────────┼──────────────┼──────────────┼──────────────┤
│   Themes    │   Standard   │    Custom    │     All      │
├─────────────┼──────────────┼──────────────┼──────────────┤
│   Support   │    Basic     │   Priority   │   Priority   │
├─────────────┼──────────────┼──────────────┼──────────────┤
│   Export    │      ✗       │      ✗       │      ✓       │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

## Error Handling Flow

```
User sends query when limit = 0
         ↓
Backend checks can_send_message()
         ↓
Returns 403 Forbidden
         ↓
┌─────────────────────────────────────┐
│ Response:                           │
│ {                                   │
│   "error": "Message limit reached", │
│   "message": "You have reached...", │
│   "remaining_messages": 0           │
│ }                                   │
└─────────────────────────────────────┘
         ↓
Frontend catches error
         ↓
Displays formatted error message
         ↓
Updates subscription state
         ↓
Shows upgrade warning
```

## Success Flow

```
User sends query (limit not reached)
         ↓
Backend processes query
         ↓
┌─────────────────────────────────────┐
│ Response:                           │
│ {                                   │
│   "sql_query": "SELECT...",         │
│   "chart_data": {...},              │
│   "insights": "...",                │
│   "subscription": {                 │
│     "plan": "premium",              │
│     "messages_remaining": 7,        │
│     "message_limit": 10             │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
         ↓
Frontend updates:
  - Chat with response
  - Dashboard with visualization
  - Message counter (10 → 9 → 8 → 7)
```

---

**Visual Guide Complete**
This document provides a complete visual representation of the user flow and system behavior.
