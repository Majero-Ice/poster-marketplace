# Vercel + Supabase Database Configuration

## Problem

When deploying to Vercel, you may encounter this error:
```
connect ENETUNREACH [IPv6 address]:5432
```

This happens because Vercel's serverless environment cannot use direct PostgreSQL connections.

## Solution: Use Supabase Connection Pooler

### Step 1: Get the Connection Pooler URL

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. **IMPORTANT:** Select **"Connection pooling"** (NOT "Connection string")
6. Mode: Choose **Transaction** mode
7. Copy the URL

The URL should look like:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

Key differences from direct connection:
- Port: `6543` instead of `5432`
- Host: includes `.pooler.`
- Parameter: includes `?pgbouncer=true`

### Step 2: Add Connection Limit Parameter

Add `&connection_limit=1` to the end of the URL:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

This is important for serverless environments to prevent connection pool exhaustion.

### Step 3: Update Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find `DATABASE_URL`
4. Click **Edit**
5. **Replace** the value with the new Connection Pooler URL
6. **Important:** Add it for all environments (Production, Preview, Development)
7. Save changes

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯** (three dots) → **Redeploy**
4. Or push a new commit to trigger automatic redeployment

## Local Development

For local development, you can continue using the **direct connection** URL (port 5432).

Create a `.env.local` file:
```env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

The application will automatically detect and configure the connection appropriately.

## Verification

After redeployment, your build should succeed. Check:
1. Build logs show successful database connection
2. Pages that query the database load correctly
3. No `ENETUNREACH` errors

## Troubleshooting

### Still getting connection errors?

1. **Check the URL format:**
   - Must include `.pooler.` in hostname
   - Must have port `6543`
   - Must include `?pgbouncer=true`

2. **Verify password encoding:**
   - If your password has special characters, they must be URL-encoded
   - Example: `@` becomes `%40`, `#` becomes `%23`

3. **Check Supabase connection limits:**
   - Go to Supabase Dashboard → Database → Connection Pooler
   - Verify it's enabled and not at maximum connections

4. **Verify environment variable:**
   - In Vercel, check the variable is set for Production environment
   - No extra spaces or quotes

### Alternative: Use Supabase Direct Connection with Prisma Data Proxy

If pooling doesn't work, consider using [Prisma Data Proxy](https://www.prisma.io/data-platform/proxy) (paid service).

## References

- [Supabase: Database Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Vercel: Using Prisma with PostgreSQL](https://vercel.com/guides/using-prisma-with-vercel)
- [Prisma: Best practices for serverless](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
