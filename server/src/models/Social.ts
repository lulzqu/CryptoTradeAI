import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRating extends Document {
  user: mongoose.Types.ObjectId;
  score: number;
  comment?: string;
  createdAt: Date;
}

export interface IStrategyShare extends Document {
  strategy: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  isPublic: boolean;
  performance: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    averageReturn: number;
  };
  comments: IComment[];
  ratings: IRating[];
  followers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const RatingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const StrategyShareSchema = new Schema({
  strategy: { type: Schema.Types.ObjectId, ref: 'TradingStrategy', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  performance: {
    totalTrades: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    profitFactor: { type: Number, default: 0 },
    averageReturn: { type: Number, default: 0 }
  },
  comments: [CommentSchema],
  ratings: [RatingSchema],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const StrategyShare = mongoose.model<IStrategyShare>('StrategyShare', StrategyShareSchema); 