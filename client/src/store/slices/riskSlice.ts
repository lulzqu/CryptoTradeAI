import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import RiskService, { 
  RiskSettings, 
  PositionSizing, 
  RiskMetrics, 
  RiskAnalysis, 
  RiskAlert, 
  RiskReport 
} from '../../services/RiskService';
import { RootState } from '../store';

interface RiskState {
  // Risk Settings
  settings: RiskSettings | null;
  settingsLoading: boolean;
  settingsError: string | null;
  
  // Position Sizing
  positionSizing: PositionSizing | null;
  positionSizingLoading: boolean;
  positionSizingError: string | null;
  
  // Risk Analysis
  analysis: RiskAnalysis | null;
  analysisLoading: boolean;
  analysisError: string | null;
  
  // Risk Metrics
  metrics: RiskMetrics | null;
  metricsLoading: boolean;
  metricsError: string | null;
  
  // Risk Alerts
  alerts: RiskAlert[];
  alertsLoading: boolean;
  alertsError: string | null;
  
  // Risk Reports
  reports: RiskReport[];
  reportsLoading: boolean;
  reportsError: string | null;
  selectedReport: RiskReport | null;
}

const initialState: RiskState = {
  // Risk Settings
  settings: null,
  settingsLoading: false,
  settingsError: null,
  
  // Position Sizing
  positionSizing: null,
  positionSizingLoading: false,
  positionSizingError: null,
  
  // Risk Analysis
  analysis: null,
  analysisLoading: false,
  analysisError: null,
  
  // Risk Metrics
  metrics: null,
  metricsLoading: false,
  metricsError: null,
  
  // Risk Alerts
  alerts: [],
  alertsLoading: false,
  alertsError: null,
  
  // Risk Reports
  reports: [],
  reportsLoading: false,
  reportsError: null,
  selectedReport: null,
};

// Risk Settings Thunks
export const fetchRiskSettings = createAsyncThunk(
  'risk/fetchRiskSettings',
  async (_, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return RiskService.getMockRiskSettings();
      }
      
      const settings = await RiskService.getRiskSettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch risk settings');
    }
  }
);

export const updateRiskSettings = createAsyncThunk(
  'risk/updateRiskSettings',
  async (settings: Partial<RiskSettings>, { rejectWithValue }) => {
    try {
      const updatedSettings = await RiskService.updateRiskSettings(settings);
      return updatedSettings;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update risk settings');
    }
  }
);

// Position Sizing Thunks
export const calculatePositionSize = createAsyncThunk(
  'risk/calculatePositionSize',
  async (params: Omit<PositionSizing, 'positionSize' | 'quantity'>, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return RiskService.getMockPositionSizing(params);
      }
      
      const positionSizing = await RiskService.calculatePositionSize(params);
      return positionSizing;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to calculate position size');
    }
  }
);

// Risk Analysis Thunks
export const fetchRiskAnalysis = createAsyncThunk(
  'risk/fetchRiskAnalysis',
  async (portfolioId: string | undefined, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return RiskService.getMockRiskAnalysis();
      }
      
      const analysis = await RiskService.getRiskAnalysis(portfolioId);
      return analysis;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch risk analysis');
    }
  }
);

// Risk Metrics Thunks
export const fetchRiskMetrics = createAsyncThunk(
  'risk/fetchRiskMetrics',
  async (params: { portfolioId?: string; timeframe?: string; from?: Date; to?: Date }, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return RiskService.getMockRiskMetrics();
      }
      
      const metrics = await RiskService.getRiskMetrics(params);
      return metrics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch risk metrics');
    }
  }
);

// Risk Alerts Thunks
export const fetchRiskAlerts = createAsyncThunk(
  'risk/fetchRiskAlerts',
  async (_, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return RiskService.getMockRiskAlerts();
      }
      
      const alerts = await RiskService.getRiskAlerts();
      return alerts;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch risk alerts');
    }
  }
);

export const createRiskAlert = createAsyncThunk(
  'risk/createRiskAlert',
  async (alert: Omit<RiskAlert, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newAlert = await RiskService.createRiskAlert(alert);
      return newAlert;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create risk alert');
    }
  }
);

export const updateRiskAlert = createAsyncThunk(
  'risk/updateRiskAlert',
  async ({ alertId, updates }: { alertId: string; updates: Partial<RiskAlert> }, { rejectWithValue }) => {
    try {
      const updatedAlert = await RiskService.updateRiskAlert(alertId, updates);
      return updatedAlert;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update risk alert');
    }
  }
);

export const deleteRiskAlert = createAsyncThunk(
  'risk/deleteRiskAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      const result = await RiskService.deleteRiskAlert(alertId);
      if (result.success) {
        return alertId;
      }
      return rejectWithValue(result.message || 'Failed to delete risk alert');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete risk alert');
    }
  }
);

// Risk Reports Thunks
export const fetchRiskReports = createAsyncThunk(
  'risk/fetchRiskReports',
  async (timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | undefined, { rejectWithValue }) => {
    try {
      // In development mode, fetch mock data
      if (process.env.NODE_ENV === 'development') {
        return RiskService.getMockRiskReports();
      }
      
      const reports = await RiskService.getRiskReports(timeframe);
      return reports;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch risk reports');
    }
  }
);

