import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { Sentiment, SignalType } from '../types';
import { TechnicalAnalysisService } from '../services/technicalAnalysis.service';
import { PatternRecognitionService } from '../services/patternRecognition';
import { Signal } from '../models/Signal';
import { Strategy } from '../models/Strategy';
import { Backtest } from '../models/Backtest';
import { AppError } from '../middleware/errorHandler';
import { IUser } from '../models/User';
import { Indicator } from '../models/Indicator';
import { Pattern } from '../models/Pattern';
import { validationResult, body, param, query } from 'express-validator';

/**
 * @desc    Lấy phân tích kỹ thuật cho một mã coin cụ thể
 * @route   GET /api/analysis/coin/:symbol
 * @access  Public
 */
export const getCoinAnalysis = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  const { timeframe = '1h' } = req.query;
  
  try {
    // Mock data cho MVP - sẽ được thay thế bằng phân tích thực tế
    const analysis = {
      symbol: symbol.toUpperCase(),
      timeframe,
      timestamp: new Date().toISOString(),
      indicators: {
        rsi: {
          value: Math.random() * 100,
          interpretation: Math.random() > 0.5 ? 'Oversold' : 'Overbought',
          signal: Math.random() > 0.6 ? 'Buy' : 'Sell'
        },
        macd: {
          value: Math.random() * 100 - 50,
          signal: Math.random() * 100 - 50,
          histogram: Math.random() * 20 - 10,
          interpretation: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
          signal: Math.random() > 0.6 ? 'Buy' : 'Sell'
        },
        bb: {
          upper: Math.random() * 1000 + 500,
          middle: Math.random() * 1000,
          lower: Math.random() * 500,
          width: Math.random() * 5,
          interpretation: Math.random() > 0.5 ? 'Expanding' : 'Contracting',
          signal: Math.random() > 0.6 ? 'Buy' : 'Sell'
        },
        ema: {
          ema9: Math.random() * 1000,
          ema20: Math.random() * 1000,
          ema50: Math.random() * 1000,
          ema200: Math.random() * 1000,
          interpretation: Math.random() > 0.5 ? 'Uptrend' : 'Downtrend',
          signal: Math.random() > 0.6 ? 'Buy' : 'Sell'
        }
      },
      patterns: {
        identified: Math.random() > 0.7,
        type: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
        name: ['Double Bottom', 'Head and Shoulders', 'Cup and Handle', 'Triangle', 'Flag'][Math.floor(Math.random() * 5)],
        confidence: Math.random() * 100
      },
      support_resistance: {
        supports: [Math.random() * 900, Math.random() * 800, Math.random() * 700],
        resistances: [Math.random() * 1100, Math.random() * 1200, Math.random() * 1300]
      },
      summary: {
        sentiment: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
        strength: Math.floor(Math.random() * 10) + 1,
        recommendation: Math.random() > 0.6 ? 'Strong Buy' : Math.random() > 0.3 ? 'Buy' : 'Sell'
      }
    };
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    return next(new ErrorResponse(`Không thể lấy phân tích cho ${symbol}`, 500));
  }
});

/**
 * @desc    Lấy tổng quan thị trường
 * @route   GET /api/analysis/market-overview
 * @access  Public
 */
