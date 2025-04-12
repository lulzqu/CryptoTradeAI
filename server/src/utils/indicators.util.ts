/**
 * Tiện ích chỉ báo kỹ thuật giao dịch
 * Cung cấp các hàm tính toán chỉ báo kỹ thuật phổ biến cho giao dịch crypto
 */

/**
 * Tính giá trị Simple Moving Average (SMA)
 * @param prices Mảng giá
 * @param period Khoảng thời gian
 * @returns Mảng giá trị SMA
 */
export const calculateSMA = (prices: number[], period: number): number[] => {
  const result: number[] = [];
  
  if (prices.length < period) {
    return result;
  }
  
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  
  return result;
};

/**
 * Tính giá trị Exponential Moving Average (EMA)
 * @param prices Mảng giá
 * @param period Khoảng thời gian
 * @returns Mảng giá trị EMA
 */
export const calculateEMA = (prices: number[], period: number): number[] => {
  const result: number[] = [];
  
  if (prices.length < period) {
    return result;
  }
  
  // Tính SMA đầu tiên
  const smaFirst = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result.push(smaFirst);
  
  // Tính hệ số bình quân
  const multiplier = 2 / (period + 1);
  
  // Tính các giá trị EMA tiếp theo
  for (let i = period; i < prices.length; i++) {
    const ema = (prices[i] - result[result.length - 1]) * multiplier + result[result.length - 1];
    result.push(ema);
  }
  
  return result;
};

/**
 * Tính giá trị Relative Strength Index (RSI)
 * @param prices Mảng giá
 * @param period Khoảng thời gian (thường là 14)
 * @returns Mảng giá trị RSI
 */
export const calculateRSI = (prices: number[], period: number = 14): number[] => {
  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  if (prices.length <= period) {
    return result;
  }
  
  // Tính toán gains và losses
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Tính toán average gains và average losses đầu tiên
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // Tính RSI đầu tiên
  let rs = avgGain / avgLoss;
  result.push(100 - (100 / (1 + rs)));
  
  // Tính các giá trị RSI tiếp theo
  for (let i = period; i < gains.length; i++) {
    avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    
    rs = avgGain / avgLoss;
    result.push(100 - (100 / (1 + rs)));
  }
  
  return result;
};

/**
 * Tính giá trị MACD (Moving Average Convergence Divergence)
 * @param prices Mảng giá
 * @param fastPeriod Khoảng thời gian nhanh (mặc định 12)
 * @param slowPeriod Khoảng thời gian chậm (mặc định 26)
 * @param signalPeriod Khoảng thời gian tín hiệu (mặc định 9)
 * @returns Object chứa MACD, Signal và Histogram
 */
export const calculateMACD = (
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } => {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  // Đảm bảo độ dài bằng nhau
  const slowEMAOffset = slowPeriod - fastPeriod;
  
  // Tính MACD (fastEMA - slowEMA)
  const macd: number[] = [];
  for (let i = 0; i < fastEMA.length - slowEMAOffset; i++) {
    macd.push(fastEMA[i + slowEMAOffset] - slowEMA[i]);
  }
  
  // Tính Signal Line (EMA của MACD)
  const signal = calculateEMA(macd, signalPeriod);
  
  // Tính Histogram (MACD - Signal)
  const histogram: number[] = [];
  for (let i = 0; i < signal.length; i++) {
    histogram.push(macd[i + (macd.length - signal.length)] - signal[i]);
  }
  
  return { macd, signal, histogram };
};

/**
 * Tính giá trị Bollinger Bands
 * @param prices Mảng giá
 * @param period Khoảng thời gian (mặc định 20)
 * @param multiplier Hệ số nhân (mặc định 2)
 * @returns Object chứa Upper Band, Middle Band và Lower Band
 */
export const calculateBollingerBands = (
  prices: number[],
  period: number = 20,
  multiplier: number = 2
): { upper: number[]; middle: number[]; lower: number[] } => {
  const middle = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const sum = slice.reduce((a, b) => a + Math.pow(b - middle[i - (period - 1)], 2), 0);
    const std = Math.sqrt(sum / period);
    
    upper.push(middle[i - (period - 1)] + (multiplier * std));
    lower.push(middle[i - (period - 1)] - (multiplier * std));
  }
  
  return { upper, middle, lower };
};

