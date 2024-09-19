import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface User {
    username: string;
    email: string;
    fullName: string;
}
interface AuthState {
    accessToken: string | null;
    user: User | undefined
}

const initialState: AuthState = {
    accessToken: null,
    user: undefined,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ accessToken: string | null; user: User | undefined }>) => {
            state.accessToken = action.payload.accessToken;
         
            state.user = action.payload.user;
          },
          logout: (state) => {
            state.accessToken = null;
            state.user = undefined;
         
          },
        setUser: (state, action: PayloadAction<User | undefined>) => {
            state.user = action.payload
        },
        updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
            state.accessToken = action.payload.accessToken;
          },
        
    }
})
export const { setCredentials , logout,setUser,updateTokens } = authSlice.actions;
export default authSlice.reducer
