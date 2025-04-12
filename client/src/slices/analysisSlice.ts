import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import { 
  Signal, 
  SignalType, 
  SignalStatus, 
  SignalSentiment, 
  CandlestickPattern,
  CandlePattern,
  Strategy,
  BacktestResult
} from '../types';

// State type của analysis slice
export interface AnalysisState {
  signals: Signal[];
  candlestickPatterns: CandlestickPattern[];
  patterns: CandlePattern[];
  strategies: Strategy[];
  backtestResults: BacktestResult[];
  loading: boolean;
  patternsLoading: boolean;
  error: string | null;
}

// State ban đầu
const initialState: AnalysisState = {
  signals: [],
  candlestickPatterns: [],
  patterns: [],
  strategies: [],
  backtestResults: [],
  loading: false,
  patternsLoading: false,
  error: null
};

// Async thunk để lấy các tín hiệu giao dịch
export const fetchSignals = createAsyncThunk<Signal[]>(
  'analysis/fetchSignals',
  async () => {
    const response = await apiService.get<Signal[]>('/api/signals');
    return response;
  }
);

// Async thunk để lấy các mẫu hình nến cho một symbol
export const fetchPatterns = createAsyncThunk<CandlestickPattern[], { symbol: string, timeframe: string }>(
  'analysis/fetchPatterns',
  async ({ symbol, timeframe }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<CandlestickPattern[]>(`/api/patterns?symbol=${symbol}&timeframe=${timeframe}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy mẫu hình nến');
    }
  }
);

// Async thunk để đánh dấu yêu thích một tín hiệu
export const toggleFavoriteSignal = createAsyncThunk<Signal, { id: string, favorite: boolean }>(
  'analysis/toggleFavoriteSignal',
  async ({ id, favorite }, { rejectWithValue }) => {
    try {
      const response = await apiService.patch<Signal>(`/api/signals/${id}`, { favorite });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật tín hiệu');
    }
  }
);

// Async thunk để đăng ký hoặc hủy thông báo cho một tín hiệu
export const subscribeToSignal = createAsyncThunk<Signal, { id: string, subscribed: boolean }>(
  'analysis/subscribeToSignal',
  async ({ id, subscribed }, { rejectWithValue }) => {
    try {
      const response = await apiService.patch<Signal>(`/api/signals/${id}`, { notified: subscribed });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể đăng ký thông báo');
    }
  }
);

export const addPattern = createAsyncThunk<CandlePattern, Omit<CandlePattern, 'id'>>(
  'analysis/addPattern',
  async (pattern) => {
    const response = await apiService.post<CandlePattern>('/api/patterns', pattern);
    return response;
  }
);

export const updatePattern = createAsyncThunk<CandlePattern, CandlePattern>(
  'analysis/updatePattern',
  async (pattern) => {
    const response = await apiService.put<CandlePattern>(`/api/patterns/${pattern.id}`, pattern);
    return response;
  }
);

export const deletePattern = createAsyncThunk<string, string>(
  'analysis/deletePattern',
  async (id) => {
    await apiService.delete(`/api/patterns/${id}`);
    return id;
  }
);

export const fetchStrategyPerformance = createAsyncThunk<Strategy[], { strategies: string[]; startDate: string; endDate: string }>(
  'analysis/fetchStrategyPerformance',
  async (params) => {
    const response = await apiService.post<Strategy[]>('/api/strategies/performance', params);
    return response;
  }
);

export const runBacktest = createAsyncThunk<BacktestResult, {
  symbol: string;
  timeframe: string;
  dateRange: [string, string];
  initialCapital: number;
  positionSize: number;
  stopLoss: number;
}>(
  'analysis/runBacktest',
  async (params) => {
    const response = await apiService.post<BacktestResult>('/api/backtest', params);
    return response;
  }
);

// Tạo analysis slice
const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Xử lý fetchSignals
    builder
      .addCase(fetchSignals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSignals.fulfilled, (state, action) => {
        state.loading = false;
        state.signals = action.payload;
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch signals';
      })
      
    // Xử lý fetchPatterns
    builder
      .addCase(fetchPatterns.pending, (state) => {
        state.patternsLoading = true;
        state.error = null;
      })
      .addCase(fetchPatterns.fulfilled, (state, action) => {
        state.patternsLoading = false;
        state.candlestickPatterns = action.payload;
      })
      .addCase(fetchPatterns.rejected, (state, action) => {
        state.patternsLoading = false;
        state.error = action.payload as string;
      })
      
    // Xử lý toggleFavoriteSignal
    builder
      .addCase(toggleFavoriteSignal.fulfilled, (state, action) => {
        const { id, favorite } = action.payload;
        const signalIndex = state.signals.findIndex(signal => signal.id === id);
        if (signalIndex !== -1) {
          state.signals[signalIndex].favorite = favorite;
        }
      })
      
    // Xử lý subscribeToSignal
    builder
      .addCase(subscribeToSignal.fulfilled, (state, action) => {
        const { id, notified } = action.payload;
        const signalIndex = state.signals.findIndex(signal => signal.id === id);
        if (signalIndex !== -1) {
          state.signals[signalIndex].notified = notified;
        }
      })
      
    // Add Pattern
    .addCase(addPattern.fulfilled, (state, action) => {
      state.patterns.push(action.payload);
    })
    
    // Update Pattern
    .addCase(updatePattern.fulfilled, (state, action) => {
      const index = state.patterns.findIndex((p: CandlePattern) => p.id === action.payload.id);
      if (index !== -1) {
        state.patterns[index] = action.payload;
      }
    })
    
    // Delete Pattern
    .addCase(deletePattern.fulfilled, (state, action) => {
      state.patterns = state.patterns.filter((p: CandlePattern) => p.id !== action.payload);
    })
    
    // Fetch Strategy Performance
    .addCase(fetchStrategyPerformance.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchStrategyPerformance.fulfilled, (state, action) => {
      state.loading = false;
      state.strategies = action.payload;
    })
    .addCase(fetchStrategyPerformance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch strategy performance';
    })
    
    // Run Backtest
    .addCase(runBacktest.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(runBacktest.fulfilled, (state, action) => {
      state.loading = false;
      state.backtestResults = [action.payload];
    })
    .addCase(runBacktest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to run backtest';
    });
  }
});

// Export actions & reducer
export const { clearError } = analysisSlice.actions;
export default analysisSlice.reducer; 