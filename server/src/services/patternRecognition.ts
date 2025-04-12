import { OHLCV } from '../types/market';
import { CandlestickPattern } from '../types/analysis';

export class PatternRecognitionService {
  private static instance: PatternRecognitionService;

  private constructor() {}

  public static getInstance(): PatternRecognitionService {
    if (!PatternRecognitionService.instance) {
      PatternRecognitionService.instance = new PatternRecognitionService();
    }
    return PatternRecognitionService.instance;
  }

  public detectPatterns(data: OHLCV[]): CandlestickPattern[] {
    const patterns: CandlestickPattern[] = [];

    for (let i = 2; i < data.length; i++) {
      const pattern = this.detectPattern(data.slice(i - 2, i + 1));
      if (pattern) {
        patterns.push({
          ...pattern,
          timestamp: data[i].timestamp
        });
      }
    }

    return patterns;
  }

  private detectPattern(candles: OHLCV[]): CandlestickPattern | null {
    if (this.isHammer(candles)) {
      return {
        name: 'Hammer',
        type: 'BULLISH',
        reliability: 0.7,
        description: 'Mẫu hình búa ngược, tín hiệu đảo chiều tăng'
      };
    }

    if (this.isShootingStar(candles)) {
      return {
        name: 'Shooting Star',
        type: 'BEARISH',
        reliability: 0.7,
        description: 'Mẫu hình sao băng, tín hiệu đảo chiều giảm'
      };
    }

    if (this.isEngulfing(candles)) {
      return {
        name: 'Engulfing',
        type: candles[1].close > candles[0].close ? 'BULLISH' : 'BEARISH',
        reliability: 0.8,
        description: 'Mẫu hình bao trùm, tín hiệu đảo chiều mạnh'
      };
    }

    if (this.isDoji(candles)) {
      return {
        name: 'Doji',
        type: 'NEUTRAL',
        reliability: 0.6,
        description: 'Mẫu hình doji, tín hiệu do dự'
      };
    }

    return null;
  }

  private isHammer(candles: OHLCV[]): boolean {
    const candle = candles[1];
    const body = Math.abs(candle.close - candle.open);
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;

    return (
      lowerShadow > 2 * body &&
      upperShadow < body &&
      candle.close > candle.open
    );
  }

  private isShootingStar(candles: OHLCV[]): boolean {
    const candle = candles[1];
    const body = Math.abs(candle.close - candle.open);
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;

    return (
      upperShadow > 2 * body &&
      lowerShadow < body &&
      candle.close < candle.open
    );
  }

  private isEngulfing(candles: OHLCV[]): boolean {
    const first = candles[0];
    const second = candles[1];

    return (
      Math.abs(second.close - second.open) > Math.abs(first.close - first.open) &&
      ((second.close > first.open && second.open < first.close) ||
        (second.close < first.open && second.open > first.close))
    );
  }

  private isDoji(candles: OHLCV[]): boolean {
    const candle = candles[1];
    const body = Math.abs(candle.close - candle.open);
    const totalRange = candle.high - candle.low;

    return body < totalRange * 0.1;
  }
} 