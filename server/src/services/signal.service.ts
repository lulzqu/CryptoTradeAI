import { Signal, ISignal } from '../models/signal.model';
import { User } from '../models/user.model';
import { Strategy } from '../models/strategy.model';
import { NotFoundError, ValidationError } from '../utils/errors';

export class SignalService {
  async createSignal(data: Partial<ISignal>): Promise<ISignal> {
    // Validate user exists
    const user = await User.findById(data.user);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Validate strategy exists
    if (data.strategy) {
      const strategy = await Strategy.findById(data.strategy);
      if (!strategy) {
        throw new NotFoundError('Strategy not found');
      }
    }

    // Create signal
    const signal = new Signal(data);
    return signal.save();
  }

  async getSignalById(id: string): Promise<ISignal> {
    const signal = await Signal.findById(id)
      .populate('user', 'username email')
      .populate('strategy', 'name type')
      .exec();
    
    if (!signal) {
      throw new NotFoundError('Signal not found');
    }

    return signal;
  }

  async getSignalsByUser(userId: string): Promise<ISignal[]> {
    return Signal.find({ user: userId })
      .populate('user', 'username email')
      .populate('strategy', 'name type')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSignalsByStrategy(strategyId: string): Promise<ISignal[]> {
    return Signal.find({ strategy: strategyId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSignalsBySymbol(symbol: string): Promise<ISignal[]> {
    return Signal.find({ symbol })
      .populate('user', 'username email')
      .populate('strategy', 'name type')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateSignal(id: string, data: Partial<ISignal>): Promise<ISignal> {
    const signal = await Signal.findById(id);
    
    if (!signal) {
      throw new NotFoundError('Signal not found');
    }

    // Update fields
    Object.assign(signal, data);
    return signal.save();
  }

  async deleteSignal(id: string): Promise<boolean> {
    const result = await Signal.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async triggerSignal(id: string): Promise<ISignal> {
    const signal = await Signal.findById(id);
    
    if (!signal) {
      throw new NotFoundError('Signal not found');
    }

    if (signal.status !== 'active') {
      throw new ValidationError('Signal is not active');
    }

    signal.status = 'triggered';
    signal.triggeredAt = new Date();
    return signal.save();
  }

  async cancelSignal(id: string): Promise<ISignal> {
    const signal = await Signal.findById(id);
    
    if (!signal) {
      throw new NotFoundError('Signal not found');
    }

    if (signal.status !== 'active') {
      throw new ValidationError('Signal is not active');
    }

    signal.status = 'cancelled';
    return signal.save();
  }

  async expireSignal(id: string): Promise<ISignal> {
    const signal = await Signal.findById(id);
    
    if (!signal) {
      throw new NotFoundError('Signal not found');
    }

    if (signal.status !== 'active') {
      throw new ValidationError('Signal is not active');
    }

    signal.status = 'expired';
    signal.expiredAt = new Date();
    return signal.save();
  }

  async getActiveSignals(userId: string): Promise<ISignal[]> {
    return Signal.find({ 
      user: userId,
      status: 'active'
    })
      .populate('strategy', 'name type')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTriggeredSignals(userId: string): Promise<ISignal[]> {
    return Signal.find({ 
      user: userId,
      status: 'triggered'
    })
      .populate('strategy', 'name type')
      .sort({ triggeredAt: -1 })
      .exec();
  }

  async getExpiredSignals(userId: string): Promise<ISignal[]> {
    return Signal.find({ 
      user: userId,
      status: 'expired'
    })
      .populate('strategy', 'name type')
      .sort({ expiredAt: -1 })
      .exec();
  }

  async getSignalsByTimeframe(timeframe: string): Promise<ISignal[]> {
    return Signal.find({ timeframe })
      .populate('user', 'username email')
      .populate('strategy', 'name type')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSignalsByType(type: 'buy' | 'sell' | 'alert'): Promise<ISignal[]> {
    return Signal.find({ type })
      .populate('user', 'username email')
      .populate('strategy', 'name type')
      .sort({ createdAt: -1 })
      .exec();
  }
} 