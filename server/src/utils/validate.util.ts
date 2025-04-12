/**
 * Tiện ích xác thực dữ liệu
 * Cung cấp các hàm kiểm tra và xác thực dữ liệu phổ biến
 */

/**
 * Kiểm tra email hợp lệ
 * @param email Địa chỉ email cần kiểm tra
 * @returns true nếu email hợp lệ, false nếu không
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra mật khẩu mạnh
 * @param password Mật khẩu cần kiểm tra
 * @param minLength Độ dài tối thiểu (mặc định 8)
 * @param requireNumber Yêu cầu có số (mặc định true)
 * @param requireLowercase Yêu cầu có chữ thường (mặc định true)
 * @param requireUppercase Yêu cầu có chữ in hoa (mặc định true)
 * @param requireSpecial Yêu cầu có ký tự đặc biệt (mặc định true)
 * @returns true nếu mật khẩu đủ mạnh, false nếu không
 */
export const isStrongPassword = (
  password: string,
  minLength: number = 8,
  requireNumber: boolean = true,
  requireLowercase: boolean = true,
  requireUppercase: boolean = true,
  requireSpecial: boolean = true
): boolean => {
  if (password.length < minLength) {
    return false;
  }
  
  const hasNumber = /[0-9]/.test(password);
  if (requireNumber && !hasNumber) {
    return false;
  }
  
  const hasLowercase = /[a-z]/.test(password);
  if (requireLowercase && !hasLowercase) {
    return false;
  }
  
  const hasUppercase = /[A-Z]/.test(password);
  if (requireUppercase && !hasUppercase) {
    return false;
  }
  
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (requireSpecial && !hasSpecial) {
    return false;
  }
  
  return true;
};

/**
 * Kiểm tra số điện thoại hợp lệ (định dạng quốc tế)
 * @param phone Số điện thoại cần kiểm tra
 * @returns true nếu số điện thoại hợp lệ, false nếu không
 */
