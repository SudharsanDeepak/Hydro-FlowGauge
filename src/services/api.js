import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

const getClerkToken = async () => {
  try {
    if (window.Clerk) {
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
    const clerkToken = await getClerkToken();
    
    if (clerkToken) {
      config.headers['Authorization'] = `Bearer ${clerkToken}`;
      console.log('✅ Using Clerk token for request');
      return config;
    }
    
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
