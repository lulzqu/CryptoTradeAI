import { z } from 'zod';

// Enum cho các loại sàn giao dịch
export enum ExchangeType {
  MEXC = 'mexc',
  BINANCE = 'binance',
  KUCOIN = 'kucoin'
}

// Enum cho chiến lược giao dịch
export enum TradingStrategy {
  TREND_FOLLOWING = 'trend_following',
  MEAN_REVERSION = 'mean_reversion',
  BREAKOUT = 'breakout',
  SCALPING = 'scalping',
  SWING_TRADING = 'swing_trading',
  ARBITRAGE = 'arbitrage',
  AI_DRIVEN = 'ai_driven'
}

// Enum cho trạng thái giao dịch
export enum TradeStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

// Lược đồ xác thực cấu hình giao dịch tự động
export const AutoTradingConfigSchema = z.object({
  // Cài đặt chung
  enabled: z.boolean().default(false),
  exchange: z.nativeEnum(ExchangeType),
  
  // Cài đặt chiến lược
  strategy: z.nativeEnum(TradingStrategy),
  
  // Giới hạn rủi ro
  riskManagement: z.object({
    maxLossPerTrade: z.number().min(0).max(100).default(2),
    maxLossPerDay: z.number().min(0).max(100).default(5),
    takeProfit: z.number().min(0).max(100).default(10),
    stopLoss: z.number().min(0).max(100).default(5)
  }),
  
  // Cài đặt tín hiệu
  signalFilters: z.object({
    minConfidence: z.number().min(0).max(100).default(70),
    excludedSymbols: z.array(z.string()).optional(),
    includedSymbols: z.array(z.string()).optional()
  }),
  
  // Cài đặt giao dịch
  tradeSettings: z.object({
    maxConcurrentTrades: z.number().min(1).max(10).default(3),
    orderType: z.enum(['market', 'limit']).default('market'),
    leverage: z.number().min(1).max(100).default(1),
    fundAllocation: z.number().min(0).max(100).default(10)
  }),
  
  // Cảnh báo và thông báo
  notifications: z.object({
    email: z.boolean().default(true),
    telegram: z.boolean().default(false),
    telegramChatId: z.string().optional(),
    discordWebhook: z.string().optional()
  })
});

// Kiểu TypeScript cho cấu hình
export type AutoTradingConfig = z.infer<typeof AutoTradingConfigSchema>;

// Hàm xác thực cấu hình
export function validateAutoTradingConfig(
  config: Partial<AutoTradingConfig>
): AutoTradingConfig {
  try {
    return AutoTradingConfigSchema.parse(config);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error('Lỗi cấu hình giao dịch tự động:', error.errors);
      throw new Error('Cấu hình giao dịch tự động không hợp lệ');
    }
    throw error;
  }
}

// Cấu hình mặc định
export const DEFAULT_AUTO_TRADING_CONFIG: AutoTradingConfig = {
  enabled: false,
  exchange: ExchangeType.MEXC,
  strategy: TradingStrategy.TREND_FOLLOWING,
  riskManagement: {
    maxLossPerTrade: 2,
    maxLossPerDay: 5,
    takeProfit: 10,
    stopLoss: 5
  },
  signalFilters: {
    minConfidence: 70
  },
  tradeSettings: {
    maxConcurrentTrades: 3,
    orderType: 'market',
    leverage: 1,
    fundAllocation: 10
  },
  notifications: {
    email: true,
    telegram: false
  }
}; 