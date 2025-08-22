/**
 * Fallback handler for API calls
 * This service provides fallback implementations for API endpoints when they're not available
 * Useful for development mode or when backend services are offline
 */

// Contact Form Fallback
export const handleContactFormFallback = (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  console.log('Contact form submission - fallback handler:', {
    ...formData,
    recipient: 'info@mic3solutiongroup.com',
    timestamp: new Date().toISOString()
  });
  
  // Store in localStorage for development purposes
  try {
    const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    savedMessages.push({
      ...formData,
      recipient: 'info@mic3solutiongroup.com',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(savedMessages));
    
    return { 
      success: true, 
      fallback: true,
      message: 'Message stored locally (development mode)' 
    };
  } catch (err) {
    console.error('Error storing contact message in localStorage:', err);
    return { 
      success: true, 
      fallback: true,
      message: 'Message logged to console (development mode)' 
    };
  }
};

// Get Contact Messages (for development purposes only)
export const getStoredContactMessages = () => {
  try {
    return JSON.parse(localStorage.getItem('contactMessages') || '[]');
  } catch (err) {
    console.error('Error retrieving contact messages from localStorage:', err);
    return [];
  }
};

// Clear Contact Messages (for development purposes only)
export const clearStoredContactMessages = () => {
  try {
    localStorage.removeItem('contactMessages');
    return { success: true };
  } catch (err) {
    console.error('Error clearing contact messages from localStorage:', err);
    return { success: false, error: err };
  }
};
