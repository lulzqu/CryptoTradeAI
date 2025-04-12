import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Position, Signal } from '../types/trading';
import { tradingService } from '../services/trading.service';

interface TradingState {
  positions: Position[];
  signals: Signal[];
  loading: boolean;
  error: string | null;
}

const initialState: TradingState = {
  positions: [],
  signals: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchOpenPositions = createAsyncThunk(
  'trading/fetchOpenPositions',
  async (_, { rejectWithValue }) => {
    try {
      return await tradingService.getOpenPositions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClosedPositions = createAsyncThunk(
  'trading/fetchClosedPositions',
  async (_, { rejectWithValue }) => {
    try {
      return await tradingService.getClosedPositions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSignals = createAsyncThunk(
  'trading/fetchSignals',
  async (_, { rejectWithValue }) => {
    try {
      return await tradingService.getSignals();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPosition = createAsyncThunk(
  'trading/createPosition',
  async (positionData: Partial<Position>, { rejectWithValue }) => {
    try {
      return await tradingService.createPosition(positionData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePosition = createAsyncThunk(
  'trading/updatePosition',
  async (positionData: Partial<Position>, { rejectWithValue }) => {
    try {
      return await tradingService.updatePosition(positionData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const closePosition = createAsyncThunk(
  'trading/closePosition',
  async (positionId: string, { rejectWithValue }) => {
    try {
      return await tradingService.closePosition(positionId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSignal = createAsyncThunk(
  'trading/createSignal',
  async (signalData: Partial<Signal>, { rejectWithValue }) => {
    try {
      return await tradingService.createSignal(signalData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch positions
      .addCase(fetchOpenPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = action.payload;
      })
      .addCase(fetchOpenPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch closed positions
      .addCase(fetchClosedPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClosedPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = action.payload;
      })
      .addCase(fetchClosedPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch signals
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
        state.error = action.payload as string;
      })
      // Create position
      .addCase(createPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.loading = false;
        state.positions.push(action.payload);
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update position
      .addCase(updatePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.positions.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Close position
      .addCase(closePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closePosition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.positions.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
      })
      .addCase(closePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create signal
      .addCase(createSignal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSignal.fulfilled, (state, action) => {
        state.loading = false;
        state.signals.unshift(action.payload);
      })
      .addCase(createSignal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = tradingSlice.actions;
export default tradingSlice.reducer; 