export const fetchRiskReportById = createAsyncThunk(
  'risk/fetchRiskReportById',
  async (reportId: string, { rejectWithValue }) => {
    try {
      const report = await RiskService.getRiskReportById(reportId);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch risk report');
    }
  }
);

export const generateRiskReport = createAsyncThunk(
  'risk/generateRiskReport',
  async (timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly', { rejectWithValue }) => {
    try {
      const report = await RiskService.generateRiskReport(timeframe);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate risk report');
    }
  }
);

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {
    setSelectedReport: (state, action: PayloadAction<RiskReport | null>) => {
      state.selectedReport = action.payload;
    },
    clearPositionSizing: (state) => {
      state.positionSizing = null;
      state.positionSizingError = null;
    },
  },
  extraReducers: (builder) => {
    // Risk Settings reducers
    builder
      .addCase(fetchRiskSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchRiskSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchRiskSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload as string;
      })
      .addCase(updateRiskSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(updateRiskSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateRiskSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload as string;
      });

    // Position Sizing reducers
    builder
      .addCase(calculatePositionSize.pending, (state) => {
        state.positionSizingLoading = true;
        state.positionSizingError = null;
      })
      .addCase(calculatePositionSize.fulfilled, (state, action) => {
        state.positionSizingLoading = false;
        state.positionSizing = action.payload;
      })
      .addCase(calculatePositionSize.rejected, (state, action) => {
        state.positionSizingLoading = false;
        state.positionSizingError = action.payload as string;
      });

    // Risk Analysis reducers
    builder
      .addCase(fetchRiskAnalysis.pending, (state) => {
        state.analysisLoading = true;
        state.analysisError = null;
      })
      .addCase(fetchRiskAnalysis.fulfilled, (state, action) => {
        state.analysisLoading = false;
        state.analysis = action.payload;
      })
      .addCase(fetchRiskAnalysis.rejected, (state, action) => {
        state.analysisLoading = false;
        state.analysisError = action.payload as string;
      });

    // Risk Metrics reducers
    builder
      .addCase(fetchRiskMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.metricsError = null;
      })
      .addCase(fetchRiskMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchRiskMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.metricsError = action.payload as string;
      });

    // Risk Alerts reducers
    builder
      .addCase(fetchRiskAlerts.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(fetchRiskAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchRiskAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload as string;
      })
      .addCase(createRiskAlert.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(createRiskAlert.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = [action.payload, ...state.alerts];
      })
      .addCase(createRiskAlert.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload as string;
      })
      .addCase(updateRiskAlert.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(updateRiskAlert.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = state.alerts.map(alert => 
          alert.id === action.payload.id ? action.payload : alert
        );
      })
      .addCase(updateRiskAlert.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload as string;
      })
      .addCase(deleteRiskAlert.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(deleteRiskAlert.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
      })
      .addCase(deleteRiskAlert.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload as string;
      });

    // Risk Reports reducers
    builder
      .addCase(fetchRiskReports.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchRiskReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchRiskReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload as string;
      })
      .addCase(fetchRiskReportById.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchRiskReportById.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.selectedReport = action.payload;
        
        // Update the report in the list if it exists
        const index = state.reports.findIndex(report => report.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(fetchRiskReportById.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload as string;
      })
      .addCase(generateRiskReport.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(generateRiskReport.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.reports = [action.payload, ...state.reports];
        state.selectedReport = action.payload;
      })
      .addCase(generateRiskReport.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload as string;
      });
  },
});

export const { setSelectedReport, clearPositionSizing } = riskSlice.actions;

// Selectors
export const selectRiskSettings = (state: RootState) => state.risk.settings;
export const selectSettingsLoading = (state: RootState) => state.risk.settingsLoading;
export const selectSettingsError = (state: RootState) => state.risk.settingsError;

export const selectPositionSizing = (state: RootState) => state.risk.positionSizing;
export const selectPositionSizingLoading = (state: RootState) => state.risk.positionSizingLoading;
export const selectPositionSizingError = (state: RootState) => state.risk.positionSizingError;

export const selectRiskAnalysis = (state: RootState) => state.risk.analysis;
export const selectAnalysisLoading = (state: RootState) => state.risk.analysisLoading;
export const selectAnalysisError = (state: RootState) => state.risk.analysisError;

export const selectRiskMetrics = (state: RootState) => state.risk.metrics;
export const selectMetricsLoading = (state: RootState) => state.risk.metricsLoading;
export const selectMetricsError = (state: RootState) => state.risk.metricsError;

export const selectRiskAlerts = (state: RootState) => state.risk.alerts;
export const selectAlertsLoading = (state: RootState) => state.risk.alertsLoading;
export const selectAlertsError = (state: RootState) => state.risk.alertsError;

export const selectRiskReports = (state: RootState) => state.risk.reports;
export const selectReportsLoading = (state: RootState) => state.risk.reportsLoading;
export const selectReportsError = (state: RootState) => state.risk.reportsError;
export const selectSelectedReport = (state: RootState) => state.risk.selectedReport;

export default riskSlice.reducer; 