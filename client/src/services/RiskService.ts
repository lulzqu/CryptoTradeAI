import { API_URL } from '../config/constants';
import axios from 'axios';
import { RiskSettings, RiskMetrics, RiskAlert } from '../types/risk';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { apiService } from './api';

export interface PositionSizing {
  symbol: string;
  strategy: string;
  entryPrice: number;
  accountBalance: number;
  riskPercentage: number;
  stopLossPrice: number;
  leverage?: number;
  positionSize?: number;
  quantity?: number;
}

export interface RiskAnalysis {
  metrics: RiskMetrics;
  recommendations: string[];
  portfolio: {
    diversification: number;
    concentration: number;
    exposureByAsset: Record<string, number>;
    exposureByMarket: Record<string, number>;
  };
}

export interface RiskReport {
  id?: string;
  userId: string;
  generatedAt: Date;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  metrics: RiskMetrics;
  portfolioValue: number;
  pnl: number;
  drawdown: number;
  exposureByAsset: Record<string, number>;
  largestPositions: Array<{
    symbol: string;
    size: number;
    pnl: number;
    risk: string;
  }>;
  recommendations: string[];
}

class RiskService {
  private baseUrl = `${API_URL}/risk`;

  // Risk Settings
  async getRiskSettings(): Promise<ApiResponse<RiskSettings>> {
    return apiService.get<RiskSettings>('/risk/settings');
  }

  async updateRiskSettings(settings: Partial<RiskSettings>): Promise<ApiResponse<RiskSettings>> {
    return apiService.put<RiskSettings>('/risk/settings', settings);
  }

