# Testing the Pricing System

## Quick Start

### 1. Start the Backend
```bash
cd backend
python manage.py runserver
```

### 2. Start the Frontend
```bash
cd frontend
npm start
```

### 3. Test the Flow

#### Test Free Plan (3 Messages)
1. Open http://localhost:3000
2. Click "Sign In" or "Get Started Free" button
3. You'll be redirected to the Pricing page
4. Click "Get Started Free" on the Free plan card
5. Fill in signup form (notice "Selected Plan: free" at top)
6. Complete signup and login
7. Upload a CSV file in the dashboard
8. Send 3 queries in the chatbot:
   ```
   1. Show all data (table)
   ```
   - After each query, watch the message counter decrease
   - Counter shows: "3/3" → "2/3" → "1/3" → "0/3"
9. Try sending a 4th query - it should be blocked with error:
   ```
   🚫 Message Limit Reached
   You have reached your message limit of 3 messages. Please upgrade your plan.
   ```

#### Test Premium Plan (10 Messages)
1. Go to pricing page
2. Click "Choose Premium" on Premium plan (₹1500/month)
3. Payment modal appears with:
   - Plan details
   - QR code
   - Total: ₹1500
4. Click "Payment Done" (simulates payment completion)
5. Complete signup with "Selected Plan: premium"
6. Login and verify message counter shows "10/10"
7. Send queries and watch counter decrease

#### Test Pro Plan (20 Messages)
1. Similar to Premium, but with Pro plan (₹2500/month)
2. Verify message counter shows "20/20"

## Verification Checklist

### Frontend
- [ ] Homepage buttons redirect to /pricing
- [ ] Pricing page displays 3 plans correctly
- [ ] Free plan goes directly to signup
- [ ] Paid plans show payment modal
- [ ] Payment modal shows QR code
- [ ] Signup page shows selected plan
- [ ] Chatbot header shows message counter
- [ ] Counter color changes (green → red)
- [ ] Upgrade warning appears at 0 messages
- [ ] Error message shown when limit reached

### Backend
- [ ] Subscription created on signup
- [ ] Message count increments with each query
- [ ] Queries blocked when limit reached
- [ ] 403 error returned for blocked queries
- [ ] Subscription info returned in query response

## Database Verification

### Check Subscriptions
```bash
cd backend
python manage.py shell
```

```python
from analyzer.models import UserSubscription, MessageLog

# View all subscriptions
for sub in UserSubscription.objects.all():
    print(f"{sub.email} - {sub.plan} - {sub.messages_used}/{sub.message_limit}")

# View message logs
for log in MessageLog.objects.all()[:10]:
    print(f"{log.user_id} - {log.query[:50]}")
```

## API Testing

### Test Subscription Creation
```bash
curl -X POST http://localhost:8000/api/subscription/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-123",
    "email": "test@example.com",
    "plan": "premium"
  }'
```

### Test Subscription Retrieval
```bash
curl "http://localhost:8000/api/subscription/get/?user_id=test-user-123"
```

### Test Query with Message Limit
```bash
curl -X POST http://localhost:8000/api/analyze/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show all data",
    "chart_type": "table",
    "files": ["user-id/file.csv"],
    "user_id": "test-user-123"
  }'
```

## Common Issues

### Issue: "No changes detected" during migrations
**Solution**: Ensure migrations folder exists with __init__.py
```bash
cd backend/analyzer
mkdir migrations
echo. > migrations/__init__.py
python manage.py makemigrations analyzer
python manage.py migrate
```

### Issue: Subscription not created on signup
**Solution**: Check backend logs for errors. Ensure REACT_APP_BACKEND_URL is set correctly.

### Issue: Message counter not updating
**Solution**: 
1. Check if user_id is being sent in query
2. Verify subscription exists in database
3. Check browser console for errors

### Issue: QR code not displaying
**Solution**: QR code is an SVG placeholder. Replace with actual payment QR code image.

## Expected Behavior

### Message Counter Display
- **Green text**: More than 1 message remaining
- **Red text**: 1 or 0 messages remaining
- **Yellow warning**: "Upgrade to continue" when 0 messages

### Error Messages
- **No files uploaded**: "Please upload data files first!"
- **No files selected**: "Please select at least one file to query!"
- **Limit reached**: "🚫 Message Limit Reached... Please upgrade your plan."

## Demo Accounts

Create these test accounts for demonstration:

1. **Free User**
   - Email: free@test.com
   - Plan: Free
   - Limit: 3 messages

2. **Premium User**
   - Email: premium@test.com
   - Plan: Premium
   - Limit: 10 messages

3. **Pro User**
   - Email: pro@test.com
   - Plan: Pro
   - Limit: 20 messages

## Next Steps

After testing, you can:
1. Replace QR code with actual payment gateway QR
2. Implement real payment processing
3. Add subscription management dashboard
4. Set up monthly reset for paid plans
5. Add email notifications for limit warnings
