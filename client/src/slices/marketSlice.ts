import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import { websocketService } from '../services/websocket';

interface MarketState {
  symbols: string[];
  selectedSymbol: string;
  timeframe: string;
  price: number;
  volume: number;
  change24h: number;
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  symbols: [],
  selectedSymbol: 'BTC/USDT',
  timeframe: '1h',
  price: 0,
  volume: 0,
  change24h: 0,
  loading: false,
  error: null,
};

export const fetchSymbols = createAsyncThunk(
  'market/fetchSymbols',
  async () => {
    const response = await apiService.get<string[]>('/market/symbols');
    return response;
  }
);

export const fetchMarketData = createAsyncThunk(
  'market/fetchMarketData',
  async ({ symbol, timeframe }: { symbol: string; timeframe: string }) => {
    const response = await apiService.get(`/market/data?symbol=${symbol}&timeframe=${timeframe}`);
    return response;
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    setTimeframe: (state, action) => {
      state.timeframe = action.payload;
    },
    updatePrice: (state, action) => {
      state.price = action.payload;
    },
    updateVolume: (state, action) => {
      state.volume = action.payload;
    },
    updateChange24h: (state, action) => {
      state.change24h = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Symbols
      .addCase(fetchSymbols.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSymbols.fulfilled, (state, action) => {
        state.loading = false;
        state.symbols = action.payload;
      })
      .addCase(fetchSymbols.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải danh sách cặp tiền';
      })
      // Fetch Market Data
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.price = action.payload.price;
        state.volume = action.payload.volume;
        state.change24h = action.payload.change24h;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải dữ liệu thị trường';
      });
  },
});

export const {
  setSelectedSymbol,
  setTimeframe,
  updatePrice,
  updateVolume,
  updateChange24h,
} = marketSlice.actions;

export default marketSlice.reducer; 