export const isValidPhone = (phone: string): boolean => {
  // Hỗ trợ các định dạng: +84..., 84..., 0...
  const phoneRegex = /^(\+?84|0)[3-9][0-9]{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Kiểm tra URL hợp lệ
 * @param url URL cần kiểm tra
 * @returns true nếu URL hợp lệ, false nếu không
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

/**
 * Kiểm tra mã ticker tiền điện tử hợp lệ
 * @param ticker Mã ticker cần kiểm tra
 * @returns true nếu mã ticker hợp lệ, false nếu không
 */
export const isValidCryptoTicker = (ticker: string): boolean => {
  // Hỗ trợ các định dạng như BTC, ETH, XRP, BCH, LTC, v.v.
  const tickerRegex = /^[A-Z0-9]{2,10}$/;
  return tickerRegex.test(ticker);
};

/**
 * Kiểm tra cặp giao dịch hợp lệ
 * @param pair Cặp giao dịch cần kiểm tra (ví dụ: BTC/USDT, ETH-USDT)
 * @returns true nếu cặp giao dịch hợp lệ, false nếu không
 */
export const isValidTradingPair = (pair: string): boolean => {
  // Hỗ trợ các định dạng như BTC/USDT, ETH-USDT, BTC_USDT, v.v.
  const pairRegex = /^[A-Z0-9]{2,10}[\/\-_][A-Z0-9]{2,10}$/;
  return pairRegex.test(pair);
};

/**
 * Kiểm tra giá trị số hợp lệ trong khoảng
 * @param value Giá trị cần kiểm tra
 * @param min Giá trị tối thiểu
 * @param max Giá trị tối đa
 * @returns true nếu giá trị nằm trong khoảng, false nếu không
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Kiểm tra giá trị không âm
 * @param value Giá trị cần kiểm tra
 * @returns true nếu giá trị không âm, false nếu không
 */
export const isNonNegative = (value: number): boolean => {
  return value >= 0;
};

/**
 * Kiểm tra giá trị API key hợp lệ
 * @param apiKey API key cần kiểm tra
 * @returns true nếu API key hợp lệ, false nếu không
 */
export const isValidApiKey = (apiKey: string): boolean => {
  // API key thường là chuỗi ký tự alphanumeric dài
  const apiKeyRegex = /^[A-Za-z0-9]{16,64}$/;
  return apiKeyRegex.test(apiKey);
};

/**
 * Kiểm tra giá trị API secret hợp lệ
 * @param apiSecret API secret cần kiểm tra
 * @returns true nếu API secret hợp lệ, false nếu không
 */
export const isValidApiSecret = (apiSecret: string): boolean => {
  // API secret thường là chuỗi ký tự alphanumeric và ký tự đặc biệt dài
  const apiSecretRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{24,128}$/;
  return apiSecretRegex.test(apiSecret);
};

/**
 * Kiểm tra địa chỉ ví tiền điện tử
 * @param address Địa chỉ ví cần kiểm tra
 * @param coinType Loại tiền điện tử (BTC, ETH, v.v.)
 * @returns true nếu địa chỉ ví hợp lệ, false nếu không
 */
export const isValidCryptoAddress = (address: string, coinType: string): boolean => {
  if (!address) {
    return false;
  }
  
  // Kiểm tra theo loại tiền
  coinType = coinType.toUpperCase();
  
  if (coinType === 'BTC') {
    // Địa chỉ Bitcoin thường bắt đầu bằng 1, 3, hoặc bc1
    const btcRegex = /^(1|3|bc1)[a-zA-Z0-9]{25,42}$/;
    return btcRegex.test(address);
  } else if (coinType === 'ETH') {
    // Địa chỉ Ethereum thường bắt đầu bằng 0x và có 42 ký tự
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethRegex.test(address);
  } else if (coinType === 'XRP') {
    // Địa chỉ Ripple
    const xrpRegex = /^r[0-9a-zA-Z]{24,34}$/;
    return xrpRegex.test(address);
  } else if (coinType === 'LTC') {
    // Địa chỉ Litecoin thường bắt đầu bằng L, M, hoặc ltc1
    const ltcRegex = /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-zA-Z0-9]{39,59}$/;
    return ltcRegex.test(address);
  } else if (coinType === 'TRX') {
    // Địa chỉ TRON thường bắt đầu bằng T
    const trxRegex = /^T[a-zA-Z0-9]{33}$/;
    return trxRegex.test(address);
  }
  
  // Nếu không có kiểm tra cụ thể cho loại tiền, kiểm tra chung
  const genericRegex = /^[a-zA-Z0-9]{26,42}$/;
  return genericRegex.test(address);
};

/**
 * Kiểm tra định dạng ngày hợp lệ (ISO 8601)
 * @param dateString Chuỗi ngày cần kiểm tra
 * @returns true nếu định dạng ngày hợp lệ, false nếu không
 */
export const isValidISODate = (dateString: string): boolean => {
  if (!dateString) {
    return false;
  }
  
  // Kiểm tra định dạng ISO 8601
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;
  if (!isoDateRegex.test(dateString)) {
    return false;
  }
  
  // Kiểm tra ngày có hợp lệ không
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Kiểm tra định dạng JSON hợp lệ
 * @param jsonString Chuỗi JSON cần kiểm tra
 * @returns true nếu JSON hợp lệ, false nếu không
 */
export const isValidJSON = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Kiểm tra định dạng hex color hợp lệ
 * @param color Mã màu cần kiểm tra
 * @returns true nếu mã màu hợp lệ, false nếu không
 */
export const isValidHexColor = (color: string): boolean => {
  const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  return hexColorRegex.test(color);
};

/**
 * Kiểm tra định dạng tên người dùng hợp lệ
 * @param username Tên người dùng cần kiểm tra
 * @returns true nếu tên người dùng hợp lệ, false nếu không
 */
export const isValidUsername = (username: string): boolean => {
  // Tên người dùng chỉ chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang
  // Độ dài từ 3 đến 20 ký tự
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Kiểm tra tham số phần trăm hợp lệ
 * @param value Giá trị cần kiểm tra
 * @param allowNegative Cho phép giá trị âm (mặc định false)
 * @returns true nếu giá trị hợp lệ, false nếu không
 */
export const isValidPercentage = (value: number, allowNegative: boolean = false): boolean => {
  if (allowNegative) {
    return value >= -100 && value <= 100;
  }
  return value >= 0 && value <= 100;
};

/**
 * Làm sạch dữ liệu đầu vào
 * @param input Chuỗi đầu vào cần làm sạch
 * @returns Chuỗi đã được làm sạch
 */
export const sanitizeInput = (input: string): string => {
  if (!input) {
    return '';
  }
  
  // Loại bỏ các ký tự HTML và script
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}; 