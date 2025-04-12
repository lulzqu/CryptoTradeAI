/**
 * Tiện ích xử lý dữ liệu
 * Cung cấp các hàm tiện ích để xử lý và chuẩn hóa dữ liệu
 */

/**
 * Loại bỏ các giá trị trùng lặp từ một mảng
 * @param array Mảng dữ liệu đầu vào
 * @returns Mảng không có giá trị trùng lặp
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  if (!Array.isArray(array)) {
    return [];
  }
  return [...new Set(array)];
};

/**
 * Loại bỏ các giá trị trùng lặp từ một mảng đối tượng dựa trên một khóa
 * @param array Mảng đối tượng
 * @param key Tên thuộc tính dùng để xác định trùng lặp
 * @returns Mảng đối tượng không có giá trị trùng lặp theo khóa
 */
export const removeDuplicatesByKey = <T extends Record<string, any>>(array: T[], key: keyof T): T[] => {
  if (!Array.isArray(array) || !key) {
    return [];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Phân nhóm mảng thành các nhóm theo một hàm callback
 * @param array Mảng cần phân nhóm
 * @param keySelector Hàm trả về khóa để phân nhóm
 * @returns Đối tượng với khóa là kết quả của keySelector và giá trị là mảng các phần tử có cùng khóa
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T[]> => {
  if (!Array.isArray(array) || !keySelector) {
    return {} as Record<K, T[]>;
  }
  
  return array.reduce((result, item) => {
    const key = keySelector(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
};

/**
 * Đếm số lần xuất hiện của mỗi giá trị trong mảng
 * @param array Mảng đầu vào
 * @returns Đối tượng với khóa là giá trị và giá trị là số lần xuất hiện
 */
export const countOccurrences = <T extends string | number | symbol>(array: T[]): Record<T, number> => {
  if (!Array.isArray(array)) {
    return {} as Record<T, number>;
  }
  
  return array.reduce((result, item) => {
    result[item] = (result[item] || 0) + 1;
    return result;
  }, {} as Record<T, number>);
};

/**
 * Tìm giá trị phổ biến nhất trong mảng
 * @param array Mảng đầu vào
 * @returns Giá trị xuất hiện nhiều nhất hoặc undefined nếu mảng rỗng
 */
export const mostFrequent = <T extends string | number | symbol>(array: T[]): T | undefined => {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  const occurrences = countOccurrences(array);
  return Object.entries(occurrences).reduce(
    (a, b) => (b[1] > occurrences[a as unknown as T]) ? (b[0] as unknown as T) : a,
    array[0]
  );
};

/**
 * Lấy phần tử ngẫu nhiên từ mảng
 * @param array Mảng đầu vào
 * @returns Phần tử ngẫu nhiên hoặc undefined nếu mảng rỗng
 */
export const getRandomElement = <T>(array: T[]): T | undefined => {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * Trộn ngẫu nhiên các phần tử trong mảng (Fisher-Yates shuffle)
 * @param array Mảng đầu vào
 * @returns Mảng mới với các phần tử đã được trộn
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  if (!Array.isArray(array)) {
    return [];
  }
  
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
};

/**
 * Phân trang mảng
 * @param array Mảng đầu vào
 * @param pageSize Kích thước trang
 * @param pageNumber Số trang (bắt đầu từ 1)
 * @returns Mảng con chứa các phần tử của trang được chọn
 */
export const paginateArray = <T>(array: T[], pageSize: number, pageNumber: number): T[] => {
  if (!Array.isArray(array) || pageSize <= 0 || pageNumber <= 0) {
    return [];
  }
  
  const startIndex = (pageNumber - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
};

/**
 * Chuyển đổi mảng thành đối tượng với khóa được chỉ định
 * @param array Mảng đối tượng
 * @param key Tên thuộc tính dùng làm khóa
 * @returns Đối tượng với khóa từ thuộc tính của đối tượng
 */
export const arrayToObject = <T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T> => {
  if (!Array.isArray(array) || !key) {
    return {};
  }
  
  return array.reduce((result, item) => {
    if (item[key] !== undefined && item[key] !== null) {
      result[String(item[key])] = item;
    }
    return result;
  }, {} as Record<string, T>);
};

/**
 * Chuẩn hóa chuỗi: xóa khoảng trắng đầu/cuối, chuyển về chữ thường, thay thế khoảng trắng bằng dấu gạch ngang
 * @param str Chuỗi đầu vào
 * @returns Chuỗi đã chuẩn hóa
 */
export const normalizeString = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str.trim().toLowerCase().replace(/\s+/g, '-');
};

/**
 * Chuẩn hóa chuỗi Unicode thành ASCII (loại bỏ dấu)
 * @param str Chuỗi Unicode
 * @returns Chuỗi ASCII không dấu
 */
export const removeAccents = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Tạo slug từ chuỗi (URL friendly)
 * @param str Chuỗi đầu vào
 * @returns Chuỗi slug
 */
export const slugify = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  // Loại bỏ dấu, chuyển thành chữ thường, loại bỏ ký tự đặc biệt
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Rút gọn chuỗi nếu dài hơn độ dài tối đa
 * @param str Chuỗi đầu vào
 * @param maxLength Độ dài tối đa
 * @param suffix Hậu tố khi chuỗi bị cắt (mặc định: '...')
 * @returns Chuỗi đã được rút gọn
 */
export const truncateString = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (!str || typeof str !== 'string' || maxLength <= 0) {
    return '';
  }
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Tạo mã định danh ngẫu nhiên
 * @param length Độ dài mã (mặc định: 10)
 * @param chars Chuỗi ký tự được sử dụng (mặc định: chữ cái và số)
 * @returns Chuỗi mã ngẫu nhiên
 */
export const generateRandomId = (
  length: number = 10,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  if (length <= 0 || !chars || chars.length === 0) {
    return '';
  }
  
  let result = '';
  const charactersLength = chars.length;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

/**
 * Chuyển đổi giá trị thành boolean
 * @param value Giá trị cần chuyển đổi
 * @returns Giá trị boolean
 */
export const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1';
  }
  
  if (typeof value === 'number') {
    return value === 1;
  }
  
  return false;
};

/**
 * Chuyển đổi đối tượng thành chuỗi query URL
 * @param params Đối tượng chứa các tham số
 * @returns Chuỗi query URL (không bao gồm dấu '?')
 */
export const objectToQueryString = (params: Record<string, any>): string => {
  if (!params || typeof params !== 'object') {
    return '';
  }
  
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(item => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');
};

/**
 * Phân tích chuỗi query URL thành đối tượng
 * @param queryString Chuỗi query URL (không bao gồm dấu '?')
 * @returns Đối tượng với các tham số đã phân tích
 */
export const queryStringToObject = (queryString: string): Record<string, string | string[]> => {
  if (!queryString || typeof queryString !== 'string') {
    return {};
  }
  
  // Loại bỏ dấu '?' nếu có
  const query = queryString.replace(/^\?/, '');
  
  if (!query) {
    return {};
  }
  
  const result: Record<string, string | string[]> = {};
  
  query.split('&').forEach(part => {
    const [key, value] = part.split('=').map(decodeURIComponent);
    
    if (!key) return;
    
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value || '');
      } else {
        result[key] = [result[key] as string, value || ''];
      }
    } else {
      result[key] = value || '';
    }
  });
  
  return result;
}; 