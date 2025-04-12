import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import TradingService, { Order, Position, MarketData, OrderBook, Trade } from '../../services/TradingService';
import { RootState } from '../store';

interface TradingState {
  // Orders
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  
  // Positions
  positions: Position[];
  positionsLoading: boolean;
  positionsError: string | null;
  
  // Market data
  selectedSymbol: string;
  marketData: MarketData | null;
  orderBook: OrderBook | null;
  recentTrades: Trade[];
  marketDataLoading: boolean;
  marketDataError: string | null;
  
  // Trading form
  tradingForm: {
    symbol: string;
    type: 'market' | 'limit' | 'stopLimit' | 'stopMarket';
    side: 'buy' | 'sell';
    price?: number;
    stopPrice?: number;
    quantity: number;
    total?: number;
    exchange: string;
  };
}

const initialState: TradingState = {
  // Orders
  orders: [],
  ordersLoading: false,
  ordersError: null,
  
  // Positions
  positions: [],
  positionsLoading: false,
  positionsError: null,
  
  // Market data
  selectedSymbol: 'BTC/USDT',
  marketData: null,
  orderBook: null,
  recentTrades: [],
  marketDataLoading: false,
  marketDataError: null,
  
  // Trading form
  tradingForm: {
    symbol: 'BTC/USDT',
    type: 'limit',
    side: 'buy',
    price: undefined,
    stopPrice: undefined,
    quantity: 0,
    total: undefined,
    exchange: 'binance',
  },
};

// Orders Thunks
export const fetchOrders = createAsyncThunk(
  'trading/fetchOrders',
  async (params: { symbol?: string; status?: string; limit?: number } = {}, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return TradingService.getMockOrders();
      }
      
      const orders = await TradingService.getOrders(params);
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'trading/createOrder',
  async (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const order = await TradingService.createOrder(orderData);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'trading/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const result = await TradingService.cancelOrder(orderId);
      if (result.success) {
        return orderId;
      }
      return rejectWithValue(result.message || 'Failed to cancel order');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

// Positions Thunks
export const fetchPositions = createAsyncThunk(
  'trading/fetchPositions',
  async (params: { symbol?: string; exchange?: string } = {}, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return TradingService.getMockPositions();
      }
      
      const positions = await TradingService.getPositions(params);
      return positions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch positions');
    }
  }
);

export const closePosition = createAsyncThunk(
  'trading/closePosition',
  async (positionId: string, { rejectWithValue }) => {
    try {
      const result = await TradingService.closePosition(positionId);
      if (result.success) {
        return positionId;
      }
      return rejectWithValue(result.message || 'Failed to close position');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to close position');
    }
  }
);

export const updatePosition = createAsyncThunk(
  'trading/updatePosition',
  async (
    { positionId, updates }: { positionId: string; updates: { stopLoss?: number; takeProfit?: number } },
    { rejectWithValue }
  ) => {
    try {
      const position = await TradingService.updatePosition(positionId, updates);
      return position;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update position');
    }
  }
);

// Market Data Thunks
export const fetchMarketData = createAsyncThunk(
  'trading/fetchMarketData',
  async (symbol: string, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return TradingService.getMockMarketData(symbol);
      }
      
      const marketData = await TradingService.getMarketData(symbol);
      return marketData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch market data');
    }
  }
);

export const fetchOrderBook = createAsyncThunk(
  'trading/fetchOrderBook',
  async ({ symbol, limit }: { symbol: string; limit?: number }, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return TradingService.getMockOrderBook(symbol);
      }
      
      const orderBook = await TradingService.getOrderBook(symbol, limit);
      return orderBook;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order book');
    }
  }
);

