# Deployment Guide

This guide covers deploying the Digital Posters Marketplace to Vercel.

## Prerequisites

- Vercel account
- Supabase project (PostgreSQL + Storage)
- Stripe account (with test/production keys)
- GitHub repository

## Environment Variables

Create the following environment variables in your Vercel project settings:

### Database
- `DATABASE_URL` - PostgreSQL connection string from Supabase

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (see below)

### Admin Auth
- `JWT_SECRET` - Secret key for JWT token generation (use a strong random string)

### App URL
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., https://your-app.vercel.app)

## Step-by-Step Deployment

### 1. Push to GitHub

Ensure all your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 3. Configure Environment Variables

1. In your Vercel project settings, go to "Environment Variables"
2. Add all the environment variables listed above
3. Make sure to use production values for:
   - Stripe keys (replace test keys with live keys)
   - Production database URL
   - Production app URL

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Setup Database

After the first deployment:

1. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

2. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

You can run these commands locally (connecting to production database) or use Vercel CLI.

### 6. Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the endpoint URL: `https://your-app.vercel.app/api/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
5. Copy the webhook signing secret
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy the application

### 7. Setup Supabase Storage

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a bucket named `posters` (or your preferred name)
4. Set the bucket to public or configure access policies
5. Update the storage configuration in your code if needed

### 8. Create Admin Account

1. Use the seed script to create an admin account, or
2. Manually insert an admin record into the `Admin` table with a hashed password

Default admin credentials (from seed):
- Email: `admin@postermart.com`
- Password: `admin123`

**Important:** Change the admin password after first login in production!

## Post-Deployment Checklist

- [ ] Test the homepage loads correctly
- [ ] Test poster detail pages
- [ ] Test search functionality
- [ ] Test cart functionality
- [ ] Test checkout flow with Stripe test card
- [ ] Verify webhook is receiving events
- [ ] Test download functionality
- [ ] Test admin login
- [ ] Test admin CRUD operations
- [ ] Check mobile responsiveness
- [ ] Verify all environment variables are set
- [ ] Change default admin password

## Testing the Production Flow

Use Stripe test cards to verify the checkout flow:

- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

Any future date for expiry, any 3 digits for CVC, any 5 digits for ZIP.

## Troubleshooting

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase connection pooling settings
- Ensure database is accessible from Vercel's IP ranges

### Webhook Issues

- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Test webhook manually using Stripe CLI or dashboard
- Check webhook endpoint logs in Vercel

### Image Upload Issues

- Verify Supabase storage bucket exists and is accessible
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify bucket policies allow uploads

## Monitoring

- Use Vercel Analytics for performance monitoring
- Check Vercel logs for runtime errors
- Monitor Stripe dashboard for payment issues
- Set up alerts for critical errors

## Rolling Back

If issues occur:

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find a previous working deployment
4. Click "Promote to Production"

## Updating Production

For future updates:

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel automatically deploys from main branch
5. Monitor deployment in Vercel dashboard

## Security Recommendations

- Use strong passwords for admin accounts
- Rotate JWT_SECRET periodically
- Keep Stripe keys secure
- Enable HTTPS only (Vercel does this by default)
- Set up rate limiting for API routes
- Monitor for suspicious activity
- Keep dependencies updated

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
