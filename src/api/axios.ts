import { store } from "@/store/store";
import axios from "axios";

export default axios.create({
    baseURL: 'http://localhost:8000/api/v1',
})

axios.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (!['/users/register' || '/users/login'].includes(config.url!)) {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized! Redirecting to login.');
      }
      return Promise.reject(error);
    }
  );