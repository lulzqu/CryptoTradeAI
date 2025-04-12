import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import SignalService, { Signal, Strategy, SignalFilter } from '../../services/SignalService';
import { RootState } from '../store';

interface SignalState {
  // Signals
  signals: Signal[];
  signalsLoading: boolean;
  signalsError: string | null;
  
  // Strategies
  strategies: Strategy[];
  strategiesLoading: boolean;
  strategiesError: string | null;
  
  // Current selections
  selectedSignal: Signal | null;
  selectedStrategy: Strategy | null;
  
  // Signal generation
  generatingSignals: boolean;
  generationError: string | null;
  
  // Signal stats
  signalStats: any | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // Filters
  filters: SignalFilter;
}

const initialState: SignalState = {
  // Signals
  signals: [],
  signalsLoading: false,
  signalsError: null,
  
  // Strategies
  strategies: [],
  strategiesLoading: false,
  strategiesError: null,
  
  // Current selections
  selectedSignal: null,
  selectedStrategy: null,
  
  // Signal generation
  generatingSignals: false,
  generationError: null,
  
  // Signal stats
  signalStats: null,
  statsLoading: false,
  statsError: null,
  
  // Filters
  filters: {},
};

// Signal Thunks
export const fetchSignals = createAsyncThunk(
  'signal/fetchSignals',
  async (filters: SignalFilter = {}, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return SignalService.getMockSignals();
      }
      
      const signals = await SignalService.getSignals(filters);
      return signals;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch signals');
    }
  }
);

export const fetchSignalById = createAsyncThunk(
  'signal/fetchSignalById',
  async (signalId: string, { rejectWithValue }) => {
    try {
      const signal = await SignalService.getSignal(signalId);
      return signal;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch signal');
    }
  }
);

export const createSignal = createAsyncThunk(
  'signal/createSignal',
  async (signalData: Omit<Signal, 'id' | 'createdAt' | 'updatedAt' | 'status'>, { rejectWithValue }) => {
    try {
      const signal = await SignalService.createSignal(signalData);
      return signal;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create signal');
    }
  }
);

export const updateSignal = createAsyncThunk(
  'signal/updateSignal',
  async ({ signalId, updates }: { signalId: string; updates: Partial<Signal> }, { rejectWithValue }) => {
    try {
      const signal = await SignalService.updateSignal(signalId, updates);
      return signal;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update signal');
    }
  }
);

export const deleteSignal = createAsyncThunk(
  'signal/deleteSignal',
  async (signalId: string, { rejectWithValue }) => {
    try {
      const result = await SignalService.deleteSignal(signalId);
      if (result.success) {
        return signalId;
      }
      return rejectWithValue(result.message || 'Failed to delete signal');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete signal');
    }
  }
);

export const triggerSignal = createAsyncThunk(
  'signal/triggerSignal',
  async (signalId: string, { rejectWithValue }) => {
    try {
      const signal = await SignalService.triggerSignal(signalId);
      return signal;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to trigger signal');
    }
  }
);

export const completeSignal = createAsyncThunk(
  'signal/completeSignal',
  async ({ signalId, performance }: { signalId: string; performance: Signal['performance'] }, { rejectWithValue }) => {
    try {
      const signal = await SignalService.completeSignal(signalId, performance);
      return signal;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete signal');
    }
  }
);

export const cancelSignal = createAsyncThunk(
  'signal/cancelSignal',
  async ({ signalId, reason }: { signalId: string; reason?: string }, { rejectWithValue }) => {
    try {
      const signal = await SignalService.cancelSignal(signalId, reason);
      return signal;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel signal');
    }
  }
);

// Strategy Thunks
export const fetchStrategies = createAsyncThunk(
  'signal/fetchStrategies',
  async (_, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return SignalService.getMockStrategies();
      }
      
      const strategies = await SignalService.getStrategies();
      return strategies;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch strategies');
    }
  }
);

export const fetchStrategyById = createAsyncThunk(
  'signal/fetchStrategyById',
  async (strategyId: string, { rejectWithValue }) => {
    try {
      const strategy = await SignalService.getStrategy(strategyId);
      return strategy;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch strategy');
    }
  }
);

export const createStrategy = createAsyncThunk(
  'signal/createStrategy',
  async (
    strategyData: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'signals' | 'successRate'>,
    { rejectWithValue }
  ) => {
    try {
      const strategy = await SignalService.createStrategy(strategyData);
      return strategy;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create strategy');
    }
  }
);

