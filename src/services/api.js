import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

let getTokenFunction = null;

export const setGetToken = (getTokenFn) => {
  getTokenFunction = getTokenFn;
};

API.interceptors.request.use(
  async (config) => {
    if (getTokenFunction) {
      try {
        const token = await getTokenFunction();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
          return config;
        }
      } catch (error) {
        console.error('Error getting Clerk token:', error);
      }
    }
    
    const localToken = localStorage.getItem('token');
    if (localToken) {
      config.headers['Authorization'] = `Bearer ${localToken}`;
      return config;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed - redirecting to login');
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;
