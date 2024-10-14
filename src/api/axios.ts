import axios from 'axios';

const baseURL = import.meta.env.VITE_LIVE_URL || import.meta.env.VITE_LOCAL_URL;

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1/users`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

const axiosRefreshInstance = axios.create({
  baseURL: `${baseURL}/api/v1/users`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});
// Request interceptor (no need to set Authorization header as cookies handle it)
axiosInstance.interceptors.request.use(
  (config) => {
    // Cookies will automatically be sent by the browser, so no need to add tokens here
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Just return the response if successful
  async (error) => {
    const originalRequest = error.config;
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevents infinite retry loops

      try {
        // Attempt to refresh the token
        const refreshResponse = await axiosRefreshInstance.post('/refresh-token', {}, { withCredentials: true });
        
        if (refreshResponse.status === 200) {
          // Retry the original request with the updated token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Token refresh failed, log out the user or redirect to login
        window.location.href = '/login'; // Redirect to login page or handle logout
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // If not 401 or token refresh fails, return the error
  }
);
