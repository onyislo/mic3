# Vercel Deployment Guide

This guide will help you properly deploy your React application with Supabase integration to Vercel.

## Fix for "Invalid API Key" Error

**The "Invalid API Key" error occurs because your Supabase credentials are not properly set in your Vercel deployment.** This is why you can't see data added in one browser when viewing the site in another browser.

## Required Environment Variables

You must configure these environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://hucxgczibzdqpaiuvwrf.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y3hnY3ppYnpkcXBhaXV2d3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQ1NTQsImV4cCI6MjA3MTE5MDU1NH0.fJSyNAF7peA1mvcZyTJkDgljzmQSgiegVADBEOjkUlc` | Your Supabase anonymous key |
| `VITE_SITE_URL` | `https://your-production-domain.com` | Your production site URL (required for password reset functionality) |

⚠️ **Note**: Do not hardcode these values in `vercel.json` or any source files. Always use the Vercel dashboard for security reasons.

## Vercel Configuration

The `vercel.json` file should only contain routing configurations:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/admin/(.*)", "dest": "/index.html", "status": 200 },
    { "src": "/courses/(.*)", "dest": "/index.html", "status": 200 },
    { "src": "/login", "dest": "/index.html", "status": 200 },
    { "src": "/register", "dest": "/index.html", "status": 200 },
    { "src": "/dashboard", "dest": "/index.html", "status": 200 },
    { "src": "/contact", "dest": "/index.html", "status": 200 },
    { "src": "/portfolio", "dest": "/index.html", "status": 200 },
    { "src": "/auth/(.*)", "dest": "/index.html", "status": 200 },
    { "src": "/(.*)", "dest": "/index.html", "status": 200 }
  ]
}
```

## Common Deployment Issues

### 1. "Invalid API key" Error

If you encounter an "Invalid API key" error when registering or logging in, it means that the Supabase environment variables are not properly set. Follow these steps:

1. Check if the environment variables are correctly set in the Vercel dashboard
2. Ensure you have removed any hardcoded environment variables from `vercel.json`
3. Redeploy your application after making these changes

### 2. "Missing public directory" Error

If you encounter a "Missing public directory" error, make sure:

1. Your build command is properly configured in Vercel
2. The output directory is properly set (typically `dist` for Vite projects)
3. Your `package.json` includes a proper build script

Default build configuration for this Vite project:
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. Mixed Routing Properties Error

If you see "Mixed routing properties" error, ensure you don't have both `rewrites` and `routes` in your `vercel.json`. Only use one of these properties (preferably `routes` for this project).

## Troubleshooting

If you still encounter deployment issues:

1. Check the Vercel deployment logs for specific error messages
2. Ensure all dependencies are properly installed
3. Verify that the build process completes successfully
4. Test your build locally with `npm run build`
