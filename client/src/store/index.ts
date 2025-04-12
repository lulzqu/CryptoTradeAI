import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';
import portfolioReducer from './slices/portfolioSlice';
import analysisReducer from './slices/analysisSlice';
import settingsReducer from './slices/settingsSlice';
import strategyReducer from './slices/strategySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    portfolio: portfolioReducer,
    analysis: analysisReducer,
    settings: settingsReducer,
    strategy: strategyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['market.lastUpdated', 'portfolio.positions.timestamp'],
      },
    }),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 