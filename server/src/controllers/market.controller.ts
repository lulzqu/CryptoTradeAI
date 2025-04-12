import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { MEXC_API_KEY, MEXC_API_SECRET, MEXC_BASE_URL } from '../config';
import axios from 'axios';
import crypto from 'crypto';
import mexcApi from '../api/mexc';
import { MEXCService } from '../services/mexc';
import { AppError } from '../middleware/errorHandler';
import { OHLCV } from '../types/market';

/**
 * @desc    Lấy dữ liệu thị trường (giá, volume, etc.) cho một mã coin cụ thể
 * @route   GET /api/market/coin/:symbol
 * @access  Public
 */
export const getCoinData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  
  try {
    // Mock data cho MVP - sẽ được thay thế bằng call tới MEXC API
    const coinData = {
      symbol: symbol.toUpperCase(),
      price: Math.random() * 10000,
      volume24h: Math.random() * 1000000,
      change24h: (Math.random() * 20) - 10, // -10% đến +10%
      high24h: Math.random() * 12000,
      low24h: Math.random() * 8000,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: coinData
    });
  } catch (error) {
    return next(new ErrorResponse(`Không thể lấy dữ liệu cho ${symbol}`, 500));
  }
});

/**
 * @desc    Lấy danh sách các cặp giao dịch
 * @route   GET /api/market/symbols
 * @access  Public
 */
export const getSymbols = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const mexcService = MEXCService.getInstance();
  const symbols = await mexcService.getSymbols();
  
  res.status(200).json({
    success: true,
    count: symbols.length,
    data: symbols
  });
});

/**
 * @desc    Lấy giá của một hoặc tất cả các cặp giao dịch
 * @route   GET /api/market/ticker
 * @access  Public
 */
export const getTicker = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol } = req.query;
    const tickerData = await mexcApi.getTickerPrice(symbol as string);

    res.status(200).json({
      success: true,
      data: tickerData
    });
  } catch (error: any) {
    return next(new ErrorResponse(`Không thể lấy giá: ${error.message}`, 500));
  }
});

/**
 * @desc    Lấy thông tin thị trường 24h
 * @route   GET /api/market/ticker24h
 * @access  Public
 */
export const getTicker24h = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol } = req.query;
    const ticker24h = await mexcApi.getTicker24hr(symbol as string);

    // Định dạng lại dữ liệu để dễ sử dụng ở frontend
    const formatData = Array.isArray(ticker24h)
      ? ticker24h.map((item: any) => ({
          symbol: item.symbol,
          lastPrice: parseFloat(item.lastPrice),
          priceChange: parseFloat(item.priceChange),
          priceChangePercent: parseFloat(item.priceChangePercent),
          highPrice: parseFloat(item.highPrice),
          lowPrice: parseFloat(item.lowPrice),
          volume: parseFloat(item.volume),
          quoteVolume: parseFloat(item.quoteVolume)
        }))
      : {
          symbol: ticker24h.symbol,
          lastPrice: parseFloat(ticker24h.lastPrice),
          priceChange: parseFloat(ticker24h.priceChange),
          priceChangePercent: parseFloat(ticker24h.priceChangePercent),
          highPrice: parseFloat(ticker24h.highPrice),
          lowPrice: parseFloat(ticker24h.lowPrice),
          volume: parseFloat(ticker24h.volume),
          quoteVolume: parseFloat(ticker24h.quoteVolume)
        };

    res.status(200).json({
      success: true,
      data: formatData
    });
  } catch (error: any) {
    return next(new ErrorResponse(`Không thể lấy thông tin thị trường 24h: ${error.message}`, 500));
  }
});

/**
 * @desc    Lấy dữ liệu biểu đồ (nến)
 * @route   GET /api/market/klines
 * @access  Public
 */
export const getKlines = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, interval = '1h', limit = 500, startTime, endTime } = req.query;

    if (!symbol) {
      return next(new ErrorResponse('Vui lòng cung cấp mã giao dịch (symbol)', 400));
    }

    const klines = await mexcApi.getKlines(
      symbol as string,
      interval as string,
      limit ? parseInt(limit as string) : 500,
      startTime ? parseInt(startTime as string) : undefined,
      endTime ? parseInt(endTime as string) : undefined
    );

    // Định dạng dữ liệu nến để dễ sử dụng ở frontend
    const formattedKlines = klines.map((kline: any) => ({
      openTime: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: kline[6],
      quoteVolume: parseFloat(kline[7]),
      trades: kline[8],
      takerBuyBaseVolume: parseFloat(kline[9]),
      takerBuyQuoteVolume: parseFloat(kline[10])
    }));

    res.status(200).json({
      success: true,
      data: formattedKlines
    });
  } catch (error: any) {
    return next(new ErrorResponse(`Không thể lấy dữ liệu nến: ${error.message}`, 500));
  }
});

/**
 * @desc    Lấy dữ liệu sổ lệnh
 * @route   GET /api/market/orderbook
 * @access  Public
 */
