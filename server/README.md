# CryptoTradeAI Server

Backend server for CryptoTradeAI application, built with Node.js, Express, and TypeScript.

## Features

- RESTful API endpoints
- WebSocket support for real-time data
- Authentication and authorization
- Market data integration with MEXC
- Technical analysis and pattern recognition
- Risk management
- Email notifications
- Logging and monitoring

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 4.4
- MEXC API credentials
- SMTP server for email notifications

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/cryptotradeai.git
cd cryptotradeai/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure the environment variables:
```env
# App
APP_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Database
MONGODB_URL=mongodb://localhost:27017/cryptotradeai

# MEXC API
MEXC_API_KEY=your-api-key
MEXC_API_SECRET=your-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@cryptotradeai.com

# WebSocket
WS_PORT=8080

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Monitoring
MONITORING_ENABLED=true
MONITORING_INTERVAL=60000

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

## Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Linting

Run ESLint:
```bash
npm run lint
```

Format code with Prettier:
```bash
npm run format
```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## License

MIT 