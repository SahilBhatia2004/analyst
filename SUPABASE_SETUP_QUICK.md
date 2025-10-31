# Quick Supabase Setup - Copy & Paste

## What to Create in Supabase

Go to your Supabase project → **SQL Editor** → **New Query**

---

## Copy & Paste This (All at Once)

```sql
-- ============================================
-- STEP 1: Create user_subscriptions table
-- ============================================
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

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan ON user_subscriptions(plan);
CREATE INDEX idx_user_subscriptions_email ON user_subscriptions(email);

COMMENT ON TABLE user_subscriptions IS 'Stores user subscription plans and usage limits';

-- ============================================
-- STEP 2: Create message_logs table
-- ============================================
CREATE TABLE message_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_logs_user_id ON message_logs(user_id);
CREATE INDEX idx_message_logs_subscription_id ON message_logs(subscription_id);
CREATE INDEX idx_message_logs_timestamp ON message_logs(timestamp DESC);

COMMENT ON TABLE message_logs IS 'Logs all user queries and AI responses';

-- ============================================
-- STEP 3: Create auto-update trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- STEP 4: Enable Row Level Security
-- ============================================
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" 
    ON user_subscriptions
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can view their own message logs
CREATE POLICY "Users can view own message logs" 
    ON message_logs
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Service role (backend) can manage everything
CREATE POLICY "Service role can manage all subscriptions" 
    ON user_subscriptions
    FOR ALL 
    USING (true);

CREATE POLICY "Service role can manage all message logs" 
    ON message_logs
    FOR ALL 
    USING (true);
```

Click **Run** or press **Ctrl+Enter**

---

## Verify Setup

### Check Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see:
   - ✅ `user_subscriptions`
   - ✅ `message_logs`

### Check Columns
Click on `user_subscriptions` table and verify:
- ✅ 11 columns total
- ✅ `user_id` is unique
- ✅ `plan` has check constraint
- ✅ `message_limit` defaults to 3

---

## That's It!

Backend code is already updated. Just:
1. Run the SQL above in Supabase
2. Start your backend: `python manage.py runserver`
3. Start your frontend: `npm start`
4. Test the flow!

---

## Quick Test

After setup, test with curl:

```bash
curl -X POST http://localhost:8000/api/subscription/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "plan": "free"
  }'
```

Then check Supabase Table Editor → `user_subscriptions` → You should see the new row!

---

## Files Already Updated

✅ `backend/analyzer/supabase_client.py` - Created
✅ `backend/analyzer/views.py` - Modified
✅ Frontend - No changes needed

Everything else works automatically!
