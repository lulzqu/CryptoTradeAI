import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { authenticate } from '../middleware/authenticate';
import { SignalType, Sentiment, TimeFrame } from '../types';

// Lưu trữ kết nối của người dùng
interface UserConnection {
  socketId: string;
  userId: string;
  subscribedSymbols: string[];
  subscribedChannels: string[];
}

class WebSocketServer {
  private io: Server;
  private userConnections: Map<string, UserConnection> = new Map();
  private interval: NodeJS.Timeout | null = null;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupSocketHandlers();
    this.startDataSimulation();
  }

  /**
   * Khởi tạo các event handlers cho socket
   */
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      // Xử lý xác thực
      socket.on('authenticate', (token: string) => {
        this.authenticateUser(socket, token);
      });

      // Đăng ký theo dõi một mã coin
      socket.on('subscribe_symbol', (symbol: string) => {
        this.subscribeToSymbol(socket, symbol);
      });

      // Hủy đăng ký theo dõi một mã coin
      socket.on('unsubscribe_symbol', (symbol: string) => {
        this.unsubscribeFromSymbol(socket, symbol);
      });

      // Đăng ký theo dõi một kênh dữ liệu (market, signals, portfolio)
      socket.on('subscribe_channel', (channel: string) => {
        this.subscribeToChannel(socket, channel);
      });

      // Hủy đăng ký theo dõi một kênh dữ liệu
      socket.on('unsubscribe_channel', (channel: string) => {
        this.unsubscribeFromChannel(socket, channel);
      });

      // Xử lý disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  /**
   * Xác thực người dùng khi kết nối
   */
  private authenticateUser(socket: Socket, token: string): void {
    try {
      // Ở đây sẽ xác thực token JWT và lấy thông tin người dùng
      // Đây là mô phỏng, trong thực tế sẽ tích hợp với hệ thống xác thực hiện có
      const userId = 'user-' + Math.floor(Math.random() * 1000); // Giả lập userId

      // Lưu thông tin kết nối
      const userConnection: UserConnection = {
        socketId: socket.id,
        userId,
        subscribedSymbols: [],
        subscribedChannels: ['market'] // Mặc định đăng ký kênh market
      };

      this.userConnections.set(socket.id, userConnection);

      // Thông báo cho client biết đã xác thực thành công
      socket.emit('authenticated', { status: 'success', userId });
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    } catch (error) {
      socket.emit('authenticated', { status: 'error', message: 'Authentication failed' });
      console.error('Authentication error:', error);
    }
  }

  /**
   * Đăng ký theo dõi một mã coin
   */
  private subscribeToSymbol(socket: Socket, symbol: string): void {
    const connection = this.userConnections.get(socket.id);
    if (!connection) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    if (!connection.subscribedSymbols.includes(symbol)) {
      connection.subscribedSymbols.push(symbol);
      this.userConnections.set(socket.id, connection);
      socket.emit('symbol_subscribed', { symbol });
      console.log(`Socket ${socket.id} subscribed to symbol ${symbol}`);
    }
  }

  /**
   * Hủy đăng ký theo dõi một mã coin
   */
  private unsubscribeFromSymbol(socket: Socket, symbol: string): void {
    const connection = this.userConnections.get(socket.id);
    if (!connection) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    connection.subscribedSymbols = connection.subscribedSymbols.filter(s => s !== symbol);
    this.userConnections.set(socket.id, connection);
    socket.emit('symbol_unsubscribed', { symbol });
    console.log(`Socket ${socket.id} unsubscribed from symbol ${symbol}`);
  }

  /**
   * Đăng ký theo dõi một kênh dữ liệu
   */
  private subscribeToChannel(socket: Socket, channel: string): void {
    const connection = this.userConnections.get(socket.id);
    if (!connection) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    if (!connection.subscribedChannels.includes(channel)) {
      connection.subscribedChannels.push(channel);
      this.userConnections.set(socket.id, connection);
      socket.emit('channel_subscribed', { channel });
      console.log(`Socket ${socket.id} subscribed to channel ${channel}`);
    }
  }

  /**
   * Hủy đăng ký theo dõi một kênh dữ liệu
   */
  private unsubscribeFromChannel(socket: Socket, channel: string): void {
    const connection = this.userConnections.get(socket.id);
    if (!connection) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    connection.subscribedChannels = connection.subscribedChannels.filter(c => c !== channel);
    this.userConnections.set(socket.id, connection);
    socket.emit('channel_unsubscribed', { channel });
    console.log(`Socket ${socket.id} unsubscribed from channel ${channel}`);
  }

  /**
   * Xử lý khi client ngắt kết nối
   */
  private handleDisconnect(socket: Socket): void {
    this.userConnections.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  }

  /**
   * Bắt đầu mô phỏng dữ liệu thời gian thực
   */
  private startDataSimulation(): void {
    // Mô phỏng dữ liệu thị trường mỗi 2 giây
    this.interval = setInterval(() => {
      this.broadcastMarketData();
      this.broadcastSignals();
    }, 2000);
  }

  /**
   * Phát tín hiệu dữ liệu thị trường
   */
  private broadcastMarketData(): void {
    // Danh sách các mã coin phổ biến
    const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT'];

    // Tạo dữ liệu ngẫu nhiên cho mỗi mã
    const marketData = symbols.map(symbol => {
      const basePrice = this.getBasePrice(symbol);
      const change = (Math.random() * 2 - 1) * basePrice * 0.01; // -1% đến +1%
      
      return {
        symbol,
        price: basePrice + change,
        change24h: (Math.random() * 10 - 5).toFixed(2), // -5% đến +5%
        volume24h: Math.random() * 1000000000,
        timestamp: new Date().toISOString()
      };
    });

    // Phát dữ liệu cho từng người dùng theo các mã họ đã đăng ký
    this.userConnections.forEach((connection, socketId) => {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket && connection.subscribedChannels.includes('market')) {
        // Nếu người dùng đã đăng ký các mã cụ thể, chỉ gửi những mã đó
        const filteredData = connection.subscribedSymbols.length > 0
          ? marketData.filter(data => connection.subscribedSymbols.includes(data.symbol))
          : marketData;
        
        if (filteredData.length > 0) {
          socket.emit('market_data', filteredData);
        }
      }
    });
  }

  /**
   * Phát tín hiệu giao dịch
   */
  private broadcastSignals(): void {
    // Chỉ phát tín hiệu ngẫu nhiên khoảng 10% thời gian
    if (Math.random() < 0.1) {
      const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'];
      const signalTypes = Object.values(SignalType);
      const timeframes = Object.values(TimeFrame);
      
      const signal = {
        id: `signal-${Date.now()}`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        type: signalTypes[Math.floor(Math.random() * signalTypes.length)],
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        price: this.getBasePrice(symbols[Math.floor(Math.random() * symbols.length)]),
        sentiment: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        timestamp: new Date().toISOString()
      };

      // Phát tín hiệu cho người dùng đã đăng ký kênh signals
      this.userConnections.forEach((connection, socketId) => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket && connection.subscribedChannels.includes('signals')) {
          // Nếu người dùng đã đăng ký các mã cụ thể, chỉ gửi tín hiệu của những mã đó
          if (connection.subscribedSymbols.length === 0 || 
              connection.subscribedSymbols.includes(signal.symbol)) {
            socket.emit('trading_signal', signal);
          }
        }
      });
    }
  }

  /**
   * Lấy giá cơ bản cho mỗi mã
   */
  private getBasePrice(symbol: string): number {
    switch (symbol) {
      case 'BTC/USDT':
        return 60000 + Math.random() * 5000;
      case 'ETH/USDT':
        return 3000 + Math.random() * 500;
      case 'SOL/USDT':
        return 100 + Math.random() * 50;
      case 'BNB/USDT':
        return 400 + Math.random() * 100;
      case 'XRP/USDT':
        return 0.5 + Math.random() * 0.2;
      case 'ADA/USDT':
        return 0.3 + Math.random() * 0.1;
      case 'DOGE/USDT':
        return 0.08 + Math.random() * 0.03;
      default:
        return 10 + Math.random() * 5;
    }
  }

  /**
   * Dừng server WebSocket
   */
  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    this.io.disconnectSockets(true);
    console.log('WebSocket server stopped');
  }
}

export default WebSocketServer; 