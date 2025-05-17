// // src/store/authSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// // Define the shape of the auth state
// export interface AuthState {
//   userId: string | null;
//   email: string | null;
//   role: string | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   userId: null,
//   email: null,
//   role: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginSuccess: (state, action: PayloadAction<{ userId: string; email: string; role: string }>) => {
//       state.userId = action.payload.userId;
//       state.email = action.payload.email;
//       state.role = action.payload.role;
//       state.isAuthenticated = true;
//       localStorage.setItem('email', action.payload.email);
//     },
//     logout: (state) => {
//       state.userId = null;
//       state.email = null;
//       state.role = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('email');
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  userId: string | null;
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ userId: string; email: string; role: string }>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem('email', action.payload.email);
    },
    logout: (state) => {
      state.userId = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('email');
      localStorage.removeItem('session');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
