import { LoginUser, OTP, RegisterUser, User } from "@/lib/types/auth"
import { axiosInstance as axioss } from "./axios"
import { axiosFormInstance } from "./axios"



export const registerUser = async (data: FormData) => {
  console.log(data, "inside api")
  try {
    const res = await axioss.post('/register', data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || 'An error occurred');
  }
}

export const verifyOTP = async (data: OTP) => {
  try {
    const res = await axioss.post('/verify-otp', data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || 'An error occurred');
  }
}

export const loginUser = async (data: { username: string, email: string; password: string, }) => {

  try {
    const response = await axioss.post('/login', data);

    return response.data
  } catch (error) {
    console.error('Login failed:', error);
  }
};

export const getCurrentUser = async (): Promise<User | undefined> => {
  try {
    const response = await axioss.get('/current-user');
    return response.data?.data
  } catch (error) {
    console.error('error hai', error);
  }
};
