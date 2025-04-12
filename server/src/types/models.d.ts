import { Document, Types } from 'mongoose';
import { SignalType, SignalSource } from '../models/Signal';
import { NotificationType, NotificationChannel } from '../config/notification.config';
import { TradingStrategy } from '../config/autoTrading.config';

// Khai báo kiểu cho các model
declare module '../models/Signal' {
  export interface ISignal extends Document {
    symbol: string;
    type: SignalType;
    strategy: TradingStrategy;
    source: SignalSource;
    confidence: number;
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    leverage: number;
    indicators: Record<string, any>;
    analysis: string;
    user?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    shares: Array<{
      user: Types.ObjectId;
      type: string;
      recipients: Types.ObjectId[];
      message?: string;
      tags?: string[];
    }>;
  }

  export const Signal: mongoose.Model<ISignal>;
}

declare module '../models/User' {
  export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    settings: {
      autoTrading: {
        enabled: boolean;
        exchange: string;
      }
    };
  }

  export const User: mongoose.Model<IUser>;
}

declare module '../models/Strategy' {
  export interface IStrategy extends Document {
    name: string;
    description?: string;
    type: TradingStrategy;
    user: Types.ObjectId;
    status: string;
    parameters: Record<string, any>;
    performanceMetrics: {
      totalTrades: number;
      winRate: number;
      profitFactor: number;
      maxDrawdown: number;
      averageReturn: number;
    };
    backtestResults?: Array<{
      date: Date;
      result: Record<string, any>;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }

  export const Strategy: mongoose.Model<IStrategy>;
}

declare module '../models/Position' {
  export interface IPosition extends Document {
    user: Types.ObjectId;
    signal: Types.ObjectId;
    symbol: string;
    type: string;
    entryPrice: number;
    quantity: number;
    stopLoss: number;
    takeProfit: number;
    leverage: number;
    status: string;
    exchange: string;
    strategy: string;
    orderDetails?: Record<string, any>;
    currentPrice?: number;
    totalLoss?: number;
    closedAt?: Date;
    closingReason?: string;
  }

  export const Position: mongoose.Model<IPosition>;
}

declare module '../models/Notification' {
  export interface INotification extends Document {
    user: Types.ObjectId;
    type: NotificationType;
    title: string;
    content: string;
    channel: NotificationChannel[];
    data?: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export const Notification: mongoose.Model<INotification>;
} 