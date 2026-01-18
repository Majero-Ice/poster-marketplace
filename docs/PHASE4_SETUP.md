# Phase 4: Webhooks & Delivery - Setup Guide

This guide explains how to configure and test the webhook and file delivery system implemented in Phase 4.

## What Was Implemented

### 1. Webhook Handler (`/api/webhook`)

- Verifies Stripe webhook signatures for security
- Handles `checkout.session.completed` events
- Creates purchase records with unique download tokens
- Implements idempotency to prevent duplicate purchases

### 2. Purchase Entity

Created a new entity layer for purchases:

- `entities/purchase/model/types.ts` - TypeScript types
- `entities/purchase/api/getPurchaseByToken.ts` - Fetch by download token
- `entities/purchase/api/getPurchaseBySessionId.ts` - Fetch by Stripe session
- `entities/purchase/api/markAsDownloaded.ts` - Track first download

### 3. Supabase Storage Integration

- `shared/lib/supabase.ts` - Supabase client configuration
- `getSignedDownloadUrl()` function - Generates time-limited signed URLs (1 hour expiry)

### 4. Download API Route (`/api/download/[token]`)

- Verifies purchase tokens before granting access
- Returns signed download URLs from Supabase Storage
- Tracks first download timestamp
- Expires after 1 hour for security

### 5. Download Page (`/download/[token]`)

- Server-side rendered page with purchase verification
- Shows poster preview and purchase details
- Interactive download button with loading states
- Error handling for invalid tokens

### 6. Download Button Feature

- Client-side component with async download logic
- Loading and error states
- Automatic file download via signed URLs

### 7. Updated Success Page

- Fetches purchase by session ID
- Displays immediate download link when available
- Fallback message if webhook hasn't processed yet

## Environment Variables Required

Add these to your `.env` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Supabase Storage Setup

### 1. Create Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** → **Create a new bucket**
2. Name it `posters`
3. Make it **private** (not public)
4. Save

### 2. Upload Poster Files

Upload your high-resolution poster files to the `posters` bucket. The file paths should match the `fileUrl` field in your database.

Example:
- Database: `fileUrl: "classic-paintings/starry-night.jpg"`
- Upload to: `posters/classic-paintings/starry-night.jpg`

### 3. Storage Policies (Optional)

Since we're using signed URLs with the service role key, you don't need to configure RLS policies. The service role bypasses RLS and generates secure, time-limited URLs.

## Stripe Webhook Setup

### Local Development (Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

4. Copy the webhook signing secret that appears (starts with `whsec_`)

5. Add it to your `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Production (Vercel)

1. Deploy your app to Vercel

2. Go to Stripe Dashboard → **Developers** → **Webhooks**

3. Click **Add endpoint**

4. Enter your webhook URL:
```
https://your-app.vercel.app/api/webhook
```

5. Select events to listen for:
   - `checkout.session.completed`

6. Copy the webhook signing secret

7. Add it to Vercel environment variables:
```bash
vercel env add STRIPE_WEBHOOK_SECRET
```

## Testing the Flow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Start Stripe CLI (in another terminal)

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 3. Complete a Test Purchase

1. Browse to `http://localhost:3000`
2. Click on a poster
3. Click "Buy Now"
4. Use Stripe test card: `4242 4242 4242 4242`
5. Enter any future expiry date and CVC
6. Complete checkout

### 4. Verify Webhook Processing

Check your terminal where `stripe listen` is running. You should see:

```
✓ checkout.session.completed [200]
```

### 5. Check Success Page

After payment, you should be redirected to `/checkout/success?session_id=...`

The page should show a "Your Download is Ready" section with a download button.

### 6. Test Download

1. Click "Download Now"
2. You'll be redirected to `/download/[token]`
3. Click "Download High-Resolution File"
4. The file should download from Supabase Storage

## Troubleshooting

### Webhook not receiving events

- Ensure Stripe CLI is running with correct URL
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Verify webhook route is accessible at `/api/webhook`

### "Invalid download token" error

- Check that webhook successfully created purchase record
- Verify database connection and Prisma schema is up to date
- Check server logs for webhook processing errors

### Download fails or returns 500

- Verify Supabase credentials are correct
- Check that poster `fileUrl` matches actual file path in storage
- Ensure storage bucket exists and is named `posters`
- Check that files are uploaded to correct paths

### Success page shows "download link will be ready shortly"

- Webhook may still be processing (usually takes 1-2 seconds)
- Refresh the page after a few seconds
- Check Stripe CLI or webhook logs for errors

## Database Verification

Check if purchase was created:

```sql
SELECT * FROM "Purchase" ORDER BY "createdAt" DESC LIMIT 1;
```

Should show:
- `stripeSessionId`: The Stripe session ID
- `downloadToken`: A 64-character hex string
- `customerEmail`: Buyer's email
- `posterId`: The purchased poster
- `createdAt`: Timestamp of purchase

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── webhook/
│   │   │   └── route.ts              # Stripe webhook handler
│   │   └── download/
│   │       └── [token]/
│   │           └── route.ts          # Download API
│   ├── checkout/
│   │   └── success/
│   │       └── page.tsx              # Updated with download link
│   └── download/
│       └── [token]/
│           └── page.tsx              # Download page
├── entities/
│   └── purchase/                     # New entity
│       ├── api/
│       │   ├── getPurchaseByToken.ts
│       │   ├── getPurchaseBySessionId.ts
│       │   ├── markAsDownloaded.ts
│       │   └── index.ts
│       ├── model/
│       │   └── types.ts
│       └── index.ts
├── features/
│   └── download-file/                # New feature
│       ├── ui/
│       │   └── DownloadButton.tsx
│       └── index.ts
└── shared/
    └── lib/
        └── supabase.ts               # Supabase client
```

## Security Features

1. **Webhook Signature Verification**: All webhook requests are cryptographically verified
2. **Unique Download Tokens**: 32-byte random tokens (64 hex characters)
3. **Time-Limited URLs**: Signed URLs expire after 1 hour
4. **Private Storage**: Files are not publicly accessible
5. **Purchase Verification**: Download endpoint validates purchase before serving files
6. **Idempotency**: Duplicate webhook events don't create duplicate purchases

## Next Steps

With Phase 4 complete, you can now:

1. **Phase 5: Polish & Deploy**
   - Add loading states and error handling
   - Improve responsive design
   - Deploy to Vercel
   - Configure production webhooks

2. **Optional Enhancements**
   - Send email notifications with download links (Resend)
   - Add download expiry/limit policies
   - Implement purchase history for users
   - Add admin dashboard for managing orders
