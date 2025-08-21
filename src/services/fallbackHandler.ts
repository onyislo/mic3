// This file contains a fallback API implementation for when the app is deployed
// without a backend API server

export const fallbackHandler = {
  // Handle API requests when no actual API is available
  handleRequest: async (url: string) => {
    console.log(`API fallback: Request to ${url} was intercepted`);
    
    if (url.includes('/courses')) {
      // Return empty courses array
      return { 
        data: [], 
        message: 'No courses available. API not configured in this environment.' 
      };
    }
    
    // Default response for any other endpoints
    return {
      success: false,
      message: 'API not available in this environment',
      data: null
    };
  }
};
