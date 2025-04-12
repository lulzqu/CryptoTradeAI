/**
 * Tiện ích xử lý ngày giờ
 * Cung cấp các hàm xử lý và định dạng ngày giờ phổ biến
 */

/**
 * Định dạng ngày giờ theo định dạng cụ thể
 * @param date Đối tượng Date hoặc chuỗi ISO hoặc timestamp
 * @param format Định dạng (mặc định: DD/MM/YYYY HH:mm:ss)
 * @returns Chuỗi ngày giờ đã định dạng
 */
export const formatDate = (
  date: Date | string | number,
  format: string = 'DD/MM/YYYY HH:mm:ss'
): string => {
  // Chuyển đổi input thành đối tượng Date
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');
  const milliseconds = dateObj.getMilliseconds().toString().padStart(3, '0');
  
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds);
};

/**
 * Chuyển đổi timestamp thành đối tượng Date
 * @param timestamp Timestamp (miliseconds)
 * @returns Đối tượng Date
 */
export const timestampToDate = (timestamp: number): Date => {
  return new Date(timestamp);
};

/**
 * Chuyển đổi đối tượng Date thành timestamp
 * @param date Đối tượng Date
 * @returns Timestamp (miliseconds)
 */
export const dateToTimestamp = (date: Date): number => {
  return date.getTime();
};

/**
 * Thêm một khoảng thời gian vào ngày
 * @param date Đối tượng Date
 * @param amount Số lượng cần thêm
 * @param unit Đơn vị (years, months, days, hours, minutes, seconds)
 * @returns Đối tượng Date mới
 */
export const addToDate = (
  date: Date,
  amount: number,
  unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
): Date => {
  const result = new Date(date);
  
  switch (unit) {
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'hours':
      result.setHours(result.getHours() + amount);
      break;
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount);
      break;
  }
  
  return result;
};

/**
 * Tính khoảng cách giữa hai ngày
 * @param date1 Ngày thứ nhất
 * @param date2 Ngày thứ hai
 * @param unit Đơn vị kết quả (years, months, days, hours, minutes, seconds, milliseconds)
 * @returns Khoảng cách giữa hai ngày theo đơn vị chỉ định
 */
export const diffBetweenDates = (
  date1: Date,
  date2: Date,
  unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds' = 'milliseconds'
): number => {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  
  switch (unit) {
    case 'years':
      return diffMs / (1000 * 60 * 60 * 24 * 365.25);
    case 'months':
      return diffMs / (1000 * 60 * 60 * 24 * 30.44);
    case 'days':
      return diffMs / (1000 * 60 * 60 * 24);
    case 'hours':
      return diffMs / (1000 * 60 * 60);
    case 'minutes':
      return diffMs / (1000 * 60);
    case 'seconds':
      return diffMs / 1000;
    case 'milliseconds':
    default:
      return diffMs;
  }
};

/**
 * Lấy ngày đầu tiên của tháng
 * @param date Đối tượng Date
 * @returns Đối tượng Date mới là ngày đầu tiên của tháng
 */
export const getFirstDayOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Lấy ngày cuối cùng của tháng
 * @param date Đối tượng Date
 * @returns Đối tượng Date mới là ngày cuối cùng của tháng
 */
export const getLastDayOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Lấy ngày đầu tiên của tuần
 * @param date Đối tượng Date
 * @param startOnMonday Bắt đầu tuần vào thứ Hai (mặc định: true)
 * @returns Đối tượng Date mới là ngày đầu tiên của tuần
 */
export const getFirstDayOfWeek = (date: Date, startOnMonday: boolean = true): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = startOnMonday ? day === 0 ? 6 : day - 1 : day;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Lấy ngày cuối cùng của tuần
 * @param date Đối tượng Date
 * @param startOnMonday Bắt đầu tuần vào thứ Hai (mặc định: true)
 * @returns Đối tượng Date mới là ngày cuối cùng của tuần
 */
export const getLastDayOfWeek = (date: Date, startOnMonday: boolean = true): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = startOnMonday ? day === 0 ? 0 : 7 - day : 6 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Lấy danh sách các ngày trong tháng
 * @param year Năm
 * @param month Tháng (1-12)
 * @returns Mảng các đối tượng Date
 */
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const result: Date[] = [];
  const date = new Date(year, month - 1, 1);
  
  while (date.getMonth() === month - 1) {
    result.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return result;
};

/**
 * Kiểm tra xem ngày có phải là cuối tuần
 * @param date Đối tượng Date
 * @returns true nếu là cuối tuần, false nếu không
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Tạo khoảng thời gian
 * @param startDate Ngày bắt đầu
 * @param endDate Ngày kết thúc
 * @param interval Khoảng cách (days, weeks, months)
 * @returns Mảng các đối tượng Date
 */
