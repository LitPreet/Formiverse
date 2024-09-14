import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface User {
    username: string;
    email: string;
    avatar: string;
    fullname: string;
}
interface AuthState {
    token: string | null
    user: User | undefined
}

const initialState: AuthState = {
    token: null,
    user: undefined
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | undefined>) => {
            state.user = action.payload
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
        }
    }
})
export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer
