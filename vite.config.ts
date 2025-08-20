import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Map non-prefixed env vars to VITE_ prefixed vars for client usage
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.VITE_SUPABASE_URL || env.SUPABASE_URL || 'https://hucxgczibzdqpaiuvwrf.supabase.co'
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y3hnY3ppYnpkcXBhaXV2d3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQ1NTQsImV4cCI6MjA3MTE5MDU1NH0.fJSyNAF7peA1mvcZyTJkDgljzmQSgiegVADBEOjkUlc'
      )
    }
  };
});