export const getMarketOverview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock data cho MVP - sẽ được thay thế bằng phân tích thực tế
    const marketAnalysis = {
      timestamp: new Date().toISOString(),
      btcDominance: {
        value: 40 + Math.random() * 20,
        change24h: Math.random() * 2 - 1
      },
      globalMarketCap: {
        value: 1 + Math.random() * 2,
        change24h: Math.random() * 10 - 5
      },
      sentiment: {
        overall: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
        fearGreedIndex: Math.floor(Math.random() * 100)
      },
      topMovers: {
        gainers: [
          { symbol: 'SOL/USDT', change24h: 15 + Math.random() * 10 },
          { symbol: 'AVAX/USDT', change24h: 10 + Math.random() * 10 },
          { symbol: 'ARB/USDT', change24h: 5 + Math.random() * 10 }
        ],
        losers: [
          { symbol: 'DOGE/USDT', change24h: -(5 + Math.random() * 10) },
          { symbol: 'LTC/USDT', change24h: -(3 + Math.random() * 10) },
          { symbol: 'XRP/USDT', change24h: -(1 + Math.random() * 10) }
        ]
      },
      sectorPerformance: [
        { name: 'DeFi', change24h: Math.random() * 20 - 10 },
        { name: 'Layer 1', change24h: Math.random() * 20 - 10 },
        { name: 'Layer 2', change24h: Math.random() * 20 - 10 },
        { name: 'Meme', change24h: Math.random() * 20 - 10 },
        { name: 'AI', change24h: Math.random() * 20 - 10 }
      ],
      marketCycles: {
        btc: Math.random() > 0.5 ? 'Accumulation' : Math.random() > 0.5 ? 'Bull' : 'Bear',
        alts: Math.random() > 0.5 ? 'Accumulation' : Math.random() > 0.5 ? 'Bull' : 'Bear'
      }
    };
    
    res.status(200).json({
      success: true,
      data: marketAnalysis
    });
  } catch (error) {
    return next(new ErrorResponse('Không thể lấy tổng quan thị trường', 500));
  }
});

/**
 * @desc    Lấy các dự báo AI cho một mã coin cụ thể
 * @route   GET /api/analysis/ai-predictions/:symbol
 * @access  Private
 */
export const getAIPredictions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  const { timeframe = '1d' } = req.query;
  
  try {
    // Mock data cho MVP - sẽ được thay thế bằng phân tích AI thực tế
    const aiPredictions = {
      symbol: symbol.toUpperCase(),
      timeframe,
      timestamp: new Date().toISOString(),
      pricePredictions: {
        '24h': {
          min: Math.random() * 900,
          max: Math.random() * 1100 + 1000,
          most_likely: Math.random() * 1000 + 500,
          confidence: Math.random() * 40 + 60
        },
        '7d': {
          min: Math.random() * 800,
          max: Math.random() * 1200 + 1000,
          most_likely: Math.random() * 1000 + 500,
          confidence: Math.random() * 30 + 50
        },
        '30d': {
          min: Math.random() * 700,
          max: Math.random() * 1300 + 1000,
          most_likely: Math.random() * 1000 + 500,
          confidence: Math.random() * 20 + 40
        }
      },
      sentiment: {
        value: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
        strength: Math.floor(Math.random() * 10) + 1,
        sources: {
          social_media: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
          news: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
          on_chain: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH
        }
      },
      pattern_recognition: {
        current_pattern: ['Double Bottom', 'Head and Shoulders', 'Cup and Handle', 'Triangle', 'Flag'][Math.floor(Math.random() * 5)],
        confidence: Math.random() * 100,
        projected_outcome: Math.random() > 0.6 ? 'Bullish Breakout' : 'Bearish Breakdown',
        historical_success_rate: Math.random() * 100
      },
      volatility_prediction: {
        expected_volatility: Math.random() * 20,
        compared_to_avg: Math.random() > 0.5 ? 'Higher' : 'Lower'
      },
      model_metrics: {
        accuracy: Math.random() * 40 + 60,
        recall: Math.random() * 40 + 60,
        precision: Math.random() * 40 + 60,
        f1_score: Math.random() * 40 + 60
      }
    };
    
    res.status(200).json({
      success: true,
      data: aiPredictions
    });
  } catch (error) {
    return next(new ErrorResponse(`Không thể lấy dự báo AI cho ${symbol}`, 500));
  }
});

/**
 * @desc    Lấy các tín hiệu giao dịch
 * @route   GET /api/analysis/signals
 * @access  Private
 */
