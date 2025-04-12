// Enums

/**
 * Loại tín hiệu giao dịch
 */
export enum SignalType {
  STRONG_BUY = 'STRONG_BUY',
  BUY = 'BUY',
  NEUTRAL = 'NEUTRAL',
  SELL = 'SELL',
  STRONG_SELL = 'STRONG_SELL'
}

/**
 * Trạng thái vị thế
 */
export enum PositionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LIQUIDATED = 'LIQUIDATED'
}

/**
 * Xu hướng thị trường
 */
export enum Sentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

/**
 * Giai đoạn thị trường
 */
export enum MarketPhase {
  ACCUMULATION = 'ACCUMULATION',
  UPTREND = 'UPTREND',
  DISTRIBUTION = 'DISTRIBUTION',
  DOWNTREND = 'DOWNTREND',
  RANGING = 'RANGING'
}

/**
 * Khung thời gian biểu đồ
 */
export enum TimeFrame {
  M1 = '1m',
  M5 = '5m',
  M15 = '15m',
  M30 = '30m',
  H1 = '1h',
  H4 = '4h',
  D1 = '1d',
  W1 = '1w'
}

// Interfaces

/**
 * Thông tin tín hiệu giao dịch
 */
export interface Signal {
  id: string;
  symbol: string;
  type: SignalType;
  price: number;
  timeFrame: TimeFrame;
  stopLoss: number;
  takeProfits: number[];
  riskRewardRatio: number;
  winProbability: number;
  entryTime: Date;
  expiryTime: Date;
  reason: string;
  source: string;
  confidence: number;
}

/**
 * Thông tin thị trường
 */
export interface MarketData {
  symbol: string;
  price: number;
  priceChangePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  fundingRate: number;
  openInterest: number;
  marketCap?: number;
  lastUpdate: Date;
}

/**
 * Dữ liệu phân tích kỹ thuật
 */
export interface TechnicalAnalysis {
  symbol: string;
  signal: SignalType;
  indicators: {
    name: string;
    value: string;
    sentiment: Sentiment;
    description: string;
  }[];
  score: number;
  timeFrame: TimeFrame;
  lastUpdate: Date;
}

/**
 * Dự đoán AI
 */
export interface AIPrediction {
  symbol: string;
  timeFrame: TimeFrame;
  prediction: string;
  sentiment: Sentiment;
  sentimentScore: number;
  overview: string;
  patterns: {
    name: string;
    description: string;
    confidence: number;
  }[];
  priceTargets: {
    timeframe: string;
    price: number;
    probability: number;
  }[];
  lastUpdate: Date;
}

/**
 * Thiết lập giao dịch
 */
export interface TradeSetup {
  symbol: string;
  signal: SignalType;
  entryZone: number[];
  stopLoss: number;
  stopLossPercent: number;
  takeProfits: {
    price: number;
    percent: number;
  }[];
  riskRewardRatio: number;
  winProbability: number;
  positionSizePercent: number;
  timeFrame: TimeFrame;
  lastUpdate: Date;
}

/**
 * Dữ liệu từ web
 */
export interface WebData {
  symbol: string;
  icryptoAnalysis: string;
  socialSentiment: {
    source: string;
    content: string;
    sentiment: Sentiment;
  }[];
  upcomingEvents: {
    title: string;
    date: string;
    description: string;
  }[];
  lastUpdate: Date;
} 