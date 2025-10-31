# Supabase Migration Guide

## Overview
This guide will help you migrate the subscription system from Django SQLite to Supabase PostgreSQL.

---

## Step 1: Create Tables in Supabase

### 1.1 Go to Supabase Dashboard
1. Open your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### 1.2 Create `user_subscriptions` Table

Copy and paste this SQL:

```sql
-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'premium', 'pro')),
    message_limit INTEGER NOT NULL DEFAULT 3,
    messages_used INTEGER NOT NULL DEFAULT 0,
    subscription_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    subscription_end TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan ON user_subscriptions(plan);
CREATE INDEX idx_user_subscriptions_email ON user_subscriptions(email);

-- Add comment
COMMENT ON TABLE user_subscriptions IS 'Stores user subscription plans and usage limits';
```

Click **Run** (or press Ctrl+Enter)

### 1.3 Create `message_logs` Table

```sql
-- Create message_logs table
CREATE TABLE message_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_message_logs_user_id ON message_logs(user_id);
CREATE INDEX idx_message_logs_subscription_id ON message_logs(subscription_id);
CREATE INDEX idx_message_logs_timestamp ON message_logs(timestamp DESC);

-- Add comment
COMMENT ON TABLE message_logs IS 'Logs all user queries and AI responses';
```

Click **Run**

### 1.4 Create Auto-Update Trigger

```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
```

Click **Run**

### 1.5 Set Up Row Level Security (RLS)

```sql
-- Enable RLS on both tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription
CREATE POLICY "Users can view own subscription" 
    ON user_subscriptions
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can view their own message logs
CREATE POLICY "Users can view own message logs" 
    ON message_logs
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Service role (backend) can manage everything
CREATE POLICY "Service role can manage all subscriptions" 
    ON user_subscriptions
    FOR ALL 
    USING (true);

CREATE POLICY "Service role can manage all message logs" 
    ON message_logs
    FOR ALL 
    USING (true);
```

Click **Run**

---

## Step 2: Verify Tables Created

### 2.1 Check Tables
1. Go to **Table Editor** in Supabase
2. You should see:
   - `user_subscriptions`
   - `message_logs`

### 2.2 Check Structure
Click on `user_subscriptions` and verify columns:
- ✅ id (uuid)
- ✅ user_id (uuid)
- ✅ email (text)
- ✅ plan (text)
- ✅ message_limit (int4)
- ✅ messages_used (int4)
- ✅ subscription_start (timestamptz)
- ✅ subscription_end (timestamptz)
- ✅ is_active (bool)
- ✅ created_at (timestamptz)
- ✅ updated_at (timestamptz)

---

## Step 3: Backend Files Already Updated

The following files have been created/modified:

### ✅ Created Files:
1. **`backend/analyzer/supabase_client.py`**
   - `SubscriptionManager` class
   - `MessageLogger` class
   - All subscription logic

### ✅ Modified Files:
1. **`backend/analyzer/views.py`**
   - Replaced Django ORM with Supabase client
   - Updated all subscription endpoints
   - Updated analyze_query endpoint

---

## Step 4: Test the Migration

### 4.1 Start Backend
```bash
cd backend
python manage.py runserver
```

### 4.2 Test Subscription Creation
```bash
curl -X POST http://localhost:8000/api/subscription/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-uuid-123",
    "email": "test@example.com",
    "plan": "free"
  }'
```

Expected response:
```json
{
  "message": "Subscription created successfully",
  "subscription": {
    "user_id": "test-uuid-123",
    "email": "test@example.com",
    "plan": "free",
    "message_limit": 3,
    "messages_used": 0,
    "messages_remaining": 3
  }
}
```

### 4.3 Verify in Supabase
1. Go to **Table Editor** → `user_subscriptions`
2. You should see the new row with your test data

### 4.4 Test Full Flow
1. Start frontend: `cd frontend && npm start`
2. Go to http://localhost:3000
3. Click "Get Started Free"
4. Select Free plan
5. Sign up with a new account
6. Check Supabase table - subscription should be created automatically

