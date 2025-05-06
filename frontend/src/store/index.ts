// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './authSlice';

// Define the root state type
export interface RootState {
  auth: AuthState;
}

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

// Export types for use with useDispatch
export type AppDispatch = typeof store.dispatch;