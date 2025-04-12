import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface SocialState {
  publicStrategies: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SocialState = {
  publicStrategies: [],
  loading: false,
  error: null
};

export const shareStrategy = createAsyncThunk(
  'social/shareStrategy',
  async ({ strategyId, isPublic }: { strategyId: string; isPublic: boolean }) => {
    const response = await axios.post('/api/social/share', { strategyId, isPublic });
    return response.data;
  }
);

export const getPublicStrategies = createAsyncThunk(
  'social/getPublicStrategies',
  async () => {
    const response = await axios.get('/api/social/public');
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  'social/addComment',
  async ({ strategyShareId, content }: { strategyShareId: string; content: string }) => {
    const response = await axios.post(`/api/social/${strategyShareId}/comment`, { content });
    return response.data;
  }
);

export const addRating = createAsyncThunk(
  'social/addRating',
  async ({ strategyShareId, score, comment }: { strategyShareId: string; score: number; comment?: string }) => {
    const response = await axios.post(`/api/social/${strategyShareId}/rating`, { score, comment });
    return response.data;
  }
);

export const followStrategy = createAsyncThunk(
  'social/followStrategy',
  async (strategyShareId: string) => {
    const response = await axios.post(`/api/social/${strategyShareId}/follow`);
    return response.data;
  }
);

export const updatePerformance = createAsyncThunk(
  'social/updatePerformance',
  async ({ strategyShareId, performance }: { strategyShareId: string; performance: any }) => {
    const response = await axios.put(`/api/social/${strategyShareId}/performance`, { performance });
    return response.data;
  }
);

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Share Strategy
      .addCase(shareStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareStrategy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publicStrategies.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.publicStrategies[index] = action.payload;
        } else {
          state.publicStrategies.push(action.payload);
        }
      })
      .addCase(shareStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi chia sẻ chiến lược';
      })
      // Get Public Strategies
      .addCase(getPublicStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicStrategies.fulfilled, (state, action) => {
        state.loading = false;
        state.publicStrategies = action.payload;
      })
      .addCase(getPublicStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi lấy danh sách chiến lược';
      })
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publicStrategies.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.publicStrategies[index] = action.payload;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi thêm bình luận';
      })
      // Add Rating
      .addCase(addRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publicStrategies.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.publicStrategies[index] = action.payload;
        }
      })
      .addCase(addRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi thêm đánh giá';
      })
      // Follow Strategy
      .addCase(followStrategy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followStrategy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publicStrategies.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.publicStrategies[index] = action.payload;
        }
      })
      .addCase(followStrategy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi theo dõi chiến lược';
      })
      // Update Performance
      .addCase(updatePerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePerformance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publicStrategies.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.publicStrategies[index] = action.payload;
        }
      })
      .addCase(updatePerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi cập nhật hiệu suất';
      });
  }
});

export const { clearError } = socialSlice.actions;
export default socialSlice.reducer; 