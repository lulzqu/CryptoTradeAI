import { 
  OrderType, 
  OrderStatus, 
  PositionType, 
  PositionStatus,
  TradeSide,
  TimeInForce,
  MarginMode
} from './enums';

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  side: TradeSide;
  price: number;
  quantity: number;
  timestamp: Date;
  fee: number;
  feeCurrency: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  orderId: string;
  positionId?: string;
  signalId?: string;
}

export interface Position {
  id: string;
  userId: string;
  symbol: string;
  type: PositionType;
  status: PositionStatus;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  leverage: number;
  marginMode: MarginMode;
  unrealizedPnl: number;
  realizedPnl: number;
  liquidationPrice: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  entryTime: Date;
  pnl?: number;
  pnlPercentage?: number;
  trades: string[];
  signalId?: string;
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  type: OrderType;
  side: TradeSide;
  price: number;
  stopPrice?: number;
  quantity: number;
  status: OrderStatus;
  timeInForce: TimeInForce;
  createdAt: Date;
  updatedAt: Date;
  filledAt?: Date;
  averageFilledPrice?: number;
  filledQuantity: number;
  remainingQuantity: number;
  fee?: number;
  feeCurrency?: string;
  positionId?: string;
  signalId?: string;
}

export interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface TradingState {
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  balance: Balance[];
  loading: boolean;
  error: string | null;
} 