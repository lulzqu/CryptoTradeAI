import { Exchange, IExchange } from '../models/exchange.model';
import { User } from '../models/user.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { encrypt, decrypt } from '../utils/crypto';

export class ExchangeService {
  async createExchange(data: Partial<IExchange>): Promise<IExchange> {
    // Validate user exists
    const user = await User.findById(data.user);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Encrypt sensitive data
    const encryptedData = {
      ...data,
      apiKey: encrypt(data.apiKey),
      apiSecret: encrypt(data.apiSecret),
      apiPassphrase: data.apiPassphrase ? encrypt(data.apiPassphrase) : undefined
    };

    // Create exchange
    const exchange = new Exchange(encryptedData);
    return exchange.save();
  }

  async getExchangeById(id: string): Promise<IExchange> {
    const exchange = await Exchange.findById(id)
      .populate('user', 'username email')
      .exec();
    
    if (!exchange) {
      throw new NotFoundError('Exchange not found');
    }

    // Decrypt sensitive data
    return {
      ...exchange.toObject(),
      apiKey: decrypt(exchange.apiKey),
      apiSecret: decrypt(exchange.apiSecret),
      apiPassphrase: exchange.apiPassphrase ? decrypt(exchange.apiPassphrase) : undefined
    };
  }

  async getExchangesByUser(userId: string): Promise<IExchange[]> {
    const exchanges = await Exchange.find({ user: userId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .exec();

    // Decrypt sensitive data for each exchange
    return exchanges.map(exchange => ({
      ...exchange.toObject(),
      apiKey: decrypt(exchange.apiKey),
      apiSecret: decrypt(exchange.apiSecret),
      apiPassphrase: exchange.apiPassphrase ? decrypt(exchange.apiPassphrase) : undefined
    }));
  }

  async updateExchange(id: string, data: Partial<IExchange>): Promise<IExchange> {
    const exchange = await Exchange.findById(id);
    
    if (!exchange) {
      throw new NotFoundError('Exchange not found');
    }

    // Encrypt sensitive data if provided
    const encryptedData = {
      ...data,
      apiKey: data.apiKey ? encrypt(data.apiKey) : undefined,
      apiSecret: data.apiSecret ? encrypt(data.apiSecret) : undefined,
      apiPassphrase: data.apiPassphrase ? encrypt(data.apiPassphrase) : undefined
    };

    // Update fields
    Object.assign(exchange, encryptedData);
    const updatedExchange = await exchange.save();

    // Decrypt sensitive data before returning
    return {
      ...updatedExchange.toObject(),
      apiKey: decrypt(updatedExchange.apiKey),
      apiSecret: decrypt(updatedExchange.apiSecret),
      apiPassphrase: updatedExchange.apiPassphrase ? decrypt(updatedExchange.apiPassphrase) : undefined
    };
  }

  async deleteExchange(id: string): Promise<boolean> {
    const result = await Exchange.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async syncExchange(id: string): Promise<IExchange> {
    const exchange = await Exchange.findById(id);
    
    if (!exchange) {
      throw new NotFoundError('Exchange not found');
    }

    if (exchange.status === 'error') {
      throw new ValidationError('Exchange is in error state');
    }

    // TODO: Implement actual exchange sync logic
    // This should include:
    // 1. Fetch account balance
    // 2. Fetch open orders
    // 3. Fetch open positions
    // 4. Update exchange status

    exchange.lastSync = new Date();
    exchange.status = 'active';
    return exchange.save();
  }

  async testExchangeConnection(data: Partial<IExchange>): Promise<boolean> {
    // TODO: Implement exchange connection test
    // This should:
    // 1. Try to connect to exchange
    // 2. Fetch basic account info
    // 3. Return true if successful

    return true; // Placeholder
  }

  async getExchangeBalance(id: string): Promise<any> {
    const exchange = await Exchange.findById(id);
    
    if (!exchange) {
      throw new NotFoundError('Exchange not found');
    }

    // TODO: Implement actual balance fetching logic
    // This should return the current balance from the exchange

    return exchange.balance; // Placeholder
  }

  async getExchangeOrders(id: string): Promise<any[]> {
    const exchange = await Exchange.findById(id);
    
    if (!exchange) {
      throw new NotFoundError('Exchange not found');
    }

    // TODO: Implement actual order fetching logic
    // This should return all open orders from the exchange

    return []; // Placeholder
  }

  async getExchangePositions(id: string): Promise<any[]> {
    const exchange = await Exchange.findById(id);
    
    if (!exchange) {
      throw new NotFoundError('Exchange not found');
    }

    // TODO: Implement actual position fetching logic
    // This should return all open positions from the exchange

    return []; // Placeholder
  }
} 