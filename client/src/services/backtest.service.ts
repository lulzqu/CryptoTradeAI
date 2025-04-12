import { Backtest, BacktestRequest } from '../types/backtest';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { apiService } from './api';

class BacktestService {
  async createBacktest(backtestData: Partial<Backtest>): Promise<ApiResponse<Backtest>> {
    return apiService.post<Backtest>('/backtest', backtestData);
  }

  async getBacktest(id: string): Promise<ApiResponse<Backtest>> {
    return apiService.get<Backtest>(`/backtest/${id}`);
  }

  async getBacktestsByUser(userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Backtest>>> {
    return apiService.get<PaginatedResponse<Backtest>>(`/backtest/user/${userId}`, {
      params: { page, limit }
    });
  }

  async getBacktestsByStrategy(strategyId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Backtest>>> {
    return apiService.get<PaginatedResponse<Backtest>>(`/backtest/strategy/${strategyId}`, {
      params: { page, limit }
    });
  }

  async deleteBacktest(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/backtest/${id}`);
  }

  async runBacktest(backtestRequest: BacktestRequest): Promise<ApiResponse<Backtest>> {
    return apiService.post<Backtest>('/backtest/run', backtestRequest);
  }
}

export const backtestService = new BacktestService(); 