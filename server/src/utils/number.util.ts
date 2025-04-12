/**
 * Tiện ích định dạng số
 * Cung cấp các hàm định dạng số cho các mục đích khác nhau
 */

/**
 * Định dạng số thành chuỗi có dấu phân cách hàng nghìn
 * @param value Số cần định dạng
 * @param decimalPlaces Số chữ số thập phân (mặc định: 2)
 * @param decimalSeparator Ký tự phân cách phần thập phân (mặc định: ',')
 * @param thousandSeparator Ký tự phân cách hàng nghìn (mặc định: '.')
 * @returns Chuỗi đã định dạng
 */
export const formatNumber = (
  value: number,
  decimalPlaces: number = 2,
  decimalSeparator: string = ',',
  thousandSeparator: string = '.'
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  
  // Làm tròn số đến số chữ số thập phân cần thiết
  const roundedValue = decimalPlaces === 0 
    ? Math.round(value) 
    : Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  
  // Chuyển đổi thành chuỗi và tách phần nguyên và phần thập phân
  const parts = roundedValue.toString().split('.');
  
  // Định dạng phần nguyên với dấu phân cách hàng nghìn
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  // Nếu cần có phần thập phân
  if (decimalPlaces > 0) {
    // Nếu không có phần thập phân, thêm vào
    if (parts.length === 1) {
      parts.push('0'.repeat(decimalPlaces));
    } 
    // Nếu phần thập phân ngắn hơn yêu cầu, thêm số 0
    else if (parts[1].length < decimalPlaces) {
      parts[1] = parts[1] + '0'.repeat(decimalPlaces - parts[1].length);
    } 
    // Nếu phần thập phân dài hơn yêu cầu, cắt bớt
    else if (parts[1].length > decimalPlaces) {
      parts[1] = parts[1].substring(0, decimalPlaces);
    }
    
    // Nối phần nguyên và phần thập phân với dấu phân cách
    return parts.join(decimalSeparator);
  }
  
  // Nếu không cần phần thập phân, chỉ trả về phần nguyên
  return parts[0];
};

/**
 * Định dạng số thành chuỗi tiền tệ
 * @param value Số tiền cần định dạng
 * @param currency Mã tiền tệ (mặc định: 'VND')
 * @param decimalPlaces Số chữ số thập phân (mặc định: 0 cho VND, 2 cho các loại tiền khác)
 * @param locale Định dạng ngôn ngữ (mặc định: 'vi-VN')
 * @returns Chuỗi tiền tệ đã định dạng
 */
export const formatCurrency = (
  value: number,
  currency: string = 'VND',
  decimalPlaces?: number,
  locale: string = 'vi-VN'
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  
  // Xác định số chữ số thập phân dựa trên loại tiền tệ nếu không được chỉ định
  if (decimalPlaces === undefined) {
    decimalPlaces = currency === 'VND' ? 0 : 2;
  }
  
  // Sử dụng Intl.NumberFormat để định dạng tiền tệ
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
  
  return formatter.format(value);
};

/**
 * Định dạng số thành chuỗi phần trăm
 * @param value Giá trị phần trăm (0.01 = 1%)
 * @param decimalPlaces Số chữ số thập phân (mặc định: 2)
 * @param includeSign Có bao gồm dấu % không (mặc định: true)
 * @returns Chuỗi phần trăm đã định dạng
 */
export const formatPercent = (
  value: number,
  decimalPlaces: number = 2,
  includeSign: boolean = true
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  
  // Chuyển đổi sang phần trăm (nhân với 100)
  const percentValue = value * 100;
  
  // Làm tròn đến số chữ số thập phân cần thiết
  const roundedValue = decimalPlaces === 0 
    ? Math.round(percentValue) 
    : Math.round(percentValue * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  
  // Định dạng số
  const formattedValue = formatNumber(roundedValue, decimalPlaces);
  
  // Thêm dấu % nếu cần
  return includeSign ? `${formattedValue}%` : formattedValue;
};

/**
 * Làm tròn số đến số chữ số thập phân cần thiết
 * @param value Số cần làm tròn
 * @param decimalPlaces Số chữ số thập phân (mặc định: 2)
 * @returns Số đã làm tròn
 */
export const roundNumber = (value: number, decimalPlaces: number = 2): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return NaN;
  }
  
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
};

/**
 * Làm tròn số đến số chữ số thập phân có nghĩa
 * @param value Số cần làm tròn
 * @param significantDigits Số chữ số có nghĩa (mặc định: 4)
 * @returns Số đã làm tròn
 */
