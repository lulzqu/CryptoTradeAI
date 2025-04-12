import { z } from 'zod';

// Enum cho các loại thông báo
export enum NotificationType {
  SIGNAL = 'signal',
  TRADE = 'trade',
  SYSTEM = 'system',
  SECURITY = 'security',
  SOCIAL = 'social'
}

// Enum cho các kênh thông báo
export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  TELEGRAM = 'telegram',
  DISCORD = 'discord',
  PUSH = 'push'
}

// Lược đồ xác thực cấu hình thông báo
export const NotificationConfigSchema = z.object({
  // Cài đặt chung
  enabled: z.boolean().default(true),
  
  // Cài đặt kênh thông báo
  channels: z.object({
    email: z.object({
      enabled: z.boolean().default(true),
      fromEmail: z.string().email(),
      smtpConfig: z.object({
        host: z.string(),
        port: z.number().min(1).max(65535),
        secure: z.boolean().default(true),
        auth: z.object({
          user: z.string(),
          pass: z.string()
        })
      })
    }),
    telegram: z.object({
      enabled: z.boolean().default(false),
      botToken: z.string().optional(),
      defaultChatId: z.string().optional()
    }),
    discord: z.object({
      enabled: z.boolean().default(false),
      webhookUrl: z.string().url().optional()
    }),
    sms: z.object({
      enabled: z.boolean().default(false),
      provider: z.enum(['twilio', 'nexmo']).optional(),
      apiKey: z.string().optional(),
      apiSecret: z.string().optional()
    })
  }),
  
  // Cài đặt ưu tiên thông báo
  preferences: z.object({
    signal: z.object({
      minConfidence: z.number().min(0).max(100).default(70),
      enabledChannels: z.array(z.nativeEnum(NotificationChannel)).default([
        NotificationChannel.EMAIL
      ])
    }),
    trade: z.object({
      enabledChannels: z.array(z.nativeEnum(NotificationChannel)).default([
        NotificationChannel.EMAIL
      ]),
      notifyOnlySignificantTrades: z.boolean().default(true),
      significantTradeThreshold: z.number().min(0).max(100).default(5)
    }),
    system: z.object({
      enabledChannels: z.array(z.nativeEnum(NotificationChannel)).default([
        NotificationChannel.EMAIL
      ])
    }),
    security: z.object({
      enabledChannels: z.array(z.nativeEnum(NotificationChannel)).default([
        NotificationChannel.EMAIL, 
        NotificationChannel.SMS
      ]),
      notifyOnUnusualActivity: z.boolean().default(true)
    }),
    social: z.object({
      enabledChannels: z.array(z.nativeEnum(NotificationChannel)).default([
        NotificationChannel.EMAIL
      ])
    })
  }),
  
  // Cài đặt giới hạn thông báo
  limits: z.object({
    maxNotificationsPerDay: z.number().min(1).max(100).default(50),
    cooldownPeriod: z.number().min(0).max(24).default(1) // Giờ
  })
});

// Kiểu TypeScript cho cấu hình
export type NotificationConfig = z.infer<typeof NotificationConfigSchema>;

// Hàm xác thực cấu hình
export function validateNotificationConfig(
  config: Partial<NotificationConfig>
): NotificationConfig {
  try {
    return NotificationConfigSchema.parse(config);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error('Lỗi cấu hình thông báo:', error.errors);
      throw new Error('Cấu hình thông báo không hợp lệ');
    }
    throw error;
  }
}

// Cấu hình mặc định
export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: true,
  channels: {
    email: {
      enabled: true,
      fromEmail: 'notifications@cryptotradeai.com',
      smtpConfig: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: '',
          pass: ''
        }
      }
    },
    telegram: {
      enabled: false
    },
    discord: {
      enabled: false
    },
    sms: {
      enabled: false
    }
  },
  preferences: {
    signal: {
      minConfidence: 70,
      enabledChannels: [NotificationChannel.EMAIL]
    },
    trade: {
      enabledChannels: [NotificationChannel.EMAIL],
      notifyOnlySignificantTrades: true,
      significantTradeThreshold: 5
    },
    system: {
      enabledChannels: [NotificationChannel.EMAIL]
    },
    security: {
      enabledChannels: [
        NotificationChannel.EMAIL, 
        NotificationChannel.SMS
      ],
      notifyOnUnusualActivity: true
    },
    social: {
      enabledChannels: [NotificationChannel.EMAIL]
    }
  },
  limits: {
    maxNotificationsPerDay: 50,
    cooldownPeriod: 1
  }
}; 