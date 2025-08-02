import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isMobile:false,
};

const miscSlice = createSlice({
    name:"misc",
    initialState,
    reducers:{
        
       toggleDrawer:(state)=>{
        state.isMobile = !state.isMobile;
       },
       closeDrawer:(state)=>{
        state.isMobile = false
       },
    },
})

export default miscSlice;
export const {
    toggleDrawer,
    closeDrawer,

} = miscSlice.actions;