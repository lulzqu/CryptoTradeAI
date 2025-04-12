/**
 * Enum cho trạng thái vị thế
 */
export enum PositionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LIQUIDATED = 'LIQUIDATED',
  PENDING = 'PENDING'
}

/**
 * Enum cho loại vị thế
 */
export enum PositionType {
  LONG = 'LONG',
  SHORT = 'SHORT'
}

/**
 * Enum cho loại lệnh
 */
export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP_LOSS = 'STOP_LOSS',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TRAILING_STOP = 'TRAILING_STOP'
}

/**
 * Enum cho trạng thái lệnh
 */
export enum OrderStatus {
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

/**
 * Enum cho phía giao dịch
 */
export enum TradeSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

/**
 * Enum cho nguồn tín hiệu
 */
export enum SignalSource {
  AI = 'AI',
  MANUAL = 'MANUAL',
  STRATEGY = 'STRATEGY',
  COPY_TRADING = 'COPY_TRADING'
}

/**
 * Enum cho loại tín hiệu
 */
export enum SignalType {
  STRONG_BUY = 'STRONG_BUY',
  BUY = 'BUY',
  NEUTRAL = 'NEUTRAL',
  SELL = 'SELL',
  STRONG_SELL = 'STRONG_SELL'
}

/**
 * Enum cho loại sàn giao dịch
 */
export enum ExchangeType {
  SPOT = 'SPOT',
  FUTURES = 'FUTURES',
  MARGIN = 'MARGIN'
}

/**
 * Enum cho chế độ margin
 */
export enum MarginMode {
  ISOLATED = 'ISOLATED',
  CROSS = 'CROSS'
}

/**
 * Enum cho chế độ vị thế
 */
export enum PositionMode {
  ONE_WAY = 'ONE_WAY',
  HEDGE = 'HEDGE'
}

/**
 * Enum cho trạng thái sàn giao dịch
 */
export enum ExchangeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ERROR = 'ERROR'
}

/**
 * Enum cho thời gian hiệu lực lệnh
 */
export enum TimeInForce {
  GTC = 'GTC', // Good Till Cancel
  IOC = 'IOC', // Immediate Or Cancel
  FOK = 'FOK'  // Fill Or Kill
} 