export const getTradingSignals = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { limit = 10 } = req.query;
  
  try {
    // Mock data cho MVP - sẽ được thay thế bằng phân tích thực tế
    const signals = [];
    const signalTypes = Object.values(SignalType);
    const timeframes = ['15m', '1h', '4h', '1d'];
    
    for (let i = 0; i < Number(limit); i++) {
      signals.push({
        id: `signal-${i + 1}`,
        symbol: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'][Math.floor(Math.random() * 5)],
        type: signalTypes[Math.floor(Math.random() * signalTypes.length)],
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        entryPrice: Math.random() * 10000,
        stopLoss: Math.random() * 9000,
        takeProfits: [
          Math.random() * 11000,
          Math.random() * 12000,
          Math.random() * 13000
        ],
        riskRewardRatio: (1 + Math.random() * 2).toFixed(1) + ':1',
        confidence: Math.random() * 100,
        sentiment: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      count: signals.length,
      data: signals
    });
  } catch (error) {
    return next(new ErrorResponse('Không thể lấy tín hiệu giao dịch', 500));
  }
});

/**
 * @desc    Lấy thiết lập giao dịch đề xuất cho một mã coin
 * @route   GET /api/analysis/trade-setup/:symbol
 * @access  Private
 */
export const getTradeSetup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  
  try {
    // Mock data cho MVP - sẽ được thay thế bằng phân tích thực tế
    const tradeSetup = {
      symbol: symbol.toUpperCase(),
      timestamp: new Date().toISOString(),
      setup: {
        type: Math.random() > 0.5 ? 'LONG' : 'SHORT',
        sentiment: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
        pattern: ['Breakout', 'Reversal', 'Trend Continuation', 'Range Play'][Math.floor(Math.random() * 4)],
        timeframe: ['1h', '4h', '1d'][Math.floor(Math.random() * 3)]
      },
      entry: {
        price: Math.random() * 10000,
        zone: {
          min: Math.random() * 9500,
          max: Math.random() * 10500 + 9500
        },
        rationale: 'Dựa trên mức hỗ trợ/kháng cự và phân kỳ RSI'
      },
      stopLoss: {
        price: Math.random() * 9000,
        percentage: Math.random() * 5 + 2,
        rationale: 'Dưới mức hỗ trợ quan trọng gần nhất'
      },
      takeProfits: [
        {
          level: 1,
          price: Math.random() * 11000,
          percentage: Math.random() * 10 + 5,
          rationale: 'Kháng cự cấp 1'
        },
        {
          level: 2,
          price: Math.random() * 12000 + 11000,
          percentage: Math.random() * 15 + 10,
          rationale: 'Kháng cự cấp 2'
        },
        {
          level: 3,
          price: Math.random() * 13000 + 12000,
          percentage: Math.random() * 20 + 15,
          rationale: 'Kháng cự cấp 3'
        }
      ],
      metrics: {
        riskRewardRatio: (1 + Math.random() * 3).toFixed(1) + ':1',
        winProbability: Math.random() * 40 + 60,
        expectedValue: Math.random() * 40 + 10
      },
      position: {
        recommendedSize: Math.random() * 5 + 1,
        maxLeverage: Math.floor(Math.random() * 10) + 1,
        maxRiskPercentage: Math.random() * 2 + 0.5
      },
      additional: {
        keyLevels: {
          supports: [Math.random() * 9000, Math.random() * 8000, Math.random() * 7000],
          resistances: [Math.random() * 11000, Math.random() * 12000, Math.random() * 13000]
        },
        marketConditions: Math.random() > 0.5 ? 'Trending' : 'Ranging',
        notes: 'Theo dõi khối lượng giao dịch khi tiếp cận vùng giá entry'
      }
    };
    
    res.status(200).json({
      success: true,
      data: tradeSetup
    });
  } catch (error) {
    return next(new ErrorResponse(`Không thể lấy thiết lập giao dịch cho ${symbol}`, 500));
  }
});

/**
 * @desc    Tạo phân tích tùy chỉnh
 * @route   POST /api/analysis/custom
 * @access  Private
 */
