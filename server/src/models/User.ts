import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET, JWT_EXPIRE, BCRYPT_SALT_ROUNDS } from '../config';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  apiKeys: {
    exchange: string;
    apiKey: string;
    secretKey: string;
  }[];
  settings: {
    theme: string;
    notifications: boolean;
    emailAlerts: boolean;
    riskLevel: string;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    lastLogin: Date;
    loginAttempts: number;
    lockUntil: Date;
  };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên']
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Vui lòng nhập email hợp lệ'
      ]
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    apiKeys: [{
      exchange: {
        type: String,
        required: true
      },
      apiKey: {
        type: String,
        select: false
      },
      secretKey: {
        type: String,
        select: false
      }
    }],
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
      },
      notifications: {
        type: Boolean,
        default: true
      },
      emailAlerts: {
        type: Boolean,
        default: true
      },
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    },
    securitySettings: {
      twoFactorEnabled: {
        type: Boolean,
        default: false
      },
      lastLogin: {
        type: Date,
        default: Date.now
      },
      loginAttempts: {
        type: Number,
        default: 0
      },
      lockUntil: {
        type: Date
      }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User; 