/**
 * Tính giá trị Stochastic Oscillator
 * @param highPrices Mảng giá cao nhất
 * @param lowPrices Mảng giá thấp nhất
 * @param closePrices Mảng giá đóng cửa
 * @param period Khoảng thời gian %K (mặc định 14)
 * @param smoothK Khoảng thời gian làm mượt %K (mặc định 3)
 * @param smoothD Khoảng thời gian %D (mặc định 3)
 * @returns Object chứa %K và %D
 */
export const calculateStochastic = (
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
  period: number = 14,
  smoothK: number = 3,
  smoothD: number = 3
): { k: number[]; d: number[] } => {
  const rawK: number[] = [];
  
  // Tính %K
  for (let i = period - 1; i < closePrices.length; i++) {
    const highSlice = highPrices.slice(i - period + 1, i + 1);
    const lowSlice = lowPrices.slice(i - period + 1, i + 1);
    const highestHigh = Math.max(...highSlice);
    const lowestLow = Math.min(...lowSlice);
    
    rawK.push(((closePrices[i] - lowestLow) / (highestHigh - lowestLow)) * 100);
  }
  
  // Làm mượt %K
  const k = calculateSMA(rawK, smoothK);
  
  // Tính %D (SMA của %K)
  const d = calculateSMA(k, smoothD);
  
  return { k, d };
};

/**
 * Tính giá trị ATR (Average True Range)
 * @param highPrices Mảng giá cao nhất
 * @param lowPrices Mảng giá thấp nhất
 * @param closePrices Mảng giá đóng cửa
 * @param period Khoảng thời gian (mặc định 14)
 * @returns Mảng giá trị ATR
 */
export const calculateATR = (
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
  period: number = 14
): number[] => {
  const trueRanges: number[] = [];
  const result: number[] = [];
  
  // Tính True Range
  for (let i = 1; i < closePrices.length; i++) {
    const tr1 = highPrices[i] - lowPrices[i];
    const tr2 = Math.abs(highPrices[i] - closePrices[i - 1]);
    const tr3 = Math.abs(lowPrices[i] - closePrices[i - 1]);
    
    trueRanges.push(Math.max(tr1, tr2, tr3));
  }
  
  // Tính ATR đầu tiên (Simple Average)
  if (trueRanges.length >= period) {
    const firstATR = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;
    result.push(firstATR);
    
    // Tính các giá trị ATR tiếp theo (Wilder's Smoothing)
    for (let i = period; i < trueRanges.length; i++) {
      const atr = ((result[result.length - 1] * (period - 1)) + trueRanges[i]) / period;
      result.push(atr);
    }
  }
  
  return result;
};

/**
 * Tính giá trị On-Balance Volume (OBV)
 * @param closePrices Mảng giá đóng cửa
 * @param volumes Mảng khối lượng giao dịch
 * @returns Mảng giá trị OBV
 */
export const calculateOBV = (closePrices: number[], volumes: number[]): number[] => {
  const result: number[] = [0]; // Bắt đầu với OBV = 0
  
  for (let i = 1; i < closePrices.length; i++) {
    if (closePrices[i] > closePrices[i - 1]) {
      // Giá tăng, cộng khối lượng
      result.push(result[result.length - 1] + volumes[i]);
    } else if (closePrices[i] < closePrices[i - 1]) {
      // Giá giảm, trừ khối lượng
      result.push(result[result.length - 1] - volumes[i]);
    } else {
      // Giá không đổi, giữ nguyên OBV
      result.push(result[result.length - 1]);
    }
  }
  
  return result;
};

/**
 * Tính giá trị Volume-Weighted Average Price (VWAP)
 * @param closePrices Mảng giá đóng cửa
 * @param volumes Mảng khối lượng giao dịch
 * @returns Mảng giá trị VWAP
 */
