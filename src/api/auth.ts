import { RegisterUser } from "@/lib/types/auth"
import axios from "./axios"

export const registerUser = async (data: FormData) => {
    try {
        const res = await axios.post('/users/register', data);
        return res.data;
    } catch (err:any) {
        throw new Error(err.message || 'An error occurred');
    }
}