export const getDateRange = (
  startDate: Date,
  endDate: Date,
  interval: 'days' | 'weeks' | 'months' = 'days'
): Date[] => {
  const result: Date[] = [];
  const start = new Date(startDate);
  
  while (start <= endDate) {
    result.push(new Date(start));
    
    switch (interval) {
      case 'days':
        start.setDate(start.getDate() + 1);
        break;
      case 'weeks':
        start.setDate(start.getDate() + 7);
        break;
      case 'months':
        start.setMonth(start.getMonth() + 1);
        break;
    }
  }
  
  return result;
};

/**
 * Chuyển đổi giờ từ múi giờ này sang múi giờ khác
 * @param date Đối tượng Date
 * @param fromTimezone Múi giờ nguồn (dạng ±HH:mm hoặc Z)
 * @param toTimezone Múi giờ đích (dạng ±HH:mm hoặc Z)
 * @returns Đối tượng Date mới đã được chuyển đổi múi giờ
 */
export const convertTimezone = (
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date => {
  // Parse múi giờ nguồn
  let fromOffset = 0;
  if (fromTimezone !== 'Z') {
    const fromMatch = fromTimezone.match(/^([+-])(\d{2}):(\d{2})$/);
    if (fromMatch) {
      const hours = parseInt(fromMatch[2], 10);
      const minutes = parseInt(fromMatch[3], 10);
      fromOffset = (hours * 60 + minutes) * (fromMatch[1] === '+' ? 1 : -1);
    }
  }
  
  // Parse múi giờ đích
  let toOffset = 0;
  if (toTimezone !== 'Z') {
    const toMatch = toTimezone.match(/^([+-])(\d{2}):(\d{2})$/);
    if (toMatch) {
      const hours = parseInt(toMatch[2], 10);
      const minutes = parseInt(toMatch[3], 10);
      toOffset = (hours * 60 + minutes) * (toMatch[1] === '+' ? 1 : -1);
    }
  }
  
  // Tính chênh lệch múi giờ (phút)
  const diffMinutes = toOffset - fromOffset;
  
  // Tạo đối tượng Date mới với múi giờ đã chuyển đổi
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + diffMinutes);
  
  return result;
};

/**
 * Kiểm tra xem ngày có phải là ngày hợp lệ
 * @param date Đối tượng Date hoặc chuỗi ngày
 * @returns true nếu là ngày hợp lệ, false nếu không
 */
export const isValidDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Định dạng thời gian tương đối (ví dụ: "3 giờ trước")
 * @param date Đối tượng Date
 * @param now Đối tượng Date hiện tại (mặc định: new Date())
 * @returns Chuỗi định dạng thời gian tương đối
 */
export const getRelativeTimeFromNow = (date: Date, now: Date = new Date()): string => {
  const diffMs = now.getTime() - date.getTime();
  
  // Kiểm tra nếu thời gian trong tương lai
  if (diffMs < 0) {
    const absDiffMs = Math.abs(diffMs);
    
    if (absDiffMs < 60000) { // Dưới 1 phút
      return 'trong vài giây';
    } else if (absDiffMs < 3600000) { // Dưới 1 giờ
      const minutes = Math.floor(absDiffMs / 60000);
      return `trong ${minutes} phút`;
    } else if (absDiffMs < 86400000) { // Dưới 1 ngày
      const hours = Math.floor(absDiffMs / 3600000);
      return `trong ${hours} giờ`;
    } else if (absDiffMs < 2592000000) { // Dưới 30 ngày
      const days = Math.floor(absDiffMs / 86400000);
      return `trong ${days} ngày`;
    } else if (absDiffMs < 31536000000) { // Dưới 1 năm
      const months = Math.floor(absDiffMs / 2592000000);
      return `trong ${months} tháng`;
    } else {
      const years = Math.floor(absDiffMs / 31536000000);
      return `trong ${years} năm`;
    }
  }
  
  // Thời gian trong quá khứ
  if (diffMs < 60000) { // Dưới 1 phút
    return 'vừa xong';
  } else if (diffMs < 3600000) { // Dưới 1 giờ
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes} phút trước`;
  } else if (diffMs < 86400000) { // Dưới 1 ngày
    const hours = Math.floor(diffMs / 3600000);
    return `${hours} giờ trước`;
  } else if (diffMs < 2592000000) { // Dưới 30 ngày
    const days = Math.floor(diffMs / 86400000);
    return `${days} ngày trước`;
  } else if (diffMs < 31536000000) { // Dưới 1 năm
    const months = Math.floor(diffMs / 2592000000);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(diffMs / 31536000000);
    return `${years} năm trước`;
  }
}; 