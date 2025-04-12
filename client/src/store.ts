import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';
import portfolioReducer from './slices/portfolioSlice';
import analysisReducer from './slices/analysisSlice';
import settingsReducer from './slices/settingsSlice';
import autoTradingReducer from './slices/autoTradingSlice';
import socialReducer from './slices/socialSlice';
import tradingReducer from './slices/tradingSlice';
import backtestReducer from './slices/backtestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    portfolio: portfolioReducer,
    analysis: analysisReducer,
    settings: settingsReducer,
    autoTrading: autoTradingReducer,
    social: socialReducer,
    trading: tradingReducer,
    backtest: backtestReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 