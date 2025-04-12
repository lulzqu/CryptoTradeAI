import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

interface AutoTradingState {
  strategies: any[];
  currentStrategy: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AutoTradingState = {
  strategies: [],
  currentStrategy: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchStrategies = createAsyncThunk(
  'autoTrading/fetchStrategies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/auto-trading/strategies');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createStrategy = createAsyncThunk(
  'autoTrading/createStrategy',
  async (strategyData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/auto-trading/strategies', strategyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStrategy = createAsyncThunk(
  'autoTrading/updateStrategy',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/auto-trading/strategies/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteStrategy = createAsyncThunk(
  'autoTrading/deleteStrategy',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(`/auto-trading/strategies/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleStrategy = createAsyncThunk(
  'autoTrading/toggleStrategy',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/auto-trading/strategies/${id}/toggle`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const executeStrategy = createAsyncThunk(
  'autoTrading/executeStrategy',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/auto-trading/strategies/${id}/execute`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const autoTradingSlice = createSlice({
  name: 'autoTrading',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStrategy: (state, action) => {
      state.currentStrategy = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Strategies
      .addCase(fetchStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.loading = false;
        state.strategies = action.payload;
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Strategy
      .addCase(createStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStrategy.fulfilled, (state, action) => {
        state.loading = false;
        state.strategies.push(action.payload);
      })
      .addCase(createStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Strategy
      .addCase(updateStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStrategy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.strategies.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.strategies[index] = action.payload;
        }
      })
      .addCase(updateStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Strategy
      .addCase(deleteStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.loading = false;
        state.strategies = state.strategies.filter(s => s.id !== action.payload);
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Strategy
      .addCase(toggleStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleStrategy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.strategies.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.strategies[index] = action.payload;
        }
      })
      .addCase(toggleStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Execute Strategy
      .addCase(executeStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeStrategy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.strategies.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.strategies[index] = action.payload;
        }
      })
      .addCase(executeStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, setCurrentStrategy } = autoTradingSlice.actions;
export default autoTradingSlice.reducer; 