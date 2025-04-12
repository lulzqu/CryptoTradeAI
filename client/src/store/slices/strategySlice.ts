import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated';
  status: 'active' | 'inactive' | 'testing';
  timeframe: string;
  pairs: string[];
  profitability: number;
  trades: number;
  createdAt: string;
  updatedAt: string;
  code?: string;
  parameters?: Record<string, any>;
}

interface StrategyState {
  strategies: Strategy[];
  loading: boolean;
  error: string | null;
  selectedStrategy: Strategy | null;
}

const initialState: StrategyState = {
  strategies: [],
  loading: false,
  error: null,
  selectedStrategy: null,
};

// Mock data cho development
const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'MA Crossover BTC',
    description: 'Chiến lược giao dịch dựa trên đường trung bình động cắt nhau',
    type: 'automated',
    status: 'active',
    timeframe: '1h',
    pairs: ['BTC/USDT'],
    profitability: 12.5,
    trades: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    code: `// MA Crossover Strategy
const shortPeriod = 10;
const longPeriod = 50;

// Calculate moving averages
const shortMA = calculateMA(data, shortPeriod);
const longMA = calculateMA(data, longPeriod);

// Trading logic
if (shortMA > longMA && prevShortMA <= prevLongMA) {
  // Bullish crossover - Buy signal
  return { action: 'buy', price: data[data.length - 1].close };
} else if (shortMA < longMA && prevShortMA >= prevLongMA) {
  // Bearish crossover - Sell signal
  return { action: 'sell', price: data[data.length - 1].close };
} else {
  // No signal
  return { action: 'hold' };
}`,
    parameters: {
      shortPeriod: 10,
      longPeriod: 50,
      takeProfitPercent: 5,
      stopLossPercent: 2.5,
      useTrailingStop: true,
    },
  },
  {
    id: '2',
    name: 'RSI Oscillator ETH',
    description: 'Chiến lược dựa trên chỉ báo RSI để xác định vùng quá mua và quá bán',
    type: 'automated',
    status: 'active',
    timeframe: '4h',
    pairs: ['ETH/USDT'],
    profitability: 8.7,
    trades: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    code: `// RSI Oscillator Strategy
const period = 14;
const overbought = 70;
const oversold = 30;

// Calculate RSI
const rsi = calculateRSI(data, period);
const currentRSI = rsi[rsi.length - 1];
const prevRSI = rsi[rsi.length - 2];

// Trading logic
if (currentRSI < oversold && prevRSI >= oversold) {
  // RSI crosses below oversold - Buy signal
  return { action: 'buy', price: data[data.length - 1].close };
} else if (currentRSI > overbought && prevRSI <= overbought) {
  // RSI crosses above overbought - Sell signal
  return { action: 'sell', price: data[data.length - 1].close };
} else {
  // No signal
  return { action: 'hold' };
}`,
    parameters: {
      period: 14,
      overbought: 70,
      oversold: 30,
      takeProfitPercent: 4,
      stopLossPercent: 3,
      useTrailingStop: false,
    },
  },
  {
    id: '3',
    name: 'DCA Bitcoin Weekly',
    description: 'Chiến lược đầu tư trung bình giá vào Bitcoin theo tuần',
    type: 'manual',
    status: 'inactive',
    timeframe: '1w',
    pairs: ['BTC/USDT'],
    profitability: 15.2,
    trades: 52,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Multi-Coin Portfolio',
    description: 'Chiến lược đầu tư danh mục đa đồng tiền với cân bằng định kỳ',
    type: 'manual',
    status: 'testing',
    timeframe: '1d',
    pairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT'],
    profitability: 6.3,
    trades: 17,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'MACD & Bollinger Bands',
    description: 'Kết hợp MACD và Bollinger Bands cho tín hiệu giao dịch',
    type: 'automated',
    status: 'testing',
    timeframe: '2h',
    pairs: ['BNB/USDT', 'SOL/USDT'],
    profitability: -2.1,
    trades: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    code: `// MACD & Bollinger Bands Strategy
const fastPeriod = 12;
const slowPeriod = 26;
const signalPeriod = 9;
const bBandsPeriod = 20;
const stdDev = 2;

// Calculate MACD
const macd = calculateMACD(data, fastPeriod, slowPeriod, signalPeriod);
const currentMACD = macd[macd.length - 1];
const prevMACD = macd[macd.length - 2];

// Calculate Bollinger Bands
const bBands = calculateBollingerBands(data, bBandsPeriod, stdDev);
const currentBBands = bBands[bBands.length - 1];
const currentPrice = data[data.length - 1].close;

// Trading logic
if (currentMACD.histogram > 0 && prevMACD.histogram <= 0 && currentPrice < currentBBands.middle) {
  // MACD histogram crosses above zero and price below middle band - Buy signal
  return { action: 'buy', price: currentPrice };
} else if (currentMACD.histogram < 0 && prevMACD.histogram >= 0 && currentPrice > currentBBands.middle) {
  // MACD histogram crosses below zero and price above middle band - Sell signal
  return { action: 'sell', price: currentPrice };
} else if (currentPrice < currentBBands.lower && currentMACD.histogram > prevMACD.histogram) {
  // Price below lower band and MACD histogram increasing - Buy signal
  return { action: 'buy', price: currentPrice };
} else if (currentPrice > currentBBands.upper && currentMACD.histogram < prevMACD.histogram) {
  // Price above upper band and MACD histogram decreasing - Sell signal
  return { action: 'sell', price: currentPrice };
} else {
  // No signal
  return { action: 'hold' };
}`,
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      bBandsPeriod: 20,
      stdDev: 2,
      takeProfitPercent: 3.5,
      stopLossPercent: 2,
      useTrailingStop: true,
      trailingStopPercent: 1,
    },
  },
];