export const getOrderBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  const { limit = '100' } = req.query;
  
  if (!symbol) {
    return next(new AppError(400, 'Vui lòng cung cấp mã cặp giao dịch'));
  }
  
  const mexcService = MEXCService.getInstance();
  const orderBook = await mexcService.getOrderBook(symbol, parseInt(limit as string));
  
  res.status(200).json({
    success: true,
    data: orderBook
  });
});

/**
 * @desc    Lấy dữ liệu giao dịch gần đây
 * @route   GET /api/market/trades
 * @access  Public
 */
export const getRecentTrades = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, limit = 50 } = req.query;

    if (!symbol) {
      return next(new ErrorResponse('Vui lòng cung cấp mã giao dịch (symbol)', 400));
    }

    const trades = await mexcApi.getTrades(
      symbol as string,
      limit ? parseInt(limit as string) : 50
    );

    // Định dạng lại dữ liệu giao dịch
    const formattedTrades = trades.map((trade: any) => ({
      id: trade.id,
      price: parseFloat(trade.price),
      quantity: parseFloat(trade.qty),
      quoteQuantity: parseFloat(trade.quoteQty),
      time: trade.time,
      isBuyerMaker: trade.isBuyerMaker
    }));

    res.status(200).json({
      success: true,
      count: formattedTrades.length,
      data: formattedTrades
    });
  } catch (error: any) {
    return next(new ErrorResponse(`Không thể lấy dữ liệu giao dịch: ${error.message}`, 500));
  }
});

/**
 * @desc    Lấy danh sách các cặp giao dịch được yêu thích
 * @route   GET /api/market/favorites
 * @access  Private
 */
export const getFavorites = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Trong phiên bản MVP, chúng tôi sẽ sử dụng dữ liệu cố định
    // Trong tương lai, điều này sẽ được lấy từ cơ sở dữ liệu dựa trên preferences của người dùng
    const favorites = [
      'BTC/USDT',
      'ETH/USDT',
      'SOL/USDT',
      'BNB/USDT',
      'XRP/USDT'
    ];

    const tickerPromises = favorites.map(symbol => 
      mexcApi.getTicker24hr(symbol.replace('/', ''))
    );

    const tickerResults = await Promise.allSettled(tickerPromises);
    
    const favoriteData = tickerResults
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => {
        const data = result.value;
        return {
          symbol: data.symbol,
          lastPrice: parseFloat(data.lastPrice),
          priceChange: parseFloat(data.priceChange),
          priceChangePercent: parseFloat(data.priceChangePercent),
        };
      });

    res.status(200).json({
      success: true,
      count: favoriteData.length,
      data: favoriteData
    });
  } catch (error: any) {
    return next(new ErrorResponse(`Không thể lấy danh sách yêu thích: ${error.message}`, 500));
  }
});

/**
 * @desc    Lấy dữ liệu biểu đồ cho một mã coin (OHLCV)
 * @route   GET /api/market/chart/:symbol
 * @access  Public
 */
