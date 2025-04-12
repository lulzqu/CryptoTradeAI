import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiServices from '../../services/api';

// Types
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  profit: number;
  value: number;
  targetAllocation: number;
  currentAllocation: number;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  profit24h: number;
  profit7d: number;
  profit30d: number;
  assets: Asset[];
  historyData: { date: string; value: number }[];
}

export interface PortfolioState {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PortfolioState = {
  portfolios: [],
  selectedPortfolio: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPortfolioData = createAsyncThunk(
  'portfolio/fetchData',
  async (portfolioId: string, { rejectWithValue }) => {
    try {
      // Ở đây sẽ gọi API thực tế
      // Hiện tại chỉ trả về mock data
      // const response = await apiServices.portfolioApi.getPositions();
      // return response.data;
      
      // Mock data
      return {
        id: portfolioId,
        name: portfolioId === 'main' ? 'Danh mục chính' : 
              portfolioId === 'crypto' ? 'Danh mục Crypto' : 'Danh mục Cổ phiếu',
        totalValue: 48000,
        profit24h: 2.5,
        profit7d: 5.8,
        profit30d: 12.3,
        assets: [
          {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            amount: 0.5,
            buyPrice: 28000,
            currentPrice: 30000,
            profit: 7.14,
            value: 15000,
            targetAllocation: 40,
            currentAllocation: 31.25,
          },
          {
            id: '2',
            symbol: 'ETH',
            name: 'Ethereum',
            amount: 10,
            buyPrice: 1800,
            currentPrice: 1700,
            profit: -5.56,
            value: 17000,
            targetAllocation: 30,
            currentAllocation: 35.42,
          },
          {
            id: '3',
            symbol: 'BNB',
            name: 'Binance Coin',
            amount: 50,
            buyPrice: 300,
            currentPrice: 320,
            profit: 6.67,
            value: 16000,
            targetAllocation: 30,
            currentAllocation: 33.33,
          },
        ],
        historyData: Array(30).fill(0).map((_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 38000 + Math.random() * 2000 * i / 5,
        })),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu danh mục');
    }
  }
);

export const rebalancePortfolio = createAsyncThunk(
  'portfolio/rebalance',
  async (portfolioId: string, { rejectWithValue }) => {
    try {
      // Gọi API rebalance
      // const response = await apiServices.portfolioApi.updatePosition(portfolioId, { rebalance: true });
      // return response.data;
      
      // Mock data - trả về portfolio đã cân bằng lại
      return {
        id: portfolioId,
        name: 'Danh mục đã cân bằng',
        // Các thông tin khác
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cân bằng lại danh mục');
    }
  }
);

export const addAsset = createAsyncThunk(
  'portfolio/addAsset',
  async (data: { portfolioId: string; symbol: string; amount: number; buyPrice: number; targetAllocation: number }, 
    { rejectWithValue }) => {
    try {
      // Gọi API thêm tài sản
      // const response = await apiServices.portfolioApi.createPosition(data);
      // return response;
      
      // Mock data
      return {
        id: Math.random().toString(36).substring(2, 9),
        symbol: data.symbol,
        name: data.symbol === 'BTC' ? 'Bitcoin' : 
              data.symbol === 'ETH' ? 'Ethereum' : 
              data.symbol === 'BNB' ? 'Binance Coin' : 
              data.symbol === 'SOL' ? 'Solana' : 
              data.symbol === 'ADA' ? 'Cardano' : 'Ripple',
        amount: data.amount,
        buyPrice: data.buyPrice,
        currentPrice: data.symbol === 'BTC' ? 30000 : 
                      data.symbol === 'ETH' ? 1700 : 
                      data.symbol === 'BNB' ? 320 : 
                      data.symbol === 'SOL' ? 25 : 
                      data.symbol === 'ADA' ? 0.4 : 0.5,
        profit: 0,
        value: 0,
        targetAllocation: data.targetAllocation,
        currentAllocation: 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm tài sản');
    }
  }
);

export const updateAsset = createAsyncThunk(
  'portfolio/updateAsset',
  async (data: { portfolioId: string; assetId: string; amount?: number; buyPrice?: number; targetAllocation?: number }, 
    { rejectWithValue }) => {
    try {
      // Gọi API cập nhật tài sản
      // const response = await apiServices.portfolioApi.updatePosition(data.assetId, data);
      // return response;
      
      // Mock data
      return {
        id: data.assetId,
        amount: data.amount,
        buyPrice: data.buyPrice,
        targetAllocation: data.targetAllocation,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật tài sản');
    }
  }
);

export const removeAsset = createAsyncThunk(
  'portfolio/removeAsset',
  async (data: { portfolioId: string; assetId: string }, { rejectWithValue }) => {
    try {
      // Gọi API xóa tài sản
      // await apiServices.portfolioApi.closePosition(data.assetId, { force: true });
      // return data.assetId;
      
      // Mock data
      return data.assetId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa tài sản');
    }
  }
);

// Slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setSelectedPortfolio: (state, action: PayloadAction<string>) => {
      const portfolio = state.portfolios.find(p => p.id === action.payload);
      if (portfolio) {
        state.selectedPortfolio = portfolio;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPortfolioData
      .addCase(fetchPortfolioData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioData.fulfilled, (state, action) => {
        state.loading = false;
        const portfolio = action.payload;
        const existingIndex = state.portfolios.findIndex(p => p.id === portfolio.id);
        
        if (existingIndex >= 0) {
          state.portfolios[existingIndex] = portfolio;
        } else {
          state.portfolios.push(portfolio);
        }
        
        state.selectedPortfolio = portfolio;
      })
      .addCase(fetchPortfolioData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // rebalancePortfolio
      .addCase(rebalancePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rebalancePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật portfolio sau khi cân bằng
        // Ở đây có thể cần gọi lại fetchPortfolioData
      })
      .addCase(rebalancePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // addAsset
      .addCase(addAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAsset.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedPortfolio) {
          const newAsset = action.payload;
          
          // Calculate value and profit
          newAsset.value = newAsset.amount * newAsset.currentPrice;
          newAsset.profit = ((newAsset.currentPrice - newAsset.buyPrice) / newAsset.buyPrice) * 100;
          
          // Add the new asset
          state.selectedPortfolio.assets.push(newAsset);
          
          // Recalculate total value and allocations
          const totalValue = state.selectedPortfolio.assets.reduce((sum, asset) => sum + asset.value, 0);
          state.selectedPortfolio.totalValue = totalValue;
          
          // Update allocations
          state.selectedPortfolio.assets.forEach(asset => {
            asset.currentAllocation = (asset.value / totalValue) * 100;
          });
        }
      })
      .addCase(addAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateAsset
      .addCase(updateAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedPortfolio) {
          const { id, amount, buyPrice, targetAllocation } = action.payload;
          const assetIndex = state.selectedPortfolio.assets.findIndex(a => a.id === id);
          
          if (assetIndex >= 0) {
            const asset = state.selectedPortfolio.assets[assetIndex];
            
            // Update the asset
            if (amount !== undefined) asset.amount = amount;
            if (buyPrice !== undefined) asset.buyPrice = buyPrice;
            if (targetAllocation !== undefined) asset.targetAllocation = targetAllocation;
            
            // Recalculate value and profit
            asset.value = asset.amount * asset.currentPrice;
            asset.profit = ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
            
            // Recalculate total value and allocations
            const totalValue = state.selectedPortfolio.assets.reduce((sum, a) => sum + a.value, 0);
            state.selectedPortfolio.totalValue = totalValue;
            
            // Update allocations
            state.selectedPortfolio.assets.forEach(a => {
              a.currentAllocation = (a.value / totalValue) * 100;
            });
          }
        }
      })
      .addCase(updateAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // removeAsset
      .addCase(removeAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAsset.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedPortfolio) {
          const assetId = action.payload;
          
          // Remove the asset
          state.selectedPortfolio.assets = state.selectedPortfolio.assets.filter(a => a.id !== assetId);
          
          // Recalculate total value and allocations
          const totalValue = state.selectedPortfolio.assets.reduce((sum, asset) => sum + asset.value, 0);
          state.selectedPortfolio.totalValue = totalValue;
          
          // Update allocations
          state.selectedPortfolio.assets.forEach(asset => {
            asset.currentAllocation = (asset.value / totalValue) * 100;
          });
        }
      })
      .addCase(removeAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer; 