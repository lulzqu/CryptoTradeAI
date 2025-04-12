# CryptoTradeAI

CryptoTradeAI là một nền tảng giao dịch tiền điện tử với phân tích dựa trên AI, cung cấp các công cụ và tính năng tiên tiến cho các nhà giao dịch.

## 🚀 Tính năng chính

- **Phân tích AI**: Sử dụng machine learning để phân tích thị trường và dự đoán xu hướng
- **Giao dịch tự động**: Hỗ trợ giao dịch tự động với các chiến lược tùy chỉnh
- **Quản lý rủi ro**: Các công cụ quản lý rủi ro thông minh
- **Backtesting**: Kiểm tra chiến lược với dữ liệu lịch sử
- **Tín hiệu giao dịch**: Cảnh báo và tín hiệu giao dịch theo thời gian thực
- **Đa ngôn ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- **Giao diện responsive**: Tương thích với mọi thiết bị

## 🛠 Công nghệ sử dụng

### Frontend
- React.js với TypeScript
- Redux Toolkit cho quản lý state
- Material-UI cho giao diện
- WebSocket cho dữ liệu thời gian thực

### Backend
- Node.js với Express
- MongoDB cho cơ sở dữ liệu
- JWT cho xác thực
- WebSocket cho giao tiếp thời gian thực

### DevOps
- Docker và Docker Compose
- Nginx làm reverse proxy
- CI/CD với GitHub Actions

## 📦 Cài đặt

### Yêu cầu
- Node.js >= 18
- MongoDB >= 6.0
- Docker và Docker Compose

### Cài đặt với Docker
```bash
# Clone repository
git clone https://github.com/lulzqu/CryptoTradeAI.git
cd CryptoTradeAI

# Chạy với Docker Compose
docker-compose -f docker-compose.simple.yml up -d
```

### Cài đặt thủ công
```bash
# Cài đặt dependencies
cd client && npm install
cd ../server && npm install

# Chạy development server
cd client && npm start
cd ../server && npm run dev
```

## 🔧 Cấu hình

### Biến môi trường
Tạo file `.env` trong thư mục `server` và `client`:

```env
# Server
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cryptotradeai
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Client
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## 📚 Tài liệu

- [API Documentation](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

## 📄 Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE).

## 👥 Tác giả

- [Lulzqu](https://github.com/lulzqu)

## 🙏 Cảm ơn

Cảm ơn tất cả những người đã đóng góp cho dự án này! 