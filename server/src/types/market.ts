export interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: Date;
}

export interface Trade {
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: Date;
}

export interface MarketState {
  symbols: string[];
  selectedSymbol: string;
  timeframe: string;
  data: MarketData[];
  orderBook: OrderBook | null;
  recentTrades: Trade[];
  loading: boolean;
  error: string | null;
} 