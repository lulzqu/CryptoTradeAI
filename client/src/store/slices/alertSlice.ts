import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AlertService, { Alert, AlertQueryParams } from '../../services/AlertService';
import { RootState } from '../store';

interface AlertState {
  alerts: Alert[];
  selectedAlert: Alert | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

const initialState: AlertState = {
  alerts: [],
  selectedAlert: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false
};

// Thunks
export const fetchAlerts = createAsyncThunk<Alert[], AlertQueryParams | undefined>(
  'alerts/fetchAlerts',
  async (params = undefined, { rejectWithValue }) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        return AlertService.getMockAlerts();
      }
      return await AlertService.getAlerts(params);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải danh sách cảnh báo');
    }
  }
);

export const fetchAlertById = createAsyncThunk(
  'alerts/fetchAlertById',
  async (alertId: string, { rejectWithValue }) => {
    try {
      return await AlertService.getAlertById(alertId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải thông tin cảnh báo');
    }
  }
);

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async (alertData: Omit<Alert, '_id' | 'createdAt' | 'updatedAt' | 'triggerCount' | 'lastTriggered'>, { rejectWithValue }) => {
    try {
      return await AlertService.createAlert(alertData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tạo cảnh báo');
    }
  }
);

export const updateAlert = createAsyncThunk(
  'alerts/updateAlert',
  async ({ alertId, alertData }: { alertId: string; alertData: Partial<Alert> }, { rejectWithValue }) => {
    try {
      return await AlertService.updateAlert(alertId, alertData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể cập nhật cảnh báo');
    }
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      const result = await AlertService.deleteAlert(alertId);
      if (result.success) {
        return alertId;
      }
      return rejectWithValue(result.message || 'Không thể xóa cảnh báo');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể xóa cảnh báo');
    }
  }
);

export const triggerAlert = createAsyncThunk(
  'alerts/triggerAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      return await AlertService.triggerAlert(alertId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể kích hoạt cảnh báo');
    }
  }
);

// Slice
const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setSelectedAlert: (state, action: PayloadAction<Alert | null>) => {
      state.selectedAlert = action.payload;
    },
    clearAlertErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch alerts
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch alert by ID
    builder
      .addCase(fetchAlertById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlertById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlert = action.payload;
      })
      .addCase(fetchAlertById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create alert
    builder
      .addCase(createAlert.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.creating = false;
        state.alerts = [action.payload, ...state.alerts];
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      });

    // Update alert
    builder
      .addCase(updateAlert.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAlert.fulfilled, (state, action) => {
        state.updating = false;
        state.alerts = state.alerts.map(alert => 
          alert._id === action.payload._id ? action.payload : alert
        );
        if (state.selectedAlert && state.selectedAlert._id === action.payload._id) {
          state.selectedAlert = action.payload;
        }
      })
      .addCase(updateAlert.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Delete alert
    builder
      .addCase(deleteAlert.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.deleting = false;
        state.alerts = state.alerts.filter(alert => alert._id !== action.payload);
        if (state.selectedAlert && state.selectedAlert._id === action.payload) {
          state.selectedAlert = null;
        }
      })
      .addCase(deleteAlert.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });

    // Trigger alert
    builder
      .addCase(triggerAlert.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(triggerAlert.fulfilled, (state, action) => {
        state.updating = false;
        state.alerts = state.alerts.map(alert => 
          alert._id === action.payload._id ? action.payload : alert
        );
        if (state.selectedAlert && state.selectedAlert._id === action.payload._id) {
          state.selectedAlert = action.payload;
        }
      })
      .addCase(triggerAlert.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });
  }
});

// Actions
export const { setSelectedAlert, clearAlertErrors } = alertSlice.actions;

// Selectors
export const selectAllAlerts = (state: RootState) => state.alerts.alerts;
export const selectAlertById = (state: RootState, alertId: string) => 
  state.alerts.alerts.find(alert => alert._id === alertId);
export const selectSelectedAlert = (state: RootState) => state.alerts.selectedAlert;
export const selectAlertsLoading = (state: RootState) => state.alerts.loading;
export const selectAlertsError = (state: RootState) => state.alerts.error;
export const selectAlertCreating = (state: RootState) => state.alerts.creating;
export const selectAlertUpdating = (state: RootState) => state.alerts.updating;
export const selectAlertDeleting = (state: RootState) => state.alerts.deleting;

// Filter selectors
export const selectAlertsByType = (state: RootState, type: Alert['type']) => 
  state.alerts.alerts.filter(alert => alert.type === type);

export const selectAlertsByStatus = (state: RootState, status: Alert['status']) => 
  state.alerts.alerts.filter(alert => alert.status === status);

export const selectAlertsBySymbol = (state: RootState, symbol: string) => 
  state.alerts.alerts.filter(alert => alert.symbol === symbol);

export const selectPriceAlerts = (state: RootState) => 
  state.alerts.alerts.filter(alert => alert.type === 'price');

export const selectIndicatorAlerts = (state: RootState) => 
  state.alerts.alerts.filter(alert => alert.type === 'indicator');

export const selectRiskAlerts = (state: RootState) => 
  state.alerts.alerts.filter(alert => alert.type === 'risk');

export const selectActiveAlerts = (state: RootState) => 
  state.alerts.alerts.filter(alert => alert.status === 'active');

export const selectTriggeredAlerts = (state: RootState) => 
  state.alerts.alerts.filter(alert => alert.status === 'triggered');

export default alertSlice.reducer; 