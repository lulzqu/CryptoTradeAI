import WebSocket from 'ws';
import { Server } from 'http';
import { config } from '../config';
import { MarketData, Trade, Order } from '../types/trading';
import { Signal } from '../types/analysis';

interface Client {
  ws: WebSocket;
  userId: string;
  subscriptions: {
    market: string[];
    trades: string[];
    orders: string[];
    signals: boolean;
  };
}

export class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocket.Server;
  private clients: Map<string, Client>;

  private constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();

    this.wss.on('connection', (ws: WebSocket, request) => {
      // TODO: Authenticate client
      const userId = 'anonymous'; // Get from JWT token

      const client: Client = {
        ws,
        userId,
        subscriptions: {
          market: [],
          trades: [],
          orders: [],
          signals: false
        }
      };

      this.clients.set(userId, client);

      ws.on('message', (message: string) => {
        this.handleMessage(client, message);
      });

      ws.on('close', () => {
        this.clients.delete(userId);
      });
    });
  }

  public static getInstance(server?: Server): WebSocketService {
    if (!WebSocketService.instance && server) {
      WebSocketService.instance = new WebSocketService(server);
    }
    return WebSocketService.instance;
  }

  private handleMessage(client: Client, message: string): void {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'subscribe':
          this.handleSubscribe(client, data);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(client, data);
          break;
        default:
          console.warn(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private handleSubscribe(client: Client, data: any): void {
    switch (data.channel) {
      case 'market':
        if (!client.subscriptions.market.includes(data.symbol)) {
          client.subscriptions.market.push(data.symbol);
        }
        break;
      case 'trades':
        if (!client.subscriptions.trades.includes(data.symbol)) {
          client.subscriptions.trades.push(data.symbol);
        }
        break;
      case 'orders':
        if (!client.subscriptions.orders.includes(data.symbol)) {
          client.subscriptions.orders.push(data.symbol);
        }
        break;
      case 'signals':
        client.subscriptions.signals = true;
        break;
    }
  }

  private handleUnsubscribe(client: Client, data: any): void {
    switch (data.channel) {
      case 'market':
        client.subscriptions.market = client.subscriptions.market.filter(
          symbol => symbol !== data.symbol
        );
        break;
      case 'trades':
        client.subscriptions.trades = client.subscriptions.trades.filter(
          symbol => symbol !== data.symbol
        );
        break;
      case 'orders':
        client.subscriptions.orders = client.subscriptions.orders.filter(
          symbol => symbol !== data.symbol
        );
        break;
      case 'signals':
        client.subscriptions.signals = false;
        break;
    }
  }

  public broadcastMarketData(symbol: string, data: MarketData): void {
    this.clients.forEach(client => {
      if (client.subscriptions.market.includes(symbol)) {
        client.ws.send(JSON.stringify({
          type: 'market',
          symbol,
          data
        }));
      }
    });
  }

  public broadcastTrade(symbol: string, trade: Trade): void {
    this.clients.forEach(client => {
      if (client.subscriptions.trades.includes(symbol)) {
        client.ws.send(JSON.stringify({
          type: 'trade',
          symbol,
          data: trade
        }));
      }
    });
  }

  public broadcastOrder(symbol: string, order: Order): void {
    this.clients.forEach(client => {
      if (client.subscriptions.orders.includes(symbol)) {
        client.ws.send(JSON.stringify({
          type: 'order',
          symbol,
          data: order
        }));
      }
    });
  }

  public broadcastSignal(signal: Signal): void {
    this.clients.forEach(client => {
      if (client.subscriptions.signals) {
        client.ws.send(JSON.stringify({
          type: 'signal',
          data: signal
        }));
      }
    });
  }

  public sendToUser(userId: string, type: string, data: any): void {
    const client = this.clients.get(userId);
    if (client) {
      client.ws.send(JSON.stringify({ type, data }));
    }
  }
} 