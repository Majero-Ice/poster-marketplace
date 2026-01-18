# Troubleshooting: Webhook Not Receiving Events

## Problem

The `/checkout/success` page shows the message "Your download link will be ready shortly", even after refreshing the page. SQL queries to the Purchase table are visible in the console, but no records are found.

## Cause

The webhook endpoint (`/api/webhook`) is not receiving events from Stripe because:
1. Stripe CLI is not running
2. Events are not being forwarded to the local server

## Solution

### Step 1: Install Stripe CLI

**Windows (using Scoop):**
```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Or download directly:**
https://github.com/stripe/stripe-cli/releases/latest

### Step 2: Authenticate with Stripe

```bash
stripe login
```

This will open a browser for authentication. Confirm access.

### Step 3: Start webhook forwarding

**In a new terminal** (keep `npm run dev` running):

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

You will see:
```
> Ready! You are using Stripe API Version [2024-XX-XX]. Your webhook signing secret is whsec_xxxxx
```

### Step 4: Copy webhook secret

Copy the `whsec_xxxxx` value and add it to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 5: Restart dev server

Stop `npm run dev` (Ctrl+C) and start again:

```bash
npm run dev
```

### Step 6: Verify webhook is working

1. Open http://localhost:3000
2. Select a poster and click "Buy Now"
3. Use test card: `4242 4242 4242 4242`
4. Complete payment

**In the terminal with `stripe listen` you should see:**

```
2024-01-18 10:30:15   --> checkout.session.completed [evt_xxxxx]
2024-01-18 10:30:15  <--  [200] POST http://localhost:3000/api/webhook [evt_xxxxx]
```

**In the terminal with `npm run dev` you should see:**

```
Purchase created: {
  sessionId: 'cs_test_xxxxx',
  posterId: 'xxx-xxx-xxx',
  customerEmail: 'test@example.com'
}
```

### Step 7: Check success page

After payment, a green "Download Now" button should appear on the `/checkout/success` page.

## Verifying Webhook Operation

### Manually check Purchase in database:

Run Prisma Studio:

```bash
npx prisma studio
```

Open the `Purchase` table - there should be records after the test purchase.

### Check webhook logs:

In the terminal with `stripe listen`, watch for events:
- ✓ `[200]` - webhook successfully processed
- ✗ `[400]` or `[500]` - processing error

### Test webhook directly:

```bash
stripe trigger checkout.session.completed
```

This will send a test event to your webhook.

## Common Errors

### "Webhook signature verification failed"

**Cause:** Incorrect `STRIPE_WEBHOOK_SECRET`

**Solution:** 
1. Verify you copied the correct secret from `stripe listen` output
2. Restart dev server after changing `.env`

### "Missing posterId or customerEmail"

**Cause:** Test event from `stripe trigger` does not contain metadata

**Solution:** Use a real purchase through the interface, not `stripe trigger`

### Webhook receives events but Purchase is not created

**Cause:** Database or Prisma error

**Check:**
```bash
npx prisma generate
npx prisma migrate dev
```

## Alternative: Use test events in development mode

If you don't want to use Stripe CLI, you can create a test endpoint to simulate the webhook:

```typescript
// src/app/api/test-purchase/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  const { sessionId, posterId, customerEmail } = await req.json();

  const downloadToken = randomBytes(32).toString("hex");

  const purchase = await prisma.purchase.create({
    data: {
      posterId,
      customerEmail,
      stripeSessionId: sessionId,
      downloadToken,
    },
  });

  return NextResponse.json(purchase);
}
```

This is for testing only and should not be used in production!

## Production Setup

On production (Vercel), the webhook works automatically:

1. Deploy your application to Vercel
2. In Stripe Dashboard → Webhooks → Add endpoint
3. URL: `https://your-app.vercel.app/api/webhook`
4. Events: `checkout.session.completed`
5. Copy the webhook secret to Vercel env variables

```bash
vercel env add STRIPE_WEBHOOK_SECRET
```