export const createCustomAnalysis = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol, indicators, timeframe, additionalParameters } = req.body;
  
  if (!symbol) {
    return next(new ErrorResponse('Vui lòng cung cấp mã giao dịch (symbol)', 400));
  }
  
  try {
    // Mock data cho MVP - sẽ được thay thế bằng phân tích thực tế
    const customAnalysis = {
      symbol: symbol.toUpperCase(),
      timeframe: timeframe || '1d',
      timestamp: new Date().toISOString(),
      requested_by: req.user.id,
      indicators: indicators || ['RSI', 'MACD', 'Bollinger Bands'],
      results: {
        summary: {
          sentiment: Math.random() > 0.5 ? Sentiment.BULLISH : Sentiment.BEARISH,
          strength: Math.floor(Math.random() * 10) + 1,
          recommendation: Math.random() > 0.6 ? 'Strong Buy' : Math.random() > 0.3 ? 'Buy' : 'Sell'
        },
        details: {
          price_action: {
            trend: Math.random() > 0.5 ? 'Uptrend' : 'Downtrend',
            momentum: Math.random() > 0.5 ? 'Strong' : 'Weak',
            volatility: Math.random() > 0.5 ? 'High' : 'Low'
          },
          patterns: {
            identified: Math.random() > 0.7,
            type: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
            name: ['Double Bottom', 'Head and Shoulders', 'Cup and Handle', 'Triangle', 'Flag'][Math.floor(Math.random() * 5)],
            confidence: Math.random() * 100
          }
        }
      }
    };
    
    res.status(200).json({
      success: true,
      data: customAnalysis
    });
  } catch (error) {
    return next(new ErrorResponse('Không thể tạo phân tích tùy chỉnh', 500));
  }
});

// Dịch vụ phân tích kỹ thuật
const technicalAnalysisService = new TechnicalAnalysisService();

// Middleware validation chung
const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

// Validation cho symbol
const symbolValidation = [
  param('symbol')
    .trim()
    .notEmpty().withMessage('Symbol không được để trống')
    .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ. Ví dụ: BTC/USDT')
];

// Validation cho timeframe
const timeframeValidation = [
  query('timeframe')
    .optional()
    .isIn(['1m', '5m', '15m', '30m', '1h', '4h', '1d'])
    .withMessage('Khung thời gian không hợp lệ')
];

// Validation cho tín hiệu giao dịch
const signalValidation = [
  body('symbol')
    .trim()
    .notEmpty().withMessage('Symbol không được để trống')
    .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ'),
  body('side')
    .isIn(['buy', 'sell']).withMessage('Loại giao dịch chỉ được là buy hoặc sell'),
  body('timeframe')
    .isIn(['1m', '5m', '15m', '30m', '1h', '4h', '1d'])
    .withMessage('Khung thời gian không hợp lệ'),
  body('entryPrice')
    .isFloat({ min: 0 }).withMessage('Giá entry phải là số dương'),
  body('stopLoss')
    .isFloat({ min: 0 }).withMessage('Giá stop loss phải là số dương'),
  body('takeProfit')
    .isArray().withMessage('Take profit phải là một mảng')
    .custom((value) => {
      if (!value.every((price: number) => price > 0)) {
        throw new Error('Mỗi giá take profit phải là số dương');
      }
      return true;
    }),
  body('confidence')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Độ tin cậy phải từ 0-100')
];

// Validation cho chiến lược
const strategyValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tên chiến lược không được để trống')
    .isLength({ max: 100 }).withMessage('Tên chiến lược không được quá 100 ký tự'),
  body('symbol')
    .trim()
    .notEmpty().withMessage('Symbol không được để trống')
    .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ'),
  body('timeframe')
    .isIn(['1m', '5m', '15m', '30m', '1h', '4h', '1d'])
    .withMessage('Khung thời gian không hợp lệ'),
  body('entryRules')
    .isArray().withMessage('Quy tắc entry phải là một mảng'),
  body('exitRules')
    .isArray().withMessage('Quy tắc exit phải là một mảng')
];

