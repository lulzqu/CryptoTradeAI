db = db.getSiblingDB('cryptotradeai');

// Tạo collections
db.createCollection('users');
db.createCollection('trades');
db.createCollection('strategies');
db.createCollection('settings');

// Tạo index cho users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Tạo index cho trades
db.trades.createIndex({ userId: 1 });
db.trades.createIndex({ timestamp: 1 });

// Tạo index cho strategies
db.strategies.createIndex({ userId: 1 });
db.strategies.createIndex({ isActive: 1 });

// Tạo admin user
db.users.insertOne({
  username: 'admin',
  email: 'admin@cryptotradeai.com',
  password: '$2a$10$X7z3tYpGmZxKJQhV8nBwUe.8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
}); 