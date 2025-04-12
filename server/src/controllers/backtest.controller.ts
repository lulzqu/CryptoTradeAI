import { Request, Response, NextFunction } from 'express';
import { BacktestService } from '../services/backtest.service';
import { IBacktest } from '../models/backtest.model';
import { IUser } from '../models/user.model';

export class BacktestController {
  private backtestService: BacktestService;

  constructor() {
    this.backtestService = new BacktestService();
  }

  async createBacktest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backtest = await this.backtestService.createBacktest(req.body);
      res.status(201).json(backtest);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error('An unknown error occurred'));
      }
    }
  }

  async getBacktest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backtest = await this.backtestService.getBacktestById(req.params.id);
      if (!backtest) {
        res.status(404).json({ message: 'Backtest not found' });
        return;
      }
      res.json(backtest);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error('An unknown error occurred'));
      }
    }
  }

  async getBacktestsByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backtests = await this.backtestService.getBacktestsByUser(req.params.userId);
      res.json(backtests);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error('An unknown error occurred'));
      }
    }
  }

  async getBacktestsByStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backtests = await this.backtestService.getBacktestsByStrategy(req.params.strategyId);
      res.json(backtests);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error('An unknown error occurred'));
      }
    }
  }

  async deleteBacktest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await this.backtestService.deleteBacktest(req.params.id);
      if (!success) {
        res.status(404).json({ message: 'Backtest not found' });
        return;
      }
      res.json({ message: 'Backtest deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error('An unknown error occurred'));
      }
    }
  }

  async runBacktest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const { strategyId, symbol, timeframe, startDate, endDate, initialBalance } = req.body;

      const backtest = await this.backtestService.runBacktest(
        strategyId,
        symbol,
        timeframe,
        startDate,
        endDate,
        initialBalance,
        req.user._id
      );
      
      res.status(201).json(backtest);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error('An unknown error occurred'));
      }
    }
  }
} 