import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hydro-flowgauge-backend.onrender.com/api';

console.log('🔧 API Configuration:', {
  baseURL: API_URL,
  environment: import.meta.env.MODE,
  isCapacitor: window.Capacitor !== undefined
});

const API = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout for mobile
  headers: {
    'Content-Type': 'application/json',
  }
});

let getTokenFunction = null;

export const setGetToken = (getTokenFn) => {
  getTokenFunction = getTokenFn;
};

API.interceptors.request.use(
  async (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    if (getTokenFunction) {
      try {
        const token = await getTokenFunction();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
          console.log('✅ Token added to request');
          return config;
        }
      } catch (error) {
        console.error('❌ Error getting Clerk token:', error);
      }
    }
    
    const localToken = localStorage.getItem('token');
    if (localToken) {
      config.headers['Authorization'] = `Bearer ${localToken}`;
      console.log('✅ Local token added to request');
      return config;
    }
    
    console.log('⚠️ No token available for request');
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      console.error('❌ Network Error:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      // Check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        console.error('⏱️ Request timeout - Server may be slow or sleeping (Render free tier)');
      } else if (error.message === 'Network Error') {
        console.error('🌐 Network connectivity issue - Check internet connection');
      }
      
      return Promise.reject({
        message: 'Connection error. Please check your internet connection.',
        originalError: error
      });
    }
    
    // Server responded with error
    console.error(`❌ API Error: ${error.response.status}`, {
      url: error.config?.url,
      status: error.response.status,
      data: error.response.data
    });
    
    if (error.response?.status === 401) {
      console.error('🔒 Authentication failed - Token may be invalid');
    } else if (error.response?.status === 500) {
      console.error('💥 Server error:', error.response.data);
    } else if (error.response?.status === 403) {
      console.error('🚫 Forbidden - Insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);

export default API;
