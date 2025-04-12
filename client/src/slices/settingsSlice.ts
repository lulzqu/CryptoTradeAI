import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

interface UserSettings {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  trading: {
    defaultAmount: number;
    defaultLeverage: number;
    stopLoss: number;
    takeProfit: number;
  };
}

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    theme: 'light',
    language: 'vi',
    notifications: {
      email: true,
      push: true,
      sound: true,
    },
    trading: {
      defaultAmount: 100,
      defaultLeverage: 1,
      stopLoss: 5,
      takeProfit: 10,
    },
  },
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async () => {
    const response = await apiService.get('/settings');
    return response;
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Partial<UserSettings>) => {
    const response = await apiService.put('/settings', settings);
    return response;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.settings.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.settings.language = action.payload;
    },
    toggleNotification: (state, action) => {
      const { type, value } = action.payload;
      state.settings.notifications[type] = value;
    },
    updateTradingSettings: (state, action) => {
      state.settings.trading = {
        ...state.settings.trading,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải cài đặt';
      })
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = {
          ...state.settings,
          ...action.payload,
        };
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể cập nhật cài đặt';
      });
  },
});

export const {
  setTheme,
  setLanguage,
  toggleNotification,
  updateTradingSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer; 