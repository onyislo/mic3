import { api } from './api';
import { mockApi } from './mockApi';

// Determine if we're in production
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1');

// In production, we should always use the real API
// In development, check if we want to use mock API based on environment variable
let useMockApi = false;

if (!isProduction) {
  // Only allow mock API in development
  useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
  
  if (useMockApi) {
    console.log('Using mock data for courses');
  }
}

// Select the appropriate API service
const apiService = useMockApi ? mockApi : api;

export { apiService as api };
