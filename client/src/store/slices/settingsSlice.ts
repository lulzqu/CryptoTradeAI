import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState } from '../../types';

// Initial state
const initialState: SettingsState = {
  api: {
    mexc: {
      apiKey: '',
      apiSecret: '',
      permissions: [],
      isConnected: false,
      lastChecked: null
    },
    ai: {
      provider: 'OpenAI',
      apiKey: '',
      isConnected: false,
      usage: {
        used: 0,
        limit: 100
      }
    }
  },
  trading: {
    autoTrading: false,
    riskPerTrade: 2,
    maxOpenPositions: 5,
    maxDailyVolume: 5000,
    defaultLeverage: 3,
    strategies: [
      {
        id: 'strategy-1',
        name: 'Breakout Strategy',
        isActive: true,
        description: 'Theo dõi và giao dịch các mẫu hình break-out với xác nhận chỉ báo RSI và MACD'
      },
      {
        id: 'strategy-2',
        name: 'Trend Following',
        isActive: false,
        description: 'Sử dụng EMA 20/50/200 để nhận diện xu hướng và giao dịch theo xu hướng'
      },
      {
        id: 'strategy-3',
        name: 'Sentiment Analysis',
        isActive: false,
        description: 'Dựa trên phân tích tâm lý thị trường và tin tức từ nhiều nguồn'
      }
    ]
  },
  notifications: {
    email: true,
    browser: true,
    telegram: null
  },
  isLoading: false,
  error: null
};

// Async thunks
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful fetch
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock settings - in a real app, this would come from an API
      return initialState;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải cài đặt');
    }
  }
);

export const saveApiKeys = createAsyncThunk(
  'settings/saveApiKeys',
  async ({ exchange, apiKey, apiSecret }: { exchange: 'mexc' | 'ai', apiKey: string, apiSecret?: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        exchange,
        apiKey,
        apiSecret,
        isConnected: true,
        lastChecked: new Date().toISOString()
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lưu API keys');
    }
  }
);

export const updateTradingSettings = createAsyncThunk(
  'settings/updateTradingSettings',
  async (settings: Partial<typeof initialState.trading>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật cài đặt giao dịch');
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'settings/updateNotificationSettings',
  async (settings: typeof initialState.notifications, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật cài đặt thông báo');
    }
  }
);

// Settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStrategy: (state, action: PayloadAction<{ id: string, changes: Partial<typeof initialState.trading.strategies[0]> }>) => {
      const { id, changes } = action.payload;
      const strategyIndex = state.trading.strategies.findIndex(s => s.id === id);
      
      if (strategyIndex !== -1) {
        state.trading.strategies[strategyIndex] = {
          ...state.trading.strategies[strategyIndex],
          ...changes
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        return {
          ...action.payload,
          isLoading: false,
          error: null
        };
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Không thể tải cài đặt';
      })
      
      // Save API keys
      .addCase(saveApiKeys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveApiKeys.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.exchange === 'mexc') {
          state.api.mexc = {
            ...state.api.mexc,
            apiKey: action.payload.apiKey,
            apiSecret: action.payload.apiSecret || '',
            isConnected: action.payload.isConnected,
            lastChecked: action.payload.lastChecked
          };
        } else if (action.payload.exchange === 'ai') {
          state.api.ai = {
            ...state.api.ai,
            apiKey: action.payload.apiKey,
            isConnected: action.payload.isConnected
          };
        }
      })
      .addCase(saveApiKeys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Không thể lưu API keys';
      })
      
      // Update trading settings
      .addCase(updateTradingSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTradingSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trading = {
          ...state.trading,
          ...action.payload
        };
      })
      .addCase(updateTradingSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Không thể cập nhật cài đặt giao dịch';
      })
      
      // Update notification settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Không thể cập nhật cài đặt thông báo';
      });
  }
});

export const { clearError, updateStrategy } = settingsSlice.actions;

export default settingsSlice.reducer; 