import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  apiKeys: {
    exchange: string;
    apiKey: string;
    secretKey: string;
  }[];
  securitySettings: {
    twoFactorAuth: boolean;
    emailNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  apiKeys: [{
    exchange: String,
    apiKey: String,
    secretKey: String
  }],
  securitySettings: {
    twoFactorAuth: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema); 