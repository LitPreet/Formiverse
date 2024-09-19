import axios from 'axios';
import { store } from '@/store/store'; // If needed for other Redux actions like refreshing user info
import { setCredentials } from '@/features/auth/authSlice'; // Optional for managing user data in Redux if needed
// import { useNavigate } from 'react-router-dom';
export const axiosFormInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/users', 
  headers: {
    'Content-Type': 'multipart/form-data', // Axios will set this automatically, but explicit is good
  },
  withCredentials: true
})

// Axios instance with credentials
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/users', // Adjust to your base URL
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // Ensures cookies are sent with requests
});

// Request interceptor (no need to set Authorization header)
axiosInstance.interceptors.request.use(
  (config) => {
    // Cookies will automatically be sent by the browser, so no need to add tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Just return the response if successful
  async (error) => {
    const originalRequest = error.config;
    // const navigate = useNavigate();

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevents infinite retry loops

      try {
        // Attempt to refresh the tokens by hitting your refresh token API
         await axiosInstance.post('/refresh-token', {}, { withCredentials: true });
        
        // Retry the original request with the new token (no need to set manually as cookies will handle it)
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // navigate('/login')
        return Promise.reject(refreshError); // If refresh fails, reject the promise
      }
    }

    return Promise.reject(error);
  }
);