---

## Step 5: Verify Everything Works

### Test Checklist:

#### Signup Flow
- [ ] User can sign up with selected plan
- [ ] Subscription is created in Supabase
- [ ] Correct message limit is set (3/10/20)

#### Dashboard
- [ ] Message counter displays correctly
- [ ] Counter shows remaining messages
- [ ] Counter updates after each query

#### Message Limits
- [ ] Free user can send 3 messages
- [ ] 4th message is blocked
- [ ] Error message displays correctly
- [ ] Premium user can send 10 messages
- [ ] Pro user can send 20 messages

#### Supabase Tables
- [ ] `user_subscriptions` table has data
- [ ] `message_logs` table logs queries
- [ ] Timestamps are correct
- [ ] Foreign keys work properly

---

## Step 6: Clean Up (Optional)

### Remove Django Models (Optional)
Since we're not using Django ORM anymore, you can optionally remove:

1. **`backend/analyzer/models.py`** - Can be emptied or removed
2. **`backend/analyzer/migrations/`** - No longer needed
3. **`backend/db.sqlite3`** - Can be deleted

**Note**: Keep these files if you want to maintain backward compatibility.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  • Pricing page                                         │
│  • Signup with plan selection                           │
│  • Chatbot with message counter                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                DJANGO BACKEND (REST API)                 │
│  • supabase_client.py (SubscriptionManager)            │
│  • views.py (API endpoints)                             │
│  • Handles business logic                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   SUPABASE (PostgreSQL)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ auth.users (Supabase Auth)                        │  │
│  │  • User authentication                            │  │
│  │  • User profiles                                  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ user_subscriptions                                │  │
│  │  • Plan details                                   │  │
│  │  • Message limits                                 │  │
│  │  • Usage tracking                                 │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ message_logs                                      │  │
│  │  • Query history                                  │  │
│  │  • Response logs                                  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ storage.files                                     │  │
│  │  • CSV/Excel files                                │  │
│  │  • Chat history                                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Benefits of Supabase Migration

### ✅ Advantages:
1. **Single Database**: Everything in one place
2. **Real-time**: Can add real-time subscriptions later
3. **Scalability**: PostgreSQL scales better than SQLite
4. **Built-in Auth**: Seamless integration with Supabase Auth
5. **Dashboard**: Easy to view/manage data in Supabase UI
6. **Backups**: Automatic backups included
7. **RLS**: Row Level Security for data protection

### 🔄 What Changed:
- Subscription data: SQLite → Supabase PostgreSQL
- Message logs: SQLite → Supabase PostgreSQL
- Auth: Still Supabase (no change)
- File storage: Still Supabase (no change)

### 📝 What Stayed the Same:
- Frontend code (no changes needed)
- API endpoints (same URLs)
- User flow (identical experience)
- Message limits (3/10/20)

---

## Troubleshooting

### Issue: "relation does not exist"
**Solution**: Make sure you ran all SQL queries in Supabase SQL Editor

### Issue: "permission denied"
**Solution**: Check RLS policies are created correctly

### Issue: "foreign key violation"
**Solution**: Ensure user exists in auth.users before creating subscription

### Issue: "supabase module not found"
**Solution**: 
```bash
cd backend
pip install supabase
```

### Issue: Tables not showing in Table Editor
**Solution**: Refresh the page or check SQL Editor for errors

---

## Next Steps

After migration is complete:

1. **Test thoroughly** with all three plans
2. **Monitor Supabase logs** for any errors
3. **Set up database backups** (automatic in Supabase)
4. **Consider adding indexes** for better performance
5. **Implement monthly reset** for paid plans (cron job)

---

## Summary

✅ **What You Need to Do:**
1. Run SQL queries in Supabase (Step 1)
2. Verify tables created (Step 2)
3. Test the system (Step 4-5)

✅ **What's Already Done:**
- Backend code updated
- Supabase client created
- API endpoints modified
- Frontend works as-is

🎉 **Result:**
Everything now runs on Supabase PostgreSQL instead of Django SQLite!
