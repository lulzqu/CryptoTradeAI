import { OHLCV } from '../types/market';
import { TechnicalIndicator } from '../types/analysis';

export class TechnicalAnalysisService {
  private static instance: TechnicalAnalysisService;

  private constructor() {}

  public static getInstance(): TechnicalAnalysisService {
    if (!TechnicalAnalysisService.instance) {
      TechnicalAnalysisService.instance = new TechnicalAnalysisService();
    }
    return TechnicalAnalysisService.instance;
  }

  public calculateIndicator(data: OHLCV[], indicator: TechnicalIndicator): number[] {
    switch (indicator.name) {
      case 'SMA':
        return this.calculateSMA(data, indicator.parameters.period);
      case 'EMA':
        return this.calculateEMA(data, indicator.parameters.period);
      case 'RSI':
        return this.calculateRSI(data, indicator.parameters.period);
      case 'MACD':
        return this.calculateMACD(
          data,
          indicator.parameters.fastPeriod,
          indicator.parameters.slowPeriod,
          indicator.parameters.signalPeriod
        );
      case 'BB':
        return this.calculateBollingerBands(
          data,
          indicator.parameters.period,
          indicator.parameters.stdDev
        );
      default:
        throw new Error(`Indicator ${indicator.name} not supported`);
    }
  }

  private calculateSMA(data: OHLCV[], period: number): number[] {
    const sma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(NaN);
        continue;
      }
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      sma.push(sum / period);
    }
    return sma;
  }

  private calculateEMA(data: OHLCV[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    let emaValue = data[0].close;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(emaValue);
        continue;
      }
      emaValue = (data[i].close - emaValue) * multiplier + emaValue;
      ema.push(emaValue);
    }
    return ema;
  }

  private calculateRSI(data: OHLCV[], period: number): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }

    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 0; i < period; i++) {
      avgGain += gains[i];
      avgLoss += losses[i];
    }

    avgGain /= period;
    avgLoss /= period;

    for (let i = 0; i < period; i++) {
      rsi.push(NaN);
    }

    for (let i = period; i < gains.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }

    return rsi;
  }

  private calculateMACD(
    data: OHLCV[],
    fastPeriod: number,
    slowPeriod: number,
    signalPeriod: number
  ): number[] {
    const fastEMA = this.calculateEMA(data, fastPeriod);
    const slowEMA = this.calculateEMA(data, slowPeriod);
    const macdLine: number[] = [];

    for (let i = 0; i < data.length; i++) {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }

    const signalLine = this.calculateEMA(
      macdLine.map((value, index) => ({
        open: value,
        high: value,
        low: value,
        close: value,
        volume: 0,
        timestamp: data[index].timestamp
      })),
      signalPeriod
    );

    return macdLine.map((value, index) => value - signalLine[index]);
  }

  private calculateBollingerBands(
    data: OHLCV[],
    period: number,
    stdDev: number
  ): number[] {
    const sma = this.calculateSMA(data, period);
    const bands: number[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        bands.push(NaN);
        continue;
      }

      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += Math.pow(data[i - j].close - sma[i], 2);
      }
      const standardDeviation = Math.sqrt(sum / period);
      bands.push(standardDeviation * stdDev);
    }

    return bands;
  }
} 