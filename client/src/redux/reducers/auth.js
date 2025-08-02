import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const initialState = {
    user: null,
    role: null,
    loader: true,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userExists: (state, action) => {
            state.user = action.payload;
            state.role = action.payload.role; 
            state.loader = false;
        },
        userNotExists: (state) => {
            state.user = null;
            state.loader = false;
        }
    },

})

export default authSlice;
export const { userExists, userNotExists } = authSlice.actions;