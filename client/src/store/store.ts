import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import tradingReducer from './slices/tradingSlice';
import signalReducer from './slices/signalSlice';
import notificationReducer, { notificationMiddleware } from './slices/notificationSlice';
import riskReducer from './slices/riskSlice';
import alertReducer from './slices/alertSlice';

export interface RootState {
  auth: ReturnType<typeof authReducer>;
  profile: ReturnType<typeof profileReducer>;
  trading: ReturnType<typeof tradingReducer>;
  signal: ReturnType<typeof signalReducer>;
  notification: ReturnType<typeof notificationReducer>;
  risk: ReturnType<typeof riskReducer>;
  alerts: ReturnType<typeof alertReducer>;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    trading: tradingReducer,
    signal: signalReducer,
    notification: notificationReducer,
    risk: riskReducer,
    alerts: alertReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(notificationMiddleware)
});

export type AppDispatch = typeof store.dispatch; 