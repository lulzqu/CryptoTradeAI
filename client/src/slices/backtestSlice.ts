import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface BacktestResult {
  id: string;
  symbol: string;
  timeframe: string;
  strategyType: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: any[];
  equityCurve: any[];
  drawdownCurve: any[];
  monthlyReturns: any[];
  createdAt: string;
  updatedAt: string;
}

interface BacktestState {
  results: BacktestResult[];
  currentResult: BacktestResult | null;
  savedResults: BacktestResult[];
  loading: boolean;
  error: string | null;
}

const initialState: BacktestState = {
  results: [],
  currentResult: null,
  savedResults: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchBacktestResults = createAsyncThunk(
  'backtest/fetchResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/backtest');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const runBacktest = createAsyncThunk(
  'backtest/run',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/backtest/run', params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveBacktestResult = createAsyncThunk(
  'backtest/save',
  async (result: BacktestResult, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/backtest', result);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBacktestResult = createAsyncThunk(
  'backtest/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/backtest/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const backtestSlice = createSlice({
  name: 'backtest',
  initialState,
  reducers: {
    setCurrentResult: (state, action: PayloadAction<BacktestResult | null>) => {
      state.currentResult = action.payload;
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchBacktestResults
    builder.addCase(fetchBacktestResults.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBacktestResults.fulfilled, (state, action) => {
      state.loading = false;
      state.savedResults = action.payload;
    });
    builder.addCase(fetchBacktestResults.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // runBacktest
    builder.addCase(runBacktest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(runBacktest.fulfilled, (state, action) => {
      state.loading = false;
      state.currentResult = action.payload;
      state.results.push(action.payload);
    });
    builder.addCase(runBacktest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // saveBacktestResult
    builder.addCase(saveBacktestResult.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveBacktestResult.fulfilled, (state, action) => {
      state.loading = false;
      state.savedResults.push(action.payload);
    });
    builder.addCase(saveBacktestResult.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // deleteBacktestResult
    builder.addCase(deleteBacktestResult.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBacktestResult.fulfilled, (state, action) => {
      state.loading = false;
      state.savedResults = state.savedResults.filter(
        (result) => result.id !== action.payload
      );
    });
    builder.addCase(deleteBacktestResult.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCurrentResult, clearCurrentResult, clearError } = backtestSlice.actions;

export default backtestSlice.reducer; 