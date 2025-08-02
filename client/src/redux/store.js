import {configureStore} from '@reduxjs/toolkit'
//import api from './api/api';
//import authSlice from './reducers/auth';
import miscSlice from './reducers/misc';
import api from './apis/api';
import authSlice from './reducers/auth';
//import chatSlice from './reducers/chat';
const store = configureStore({
    reducer:{
        // [authSlice.name]:authSlice.reducer,
        [miscSlice.name]:miscSlice.reducer,
        [api.reducerPath]:api.reducer,
        [authSlice.name]:authSlice.reducer,
        // [chatSlice.name]:chatSlice.reducer,
        // [api.reducerPath]:api.reducer,
    },
    middleware:(defaultMiddleware)=>[
        ...defaultMiddleware(),
        api.middleware, 
    ],
})


export default store;