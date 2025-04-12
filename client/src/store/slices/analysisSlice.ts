import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnalysisState, CoinAnalysis } from '../../types';

// Initial state
const initialState: AnalysisState = {
  currentCoin: 'BTC',
  analysis: {},
  timeframe: '1d',
  isLoading: false,
  error: null
};

// Async thunks
export const fetchCoinAnalysis = createAsyncThunk(
  'analysis/fetchCoinAnalysis',
  async ({ symbol, timeframe }: { symbol: string; timeframe: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful fetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock analysis data (would normally come from backend)
      const mockAnalysis: CoinAnalysis = {
        symbol,
        price: symbol === 'BTC' ? 60240.5 : 
               symbol === 'ETH' ? 3280.75 : 
               symbol === 'SOL' ? 120.8 : 
               symbol === 'DOT' ? 18.45 : 1.38,
        changePercent24h: Math.random() * 10 - 5, // Random between -5% and 5%
        volume24h: Math.random() * 20000000000,
        indicators: {
          rsi: 45 + Math.random() * 20, // Random RSI between 45-65
          macd: {
            line: Math.random() * 200 - 100,
            signal: Math.random() * 200 - 100,
            histogram: Math.random() * 100 - 50
          },
          ema20: symbol === 'BTC' ? 59000 + Math.random() * 2000 : 
                 symbol === 'ETH' ? 3200 + Math.random() * 200 : 
                 symbol === 'SOL' ? 115 + Math.random() * 10 : 
                 symbol === 'DOT' ? 17 + Math.random() * 2 : 1.3 + Math.random() * 0.2,
          ema50: symbol === 'BTC' ? 57000 + Math.random() * 2000 : 
                 symbol === 'ETH' ? 3100 + Math.random() * 200 : 
                 symbol === 'SOL' ? 110 + Math.random() * 10 : 
                 symbol === 'DOT' ? 16 + Math.random() * 2 : 1.2 + Math.random() * 0.2,
          ema200: symbol === 'BTC' ? 55000 + Math.random() * 2000 : 
                  symbol === 'ETH' ? 3000 + Math.random() * 200 : 
                  symbol === 'SOL' ? 100 + Math.random() * 10 : 
                  symbol === 'DOT' ? 15 + Math.random() * 2 : 1.1 + Math.random() * 0.2,
          supportLevels: symbol === 'BTC' ? [58000, 55000, 52000] : 
                         symbol === 'ETH' ? [3100, 2900, 2700] : 
                         symbol === 'SOL' ? [110, 100, 90] : 
                         symbol === 'DOT' ? [17, 16, 15] : [1.3, 1.2, 1.1],
          resistanceLevels: symbol === 'BTC' ? [62000, 65000, 68000] : 
                            symbol === 'ETH' ? [3400, 3600, 3800] : 
                            symbol === 'SOL' ? [130, 140, 150] : 
                            symbol === 'DOT' ? [19, 20, 21] : [1.5, 1.6, 1.7]
        },
        patterns: [
          {
            name: Math.random() > 0.5 ? 'Bullish Engulfing' : 'Bearish Engulfing',
            confidence: 60 + Math.random() * 30,
            direction: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral'
          },
          {
            name: Math.random() > 0.5 ? 'Double Top' : 'Double Bottom',
            confidence: 50 + Math.random() * 30,
            direction: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral'
          }
        ],
        aiAnalysis: {
          sentiment: Math.random() * 100,
          prediction: Math.random() > 0.5 ? 
            'Dựa trên phân tích kỹ thuật, có khả năng sẽ tăng trong ngắn hạn.' : 
            'Có dấu hiệu giảm trong ngắn hạn, hãy quan sát mức hỗ trợ.',
          confidence: 70 + Math.random() * 20,
          recommendedAction: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'HOLD'
        },
        webSentiment: {
          overall: Math.random() * 100,
          sources: [
            {
              name: 'CoinDesk',
              sentiment: Math.random() * 100,
              url: 'https://www.coindesk.com'
            },
            {
              name: 'CryptoCompare',
              sentiment: Math.random() * 100,
              url: 'https://www.cryptocompare.com'
            },
            {
              name: 'Twitter',
              sentiment: Math.random() * 100
            }
          ]
        }
      };
      
      return {
        symbol,
        timeframe,
        analysis: mockAnalysis
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu phân tích');
    }
  }
);

// Analysis slice
const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setCurrentCoin: (state, action: PayloadAction<string>) => {
      state.currentCoin = action.payload;
    },
    setTimeframe: (state, action: PayloadAction<string>) => {
      state.timeframe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch coin analysis
      .addCase(fetchCoinAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoinAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCoin = action.payload.symbol;
        state.timeframe = action.payload.timeframe;
        state.analysis = { 
          ...state.analysis,
          [action.payload.symbol]: action.payload.analysis
        };
      })
      .addCase(fetchCoinAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Không thể tải dữ liệu phân tích';
      });
  }
});

export const { setCurrentCoin, setTimeframe, clearError } = analysisSlice.actions;

export default analysisSlice.reducer; 