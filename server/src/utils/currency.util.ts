/**
 * Tiện ích chuyển đổi tiền tệ
 * Cung cấp các hàm cho việc chuyển đổi giữa các loại tiền tệ khác nhau
 */

import axios from 'axios';
import NodeCache from 'node-cache';

// Cache để lưu trữ tỷ giá trong một khoảng thời gian
// 1 giờ = 3600 giây
const exchangeRateCache = new NodeCache({ stdTTL: 3600 });

/**
 * Bộ định dạng tiền tệ theo từng quốc gia
 */
export const currencyFormatters: Record<string, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
  EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
  JPY: new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }),
  CNY: new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }),
  VND: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }),
  BTC: new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }),
  ETH: new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }),
  USDT: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
};

/**
 * Gọi API để lấy tỷ giá mới nhất
 * @param baseCurrency Mã tiền tệ cơ sở
 * @param apiKey Khóa API (tùy chọn)
 * @returns Đối tượng chứa tỷ giá chuyển đổi giữa các loại tiền tệ
 */
export const fetchExchangeRates = async (
  baseCurrency: string = 'USD',
  apiKey: string = process.env.EXCHANGE_RATE_API_KEY || ''
): Promise<Record<string, number>> => {
  // Kiểm tra xem tỷ giá đã được lưu trong cache chưa
  const cacheKey = `rates_${baseCurrency}`;
  const cachedRates = exchangeRateCache.get<Record<string, number>>(cacheKey);
  
  if (cachedRates) {
    return cachedRates;
  }
  
  try {
    // Gọi API để lấy tỷ giá mới nhất
    // Ví dụ với API exchangeratesapi.io
    const url = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`;
    const headers = apiKey ? { Authorization: `ApiKey ${apiKey}` } : {};
    
    const response = await axios.get(url, { headers });
    const rates = response.data.rates;
    
    // Lưu tỷ giá vào cache
    exchangeRateCache.set(cacheKey, rates);
    
    return rates;
  } catch (error) {
    console.error('Lỗi khi lấy tỷ giá:', error);
    // Trả về đối tượng trống nếu có lỗi
    return {};
  }
};

/**
 * Lấy tỷ giá chuyển đổi giữa hai loại tiền tệ
 * @param fromCurrency Mã tiền tệ nguồn
 * @param toCurrency Mã tiền tệ đích
 * @param rates Đối tượng chứa tỷ giá chuyển đổi (tùy chọn)
 * @returns Tỷ giá chuyển đổi hoặc 0 nếu không tìm thấy
 */
export const getExchangeRate = async (
  fromCurrency: string,
  toCurrency: string,
  rates?: Record<string, number>
): Promise<number> => {
  // Nếu tiền tệ nguồn và đích giống nhau, tỷ giá là 1
  if (fromCurrency === toCurrency) {
    return 1;
  }
  
  try {
    // Sử dụng rates từ tham số nếu được cung cấp
    const exchangeRates = rates || await fetchExchangeRates(fromCurrency);
    
    // Kiểm tra xem tỷ giá cho tiền tệ đích có tồn tại không
    if (!exchangeRates[toCurrency]) {
      throw new Error(`Không tìm thấy tỷ giá cho ${toCurrency}`);
    }
    
    return exchangeRates[toCurrency];
  } catch (error) {
    console.error(`Lỗi khi lấy tỷ giá từ ${fromCurrency} sang ${toCurrency}:`, error);
    return 0;
  }
};

/**
 * Chuyển đổi giá trị từ một loại tiền tệ sang loại khác
 * @param amount Số tiền cần chuyển đổi
 * @param fromCurrency Mã tiền tệ nguồn
 * @param toCurrency Mã tiền tệ đích
 * @param rates Đối tượng chứa tỷ giá chuyển đổi (tùy chọn)
 * @returns Số tiền đã chuyển đổi
 */
export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates?: Record<string, number>
): Promise<number> => {
  if (amount === 0 || fromCurrency === toCurrency) {
    return amount;
  }
  
  // Lấy tỷ giá chuyển đổi
  const rate = await getExchangeRate(fromCurrency, toCurrency, rates);
  
  if (rate === 0) {
    throw new Error(`Không thể chuyển đổi từ ${fromCurrency} sang ${toCurrency}`);
  }
  
  // Thực hiện chuyển đổi
  return amount * rate;
};

/**
 * Định dạng số tiền theo loại tiền tệ
 * @param amount Số tiền
 * @param currencyCode Mã tiền tệ
 * @returns Chuỗi số tiền đã định dạng
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  // Kiểm tra xem định dạng cho loại tiền tệ này có tồn tại không
  const formatter = currencyFormatters[currencyCode];
  
  if (!formatter) {
    // Sử dụng định dạng mặc định nếu không tìm thấy
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
  
  if (currencyCode === 'BTC' || currencyCode === 'ETH') {
    return `${formatter.format(amount)} ${currencyCode}`;
  }
  
  return formatter.format(amount);
};

/**
 * Chuyển đổi và định dạng số tiền từ một loại tiền tệ sang loại khác
 * @param amount Số tiền cần chuyển đổi
 * @param fromCurrency Mã tiền tệ nguồn
 * @param toCurrency Mã tiền tệ đích
 * @param rates Đối tượng chứa tỷ giá chuyển đổi (tùy chọn)
 * @returns Chuỗi số tiền đã chuyển đổi và định dạng
 */
export const convertAndFormatCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates?: Record<string, number>
): Promise<string> => {
  // Chuyển đổi số tiền
  const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency, rates);
  
  // Định dạng số tiền đã chuyển đổi
  return formatCurrency(convertedAmount, toCurrency);
};

/**
 * Chuyển đổi danh sách số tiền từ một loại tiền tệ sang loại khác
 * @param amounts Mảng số tiền cần chuyển đổi
 * @param fromCurrency Mã tiền tệ nguồn
 * @param toCurrency Mã tiền tệ đích
 * @param rates Đối tượng chứa tỷ giá chuyển đổi (tùy chọn)
 * @returns Mảng số tiền đã chuyển đổi
 */
export const convertCurrencyList = async (
  amounts: number[],
  fromCurrency: string,
  toCurrency: string,
  rates?: Record<string, number>
): Promise<number[]> => {
  if (fromCurrency === toCurrency) {
    return amounts;
  }
  
  // Lấy tỷ giá chuyển đổi một lần
  const rate = await getExchangeRate(fromCurrency, toCurrency, rates);
  
  if (rate === 0) {
    throw new Error(`Không thể chuyển đổi từ ${fromCurrency} sang ${toCurrency}`);
  }
  
  // Thực hiện chuyển đổi cho từng số tiền
  return amounts.map(amount => amount * rate);
};

/**
 * Lấy tỷ giá chuyển đổi giữa nhiều loại tiền tệ với một loại tiền tệ cơ sở
 * @param baseCurrency Mã tiền tệ cơ sở
 * @param currencies Mảng mã tiền tệ cần lấy tỷ giá
 * @returns Đối tượng chứa tỷ giá cho các loại tiền tệ
 */
export const getMultipleExchangeRates = async (
  baseCurrency: string,
  currencies: string[]
): Promise<Record<string, number>> => {
  try {
    // Lấy tất cả tỷ giá với tiền tệ cơ sở
    const allRates = await fetchExchangeRates(baseCurrency);
    
    // Lọc chỉ những tỷ giá cho các loại tiền tệ cần thiết
    const filteredRates: Record<string, number> = {};
    
    for (const currency of currencies) {
      if (currency === baseCurrency) {
        filteredRates[currency] = 1; // Tỷ giá với chính nó là 1
      } else if (allRates[currency]) {
        filteredRates[currency] = allRates[currency];
      }
    }
    
    return filteredRates;
  } catch (error) {
    console.error('Lỗi khi lấy nhiều tỷ giá:', error);
    return {};
  }
};

/**
 * Xác định tiền tệ chính trong công thức chuyển đổi (phân tích cặp giao dịch)
 * @param symbol Cặp giao dịch (ví dụ: 'BTC/USDT', 'ETH-BTC')
 * @returns Đối tượng chứa tiền tệ cơ sở và tiền tệ báo giá
 */
export const parseTradingPair = (symbol: string): { base: string; quote: string } => {
  // Hỗ trợ nhiều định dạng cặp giao dịch (/, -, _)
  const separator = symbol.includes('/') ? '/' : symbol.includes('-') ? '-' : '_';
  const [base, quote] = symbol.split(separator);
  
  return { base, quote };
};

/**
 * Tính toán giá trị giao dịch từ khối lượng và giá
 * @param volume Khối lượng giao dịch
 * @param price Giá
 * @param tradingPair Cặp giao dịch
 * @returns Đối tượng chứa giá trị trong tiền tệ cơ sở và tiền tệ báo giá
 */
export const calculateTradeValue = (
  volume: number,
  price: number,
  tradingPair: string
): { baseValue: number; quoteValue: number } => {
  const { base, quote } = parseTradingPair(tradingPair);
  
  // Giá trị trong tiền tệ báo giá = Khối lượng * Giá
  const quoteValue = volume * price;
  
  // Giá trị trong tiền tệ cơ sở = Khối lượng
  const baseValue = volume;
  
  return { baseValue, quoteValue };
};

/**
 * Tạo một đối tượng lưu trữ giá trị trong nhiều loại tiền tệ
 * @param amount Số tiền ban đầu
 * @param initialCurrency Mã tiền tệ ban đầu
 * @param currencies Mảng mã tiền tệ cần chuyển đổi
 * @returns Promise với đối tượng chứa số tiền trong nhiều loại tiền tệ
 */
export const createMultiCurrencyValue = async (
  amount: number,
  initialCurrency: string,
  currencies: string[]
): Promise<Record<string, number>> => {
  // Thêm tiền tệ ban đầu vào danh sách nếu chưa có
  if (!currencies.includes(initialCurrency)) {
    currencies = [initialCurrency, ...currencies];
  }
  
  // Lấy tỷ giá cho tất cả tiền tệ
  const rates = await fetchExchangeRates(initialCurrency);
  
  // Tạo đối tượng kết quả
  const result: Record<string, number> = {};
  
  // Thêm giá trị trong tiền tệ ban đầu
  result[initialCurrency] = amount;
  
  // Chuyển đổi sang các loại tiền tệ khác
  for (const currency of currencies) {
    if (currency !== initialCurrency) {
      result[currency] = await convertCurrency(amount, initialCurrency, currency, rates);
    }
  }
  
  return result;
};

/**
 * Chuyển đổi đơn vị tiền tệ crypto
 * @param amount Số lượng crypto
 * @param fromUnit Đơn vị nguồn
 * @param toUnit Đơn vị đích
 * @returns Số lượng đã chuyển đổi
 */
export const convertCryptoUnit = (
  amount: number,
  fromUnit: 'BTC' | 'mBTC' | 'bits' | 'satoshi' | 'ETH' | 'gwei' | 'wei',
  toUnit: 'BTC' | 'mBTC' | 'bits' | 'satoshi' | 'ETH' | 'gwei' | 'wei'
): number => {
  // Hệ số chuyển đổi giữa các đơn vị
  const conversionFactors: Record<string, number> = {
    // Bitcoin
    BTCTOmBTC: 1000,
    BTCTObits: 1000000,
    BTCTOsatoshi: 100000000,
    mBTCTObits: 1000,
    mBTCTOsatoshi: 100000,
    bitsTOsatoshi: 100,
    
    // Ethereum
    ETHTOgwei: 1000000000,
    ETHTOwei: 1000000000000000000,
    gweiTOwei: 1000000000
  };
  
  // Nếu cùng đơn vị, không cần chuyển đổi
  if (fromUnit === toUnit) {
    return amount;
  }
  
  // Xác định loại tiền tệ
  const isBitcoin = ['BTC', 'mBTC', 'bits', 'satoshi'].includes(fromUnit) && 
                   ['BTC', 'mBTC', 'bits', 'satoshi'].includes(toUnit);
  
  const isEthereum = ['ETH', 'gwei', 'wei'].includes(fromUnit) && 
                    ['ETH', 'gwei', 'wei'].includes(toUnit);
  
  if (!isBitcoin && !isEthereum) {
    throw new Error('Không hỗ trợ chuyển đổi giữa các loại tiền tệ khác nhau');
  }
  
  // Định nghĩa hàm chuyển đổi cho Bitcoin
  const convertBitcoin = (amount: number, fromUnit: string, toUnit: string): number => {
    // Chuyển đổi về satoshi (đơn vị nhỏ nhất)
    let inSatoshi = amount;
    
    if (fromUnit === 'BTC') inSatoshi = amount * conversionFactors.BTCTOsatoshi;
    else if (fromUnit === 'mBTC') inSatoshi = amount * conversionFactors.mBTCTOsatoshi;
    else if (fromUnit === 'bits') inSatoshi = amount * conversionFactors.bitsTOsatoshi;
    
    // Chuyển đổi từ satoshi sang đơn vị đích
    if (toUnit === 'satoshi') return inSatoshi;
    if (toUnit === 'bits') return inSatoshi / conversionFactors.bitsTOsatoshi;
    if (toUnit === 'mBTC') return inSatoshi / conversionFactors.mBTCTOsatoshi;
    if (toUnit === 'BTC') return inSatoshi / conversionFactors.BTCTOsatoshi;
    
    return 0;
  };
  
  // Định nghĩa hàm chuyển đổi cho Ethereum
  const convertEthereum = (amount: number, fromUnit: string, toUnit: string): number => {
    // Chuyển đổi về wei (đơn vị nhỏ nhất)
    let inWei = amount;
    
    if (fromUnit === 'ETH') inWei = amount * conversionFactors.ETHTOwei;
    else if (fromUnit === 'gwei') inWei = amount * conversionFactors.gweiTOwei;
    
    // Chuyển đổi từ wei sang đơn vị đích
    if (toUnit === 'wei') return inWei;
    if (toUnit === 'gwei') return inWei / conversionFactors.gweiTOwei;
    if (toUnit === 'ETH') return inWei / conversionFactors.ETHTOwei;
    
    return 0;
  };
  
  // Thực hiện chuyển đổi dựa trên loại tiền tệ
  if (isBitcoin) {
    return convertBitcoin(amount, fromUnit, toUnit);
  } else {
    return convertEthereum(amount, fromUnit, toUnit);
  }
}; 