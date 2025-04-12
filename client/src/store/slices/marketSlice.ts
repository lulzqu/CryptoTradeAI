import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MarketState, Signal, Coin } from '../../types';

// Initial state
const initialState: MarketState = {
  coins: {},
  trending: [],
  signals: [],
  isLoading: false,
  lastUpdated: null,
  error: null
};

// Async thunks
export const fetchMarketData = createAsyncThunk(
  'market/fetchMarketData',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful fetch
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock market data
      const coins: Record<string, Coin> = {
        'BTC': {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 60240.5,
          changePercent24h: 2.3,
          volume24h: 31245678910,
          marketCap: 1.12e12,
          image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
        },
        'ETH': {
          symbol: 'ETH',
          name: 'Ethereum',
          price: 3280.75,
          changePercent24h: -0.5,
          volume24h: 19876543210,
          marketCap: 3.93e11,
          image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
        },
        'SOL': {
          symbol: 'SOL',
          name: 'Solana',
          price: 120.8,
          changePercent24h: 4.7,
          volume24h: 2345678901,
          marketCap: 5.17e10,
          image: 'https://cryptologos.cc/logos/solana-sol-logo.png'
        },
        'DOT': {
          symbol: 'DOT',
          name: 'Polkadot',
          price: 18.45,
          changePercent24h: 1.2,
          volume24h: 1234567890,
          marketCap: 2.32e10,
          image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
        },
        'MATIC': {
          symbol: 'MATIC',
          name: 'Polygon',
          price: 1.38,
          changePercent24h: -2.1,
          volume24h: 987654321,
          marketCap: 1.28e10,
          image: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
        }
      };
      
      const trending = ['BTC', 'SOL', 'ETH', 'DOT', 'MATIC'];
      
      return { 
        coins, 
        trending,
        lastUpdated: new Date().toISOString() 
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu thị trường');
    }
  }
);

export const fetchSignals = createAsyncThunk(
  'market/fetchSignals',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful fetch
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return []; // Will be implemented later
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải tín hiệu giao dịch');
    }
  }
);

// Market slice
const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addSignal: (state, action: PayloadAction<Signal>) => {
      state.signals.push(action.payload);
    },
    removeSignal: (state, action: PayloadAction<string>) => {
      state.signals = state.signals.filter(signal => signal.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch market data
      .addCase(fetchMarketData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coins = action.payload.coins;
        state.trending = action.payload.trending;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Không thể tải dữ liệu thị trường';
      })
      
      // Fetch signals
      .addCase(fetchSignals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSignals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.signals = action.payload;
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Không thể tải tín hiệu giao dịch';
      });
  }
});

export const { clearError, addSignal, removeSignal } = marketSlice.actions;

export default marketSlice.reducer; 