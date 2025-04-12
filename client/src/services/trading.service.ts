import { Position, Signal } from '../types/trading';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { apiService } from './api';

class TradingService {
  async getOpenPositions(): Promise<ApiResponse<Position[]>> {
    return apiService.get<Position[]>('/trading/positions/open');
  }

  async getClosedPositions(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Position>>> {
    return apiService.get<PaginatedResponse<Position>>('/trading/positions/closed', {
      params: { page, limit }
    });
  }

  async getSignals(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Signal>>> {
    return apiService.get<PaginatedResponse<Signal>>('/trading/signals', {
      params: { page, limit }
    });
  }

  async createPosition(positionData: Partial<Position>): Promise<ApiResponse<Position>> {
    return apiService.post<Position>('/trading/positions', positionData);
  }

  async updatePosition(positionId: string, positionData: Partial<Position>): Promise<ApiResponse<Position>> {
    return apiService.put<Position>(`/trading/positions/${positionId}`, positionData);
  }

  async closePosition(positionId: string): Promise<ApiResponse<Position>> {
    return apiService.post<Position>(`/trading/positions/${positionId}/close`);
  }

  async createSignal(signalData: Partial<Signal>): Promise<ApiResponse<Signal>> {
    return apiService.post<Signal>('/trading/signals', signalData);
  }
}

export const tradingService = new TradingService(); 