export const updateStrategy = createAsyncThunk(
  'signal/updateStrategy',
  async ({ strategyId, updates }: { strategyId: string; updates: Partial<Strategy> }, { rejectWithValue }) => {
    try {
      const strategy = await SignalService.updateStrategy(strategyId, updates);
      return strategy;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update strategy');
    }
  }
);

export const deleteStrategy = createAsyncThunk(
  'signal/deleteStrategy',
  async (strategyId: string, { rejectWithValue }) => {
    try {
      const result = await SignalService.deleteStrategy(strategyId);
      if (result.success) {
        return strategyId;
      }
      return rejectWithValue(result.message || 'Failed to delete strategy');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete strategy');
    }
  }
);

// Signal Generation Thunks
export const generateSignals = createAsyncThunk(
  'signal/generateSignals',
  async (
    params: { strategy: string; symbols?: string[]; timeframe?: string },
    { rejectWithValue }
  ) => {
    try {
      const signals = await SignalService.generateSignals(params);
      return signals;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate signals');
    }
  }
);

// Signal Stats Thunks
export const fetchSignalStats = createAsyncThunk(
  'signal/fetchSignalStats',
  async (filters: SignalFilter = {}, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return SignalService.getMockSignalStatistics();
      }
      
      const stats = await SignalService.getSignalStatistics(filters);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch signal statistics');
    }
  }
);