export const getChartData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  const { interval = '1h', limit = 100 } = req.query;
  
  try {
    // Mock data cho MVP - sẽ được thay thế bằng call tới MEXC API
    const now = Date.now();
    const candleData = [];
    
    for (let i = 0; i < Number(limit); i++) {
      const timestamp = now - (i * getIntervalMilliseconds(interval as string));
      const open = Math.random() * 10000;
      const close = open * (0.9 + Math.random() * 0.2); // -10% to +10% của giá mở
      const high = Math.max(open, close) * (1 + Math.random() * 0.05);
      const low = Math.min(open, close) * (1 - Math.random() * 0.05);
      const volume = Math.random() * 1000000;
      
      candleData.unshift([timestamp, open, high, low, close, volume]);
    }
    
    res.status(200).json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        interval,
        candles: candleData
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Không thể lấy dữ liệu biểu đồ cho ${symbol}`, 500));
  }
});

/**
 * @desc    Lấy danh sách các mã coin hot và trending
 * @route   GET /api/market/trending
 * @access  Public
 */
export const getTrendingCoins = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock data cho MVP - sẽ được thay thế bằng call tới MEXC API và phân tích
    const trendingCoins = [
      { symbol: 'BTC/USDT', price: 65000, change24h: 2.5, volume24h: 25000000 },
      { symbol: 'ETH/USDT', price: 3500, change24h: 5.2, volume24h: 15000000 },
      { symbol: 'SOL/USDT', price: 150, change24h: 8.7, volume24h: 8000000 },
      { symbol: 'AVAX/USDT', price: 35, change24h: 12.3, volume24h: 5000000 },
      { symbol: 'ARB/USDT', price: 1.2, change24h: 15.8, volume24h: 3000000 }
    ];
    
    res.status(200).json({
      success: true,
      count: trendingCoins.length,
      data: trendingCoins
    });
  } catch (error) {
    return next(new ErrorResponse('Không thể lấy danh sách mã coin trending', 500));
  }
});

/**
 * @desc    Lấy tổng quan thị trường (market overview)
 * @route   GET /api/market/overview
 * @access  Public
 */
export const getMarketOverview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock data cho MVP - sẽ được thay thế bằng call tới MEXC API và phân tích
    const marketOverview = {
      totalMarketCap: 2.5e12, // $2.5 trillion
      btcDominance: 48.5,
      totalVolume24h: 100e9, // $100 billion
      gainers: [
        { symbol: 'APT/USDT', price: 8.2, change24h: 25.7 },
        { symbol: 'SEI/USDT', price: 0.85, change24h: 18.3 },
        { symbol: 'SUI/USDT', price: 1.65, change24h: 15.2 }
      ],
      losers: [
        { symbol: 'DOGE/USDT', price: 0.12, change24h: -8.5 },
        { symbol: 'SHIB/USDT', price: 0.00002, change24h: -7.2 },
        { symbol: 'ADA/USDT', price: 0.52, change24h: -5.8 }
      ],
      btcPrice: 65000,
      ethPrice: 3500,
      fearGreedIndex: 72, // 0-100, từ extreme fear đến extreme greed
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: marketOverview
    });
  } catch (error) {
    return next(new ErrorResponse('Không thể lấy tổng quan thị trường', 500));
  }
});

/**
 * @desc    Lấy funding rates cho các cặp future
 * @route   GET /api/market/funding-rates
 * @access  Public
 */
export const getFundingRates = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock data cho MVP - sẽ được thay thế bằng call tới MEXC API
    const fundingRates = [
      { symbol: 'BTC/USDT', rate: 0.0010, nextFundingTime: Date.now() + 8 * 3600 * 1000 },
      { symbol: 'ETH/USDT', rate: 0.0015, nextFundingTime: Date.now() + 8 * 3600 * 1000 },
      { symbol: 'SOL/USDT', rate: 0.0025, nextFundingTime: Date.now() + 8 * 3600 * 1000 },
      { symbol: 'BNB/USDT', rate: 0.0008, nextFundingTime: Date.now() + 8 * 3600 * 1000 },
      { symbol: 'XRP/USDT', rate: 0.0012, nextFundingTime: Date.now() + 8 * 3600 * 1000 },
      { symbol: 'DOGE/USDT', rate: 0.0020, nextFundingTime: Date.now() + 8 * 3600 * 1000 },
      { symbol: 'AVAX/USDT', rate: 0.0018, nextFundingTime: Date.now() + 8 * 3600 * 1000 },
      { symbol: 'ARB/USDT', rate: 0.0030, nextFundingTime: Date.now() + 8 * 3600 * 1000 }
    ];
    
    res.status(200).json({
      success: true,
      count: fundingRates.length,
      data: fundingRates
    });
  } catch (error) {
    return next(new ErrorResponse('Không thể lấy funding rates', 500));
  }
});

// Helper function để chuyển đổi interval thành milliseconds
const getIntervalMilliseconds = (interval: string): number => {
  const unit = interval.slice(-1);
  const value = parseInt(interval.slice(0, -1));
  
  switch (unit) {
    case 'm': return value * 60 * 1000; // minute
    case 'h': return value * 60 * 60 * 1000; // hour
    case 'd': return value * 24 * 60 * 60 * 1000; // day
    case 'w': return value * 7 * 24 * 60 * 60 * 1000; // week
    default: return 60 * 60 * 1000; // default to 1h
  }
};

// @desc    Lấy dữ liệu thị trường cho một cặp giao dịch
// @route   GET /api/market/data/:symbol
// @access  Public
export const getMarketData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  
  if (!symbol) {
    return next(new AppError(400, 'Vui lòng cung cấp mã cặp giao dịch'));
  }
  
  const mexcService = MEXCService.getInstance();
  const marketData = await mexcService.getMarketData(symbol);
  
  res.status(200).json({
    success: true,
    data: marketData
  });
});

// @desc    Lấy dữ liệu nến (OHLCV)
// @route   GET /api/market/candles/:symbol
// @access  Public
export const getCandles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  const { interval = '1h', limit = '100', startTime, endTime } = req.query;
  
  if (!symbol) {
    return next(new AppError(400, 'Vui lòng cung cấp mã cặp giao dịch'));
  }
  
  const mexcService = MEXCService.getInstance();
  const candles = await mexcService.getCandles(
    symbol, 
    interval as string, 
    parseInt(limit as string),
    startTime ? parseInt(startTime as string) : undefined,
    endTime ? parseInt(endTime as string) : undefined
  );
  
  // Chuyển đổi dữ liệu sang đúng định dạng OHLCV
  const formattedCandles: OHLCV[] = candles.map((candle: any) => ({
    timestamp: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5])
  }));
  
  res.status(200).json({
    success: true,
    count: formattedCandles.length,
    data: formattedCandles
  });
});

// @desc    Lấy dữ liệu giao dịch gần đây
// @route   GET /api/market/trades/:symbol
// @access  Private
export const getMarketTrades = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  const { limit = '500' } = req.query;
  
  if (!symbol) {
    return next(new AppError(400, 'Vui lòng cung cấp mã cặp giao dịch'));
  }
  
  const mexcService = MEXCService.getInstance();
  const trades = await mexcService.getRecentTrades(symbol, parseInt(limit as string));
  
  res.status(200).json({
    success: true,
    count: trades.length,
    data: trades
  });
}); 