  // Position Sizing
  async calculatePositionSize(params: Omit<PositionSizing, 'positionSize' | 'quantity'>): Promise<PositionSizing> {
    try {
      const response = await axios.post(`${this.baseUrl}/position-size`, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Risk Analysis
  async getRiskAnalysis(portfolioId?: string): Promise<RiskAnalysis> {
    try {
      const url = portfolioId 
        ? `${this.baseUrl}/analysis?portfolioId=${portfolioId}` 
        : `${this.baseUrl}/analysis`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Risk Metrics
  async getRiskMetrics(): Promise<ApiResponse<RiskMetrics>> {
    return apiService.get<RiskMetrics>('/risk/metrics');
  }

  async getHistoricalMetrics(timeframe: string = '1d'): Promise<ApiResponse<RiskMetrics[]>> {
    return apiService.get<RiskMetrics[]>('/risk/metrics/history', {
      params: { timeframe }
    });
  }

  // Risk Alerts
  async getRiskAlerts(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<RiskAlert>>> {
    return apiService.get<PaginatedResponse<RiskAlert>>('/risk/alerts', {
      params: { page, limit }
    });
  }

  async getRiskAlert(id: string): Promise<ApiResponse<RiskAlert>> {
    return apiService.get<RiskAlert>(`/risk/alerts/${id}`);
  }

  async acknowledgeRiskAlert(id: string): Promise<ApiResponse<RiskAlert>> {
    return apiService.post<RiskAlert>(`/risk/alerts/${id}/acknowledge`);
  }

  // Risk Limits
  async getRiskLimits(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/risk/limits');
  }

  async updateRiskLimits(limits: any): Promise<ApiResponse<any>> {
    return apiService.put<any>('/risk/limits', limits);
  }

  // Risk Reports
  async getRiskReport(timeframe: string = '1d'): Promise<ApiResponse<any>> {
    return apiService.get<any>('/risk/report', {
      params: { timeframe }
    });
  }

  async getRiskExposure(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/risk/exposure');
  }

  // Mock data for development
  getMockRiskSettings(): RiskSettings {
    return {
      userId: 'user123',
      maxPositionSize: 5, // 5% of portfolio
      maxLeverage: 5,
      maxDrawdown: 20, // 20% max drawdown
      maxDailyLoss: 5, // 5% max daily loss
      maxOpenPositions: 10,
      stopLossPercentage: 2, // 2% default stop loss
      takeProfitPercentage: 6, // 6% default take profit
      riskRewardRatio: 3, // 1:3 risk/reward ratio
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  getMockRiskMetrics(): RiskMetrics {
    return {
      maxDrawdown: 15.7,
      sharpeRatio: 1.8,
      sortinoRatio: 2.1,
      winLossRatio: 1.5,
      profitFactor: 2.3,
      expectancy: 0.75,
      volatility: 12.3,
      beta: 0.85,
      alpha: 5.2,
      riskAdjustedReturn: 8.4,
      calmarRatio: 2.1,
      marketCorrelation: 0.65
    };
  }

  getMockPositionSizing(params: Partial<PositionSizing>): PositionSizing {
    const entryPrice = params.entryPrice || 50000;
    const stopLossPrice = params.stopLossPrice || 49000;
    const riskPercentage = params.riskPercentage || 1;
    const accountBalance = params.accountBalance || 10000;
    
    const riskAmount = accountBalance * (riskPercentage / 100);
    const priceDifference = Math.abs(entryPrice - stopLossPrice);
    const leverage = params.leverage || 1;
    const positionSize = (riskAmount / (priceDifference / entryPrice)) * leverage;
    const quantity = positionSize / entryPrice;
    
    return {
      symbol: params.symbol || 'BTC/USDT',
      strategy: params.strategy || 'trend_following',
      entryPrice,
      accountBalance,
      riskPercentage,
      stopLossPrice,
      leverage,
      positionSize,
      quantity
    };
  }

  getMockRiskAnalysis(): RiskAnalysis {
    return {
      metrics: this.getMockRiskMetrics(),
      recommendations: [
        'Consider reducing exposure to technology sector',
        'Increase position diversification',
        'Set tighter stop losses for volatile assets',
        'Consider hedging Bitcoin exposure with options'
      ],
      portfolio: {
        diversification: 68, // 68% diversified
        concentration: 32, // 32% concentrated
        exposureByAsset: {
          'BTC': 35,
          'ETH': 25,
          'SOL': 15,
          'ADA': 10,
          'DOT': 8,
          'AVAX': 7
        },
        exposureByMarket: {
          'Cryptocurrencies': 75,
          'DeFi': 15,
          'NFT': 5,
          'GameFi': 5
        }
      }
    };
  }

  getMockRiskAlerts(): RiskAlert[] {
    return [
      {
        id: 'alert1',
        userId: 'user123',
        type: 'drawdown',
        condition: 'portfolio.drawdown > threshold',
        threshold: 10,
        status: 'active',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date()
      },
      {
        id: 'alert2',
        userId: 'user123',
        type: 'leverage',
        condition: 'position.leverage > threshold',
        threshold: 5,
        symbol: 'BTC/USDT',
        status: 'active',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date()
      },
      {
        id: 'alert3',
        userId: 'user123',
        type: 'exposure',
        condition: 'portfolio.exposure[BTC] > threshold',
        threshold: 30,
        symbol: 'BTC',
        status: 'triggered',
        lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        message: 'BTC exposure exceeds 30% of portfolio',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date()
      }
    ];
  }

  getMockRiskReports(): RiskReport[] {
    return [
      {
        id: 'report1',
        userId: 'user123',
        generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        timeframe: 'daily',
        metrics: this.getMockRiskMetrics(),
        portfolioValue: 15250,
        pnl: 250,
        drawdown: 3.5,
        exposureByAsset: {
          'BTC': 35,
          'ETH': 25,
          'SOL': 15,
          'ADA': 10,
          'DOT': 8,
          'AVAX': 7
        },
        largestPositions: [
          { symbol: 'BTC/USDT', size: 5000, pnl: 150, risk: 'medium' },
          { symbol: 'ETH/USDT', size: 3000, pnl: 75, risk: 'low' },
          { symbol: 'SOL/USDT', size: 2000, pnl: -50, risk: 'high' }
        ],
        recommendations: [
          'Consider taking profit on BTC position',
          'Set tighter stop loss on SOL position',
          'Consider adding to ETH position on dips'
        ]
      },
      {
        id: 'report2',
        userId: 'user123',
        generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        timeframe: 'weekly',
        metrics: {
          maxDrawdown: 12.1,
          sharpeRatio: 1.5,
          sortinoRatio: 1.9,
          winLossRatio: 1.4,
          profitFactor: 2.1,
          expectancy: 0.68,
          volatility: 14.5,
          beta: 0.92,
          alpha: 4.8,
          riskAdjustedReturn: 7.8,
          calmarRatio: 1.9,
          marketCorrelation: 0.72
        },
        portfolioValue: 14800,
        pnl: 800,
        drawdown: 5.2,
        exposureByAsset: {
          'BTC': 38,
          'ETH': 22,
          'SOL': 16,
          'ADA': 9,
          'DOT': 8,
          'AVAX': 7
        },
        largestPositions: [
          { symbol: 'BTC/USDT', size: 5600, pnl: 350, risk: 'medium' },
          { symbol: 'ETH/USDT', size: 3200, pnl: 200, risk: 'low' },
          { symbol: 'SOL/USDT', size: 2400, pnl: 150, risk: 'high' }
        ],
        recommendations: [
          'Portfolio is well-balanced but slightly overexposed to BTC',
          'Consider rebalancing by taking some profit on BTC',
          'Consider adding to ADA position at current levels'
        ]
      }
    ];
  }

  private handleError(error: any): Error {
    console.error('Risk service error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return new Error(error.response.data.message || 'Error from server');
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error(error.message || 'Unknown error occurred');
    }
  }
}

export const riskService = new RiskService(); 