import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import documentReducer from './documentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    documents: documentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;