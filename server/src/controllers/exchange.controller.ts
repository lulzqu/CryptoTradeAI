import { Request, Response } from 'express';
import { ExchangeService } from '../services/exchange.service';
import { NotFoundError, ValidationError } from '../utils/errors';

export class ExchangeController {
  private exchangeService: ExchangeService;

  constructor() {
    this.exchangeService = new ExchangeService();
  }

  async createExchange(req: Request, res: Response) {
    try {
      const exchange = await this.exchangeService.createExchange({
        ...req.body,
        user: req.user._id
      });
      res.status(201).json(exchange);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getExchange(req: Request, res: Response) {
    try {
      const exchange = await this.exchangeService.getExchangeById(req.params.id);
      res.json(exchange);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getExchanges(req: Request, res: Response) {
    try {
      const exchanges = await this.exchangeService.getExchangesByUser(req.user._id);
      res.json(exchanges);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateExchange(req: Request, res: Response) {
    try {
      const exchange = await this.exchangeService.updateExchange(req.params.id, req.body);
      res.json(exchange);
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

  async deleteExchange(req: Request, res: Response) {
    try {
      const result = await this.exchangeService.deleteExchange(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Exchange not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async syncExchange(req: Request, res: Response) {
    try {
      const exchange = await this.exchangeService.syncExchange(req.params.id);
      res.json(exchange);
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

  async testExchangeConnection(req: Request, res: Response) {
    try {
      const result = await this.exchangeService.testExchangeConnection(req.body);
      res.json({ success: result });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getExchangeBalance(req: Request, res: Response) {
    try {
      const balance = await this.exchangeService.getExchangeBalance(req.params.id);
      res.json(balance);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getExchangeOrders(req: Request, res: Response) {
    try {
      const orders = await this.exchangeService.getExchangeOrders(req.params.id);
      res.json(orders);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getExchangePositions(req: Request, res: Response) {
    try {
      const positions = await this.exchangeService.getExchangePositions(req.params.id);
      res.json(positions);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 