export const roundToSignificantDigits = (value: number, significantDigits: number = 4): number => {
  if (value === null || value === undefined || isNaN(value) || value === 0) {
    return value === 0 ? 0 : NaN;
  }
  
  const factor = Math.pow(10, significantDigits - Math.floor(Math.log10(Math.abs(value))) - 1);
  return Math.round(value * factor) / factor;
};

/**
 * Làm tròn số đến bước nhảy
 * @param value Số cần làm tròn
 * @param step Bước nhảy (mặc định: 0.01)
 * @returns Số đã làm tròn đến bước nhảy gần nhất
 */
export const roundToStep = (value: number, step: number = 0.01): number => {
  if (value === null || value === undefined || isNaN(value) || step <= 0) {
    return NaN;
  }
  
  return Math.round(value / step) * step;
};

/**
 * Định dạng số thập lục phân
 * @param value Số cần định dạng
 * @param length Độ dài tối thiểu (mặc định: 2)
 * @param prefix Tiền tố (mặc định: '0x')
 * @returns Chuỗi số thập lục phân đã định dạng
 */
export const formatHex = (value: number, length: number = 2, prefix: string = '0x'): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  
  const hex = Math.floor(value).toString(16).toUpperCase();
  const paddedHex = hex.padStart(length, '0');
  return `${prefix}${paddedHex}`;
};

/**
 * Định dạng số thành chuỗi kích thước file (bytes, KB, MB, GB, TB)
 * @param bytes Kích thước file tính bằng bytes
 * @param decimalPlaces Số chữ số thập phân (mặc định: 2)
 * @returns Chuỗi kích thước file đã định dạng
 */
export const formatFileSize = (bytes: number, decimalPlaces: number = 2): string => {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes < 0) {
    return '';
  }
  
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  let unitIndex = 0;
  let size = bytes;
  
  // Tìm đơn vị thích hợp
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  // Đặc biệt xử lý đơn vị bytes
  if (unitIndex === 0) {
    return `${Math.round(size)} ${units[unitIndex]}`;
  }
  
  // Định dạng với số chữ số thập phân cần thiết
  return `${roundNumber(size, decimalPlaces)} ${units[unitIndex]}`;
};

/**
 * Chuyển đổi số La Mã thành số Ả Rập
 * @param roman Chuỗi số La Mã
 * @returns Số Ả Rập tương ứng, hoặc NaN nếu chuỗi không hợp lệ
 */
export const romanToArabic = (roman: string): number => {
  if (!roman || typeof roman !== 'string') {
    return NaN;
  }
  
  const romanNumerals: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  };
  
  let result = 0;
  
  for (let i = 0; i < roman.length; i++) {
    const current = romanNumerals[roman[i]];
    const next = romanNumerals[roman[i + 1]];
    
    if (current === undefined) {
      return NaN; // Ký tự không hợp lệ
    }
    
    if (next && current < next) {
      result += next - current;
      i++; // Bỏ qua ký tự tiếp theo vì đã được tính
    } else {
      result += current;
    }
  }
  
  return result;
};

/**
 * Chuyển đổi số Ả Rập thành số La Mã
 * @param num Số Ả Rập cần chuyển đổi
 * @returns Chuỗi số La Mã tương ứng, hoặc chuỗi rỗng nếu đầu vào không hợp lệ
 */
export const arabicToRoman = (num: number): string => {
  if (num === null || num === undefined || isNaN(num) || num <= 0 || num >= 4000) {
    return '';
  }
  
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];
  
  let result = '';
  let remaining = Math.floor(num);
  
  for (const { value, symbol } of romanNumerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  
  return result;
};

/**
 * Định dạng số thành chuỗi theo dạng viết gọn (K, M, B, T)
 * @param value Số cần định dạng
 * @param decimalPlaces Số chữ số thập phân (mặc định: 1)
 * @returns Chuỗi số đã định dạng
 */
export const formatCompactNumber = (value: number, decimalPlaces: number = 1): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue < 1000) {
    return sign + formatNumber(absValue, decimalPlaces);
  }
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixIndex = Math.min(Math.floor(Math.log10(absValue) / 3), suffixes.length - 1);
  
  const scaledValue = absValue / Math.pow(10, suffixIndex * 3);
  const formattedValue = formatNumber(scaledValue, decimalPlaces);
  
  return sign + formattedValue + suffixes[suffixIndex];
}; 