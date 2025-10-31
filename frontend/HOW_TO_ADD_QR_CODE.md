# How to Add Your Payment QR Code

## Quick Steps:

1. **Save your QR code image** (the first image you provided) as `payment-qr.png`

2. **Place it in the public folder:**
   ```
   frontend/public/payment-qr.png
   ```

3. **That's it!** The QR code will automatically appear on:
   - Pricing page (`/pricing`)
   - Upgrade page (`/upgrade`)

## File Location:
```
ai analyst/
├── frontend/
│   ├── public/
│   │   └── payment-qr.png  ← Put your QR code here
│   ├── src/
│   └── package.json
└── backend/
```

## What the Code Does:
- Looks for `/payment-qr.png` in the public folder
- Displays it in the payment modal
- Shows a warning if the image is not found
- Uses `object-contain` to maintain aspect ratio

## Image Requirements:
- **Format**: PNG, JPG, or any web-compatible format
- **Name**: Must be exactly `payment-qr.png`
- **Size**: Any size (will be displayed as 256x256px)
- **Location**: `frontend/public/` folder

## Testing:
1. Save your QR code as `payment-qr.png` in `frontend/public/`
2. Refresh the website
3. Go to pricing page
4. Click "Choose Premium" or "Choose Pro"
5. Your actual QR code should appear in the payment modal

## Troubleshooting:
- **QR code not showing?** Check the file name is exactly `payment-qr.png`
- **Wrong location?** Make sure it's in `frontend/public/`, not `frontend/src/`
- **Still not working?** Clear browser cache and refresh

---

**Note**: The QR code image you provided will now be used for actual payments. Users can scan it with Google Pay, PhonePe, Paytm, or any UPI app to send you money.