export const fetchRecentTrades = createAsyncThunk(
  'trading/fetchRecentTrades',
  async ({ symbol, limit }: { symbol: string; limit?: number }, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return TradingService.getMockTrades(symbol);
      }
      
      const trades = await TradingService.getRecentTrades(symbol, limit);
      return trades;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch recent trades');
    }
  }
);

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    setSelectedSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload;
      state.tradingForm.symbol = action.payload;
    },
    updateTradingForm: (state, action: PayloadAction<Partial<TradingState['tradingForm']>>) => {
      state.tradingForm = { ...state.tradingForm, ...action.payload };
      
      // Calculate total if price and quantity are provided
      if (state.tradingForm.price && state.tradingForm.quantity) {
        state.tradingForm.total = state.tradingForm.price * state.tradingForm.quantity;
      }
    },
    resetTradingForm: (state) => {
      state.tradingForm = {
        ...initialState.tradingForm,
        symbol: state.selectedSymbol,
      };
    },
  },
  extraReducers: (builder) => {
    // Orders reducers
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = [action.payload, ...state.orders];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload as string;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = state.orders.map(order => 
          order.id === action.payload ? { ...order, status: 'canceled' } : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload as string;
      });
    
    // Positions reducers
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.positionsLoading = true;
        state.positionsError = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.positionsLoading = false;
        state.positions = action.payload;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.positionsLoading = false;
        state.positionsError = action.payload as string;
      })
      .addCase(closePosition.pending, (state) => {
        state.positionsLoading = true;
        state.positionsError = null;
      })
      .addCase(closePosition.fulfilled, (state, action) => {
        state.positionsLoading = false;
        state.positions = state.positions.filter(position => position.id !== action.payload);
      })
      .addCase(closePosition.rejected, (state, action) => {
        state.positionsLoading = false;
        state.positionsError = action.payload as string;
      })
      .addCase(updatePosition.pending, (state) => {
        state.positionsLoading = true;
        state.positionsError = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.positionsLoading = false;
        state.positions = state.positions.map(position => 
          position.id === action.payload.id ? action.payload : position
        );
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.positionsLoading = false;
        state.positionsError = action.payload as string;
      });
    
    // Market data reducers
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.marketDataLoading = true;
        state.marketDataError = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.marketDataLoading = false;
        state.marketData = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.marketDataLoading = false;
        state.marketDataError = action.payload as string;
      })
      .addCase(fetchOrderBook.pending, (state) => {
        state.marketDataLoading = true;
        state.marketDataError = null;
      })
      .addCase(fetchOrderBook.fulfilled, (state, action) => {
        state.marketDataLoading = false;
        state.orderBook = action.payload;
      })
      .addCase(fetchOrderBook.rejected, (state, action) => {
        state.marketDataLoading = false;
        state.marketDataError = action.payload as string;
      })
      .addCase(fetchRecentTrades.pending, (state) => {
        state.marketDataLoading = true;
        state.marketDataError = null;
      })
      .addCase(fetchRecentTrades.fulfilled, (state, action) => {
        state.marketDataLoading = false;
        state.recentTrades = action.payload;
      })
      .addCase(fetchRecentTrades.rejected, (state, action) => {
        state.marketDataLoading = false;
        state.marketDataError = action.payload as string;
      });
  },
});

export const { setSelectedSymbol, updateTradingForm, resetTradingForm } = tradingSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.trading.orders;
export const selectOrdersLoading = (state: RootState) => state.trading.ordersLoading;
export const selectOrdersError = (state: RootState) => state.trading.ordersError;

export const selectPositions = (state: RootState) => state.trading.positions;
export const selectPositionsLoading = (state: RootState) => state.trading.positionsLoading;
export const selectPositionsError = (state: RootState) => state.trading.positionsError;

export const selectSelectedSymbol = (state: RootState) => state.trading.selectedSymbol;
export const selectMarketData = (state: RootState) => state.trading.marketData;
export const selectOrderBook = (state: RootState) => state.trading.orderBook;
export const selectRecentTrades = (state: RootState) => state.trading.recentTrades;
export const selectMarketDataLoading = (state: RootState) => state.trading.marketDataLoading;
export const selectMarketDataError = (state: RootState) => state.trading.marketDataError;

export const selectTradingForm = (state: RootState) => state.trading.tradingForm;

export default tradingSlice.reducer; 