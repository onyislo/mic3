// Simple deploy script to verify environment variables are set
console.log("Starting deployment verification...");

// Check for required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

// Check if they exist in process.env (this will work for local testing)
const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('\nPlease set these variables in your Vercel project settings:');
  console.error('1. Go to https://vercel.com/[your-username]/[project-name]/settings/environment-variables');
  console.error('2. Add the missing environment variables');
  console.error('3. Redeploy your application');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
  console.log('Proceeding with deployment...');
}

// This script is just for verification purposes
// The actual build will be handled by Vite
