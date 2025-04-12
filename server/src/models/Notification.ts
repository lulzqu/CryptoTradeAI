import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType, NotificationChannel } from '../config/notification.config';

// Enum cho mức độ ưu tiên
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Interface cho Notification
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  content: string;
  channel: NotificationChannel[];
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Skema cho Notification
const NotificationSchema: Schema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  channel: [{
    type: String,
    enum: Object.values(NotificationChannel),
    default: [NotificationChannel.EMAIL]
  }],
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes để tối ưu truy vấn
NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

// Virtual để kiểm tra thời gian thông báo
NotificationSchema.virtual('isRecent').get(function(this: INotification) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return this.createdAt > oneWeekAgo;
});

// Phương thức để đánh dấu thông báo đã đọc
NotificationSchema.methods.markAsRead = function(this: INotification) {
  this.isRead = true;
  return this.save();
};

// Phương thức tĩnh để lấy thông báo chưa đọc
NotificationSchema.statics.getUnreadNotifications = function(userId: string) {
  return this.find({ 
    user: userId, 
    isRead: false 
  }).sort({ createdAt: -1 });
};

// Tạo model
const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification; 