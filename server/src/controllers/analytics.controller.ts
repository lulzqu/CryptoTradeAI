import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { NotFoundError, ValidationError } from '../utils/errors';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  async getTradeAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate, symbol, strategyId } = req.query;
      const analytics = await this.analyticsService.getTradeAnalytics(
        req.user._id,
        startDate as string,
        endDate as string,
        symbol as string,
        strategyId as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getStrategyAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await this.analyticsService.getStrategyAnalytics(
        req.user._id,
        startDate as string,
        endDate as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPortfolioAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await this.analyticsService.getPortfolioAnalytics(
        req.user._id,
        startDate as string,
        endDate as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMarketAnalytics(req: Request, res: Response) {
    try {
      const { symbol, timeframe } = req.query;
      const analytics = await this.analyticsService.getMarketAnalytics(
        symbol as string,
        timeframe as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRiskAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await this.analyticsService.getRiskAnalytics(
        req.user._id,
        startDate as string,
        endDate as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await this.analyticsService.getUserAnalytics(
        req.user._id,
        startDate as string,
        endDate as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPerformanceMetrics(req: Request, res: Response) {
    try {
      const { startDate, endDate, type } = req.query;
      const metrics = await this.analyticsService.getPerformanceMetrics(
        req.user._id,
        startDate as string,
        endDate as string,
        type as string
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCorrelationAnalysis(req: Request, res: Response) {
    try {
      const { symbols, timeframe } = req.query;
      const analysis = await this.analyticsService.getCorrelationAnalysis(
        symbols as string[],
        timeframe as string
      );
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getVolatilityAnalysis(req: Request, res: Response) {
    try {
      const { symbol, timeframe } = req.query;
      const analysis = await this.analyticsService.getVolatilityAnalysis(
        symbol as string,
        timeframe as string
      );
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMarketSentiment(req: Request, res: Response) {
    try {
      const { symbol, timeframe } = req.query;
      const sentiment = await this.analyticsService.getMarketSentiment(
        symbol as string,
        timeframe as string
      );
      res.json(sentiment);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 