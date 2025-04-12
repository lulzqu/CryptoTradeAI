import { io, Socket } from 'socket.io-client';
import { Position, Signal, MarketData } from '../types/trading';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string) {
    if (this.socket) {
      return;
    }

    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinTradingRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('join', userId);
    }
  }

  leaveTradingRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('leave', userId);
    }
  }

  subscribeToMarket(symbol: string) {
    if (this.socket) {
      this.socket.emit('subscribe_market', symbol);
    }
  }

  unsubscribeFromMarket(symbol: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe_market', symbol);
    }
  }

  onPositionUpdate(callback: (position: Position) => void) {
    if (this.socket) {
      this.socket.on('position_update', callback);
    }
  }

  onSignalUpdate(callback: (signal: Signal) => void) {
    if (this.socket) {
      this.socket.on('signal_update', callback);
    }
  }

  onMarketUpdate(callback: (data: MarketData) => void) {
    if (this.socket) {
      this.socket.on('market_update', callback);
    }
  }

  offPositionUpdate(callback: (position: Position) => void) {
    if (this.socket) {
      this.socket.off('position_update', callback);
    }
  }

  offSignalUpdate(callback: (signal: Signal) => void) {
    if (this.socket) {
      this.socket.off('signal_update', callback);
    }
  }

  offMarketUpdate(callback: (data: MarketData) => void) {
    if (this.socket) {
      this.socket.off('market_update', callback);
    }
  }
}

export const socketService = SocketService.getInstance(); 