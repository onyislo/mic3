# Password Reset Fix Guide

This guide explains the changes made to implement the "Forgot Password" functionality and how to configure it properly.

## Changes Made:

1. **Created New Components:**
   - `ResetPassword.tsx`: Handles the initial password reset request
   - `UpdatePassword.tsx`: Handles setting a new password after clicking the reset link

2. **Updated Router Configuration:**
   - Added new routes in `App.tsx` for `/reset-password` and `/update-password`
   - Added these routes to `vercel.json` for proper routing

3. **Environment Variable Management:**
   - Added `VITE_SITE_URL` to `.env` and `.env.production` to handle redirects properly
   - Updated Supabase to use this URL for password reset links

## Configuration Steps Required:

### 1. Update Environment Variables:

Make sure your `.env` for development has:
```
VITE_SITE_URL=http://localhost:5173
```

And your production environment (in Vercel) has:
```
VITE_SITE_URL=https://your-actual-domain.com
```

### 2. Configure Supabase Authentication Settings:

1. Log in to your Supabase Dashboard
2. Go to **Authentication → Settings → URL Configuration**
3. Set the **Site URL** to your production URL (e.g., `https://your-production-domain.com`)
4. Under **Redirect URLs**, add:
   - `https://your-production-domain.com/update-password`
   - If you also use other redirect URLs, keep them in the list

### 3. Deploy Your Changes:

1. Push your changes to your GitHub repository
2. Redeploy your application in Vercel

## Testing the Fix:

1. Go to your deployed application
2. Click on "Login"
3. Click on "Forgot your password?"
4. Enter your email address and submit
5. Check your email for the password reset link
6. Click the link - it should now properly redirect you to the update password page
7. Enter and confirm your new password
8. You should now be able to log in with your new password

## Troubleshooting:

If the reset password emails don't arrive:
- Check your spam folder
- Verify your Supabase URL configuration is correct
- Make sure your `VITE_SITE_URL` is set correctly in Vercel

If the reset link redirects to a blank page:
- Verify your Supabase "Redirect URLs" includes your update-password page
- Check that your Vercel deployment includes the new routes
- Make sure the latest changes were successfully deployed

## How It Works:

1. When a user requests a password reset, Supabase sends an email with a special link
2. This link contains authentication parameters in the URL hash (#)
3. When clicked, it redirects to your `VITE_SITE_URL/update-password` path
4. The `UpdatePassword` component reads these parameters and allows the user to set a new password
5. After successful password update, the user is redirected to login

The fix addresses the previous issue where the reset link was pointing to localhost instead of your production URL.
