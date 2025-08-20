import { api } from './api';
import { mockApi } from './mockApi';

// Use mock API for development, but this can be conditionally replaced with the real API
// in production or based on environment variables
const apiService = import.meta.env.VITE_USE_MOCK_API === 'true' ? mockApi : api;

export { apiService as api };
