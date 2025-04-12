import { Server, Socket } from 'socket.io';
import { Position } from '../models/Position';
import { Signal } from '../models/Signal';
import { User } from '../models/User';
import { TradingService } from '../services/trading.service';

export class TradingSocket {
  private io: Server;
  private tradingService: TradingService;

  constructor(io: Server) {
    this.io = io;
    this.tradingService = new TradingService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected to trading socket');

      // Join user's room
      socket.on('join', async (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined trading room`);
      });

      // Leave user's room
      socket.on('leave', (userId: string) => {
        socket.leave(userId);
        console.log(`User ${userId} left trading room`);
      });

      // Handle new position
      socket.on('new_position', async (positionData: any) => {
        try {
          const position = await this.tradingService.createPosition(positionData);
          this.io.to(position.userId.toString()).emit('position_created', position);
        } catch (error) {
          socket.emit('error', { message: 'Failed to create position' });
        }
      });

      // Handle position update
      socket.on('update_position', async (positionData: any) => {
        try {
          const position = await this.tradingService.updatePosition(positionData);
          this.io.to(position.userId.toString()).emit('position_updated', position);
        } catch (error) {
          socket.emit('error', { message: 'Failed to update position' });
        }
      });

      // Handle position close
      socket.on('close_position', async (positionId: string) => {
        try {
          const position = await this.tradingService.closePosition(positionId);
          this.io.to(position.userId.toString()).emit('position_closed', position);
        } catch (error) {
          socket.emit('error', { message: 'Failed to close position' });
        }
      });

      // Handle new signal
      socket.on('new_signal', async (signalData: any) => {
        try {
          const signal = await this.tradingService.createSignal(signalData);
          this.io.to(signal.userId.toString()).emit('signal_created', signal);
        } catch (error) {
          socket.emit('error', { message: 'Failed to create signal' });
        }
      });

      // Handle market data updates
      socket.on('subscribe_market', (symbol: string) => {
        socket.join(`market_${symbol}`);
        console.log(`Client subscribed to market data for ${symbol}`);
      });

      socket.on('unsubscribe_market', (symbol: string) => {
        socket.leave(`market_${symbol}`);
        console.log(`Client unsubscribed from market data for ${symbol}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected from trading socket');
      });
    });
  }

  // Method to broadcast market data updates
  public broadcastMarketData(symbol: string, data: any) {
    this.io.to(`market_${symbol}`).emit('market_update', data);
  }

  // Method to broadcast position updates
  public broadcastPositionUpdate(userId: string, position: Position) {
    this.io.to(userId).emit('position_update', position);
  }

  // Method to broadcast signal updates
  public broadcastSignalUpdate(userId: string, signal: Signal) {
    this.io.to(userId).emit('signal_update', signal);
  }
} 