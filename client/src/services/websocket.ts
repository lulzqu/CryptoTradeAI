// WebSocket Service cho dữ liệu thị trường thời gian thực
import { io, Socket } from 'socket.io-client';
import { Signal } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private callbacks: Map<string, Function[]> = new Map();

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToSignals(callback: (data: any) => void) {
    if (!this.socket) {
      this.connect();
    }

    this.socket?.on('newSignal', callback);
  }

  unsubscribeFromSignals(callback: (data: any) => void) {
    this.socket?.off('newSignal', callback);
  }

  subscribeToMarketData(symbol: string, callback: (data: any) => void) {
    if (!this.socket) {
      this.connect();
    }

    this.socket?.emit('subscribeMarket', { symbol });
    this.socket?.on(`market:${symbol}`, callback);
  }

  unsubscribeFromMarketData(symbol: string, callback: (data: any) => void) {
    this.socket?.emit('unsubscribeMarket', { symbol });
    this.socket?.off(`market:${symbol}`, callback);
  }

  subscribeToPortfolio(callback: (data: any) => void) {
    if (!this.socket) {
      this.connect();
    }

    this.socket?.on('portfolioUpdate', callback);
  }

  unsubscribeFromPortfolio(callback: (data: any) => void) {
    this.socket?.off('portfolioUpdate', callback);
  }
}

export const websocketService = new WebSocketService(); 