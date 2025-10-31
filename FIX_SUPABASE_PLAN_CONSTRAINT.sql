-- Fix Supabase Plan Constraint Error
-- Error: "new row for relation 'user_subscriptions' violates check constraint 'user_subscriptions_plan_check'"

-- STEP 1: Check what the current constraint allows
-- Run this to see the constraint definition:
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'user_subscriptions'::regclass 
AND conname = 'user_subscriptions_plan_check';

-- STEP 2: Drop the old constraint (if it's too restrictive)
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_plan_check;

-- STEP 3: Add a new constraint that allows 'free', 'premium', and 'pro'
ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_plan_check 
CHECK (plan IN ('free', 'premium', 'pro'));

-- STEP 4: Verify the constraint is working
-- Try updating a row (replace with your actual user_id):
UPDATE user_subscriptions 
SET plan = 'premium' 
WHERE user_id = 'd2ffa753-0c87-48b3-ac4f-5885e4d466917';

-- STEP 5: Check if update worked
SELECT user_id, email, plan, message_limit 
FROM user_subscriptions 
WHERE user_id = 'd2ffa753-0c87-48b3-ac4f-5885e4d466917';

-- ============================================
-- ALTERNATIVE: If you want to allow any value
-- ============================================

-- Drop the constraint entirely (not recommended for production)
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_plan_check;

-- Now you can set any value for plan column
-- But this removes validation, so be careful!

-- ============================================
-- RECOMMENDED: Keep constraint but fix values
-- ============================================

-- This is the safest approach:
-- 1. Drop old constraint
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_plan_check;

-- 2. Add new constraint with correct values
ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_plan_check 
CHECK (plan IN ('free', 'premium', 'pro'));

-- 3. Now you can update to any of these values:
-- UPDATE user_subscriptions SET plan = 'free' WHERE ...
-- UPDATE user_subscriptions SET plan = 'premium' WHERE ...
-- UPDATE user_subscriptions SET plan = 'pro' WHERE ...
