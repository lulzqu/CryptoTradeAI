import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

interface Position {
  id: string;
  symbol: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  profit: number;
  value: number;
}

interface PortfolioState {
  positions: Position[];
  totalValue: number;
  totalProfit: number;
  profit24h: number;
  profit7d: number;
  profit30d: number;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  positions: [],
  totalValue: 0,
  totalProfit: 0,
  profit24h: 0,
  profit7d: 0,
  profit30d: 0,
  loading: false,
  error: null,
};

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async () => {
    const response = await apiService.get('/portfolio');
    return response;
  }
);

export const createPosition = createAsyncThunk(
  'portfolio/createPosition',
  async (position: Omit<Position, 'id' | 'currentPrice' | 'profit' | 'value'>) => {
    const response = await apiService.post('/portfolio/positions', position);
    return response;
  }
);

export const updatePosition = createAsyncThunk(
  'portfolio/updatePosition',
  async ({ id, ...position }: Partial<Position> & { id: string }) => {
    const response = await apiService.put(`/portfolio/positions/${id}`, position);
    return response;
  }
);

export const deletePosition = createAsyncThunk(
  'portfolio/deletePosition',
  async (id: string) => {
    await apiService.delete(`/portfolio/positions/${id}`);
    return id;
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updatePositionPrice: (state, action) => {
      const { id, currentPrice } = action.payload;
      const position = state.positions.find(p => p.id === id);
      if (position) {
        position.currentPrice = currentPrice;
        position.profit = (currentPrice - position.buyPrice) * position.amount;
        position.value = currentPrice * position.amount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = action.payload.positions;
        state.totalValue = action.payload.totalValue;
        state.totalProfit = action.payload.totalProfit;
        state.profit24h = action.payload.profit24h;
        state.profit7d = action.payload.profit7d;
        state.profit30d = action.payload.profit30d;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải danh mục đầu tư';
      })
      // Create Position
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
        state.error = action.error.message || 'Không thể tạo vị thế mới';
      })
      // Update Position
      .addCase(updatePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.positions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể cập nhật vị thế';
      })
      // Delete Position
      .addCase(deletePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = state.positions.filter(p => p.id !== action.payload);
      })
      .addCase(deletePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể xóa vị thế';
      });
  },
});

export const { updatePositionPrice } = portfolioSlice.actions;
export default portfolioSlice.reducer; 