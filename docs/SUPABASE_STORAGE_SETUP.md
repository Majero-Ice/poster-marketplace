# Supabase Storage Setup

## Problem

When uploading files from the admin panel, you may get errors because the Supabase Storage bucket doesn't have the correct permissions.

## Solution: Configure Storage Bucket and RLS Policies

### 1. Create Storage Bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Name it: `posters`
6. Set it as **Public bucket** (so uploaded files have public URLs)
7. Click **Create bucket**

### 2. Configure RLS Policies

Since we're using the anonymous key from the client, we need to allow uploads.

Go to **Storage** → **Policies** → `posters` bucket

#### Option A: Allow All Uploads (Simple, Less Secure)

Click **New Policy** and add:

```sql
-- Allow anyone to upload
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'posters');

-- Allow anyone to read
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posters');

-- Allow anyone to delete (for updates)
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'posters');
```

#### Option B: Authenticated Users Only (More Secure)

If you want only authenticated admins to upload, use Supabase Auth and these policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posters');

-- Allow public reads (so customers can see images)
CREATE POLICY "Public can read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posters');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posters');
```

### 3. File Size Limits

In Supabase Dashboard → **Storage** → **Settings**:
- Set **Upload file size limit** to at least **30 MB** (or 50 MB for free tier maximum)

### 4. Verify Environment Variables

Make sure these are set in your `.env` and Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing

1. Go to `/admin/products/new`
2. Try uploading an image and file
3. Check if upload succeeds
4. Verify files appear in **Storage** → **posters** bucket

## Troubleshooting

### "new row violates row-level security policy"

- Check that RLS policies are created
- Verify bucket name is `posters`
- Make sure policies allow the operation you're trying to do

### "supabaseKey is required"

- This error means environment variables aren't loaded
- Check `.env` file has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server: `npm run dev`
- On Vercel: verify environment variable is set

### Files upload but don't show

- Verify bucket is set to **Public**
- Check if `getPublicUrl()` returns valid URL
- Make sure storage policies allow SELECT

## Production Checklist

- [ ] Storage bucket `posters` created
- [ ] Bucket set to Public
- [ ] RLS policies configured
- [ ] File size limit set to 30MB+
- [ ] Environment variables set in Vercel
- [ ] Test upload from admin panel
- [ ] Verify public can view images
