# Fix Supabase Plan Update Error

## 🔴 Error You're Seeing

```
new row for relation "user_subscriptions" 
violates check constraint "user_subscriptions_plan_check"
```

## 🔍 What This Means

The `user_subscriptions` table has a **check constraint** that only allows specific values for the `plan` column. You're trying to enter a value that's not allowed.

---

## ✅ Quick Fix (Recommended)

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run This SQL

```sql
-- Drop the old restrictive constraint
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_plan_check;

-- Add new constraint that allows 'free', 'premium', 'pro'
ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_plan_check 
CHECK (plan IN ('free', 'premium', 'pro'));
```

### Step 3: Click "Run" Button

The constraint will be updated.

### Step 4: Try Updating Again

Now go back to Table Editor and try changing the plan to:
- `free` ✅
- `premium` ✅
- `pro` ✅

**It should work now!**

---

## 📋 Allowed Values

After running the fix, you can ONLY use these exact values:

| Value | Description |
|-------|-------------|
| `free` | Free plan (3 messages) |
| `premium` | Premium plan (10 messages) |
| `pro` | Pro plan (20 messages) |

### ⚠️ Important:
- Must be **lowercase**
- Must be **exact spelling**
- No spaces or extra characters

---

## 🎯 How to Update Plans Manually

### Option 1: Using Table Editor (UI)

1. Go to **Table Editor** → `user_subscriptions`
2. Click on the row you want to edit
3. In the `plan` column, type **exactly**: `premium` or `pro`
4. Press Enter or click outside
5. Should save without error now!

### Option 2: Using SQL Editor

```sql
-- Update specific user to premium
UPDATE user_subscriptions 
SET 
  plan = 'premium',
  message_limit = 10,
  subscription_end = NOW() + INTERVAL '30 days'
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Update specific user to pro
UPDATE user_subscriptions 
SET 
  plan = 'pro',
  message_limit = 20,
  subscription_end = NOW() + INTERVAL '30 days'
WHERE user_id = 'YOUR_USER_ID_HERE';
```

Replace `YOUR_USER_ID_HERE` with the actual user_id from the table.

---

## 🔧 Complete Verification Flow

### After Payment Verification:

1. **Check UPI App** for transaction ID
2. **Find User** in Supabase:
   ```sql
   SELECT * FROM user_subscriptions 
   WHERE transaction_id = '123456789012';
   ```

3. **Verify Payment** matches amount

4. **Update Plan**:
   ```sql
   UPDATE user_subscriptions 
   SET 
     plan = 'premium',              -- Change to 'premium' or 'pro'
     message_limit = 10,            -- 10 for premium, 20 for pro
     payment_verified = TRUE,       -- Mark as verified
     subscription_end = NOW() + INTERVAL '30 days'
   WHERE transaction_id = '123456789012';
   ```

5. **Verify Update**:
   ```sql
   SELECT user_id, email, plan, message_limit, payment_verified 
   FROM user_subscriptions 
   WHERE transaction_id = '123456789012';
   ```

---

## 🐛 Troubleshooting

### Error: "violates check constraint"

**Cause**: You're typing a value not in the allowed list.

**Solution**: 
- Use exactly: `free`, `premium`, or `pro`
- Check for typos
- Make sure it's lowercase
- No extra spaces

### Error: "column does not exist"

**Cause**: Missing columns from schema update.

**Solution**: Run the schema update SQL:
```sql
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS requested_plan TEXT;
```

### Can't Find User

**Cause**: User hasn't signed up yet or wrong user_id.

**Solution**: Search by email:
```sql
SELECT * FROM user_subscriptions 
WHERE email = 'user@example.com';
```

---

## 📊 Example: Complete Upgrade Process

### Scenario: User paid ₹1500 for Premium

```sql
-- 1. Find the user by transaction ID
SELECT * FROM user_subscriptions 
WHERE transaction_id = '123456789012';

-- 2. Verify it shows:
--    - plan: 'free'
--    - payment_verified: FALSE
--    - requested_plan: 'premium'
--    - payment_amount: 1500

-- 3. Upgrade the user
UPDATE user_subscriptions 
SET 
  plan = 'premium',
  message_limit = 10,
  payment_verified = TRUE,
  subscription_end = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE transaction_id = '123456789012';

-- 4. Verify the upgrade
SELECT 
  email,
  plan,
  message_limit,
  messages_used,
  payment_verified,
  subscription_end
FROM user_subscriptions 
WHERE transaction_id = '123456789012';

-- Should show:
-- plan: 'premium'
-- message_limit: 10
-- payment_verified: TRUE
```

---

## ✅ Summary

### The Problem:
- Check constraint only allows specific plan values
- You tried to enter an invalid value

### The Solution:
1. Run SQL to update constraint
2. Use only: `free`, `premium`, or `pro`
3. Update plan + message_limit together

### After Fix:
- ✅ Can change plans in Table Editor
- ✅ Can update via SQL
- ✅ Constraint validates correct values
- ✅ Prevents typos and invalid data

---

## 🚀 Quick Commands

### Fix Constraint:
```sql
ALTER TABLE user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_plan_check;
ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_plan_check CHECK (plan IN ('free', 'premium', 'pro'));
```

### Upgrade to Premium:
```sql
UPDATE user_subscriptions SET plan = 'premium', message_limit = 10 WHERE user_id = 'USER_ID';
```

### Upgrade to Pro:
```sql
UPDATE user_subscriptions SET plan = 'pro', message_limit = 20 WHERE user_id = 'USER_ID';
```

**Run the fix SQL and you'll be able to update plans!** ✅
