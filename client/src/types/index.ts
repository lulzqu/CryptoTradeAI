// Authentication types
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  PREMIUM = 'premium'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  subscriptionTier: SubscriptionTier;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Market data types
export interface Coin {
  symbol: string;
  name: string;
  price: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  image?: string;
}

export enum SignalType {
  PRICE_BREAKOUT = 'PRICE_BREAKOUT',
  SUPPORT_RESISTANCE = 'SUPPORT_RESISTANCE',
  TREND_REVERSAL = 'TREND_REVERSAL',
  MOVING_AVERAGE_CROSS = 'MOVING_AVERAGE_CROSS',
  VOLUME_SPIKE = 'VOLUME_SPIKE',
  RSI_DIVERGENCE = 'RSI_DIVERGENCE',
  MACD_CROSS = 'MACD_CROSS',
  PATTERN_RECOGNITION = 'PATTERN_RECOGNITION',
  PATTERN = 'PATTERN',
  INDICATOR = 'INDICATOR',
  AI = 'AI',
  NEWS = 'NEWS'
}

export enum SignalSentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export enum SignalStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

export interface SignalUpdate {
  timestamp: string;
  message: string;
}

export interface Signal {
  id: string;
  symbol: string;
  type: string;
  timeframe: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  timestamp: string;
  status: string;
  favorite?: boolean;
  notified?: boolean;
}

export interface MarketState {
  data: MarketData | null;
  symbols: string[];
  favorites: any[];
  selectedSymbol: string;
  ticker: any | null;
  ticker24h: any | null;
  klines: Kline[];
  orderBook: OrderBook | null;
  recentTrades: Trade[];
  loading: boolean;
  error: string | null;
  timeframe: string;
}

// Portfolio types
export enum PositionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export interface Position {
  id: string;
  userId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  amount: number;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage: number;
  pnl?: number;
  pnlPercentage?: number;
  status: PositionStatus;
  openedAt: string;
  closedAt?: string;
  updatedAt: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalPnl: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  winCount: number;
  lossCount: number;
  bestTrade: {
    symbol: string;
    pnl: number;
    percentage: number;
    date: string;
  };
  worstTrade: {
    symbol: string;
    pnl: number;
    percentage: number;
    date: string;
  };
  monthlyPerformance: Array<{
    month: string;
    pnl: number;
    percentage: number;
  }>;
  symbolDistribution: Array<{
    symbol: string;
    percentage: number;
  }>;
}

export interface PortfolioState {
  positions: Position[];
  history: Position[];
  stats: {
    totalValue: number;
    totalPnl: number;
    totalPnlPercentage: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
  };
  loading: boolean;
  error: string | null;
}

// Analysis types
export interface CoinAnalysis {
  symbol: string;
  price: number;
  changePercent24h: number;
  volume24h: number;
  indicators: {
    rsi: number;
    macd: {
      line: number;
      signal: number;
      histogram: number;
    };
    ema20: number;
    ema50: number;
    ema200: number;
    supportLevels: number[];
    resistanceLevels: number[];
  };
  patterns: {
    name: string;
    confidence: number;
    direction: 'bullish' | 'bearish' | 'neutral';
  }[];
  aiAnalysis: {
    sentiment: number;
    prediction: string;
    confidence: number;
    recommendedAction: 'BUY' | 'SELL' | 'HOLD';
  };
  webSentiment: {
    overall: number;
    sources: {
      name: string;
      sentiment: number;
      url?: string;
    }[];
  };
}

export interface AnalysisState {
  signals: Signal[];
  candlestickPatterns: CandlestickPattern[];
  loading: boolean;
  patternsLoading: boolean;
  error: string | null;
}

// Settings types
export interface ApiConfig {
  mexc: {
    apiKey: string;
    apiSecret: string;
    permissions: string[];
    isConnected: boolean;
    lastChecked: string | null;
  };
  ai: {
    provider: string;
    apiKey: string;
    isConnected: boolean;
    usage: {
      used: number;
      limit: number;
    };
  };
}

export interface TradingConfig {
  autoTrading: boolean;
  riskPerTrade: number;
  maxOpenPositions: number;
  maxDailyVolume: number;
  defaultLeverage: number;
  strategies: {
    id: string;
    name: string;
    isActive: boolean;
    description: string;
  }[];
}

export interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

// Sentiment enum
export enum Sentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

// Exchange related types
export interface Exchange {
  id: string;
  name: string;
  logo: string;
  url: string;
  isActive: boolean;
  apiKey?: string;
  apiSecret?: string;
  createdAt: string;
}

// Subscription tier enum
export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

// Market data types
export interface MarketData {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  openTime: number;
  closeTime: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
}

export interface OrderBook {
  lastUpdateId: number;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface Trade {
  id: string;
  price: number;
  quantity: number;
  quoteQuantity: number;
  time: number;
  isBuyerMaker: boolean;
}

export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteVolume: number;
  trades: number;
  takerBuyBaseVolume: number;
  takerBuyQuoteVolume: number;
}

// Analysis related types
export interface Analysis {
  symbol: string;
  timeframe: string;
  timestamp: string;
  indicators: Indicator[];
  signals: Signal[];
  prediction: {
    price: number;
    confidence: number;
    timeframe: string;
  };
  sentiment: Sentiment;
  supportLevels: number[];
  resistanceLevels: number[];
}

// Indicator type
export interface Indicator {
  name: string;
  value: number | string;
  signal?: 'BUY' | 'SELL' | 'NEUTRAL';
  description?: string;
}

// User settings
export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    signalAlerts: boolean;
    priceAlerts: boolean;
  };
  trading: {
    defaultLeverage: number;
    riskPerTrade: number;
    autoTrade: boolean;
  };
  display: {
    defaultTimeframe: string;
    defaultChart: 'candles' | 'line';
    showVolume: boolean;
  };
}

// Root state for Redux
export interface RootState {
  auth: AuthState;
  market: MarketState;
  portfolio: PortfolioState;
  analysis: AnalysisState;
  settings: SettingsState;
}

export interface TradingRecommendation {
  action: 'BUY' | 'SELL' | 'WATCH';
  description: string;
  priceTarget?: string;
  stopLoss?: string;
}

export interface PatternPoint {
  id: number;
  description: string;
}

export interface CandlestickPattern {
  id: string;
  symbol: string;
  timeframe: string;
  pattern: string;
  reliability: number;
  timestamp: string;
}

export interface CandlePattern {
  id: string;
  name: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
  reliability: number;
  notes: string;
}

export interface Strategy {
  id: string;
  name: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  performanceData: Array<{
    date: string;
    equity: number;
  }>;
}

export interface BacktestResult {
  id: string;
  symbol: string;
  startDate: string;
  endDate: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  totalProfit: number;
  trades: Array<{
    id: string;
    entryDate: string;
    exitDate: string;
    entryPrice: number;
    exitPrice: number;
    profit: number;
    type: 'long' | 'short';
  }>;
} 