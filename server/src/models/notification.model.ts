import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface INotification extends Document {
  user: IUser['_id'];
  type: 'trade' | 'signal' | 'alert' | 'system' | 'risk';
  title: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: {
    tradeId?: string;
    signalId?: string;
    strategyId?: string;
    portfolioId?: string;
    [key: string]: any;
  };
  actions: Array<{
    label: string;
    url: string;
    method?: string;
    data?: Record<string, any>;
  }>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
}

const NotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['trade', 'signal', 'alert', 'system', 'risk'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  data: { type: Map, of: Schema.Types.Mixed },
  actions: [{
    label: { type: String, required: true },
    url: { type: String, required: true },
    method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'] },
    data: { type: Map, of: Schema.Types.Mixed }
  }],
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

// Indexes
NotificationSchema.index({ user: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, status: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Update timestamp on save
NotificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema); 