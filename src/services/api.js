import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Function to get Clerk token
const getClerkToken = async () => {
  try {
    // Wait for Clerk to be loaded
    if (window.Clerk) {
      // Use the correct method to get session token
      const session = await window.Clerk.session;
      if (session) {
        const token = await session.getToken();
        return token;
      }
    }
  } catch (error) {
    console.log('Could not get Clerk token:', error.message);
  }
  return null;
};

API.interceptors.request.use(
  async (config) => {
    // Try to get Clerk session token
    const clerkToken = await getClerkToken();
    
    if (clerkToken) {
      config.headers['Authorization'] = `Bearer ${clerkToken}`;
      console.log('✅ Using Clerk token for request');
      return config;
    }
    
    // Fallback to localStorage token (JWT) - for backward compatibility
    const localToken = localStorage.getItem('token');
    if (localToken) {
      config.headers['Authorization'] = `Bearer ${localToken}`;
      console.log('⚠️ Using localStorage token (legacy)');
      return config;
    }
    
    console.warn('⚠️ No authentication token available');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
