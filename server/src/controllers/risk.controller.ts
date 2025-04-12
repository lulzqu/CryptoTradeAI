import { Request, Response } from 'express';
import { RiskService } from '../services/risk.service';
import { NotFoundError, ValidationError } from '../utils/errors';

export class RiskController {
  private riskService: RiskService;

  constructor() {
    this.riskService = new RiskService();
  }

  async checkTradeRisk(req: Request, res: Response) {
    try {
      const risk = await this.riskService.checkTradeRisk(req.body);
      res.json(risk);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async checkPortfolioRisk(req: Request, res: Response) {
    try {
      const risk = await this.riskService.checkPortfolioRisk(req.params.portfolioId);
      res.json(risk);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async checkStrategyRisk(req: Request, res: Response) {
    try {
      const risk = await this.riskService.checkStrategyRisk(req.params.strategyId);
      res.json(risk);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getRiskMetrics(req: Request, res: Response) {
    try {
      const metrics = await this.riskService.getRiskMetrics(req.user._id);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateRiskSettings(req: Request, res: Response) {
    try {
      const settings = await this.riskService.updateRiskSettings(req.user._id, req.body);
      res.json(settings);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getRiskAlerts(req: Request, res: Response) {
    try {
      const alerts = await this.riskService.getRiskAlerts(req.user._id);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRiskHistory(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const history = await this.riskService.getRiskHistory(
        req.user._id,
        startDate as string,
        endDate as string
      );
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRiskSummary(req: Request, res: Response) {
    try {
      const summary = await this.riskService.getRiskSummary(req.user._id);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRiskExposure(req: Request, res: Response) {
    try {
      const exposure = await this.riskService.getRiskExposure(req.user._id);
      res.json(exposure);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRiskLimits(req: Request, res: Response) {
    try {
      const limits = await this.riskService.getRiskLimits(req.user._id);
      res.json(limits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 