// Validation cho backtest
const backtestValidation = [
  body('strategyId')
    .notEmpty().withMessage('ID chiến lược không được để trống'),
  body('startDate')
    .isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
  body('endDate')
    .isISO8601().withMessage('Ngày kết thúc không hợp lệ')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      return true;
    }),
  body('initialCapital')
    .isFloat({ min: 0 }).withMessage('Vốn ban đầu phải là số dương')
];

// @desc    Lấy danh sách chỉ báo kỹ thuật
// @route   GET /api/analysis/indicators
// @access  Private
export const getIndicators = [
  validate([
    query('symbol')
      .trim()
      .notEmpty().withMessage('Symbol không được để trống')
      .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ'),
    ...timeframeValidation
  ]),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { symbol, timeframe } = req.query;
    
    try {
      const indicators = await technicalAnalysisService.calculateIndicators(
        symbol as string, 
        timeframe as string
      );
      
      res.status(200).json({
        success: true,
        count: indicators.length,
        data: indicators
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi tính toán chỉ báo kỹ thuật'));
    }
  })
];

// @desc    Nhận diện mẫu hình
// @route   GET /api/analysis/patterns
// @access  Private
export const getPatterns = [
  validate([
    query('symbol')
      .trim()
      .notEmpty().withMessage('Symbol không được để trống')
      .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ'),
    ...timeframeValidation
  ]),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { symbol, timeframe } = req.query;
    
    try {
      const patterns = await technicalAnalysisService.detectPatterns(
        symbol as string, 
        timeframe as string
      );
      
      res.status(200).json({
        success: true,
        count: patterns.length,
        data: patterns
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi nhận diện mẫu hình'));
    }
  })
];

// @desc    Lấy danh sách tín hiệu giao dịch
// @route   GET /api/analysis/signals
// @access  Private
export const getSignals = [
  validate([
    query('symbol')
      .optional()
      .trim()
      .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ'),
    ...timeframeValidation,
    query('confidence')
      .optional()
      .isFloat({ min: 0, max: 100 }).withMessage('Độ tin cậy phải từ 0-100')
  ]),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const { symbol, timeframe, confidence } = req.query;
    
    const filter: any = { user: user._id };
    
    if (symbol) filter.symbol = symbol;
    if (timeframe) filter.timeframe = timeframe;
    if (confidence) filter.confidence = confidence;
    
    try {
      const signals = await Signal.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.status(200).json({
        success: true,
        count: signals.length,
        data: signals
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi lấy tín hiệu giao dịch'));
    }
  })
];

// @desc    Tạo tín hiệu giao dịch mới
// @route   POST /api/analysis/signals
// @access  Private
export const createSignal = [
  validate(signalValidation),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const { 
      symbol, 
      side, 
      timeframe, 
      entryPrice, 
      stopLoss, 
      takeProfit, 
      confidence 
    } = req.body;
    
    try {
      // Kiểm tra xem đã có tín hiệu tương tự chưa
      const existingSignal = await Signal.findOne({
        user: user._id,
        symbol,
        side,
        timeframe,
        status: 'active'
      });
      
      if (existingSignal) {
        return next(new AppError(400, 'Đã tồn tại tín hiệu tương tự'));
      }
      
      const newSignal = await Signal.create({
        user: user._id,
        symbol,
        side,
        timeframe,
        entryPrice,
        stopLoss,
        takeProfit,
        confidence,
        status: 'active'
      });
      
      res.status(201).json({
        success: true,
        data: newSignal
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi tạo tín hiệu giao dịch'));
    }
  })
];

// @desc    Lấy danh sách chiến lược
// @route   GET /api/analysis/strategies
// @access  Private
export const getStrategies = [
  validate([
    query('symbol')
      .optional()
      .trim()
      .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ'),
    ...timeframeValidation
  ]),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const { symbol, timeframe } = req.query;
    
    const filter: any = { user: user._id };
    
    if (symbol) filter.symbol = symbol;
    if (timeframe) filter.timeframe = timeframe;
    
    try {
      const strategies = await Strategy.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.status(200).json({
        success: true,
        count: strategies.length,
        data: strategies
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi lấy danh sách chiến lược'));
    }
  })
];

