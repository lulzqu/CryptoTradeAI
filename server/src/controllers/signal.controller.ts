import { Request, Response } from 'express';
import { SignalService } from '../services/signal.service';
import { NotFoundError, ValidationError } from '../utils/errors';

export class SignalController {
  private signalService: SignalService;

  constructor() {
    this.signalService = new SignalService();
  }

  async createSignal(req: Request, res: Response) {
    try {
      const signal = await this.signalService.createSignal({
        ...req.body,
        user: req.user._id
      });
      res.status(201).json(signal);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getSignal(req: Request, res: Response) {
    try {
      const signal = await this.signalService.getSignalById(req.params.id);
      res.json(signal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getSignals(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getSignalsByUser(req.user._id);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSignalsByStrategy(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getSignalsByStrategy(req.params.strategyId);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSignalsBySymbol(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getSignalsBySymbol(req.params.symbol);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSignal(req: Request, res: Response) {
    try {
      const signal = await this.signalService.updateSignal(req.params.id, req.body);
      res.json(signal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteSignal(req: Request, res: Response) {
    try {
      const result = await this.signalService.deleteSignal(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Signal not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async triggerSignal(req: Request, res: Response) {
    try {
      const signal = await this.signalService.triggerSignal(req.params.id);
      res.json(signal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async cancelSignal(req: Request, res: Response) {
    try {
      const signal = await this.signalService.cancelSignal(req.params.id);
      res.json(signal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async expireSignal(req: Request, res: Response) {
    try {
      const signal = await this.signalService.expireSignal(req.params.id);
      res.json(signal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getActiveSignals(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getActiveSignals(req.user._id);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTriggeredSignals(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getTriggeredSignals(req.user._id);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getExpiredSignals(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getExpiredSignals(req.user._id);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSignalsByTimeframe(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getSignalsByTimeframe(req.params.timeframe);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSignalsByType(req: Request, res: Response) {
    try {
      const signals = await this.signalService.getSignalsByType(req.params.type);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 