export const calculateVWAP = (
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
  volumes: number[]
): number[] => {
  const typicalPrices: number[] = [];
  const cumulativeTPV: number[] = []; // Cumulative Typical Price * Volume
  const cumulativeVolume: number[] = []; // Cumulative Volume
  const result: number[] = [];
  
  // Tính Typical Price và cumulatives
  for (let i = 0; i < closePrices.length; i++) {
    const typicalPrice = (highPrices[i] + lowPrices[i] + closePrices[i]) / 3;
    typicalPrices.push(typicalPrice);
    
    if (i === 0) {
      cumulativeTPV.push(typicalPrice * volumes[i]);
      cumulativeVolume.push(volumes[i]);
    } else {
      cumulativeTPV.push(cumulativeTPV[i - 1] + (typicalPrice * volumes[i]));
      cumulativeVolume.push(cumulativeVolume[i - 1] + volumes[i]);
    }
    
    // Tính VWAP
    result.push(cumulativeTPV[i] / cumulativeVolume[i]);
  }
  
  return result;
};

/**
 * Tính giá trị Ichimoku Cloud
 * @param highPrices Mảng giá cao nhất
 * @param lowPrices Mảng giá thấp nhất
 * @param closePrices Mảng giá đóng cửa
 * @param tenkanPeriod Tenkan-sen period (thường là 9)
 * @param kijunPeriod Kijun-sen period (thường là 26)
 * @param senkouSpanBPeriod Senkou Span B period (thường là 52)
 * @param displacement Displacement (thường là 26)
 * @returns Object chứa các thành phần của Ichimoku Cloud
 */
export const calculateIchimoku = (
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
  tenkanPeriod: number = 9,
  kijunPeriod: number = 26,
  senkouSpanBPeriod: number = 52,
  displacement: number = 26
): {
  tenkanSen: number[];
  kijunSen: number[];
  senkouSpanA: number[];
  senkouSpanB: number[];
  chikouSpan: number[];
} => {
  const tenkanSen: number[] = [];
  const kijunSen: number[] = [];
  const senkouSpanA: number[] = [];
  const senkouSpanB: number[] = [];
  const chikouSpan: number[] = [];
  
  // Tính Tenkan-sen (Conversion Line)
  for (let i = tenkanPeriod - 1; i < highPrices.length; i++) {
    const highSlice = highPrices.slice(i - tenkanPeriod + 1, i + 1);
    const lowSlice = lowPrices.slice(i - tenkanPeriod + 1, i + 1);
    tenkanSen.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
  }
  
  // Tính Kijun-sen (Base Line)
  for (let i = kijunPeriod - 1; i < highPrices.length; i++) {
    const highSlice = highPrices.slice(i - kijunPeriod + 1, i + 1);
    const lowSlice = lowPrices.slice(i - kijunPeriod + 1, i + 1);
    kijunSen.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
  }
  
  // Tính Senkou Span A (Leading Span A)
  const maxTenkanIdx = tenkanSen.length;
  const maxKijunIdx = kijunSen.length;
  const minIdx = Math.min(maxTenkanIdx, maxKijunIdx);
  
  for (let i = 0; i < minIdx; i++) {
    const tenkanIdx = tenkanSen.length - minIdx + i;
    const kijunIdx = kijunSen.length - minIdx + i;
    senkouSpanA.push((tenkanSen[tenkanIdx] + kijunSen[kijunIdx]) / 2);
  }
  
  // Tính Senkou Span B (Leading Span B)
  for (let i = senkouSpanBPeriod - 1; i < highPrices.length; i++) {
    const highSlice = highPrices.slice(i - senkouSpanBPeriod + 1, i + 1);
    const lowSlice = lowPrices.slice(i - senkouSpanBPeriod + 1, i + 1);
    senkouSpanB.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
  }
  
  // Tính Chikou Span (Lagging Span)
  for (let i = 0; i < closePrices.length - displacement; i++) {
    chikouSpan.push(closePrices[i]);
  }
  
  return { tenkanSen, kijunSen, senkouSpanA, senkouSpanB, chikouSpan };
}; 