// @desc    Tạo chiến lược mới
// @route   POST /api/analysis/strategies
// @access  Private
export const createStrategy = [
  validate(strategyValidation),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const { 
      name, 
      description, 
      symbol, 
      timeframe, 
      entryRules, 
      exitRules 
    } = req.body;
    
    try {
      // Kiểm tra xem đã có chiến lược với tên này chưa
      const existingStrategy = await Strategy.findOne({
        user: user._id,
        name
      });
      
      if (existingStrategy) {
        return next(new AppError(400, 'Đã tồn tại chiến lược với tên này'));
      }
      
      const newStrategy = await Strategy.create({
        user: user._id,
        name,
        description,
        symbol,
        timeframe,
        entryRules,
        exitRules,
        status: 'active'
      });
      
      res.status(201).json({
        success: true,
        data: newStrategy
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi tạo chiến lược'));
    }
  })
];

// @desc    Thực hiện backtest chiến lược
// @route   POST /api/analysis/backtest
// @access  Private
export const runBacktest = [
  validate(backtestValidation),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const { 
      strategyId, 
      startDate, 
      endDate, 
      initialCapital 
    } = req.body;
    
    try {
      // Lấy chiến lược
      const strategy = await Strategy.findById(strategyId);
      
      if (!strategy) {
        return next(new AppError(404, 'Không tìm thấy chiến lược'));
      }
      
      // Kiểm tra quyền sở hữu chiến lược
      if (strategy.user.toString() !== user._id.toString()) {
        return next(new AppError(403, 'Bạn không có quyền thực hiện backtest cho chiến lược này'));
      }
      
      // Kiểm tra số lượng backtest của chiến lược
      const backtestCount = await Backtest.countDocuments({ 
        user: user._id, 
        strategy: strategyId 
      });
      
      if (backtestCount >= 10) {
        return next(new AppError(400, 'Đã vượt quá số lần backtest cho chiến lược này'));
      }
      
      // Thực hiện backtest
      const backtestResults = await technicalAnalysisService.runBacktest(
        strategy, 
        startDate, 
        endDate, 
        initialCapital
      );
      
      // Lưu kết quả backtest
      const newBacktest = await Backtest.create({
        user: user._id,
        strategy: strategyId,
        startDate,
        endDate,
        initialCapital,
        results: backtestResults
      });
      
      res.status(200).json({
        success: true,
        data: newBacktest
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi thực hiện backtest'));
    }
  })
];

// @desc    Lấy lịch sử backtest
// @route   GET /api/analysis/backtest-history
// @access  Private
export const getBacktestHistory = [
  validate([
    query('strategyId')
      .optional()
      .isMongoId().withMessage('ID chiến lược không hợp lệ')
  ]),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const { strategyId } = req.query;
    
    const filter: any = { user: user._id };
    
    if (strategyId) filter.strategy = strategyId;
    
    try {
      const backtestHistory = await Backtest.find(filter)
        .populate('strategy')
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.status(200).json({
        success: true,
        count: backtestHistory.length,
        data: backtestHistory
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi lấy lịch sử backtest'));
    }
  })
];

// @desc    Phân tích tổng quan
// @route   GET /api/analysis/overview
// @access  Private
export const getAnalysisOverview = [
  validate([
    query('symbol')
      .trim()
      .notEmpty().withMessage('Symbol không được để trống')
      .matches(/^[A-Z]+\/[A-Z]+$/).withMessage('Symbol không hợp lệ'),
    ...timeframeValidation
  ]),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const { symbol, timeframe } = req.query;
    
    try {
      const overview = await technicalAnalysisService.getMarketOverview(
        symbol as string, 
        timeframe as string
      );
      
      res.status(200).json({
        success: true,
        data: overview
      });
    } catch (error) {
      next(new AppError(500, 'Lỗi khi lấy tổng quan phân tích'));
    }
  })
]; 