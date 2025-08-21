# Vercel Deployment Guide

## Required Environment Variables

To deploy this application on Vercel, you **must** set the following environment variables in your Vercel project settings:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Click on the "Settings" tab
4. Select "Environment Variables" from the left sidebar
5. Add the required variables mentioned above
6. Make sure to add these variables to the "Production", "Preview", and "Development" environments
7. Click "Save" to apply the changes
8. Redeploy your application

## Deployment Troubleshooting

If you encounter "Invalid API key" errors:

1. Check that your environment variables are correctly set in Vercel
2. Make sure you're using the correct Supabase project URL and anon key
3. Verify that your Supabase project is active and not in maintenance mode
4. Try accessing the `/test-supabase.html` path on your deployed site to debug environment variables

## Local Development

For local development, create a `.env` file in your project root with the same variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Do not commit this file to version control as it contains sensitive information.
