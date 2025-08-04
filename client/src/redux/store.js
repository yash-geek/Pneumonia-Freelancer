import { configureStore } from '@reduxjs/toolkit';
import miscSlice from './reducers/misc';
import api from './apis/api';
import authSlice from './reducers/auth';
import { factApi } from './apis/factApi'; 

const store = configureStore({
  reducer: {
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer,
    [authSlice.name]: authSlice.reducer,
    [factApi.reducerPath]: factApi.reducer, 
  },
  middleware: (defaultMiddleware) => [
    ...defaultMiddleware(),
    api.middleware, 
    factApi.middleware, 
  ],
});

export default store;
