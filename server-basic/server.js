const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://184.73.5.19',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server đang hoạt động bình thường', version: '1.0.0' });
});

// Bảo vệ API bằng token đơn giản
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Trong môi trường dev/demo, cho phép truy cập không cần token
  next();
};

// API routes cần xác thực
app.get('/api/v1/user', authMiddleware, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      id: '1',
      name: 'Người dùng mẫu',
      email: 'user@example.com',
      role: 'user'
    }
  });
});

// Tạo một số điểm cuối API mẫu để tiến hành demo
app.get('/api/v1/markets', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [
      { id: 'btc-usdt', name: 'BTC/USDT', price: 64982.51, change: 2.35 },
      { id: 'eth-usdt', name: 'ETH/USDT', price: 3095.67, change: 1.89 },
      { id: 'bnb-usdt', name: 'BNB/USDT', price: 555.23, change: -0.75 },
      { id: 'sol-usdt', name: 'SOL/USDT', price: 138.92, change: 4.21 },
      { id: 'xrp-usdt', name: 'XRP/USDT', price: 0.5041, change: -1.32 }
    ]
  });
});

// Thêm endpoint để test WebSocket (giả lập)
app.get('/api/v1/websocket', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'WebSocket endpoint đang hoạt động'
  });
});

// Demo trading data
app.get('/api/v1/trading/history', authMiddleware, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [
      { id: '1', pair: 'BTC/USDT', type: 'buy', amount: 0.05, price: 63500, date: '2025-04-08T12:00:00Z', status: 'completed' },
      { id: '2', pair: 'ETH/USDT', type: 'sell', amount: 1.2, price: 3100, date: '2025-04-07T14:30:00Z', status: 'completed' },
      { id: '3', pair: 'SOL/USDT', type: 'buy', amount: 10, price: 135, date: '2025-04-06T09:15:00Z', status: 'completed' }
    ]
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
}); 