// Thunk actions
export const fetchStrategies = createAsyncThunk<Strategy[]>(
  'strategy/fetchStrategies',
  async (_, { rejectWithValue }) => {
    try {
      // Sử dụng mock data trong quá trình phát triển
      // Trong production sẽ sử dụng API thực tế
      // const response = await axios.get('/api/strategies');
      // return response.data;
      
      return mockStrategies;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createStrategy = createAsyncThunk<Strategy, Partial<Strategy>>(
  'strategy/createStrategy',
  async (strategyData, { rejectWithValue }) => {
    try {
      // Sử dụng mock data trong quá trình phát triển
      // const response = await axios.post('/api/strategies', strategyData);
      // return response.data;
      
      // Tạo chiến lược mới với mock data
      const newStrategy: Strategy = {
        id: String(mockStrategies.length + 1),
        name: strategyData.name || 'New Strategy',
        description: strategyData.description || 'No description',
        type: strategyData.type || 'manual',
        status: strategyData.status || 'testing',
        timeframe: strategyData.timeframe || '1h',
        pairs: strategyData.pairs || ['BTC/USDT'],
        profitability: 0,
        trades: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        code: strategyData.code,
        parameters: strategyData.parameters,
      };
      
      return newStrategy;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateStrategy = createAsyncThunk<Strategy, { id: string } & Partial<Strategy>>(
  'strategy/updateStrategy',
  async ({ id, ...strategyData }, { rejectWithValue }) => {
    try {
      // Sử dụng mock data trong quá trình phát triển
      // const response = await axios.put(`/api/strategies/${id}`, strategyData);
      // return response.data;
      
      // Cập nhật chiến lược với mock data
      const existingStrategy = mockStrategies.find(strategy => strategy.id === id);
      
      if (!existingStrategy) {
        throw new Error('Strategy not found');
      }
      
      const updatedStrategy: Strategy = {
        ...existingStrategy,
        ...strategyData,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedStrategy;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteStrategy = createAsyncThunk<string, string>(
  'strategy/deleteStrategy',
  async (id, { rejectWithValue }) => {
    try {
      // Sử dụng mock data trong quá trình phát triển
      // await axios.delete(`/api/strategies/${id}`);
      // return id;
      
      // Kiểm tra chiến lược có tồn tại không
      const existingStrategy = mockStrategies.find(strategy => strategy.id === id);
      
      if (!existingStrategy) {
        throw new Error('Strategy not found');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
export const strategySlice = createSlice({
  name: 'strategy',
  initialState,
  reducers: {
    setSelectedStrategy: (state, action: PayloadAction<Strategy | null>) => {
      state.selectedStrategy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch strategies
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
      
      // Create strategy
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
      
      // Update strategy
      .addCase(updateStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStrategy.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.strategies.findIndex((s) => s.id === action.payload.id);
        if (updatedIndex !== -1) {
          state.strategies[updatedIndex] = action.payload;
        }
      })
      .addCase(updateStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete strategy
      .addCase(deleteStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.loading = false;
        state.strategies = state.strategies.filter((s) => s.id !== action.payload);
        if (state.selectedStrategy && state.selectedStrategy.id === action.payload) {
          state.selectedStrategy = null;
        }
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedStrategy } = strategySlice.actions;

export const selectStrategies = (state: RootState) => state.strategy.strategies;
export const selectLoading = (state: RootState) => state.strategy.loading;
export const selectError = (state: RootState) => state.strategy.error;
export const selectSelectedStrategy = (state: RootState) => state.strategy.selectedStrategy;

export default strategySlice.reducer; 