const signalSlice = createSlice({
  name: 'signal',
  initialState,
  reducers: {
    setSelectedSignal: (state, action: PayloadAction<Signal | null>) => {
      state.selectedSignal = action.payload;
    },
    setSelectedStrategy: (state, action: PayloadAction<Strategy | null>) => {
      state.selectedStrategy = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<SignalFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    // Signals reducers
    builder
      .addCase(fetchSignals.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(fetchSignals.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.signals = action.payload;
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      })
      .addCase(fetchSignalById.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(fetchSignalById.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.selectedSignal = action.payload;
        
        // Update the signal in the list if it exists
        const index = state.signals.findIndex(signal => signal.id === action.payload.id);
        if (index !== -1) {
          state.signals[index] = action.payload;
        }
      })
      .addCase(fetchSignalById.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      })
      .addCase(createSignal.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(createSignal.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.signals = [action.payload, ...state.signals];
        state.selectedSignal = action.payload;
      })
      .addCase(createSignal.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      })
      .addCase(updateSignal.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(updateSignal.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.signals = state.signals.map(signal => 
          signal.id === action.payload.id ? action.payload : signal
        );
        
        if (state.selectedSignal?.id === action.payload.id) {
          state.selectedSignal = action.payload;
        }
      })
      .addCase(updateSignal.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      })
      .addCase(deleteSignal.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(deleteSignal.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.signals = state.signals.filter(signal => signal.id !== action.payload);
        
        if (state.selectedSignal?.id === action.payload) {
          state.selectedSignal = null;
        }
      })
      .addCase(deleteSignal.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      })
      .addCase(triggerSignal.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(triggerSignal.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.signals = state.signals.map(signal => 
          signal.id === action.payload.id ? action.payload : signal
        );
        
        if (state.selectedSignal?.id === action.payload.id) {
          state.selectedSignal = action.payload;
        }
      })
      .addCase(triggerSignal.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      })
      .addCase(completeSignal.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(completeSignal.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.signals = state.signals.map(signal => 
          signal.id === action.payload.id ? action.payload : signal
        );
        
        if (state.selectedSignal?.id === action.payload.id) {
          state.selectedSignal = action.payload;
        }
      })
      .addCase(completeSignal.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      })
      .addCase(cancelSignal.pending, (state) => {
        state.signalsLoading = true;
        state.signalsError = null;
      })
      .addCase(cancelSignal.fulfilled, (state, action) => {
        state.signalsLoading = false;
        state.signals = state.signals.map(signal => 
          signal.id === action.payload.id ? action.payload : signal
        );
        
        if (state.selectedSignal?.id === action.payload.id) {
          state.selectedSignal = action.payload;
        }
      })
      .addCase(cancelSignal.rejected, (state, action) => {
        state.signalsLoading = false;
        state.signalsError = action.payload as string;
      });
    
    // Strategies reducers
    builder
      .addCase(fetchStrategies.pending, (state) => {
        state.strategiesLoading = true;
        state.strategiesError = null;
      })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.strategiesLoading = false;
        state.strategies = action.payload;
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.strategiesLoading = false;
        state.strategiesError = action.payload as string;
      })
      .addCase(fetchStrategyById.pending, (state) => {
        state.strategiesLoading = true;
        state.strategiesError = null;
      })
      .addCase(fetchStrategyById.fulfilled, (state, action) => {
        state.strategiesLoading = false;
        state.selectedStrategy = action.payload;
        
        // Update the strategy in the list if it exists
        const index = state.strategies.findIndex(strategy => strategy.id === action.payload.id);
        if (index !== -1) {
          state.strategies[index] = action.payload;
        }
      })
      .addCase(fetchStrategyById.rejected, (state, action) => {
        state.strategiesLoading = false;
        state.strategiesError = action.payload as string;
      })
      .addCase(createStrategy.pending, (state) => {
        state.strategiesLoading = true;
        state.strategiesError = null;
      })
      .addCase(createStrategy.fulfilled, (state, action) => {
        state.strategiesLoading = false;
        state.strategies = [action.payload, ...state.strategies];
        state.selectedStrategy = action.payload;
      })
      .addCase(createStrategy.rejected, (state, action) => {
        state.strategiesLoading = false;
        state.strategiesError = action.payload as string;
      })
      .addCase(updateStrategy.pending, (state) => {
        state.strategiesLoading = true;
        state.strategiesError = null;
      })
      .addCase(updateStrategy.fulfilled, (state, action) => {
        state.strategiesLoading = false;
        state.strategies = state.strategies.map(strategy => 
          strategy.id === action.payload.id ? action.payload : strategy
        );
        
        if (state.selectedStrategy?.id === action.payload.id) {
          state.selectedStrategy = action.payload;
        }
      })
      .addCase(updateStrategy.rejected, (state, action) => {
        state.strategiesLoading = false;
        state.strategiesError = action.payload as string;
      })
      .addCase(deleteStrategy.pending, (state) => {
        state.strategiesLoading = true;
        state.strategiesError = null;
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.strategiesLoading = false;
        state.strategies = state.strategies.filter(strategy => strategy.id !== action.payload);
        
        if (state.selectedStrategy?.id === action.payload) {
          state.selectedStrategy = null;
        }
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.strategiesLoading = false;
        state.strategiesError = action.payload as string;
      });
    
    // Signal generation reducers
    builder
      .addCase(generateSignals.pending, (state) => {
        state.generatingSignals = true;
        state.generationError = null;
      })
      .addCase(generateSignals.fulfilled, (state, action) => {
        state.generatingSignals = false;
        state.signals = [...action.payload, ...state.signals];
      })
      .addCase(generateSignals.rejected, (state, action) => {
        state.generatingSignals = false;
        state.generationError = action.payload as string;
      });
    
    // Signal stats reducers
    builder
      .addCase(fetchSignalStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchSignalStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.signalStats = action.payload;
      })
      .addCase(fetchSignalStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });
  },
});

export const { setSelectedSignal, setSelectedStrategy, updateFilters, resetFilters } = signalSlice.actions;

// Selectors
export const selectSignals = (state: RootState) => state.signal.signals;
export const selectSignalsLoading = (state: RootState) => state.signal.signalsLoading;
export const selectSignalsError = (state: RootState) => state.signal.signalsError;

export const selectStrategies = (state: RootState) => state.signal.strategies;
export const selectStrategiesLoading = (state: RootState) => state.signal.strategiesLoading;
export const selectStrategiesError = (state: RootState) => state.signal.strategiesError;

export const selectSelectedSignal = (state: RootState) => state.signal.selectedSignal;
export const selectSelectedStrategy = (state: RootState) => state.signal.selectedStrategy;

export const selectGeneratingSignals = (state: RootState) => state.signal.generatingSignals;
export const selectGenerationError = (state: RootState) => state.signal.generationError;

export const selectSignalStats = (state: RootState) => state.signal.signalStats;
export const selectStatsLoading = (state: RootState) => state.signal.statsLoading;
export const selectStatsError = (state: RootState) => state.signal.statsError;

export const selectFilters = (state: RootState) => state.signal.filters;

export default signalSlice.reducer; 