import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, SubscriptionTier } from '../../types';

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: Boolean(localStorage.getItem('token')),
  isLoading: false,
  error: null
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful login for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data
      const userData = {
        id: '123456',
        email: credentials.email,
        username: credentials.email.split('@')[0],
        createdAt: new Date().toISOString(),
        profilePicture: undefined,
        subscription: SubscriptionTier.FREE
      };
      
      const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return { user: userData, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; username: string; password: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const newUser = {
        id: '123456',
        email: userData.email,
        username: userData.username,
        createdAt: new Date().toISOString(),
        profilePicture: undefined,
        subscription: SubscriptionTier.FREE
      };
      
      const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return { user: newUser, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Đăng nhập thất bại';
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Đăng ký thất bại';
      });
  }
});

export const { clearError, updateUser } = authSlice.actions;

export default authSlice.reducer; 