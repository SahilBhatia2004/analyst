-- Add new columns to user_subscriptions table for payment verification

-- Add transaction_id column
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS transaction_id TEXT;

-- Add payment_amount column
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2);

-- Add payment_verified column (true = verified, false = pending)
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT TRUE;

-- Add requested_plan column (stores the plan user wants when payment is pending)
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS requested_plan TEXT;

-- Create index for faster transaction lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_transaction_id 
ON user_subscriptions(transaction_id);

-- Create index for pending verifications
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_payment_verified 
ON user_subscriptions(payment_verified) 
WHERE payment_verified = FALSE;

-- Add comments
COMMENT ON COLUMN user_subscriptions.transaction_id IS 'UPI transaction ID from payment';
COMMENT ON COLUMN user_subscriptions.payment_amount IS 'Amount paid in INR';
COMMENT ON COLUMN user_subscriptions.payment_verified IS 'Whether payment has been verified by admin';
COMMENT ON COLUMN user_subscriptions.requested_plan IS 'Plan user requested (when payment is pending verification)';
