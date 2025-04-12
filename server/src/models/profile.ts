import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  avatar: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
    emailNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  bio: { type: String },
  avatar: { type: String },
  socialLinks: {
    twitter: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    github: { type: String }
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<IProfile>('Profile', ProfileSchema); 