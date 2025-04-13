
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_CONFIG } from '../../config/environment';

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY)),
  error: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem(API_CONFIG.AUTH_TOKEN_KEY);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
