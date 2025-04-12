import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IAlert extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  type: 'price' | 'indicator' | 'risk' | 'system' | 'custom';
  symbol: string;
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals' | 'custom';
  value: number;
  indicator?: string;
  indicatorParams?: Record<string, any>;
  status: 'active' | 'triggered' | 'disabled' | 'expired';
  frequency: 'once' | 'always';
  triggerCount: number;
  lastTriggered?: Date;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notificationChannels: ('app' | 'email' | 'sms' | 'webhook')[];
  webhookUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

const AlertSchema: Schema = new Schema<IAlert>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['price', 'indicator', 'risk', 'system', 'custom'],
      required: true,
      index: true
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true
    },
    condition: {
      type: String,
      enum: ['above', 'below', 'crosses_above', 'crosses_below', 'equals', 'custom'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    indicator: {
      type: String,
      trim: true
    },
    indicatorParams: {
      type: Schema.Types.Mixed
    },
    status: {
      type: String,
      enum: ['active', 'triggered', 'disabled', 'expired'],
      default: 'active',
      index: true
    },
    frequency: {
      type: String,
      enum: ['once', 'always'],
      default: 'once'
    },
    triggerCount: {
      type: Number,
      default: 0
    },
    lastTriggered: {
      type: Date
    },
    message: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    notificationChannels: {
      type: [String],
      enum: ['app', 'email', 'sms', 'webhook'],
      default: ['app']
    },
    webhookUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\//.test(v);
        },
        message: 'Webhook URL phải là một URL hợp lệ'
      }
    },
    expiresAt: {
      type: Date
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

// Thêm index cho các trường tìm kiếm phổ biến
AlertSchema.index({ user: 1, type: 1 });
AlertSchema.index({ user: 1, status: 1 });
AlertSchema.index({ symbol: 1, status: 1 });
AlertSchema.index({ expiresAt: 1 }, { sparse: true });

// Phương thức tĩnh để tìm các alert đang hoạt động
AlertSchema.statics.findActiveAlerts = function() {
  return this.find({
    status: 'active',
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Phương thức instance để kích hoạt alert
AlertSchema.methods.trigger = function() {
  this.triggerCount += 1;
  this.lastTriggered = new Date();
  
  // Nếu alert chỉ chạy 1 lần, đánh dấu là đã kích hoạt
  if (this.frequency === 'once') {
    this.status = 'triggered';
  }
  
  return this.save();
};

const Alert = mongoose.model<IAlert>('Alert', AlertSchema);

export default Alert; 