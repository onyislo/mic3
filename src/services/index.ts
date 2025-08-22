import { api } from './api';
import { mockApi } from './mockApi';
import * as fallbackHandler from './fallbackHandler';

// Enhance the api object with fallback handlers
if (import.meta.env.DEV) {
  // In development, patch the api object's methods with fallback handlers
  const originalSubmitContact = api.submitContact.bind(api);
  api.submitContact = async (data) => {
    try {
      return await originalSubmitContact(data);
    } catch (err) {
      console.log('Using fallback handler for contact form submission:', err);
      return fallbackHandler.handleContactFormFallback(data);
    }
  };
}

// Use mock API for development, but this can be conditionally replaced with the real API
// in production or based on environment variables
const apiService = import.meta.env.VITE_USE_MOCK_API === 'true' ? mockApi : api;

export { apiService as api, fallbackHandler };
