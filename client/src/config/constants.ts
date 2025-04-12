// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Authentication constants
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// App constants
export const APP_NAME = 'CryptoTradeAI';
export const DEFAULT_LANGUAGE = 'vi';

// Chart defaults
export const DEFAULT_TIMEFRAME = '1h';
export const DEFAULT_CHART_TYPE = 'candlestick';

// Trading constants
export const DEFAULT_TRADING_PAIR = 'BTC/USDT';
export const DEFAULT_TRADING_EXCHANGE = 'binance';

// Notification constants
export const NOTIFICATION_DURATION = 4500; // in ms

// Theme settings
export const THEME_KEY = 'app_theme';
export const DEFAULT_THEME = 'light';

// Feature flags
export const FEATURES = {
  DEMO_MODE: true,
  TRADING_ENABLED: false,
  SIGNALS_ENABLED: true,
  BACKTESTING_ENABLED: true,
}; 