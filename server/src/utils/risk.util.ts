/**
 * Tiện ích tính toán rủi ro giao dịch
 * Cung cấp các hàm tính toán rủi ro và quản lý vốn cho giao dịch crypto
 */

/**
 * Tính kích thước vị thế dựa trên phần trăm rủi ro và SL
 * @param accountBalance Số dư tài khoản
 * @param entryPrice Giá vào lệnh
 * @param stopLossPrice Giá dừng lỗ
 * @param riskPercentage Phần trăm rủi ro (mặc định 1%)
 * @param leverage Đòn bẩy (mặc định 1 - không dùng đòn bẩy)
 * @returns Kích thước vị thế
 */
export const calculatePositionSize = (
  accountBalance: number,
  entryPrice: number,
  stopLossPrice: number,
  riskPercentage: number = 1,
  leverage: number = 1
): number => {
  if (entryPrice === stopLossPrice) {
    throw new Error('Giá vào lệnh không thể bằng giá dừng lỗ');
  }
  
  // Tính số tiền rủi ro (số tiền tối đa sẵn sàng mất)
  const riskAmount = accountBalance * (riskPercentage / 100);
  
  // Tính phần trăm thay đổi từ entryPrice đến stopLossPrice
  const priceDelta = Math.abs((entryPrice - stopLossPrice) / entryPrice);
  
  // Tính kích thước vị thế
  const positionSize = (riskAmount / priceDelta) * leverage;
  
  return positionSize;
};

/**
 * Tính giá dừng lỗ dựa trên kích thước vị thế và mức rủi ro chấp nhận được
 * @param entryPrice Giá vào lệnh
 * @param positionSize Kích thước vị thế
 * @param riskAmount Số tiền rủi ro tối đa
 * @param isLong Là lệnh long hay short
 * @param leverage Đòn bẩy (mặc định 1 - không dùng đòn bẩy)
 * @returns Giá dừng lỗ
 */
export const calculateStopLossPrice = (
  entryPrice: number,
  positionSize: number,
  riskAmount: number,
  isLong: boolean = true,
  leverage: number = 1
): number => {
  if (positionSize <= 0 || riskAmount <= 0) {
    throw new Error('Kích thước vị thế và số tiền rủi ro phải lớn hơn 0');
  }
  
  // Tính phần trăm thay đổi giá tương ứng với rủi ro
  const priceDelta = (riskAmount / positionSize) * leverage;
  
  // Tính giá dừng lỗ dựa trên hướng giao dịch
  return isLong
    ? entryPrice * (1 - priceDelta)
    : entryPrice * (1 + priceDelta);
};

/**
 * Tính giá take profit dựa trên tỷ lệ risk/reward
 * @param entryPrice Giá vào lệnh
 * @param stopLossPrice Giá dừng lỗ
 * @param riskRewardRatio Tỷ lệ risk/reward (mặc định 2)
 * @param isLong Là lệnh long hay short
 * @returns Giá chốt lời
 */
export const calculateTakeProfitPrice = (
  entryPrice: number,
  stopLossPrice: number,
  riskRewardRatio: number = 2,
  isLong: boolean = true
): number => {
  if (entryPrice === stopLossPrice) {
    throw new Error('Giá vào lệnh không thể bằng giá dừng lỗ');
  }
  
  // Tính khoảng cách từ giá vào lệnh đến giá dừng lỗ
  const priceDelta = Math.abs(entryPrice - stopLossPrice);
  
  // Tính giá chốt lời dựa trên hướng giao dịch và tỷ lệ risk/reward
  return isLong
    ? entryPrice + (priceDelta * riskRewardRatio)
    : entryPrice - (priceDelta * riskRewardRatio);
};

/**
 * Tính tỷ lệ win/loss cần thiết để có lợi nhuận dựa trên tỷ lệ risk/reward
 * @param riskRewardRatio Tỷ lệ risk/reward
 * @returns Tỷ lệ win/loss cần thiết (phần trăm)
 */
export const calculateRequiredWinRate = (riskRewardRatio: number): number => {
  return (1 / (1 + riskRewardRatio)) * 100;
};

/**
 * Tính giá trị rủi ro (VaR - Value at Risk) dựa trên phương pháp lịch sử
 * @param returns Mảng tỷ lệ lợi nhuận (theo ngày, theo tuần, theo tháng...)
 * @param confidence Độ tin cậy (mặc định 95%)
 * @param portfolioValue Giá trị danh mục đầu tư
 * @returns Giá trị rủi ro
 */
export const calculateHistoricalVaR = (
  returns: number[],
  confidence: number = 95,
  portfolioValue: number
): number => {
  if (returns.length === 0) {
    throw new Error('Mảng tỷ lệ lợi nhuận không thể rỗng');
  }
  
  // Sắp xếp tỷ lệ lợi nhuận từ thấp đến cao
  const sortedReturns = [...returns].sort((a, b) => a - b);
  
  // Tính vị trí phân vị dựa trên độ tin cậy
  const percentile = 100 - confidence;
  const position = Math.floor((percentile / 100) * sortedReturns.length);
  
  // Lấy giá trị ở vị trí phân vị
  const varReturn = sortedReturns[position];
  
  // Chuyển đổi thành giá trị tiền tệ
  return Math.abs(varReturn * portfolioValue);
};

/**
 * Tính chỉ số Sharpe Ratio
 * @param returns Mảng tỷ lệ lợi nhuận
 * @param riskFreeRate Lãi suất phi rủi ro (mặc định 0.02 - 2%)
 * @returns Chỉ số Sharpe Ratio
 */
export const calculateSharpeRatio = (
  returns: number[],
  riskFreeRate: number = 0.02
): number => {
  if (returns.length === 0) {
    throw new Error('Mảng tỷ lệ lợi nhuận không thể rỗng');
  }
  
  // Tính trung bình lợi nhuận
  const meanReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  
  // Tính độ lệch chuẩn (rủi ro)
  const squaredDifferences = returns.map(value => Math.pow(value - meanReturn, 2));
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  // Tính Sharpe Ratio
  return (meanReturn - riskFreeRate) / stdDev;
};

/**
 * Tính chỉ số Sortino Ratio (chỉ xét rủi ro từ lợi nhuận âm)
 * @param returns Mảng tỷ lệ lợi nhuận
 * @param riskFreeRate Lãi suất phi rủi ro (mặc định 0.02 - 2%)
 * @param targetReturn Tỷ lệ lợi nhuận mục tiêu (mặc định bằng lãi suất phi rủi ro)
 * @returns Chỉ số Sortino Ratio
 */
export const calculateSortinoRatio = (
  returns: number[],
  riskFreeRate: number = 0.02,
  targetReturn: number = riskFreeRate
): number => {
  if (returns.length === 0) {
    throw new Error('Mảng tỷ lệ lợi nhuận không thể rỗng');
  }
  
  // Tính trung bình lợi nhuận
  const meanReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  
  // Tính chỉ lấy lợi nhuận âm (dưới mức mục tiêu)
  const negativeReturns = returns.filter(value => value < targetReturn);
  
  if (negativeReturns.length === 0) {
    return Infinity; // Nếu không có lợi nhuận âm
  }
  
  // Tính độ lệch chuẩn của lợi nhuận âm
  const squaredDifferences = negativeReturns.map(value => Math.pow(value - targetReturn, 2));
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / negativeReturns.length;
  const downwardDeviation = Math.sqrt(variance);
  
  // Tính Sortino Ratio
  return (meanReturn - riskFreeRate) / downwardDeviation;
};

/**
 * Tính Maximum Drawdown (MDD)
 * @param portfolioValues Mảng giá trị danh mục đầu tư theo thời gian
 * @returns Maximum Drawdown (phần trăm)
 */
export const calculateMaxDrawdown = (portfolioValues: number[]): number => {
  if (portfolioValues.length <= 1) {
    return 0;
  }
  
  let maxDrawdown = 0;
  let peak = portfolioValues[0];
  
  // Tìm drawdown lớn nhất
  for (let i = 1; i < portfolioValues.length; i++) {
    if (portfolioValues[i] > peak) {
      peak = portfolioValues[i];
    } else {
      const drawdown = (peak - portfolioValues[i]) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown * 100; // Chuyển thành phần trăm
};

/**
 * Tính chỉ số Calmar Ratio
 * @param returns Mảng tỷ lệ lợi nhuận hàng năm
 * @param portfolioValues Mảng giá trị danh mục đầu tư theo thời gian
 * @returns Chỉ số Calmar Ratio
 */
export const calculateCalmarRatio = (
  returns: number[],
  portfolioValues: number[]
): number => {
  if (returns.length === 0 || portfolioValues.length <= 1) {
    throw new Error('Mảng dữ liệu không thể rỗng hoặc chỉ có một giá trị');
  }
  
  // Tính trung bình lợi nhuận hàng năm
  const meanAnnualReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  
  // Tính Maximum Drawdown
  const maxDrawdown = calculateMaxDrawdown(portfolioValues) / 100; // Chuyển thành tỷ lệ
  
  if (maxDrawdown === 0) {
    return Infinity; // Không có drawdown
  }
  
  // Tính Calmar Ratio
  return meanAnnualReturn / maxDrawdown;
};

/**
 * Tính tỷ lệ rủi ro tổng thể của danh mục
 * @param positionSizes Mảng kích thước các vị thế (theo đơn vị tiền)
 * @param stopLossDistances Mảng khoảng cách dừng lỗ tính theo phần trăm
 * @param accountBalance Số dư tài khoản
 * @returns Tỷ lệ rủi ro tổng thể (phần trăm)
 */
export const calculateTotalPortfolioRisk = (
  positionSizes: number[],
  stopLossDistances: number[],
  accountBalance: number
): number => {
  if (positionSizes.length !== stopLossDistances.length) {
    throw new Error('Số lượng vị thế và khoảng cách dừng lỗ phải bằng nhau');
  }
  
  if (positionSizes.length === 0) {
    return 0;
  }
  
  let totalRiskAmount = 0;
  
  // Tính tổng số tiền rủi ro
  for (let i = 0; i < positionSizes.length; i++) {
    const riskAmount = positionSizes[i] * (stopLossDistances[i] / 100);
    totalRiskAmount += riskAmount;
  }
  
  // Tính tỷ lệ rủi ro tổng thể
  return (totalRiskAmount / accountBalance) * 100;
};

/**
 * Kiểm tra sự tương quan giữa các tài sản để quản lý rủi ro
 * @param assetsReturns Mảng chứa các mảng tỷ lệ lợi nhuận của từng tài sản
 * @returns Ma trận tương quan
 */
export const calculateCorrelationMatrix = (assetsReturns: number[][]): number[][] => {
  const numAssets = assetsReturns.length;
  
  if (numAssets === 0) {
    return [];
  }
  
  // Khởi tạo ma trận tương quan
  const correlationMatrix: number[][] = Array(numAssets).fill(0).map(() => Array(numAssets).fill(0));
  
  // Tính mean và standard deviation cho mỗi tài sản
  const means: number[] = [];
  const stdDevs: number[] = [];
  
  for (let i = 0; i < numAssets; i++) {
    const returns = assetsReturns[i];
    const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    
    const squaredDifferences = returns.map(value => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    means.push(mean);
    stdDevs.push(stdDev);
  }
  
  // Tính hệ số tương quan cho từng cặp tài sản
  for (let i = 0; i < numAssets; i++) {
    // Mỗi tài sản tương quan hoàn hảo với chính nó
    correlationMatrix[i][i] = 1;
    
    for (let j = i + 1; j < numAssets; j++) {
      const returnsI = assetsReturns[i];
      const returnsJ = assetsReturns[j];
      const meanI = means[i];
      const meanJ = means[j];
      const stdDevI = stdDevs[i];
      const stdDevJ = stdDevs[j];
      
      // Tính hệ số tương quan
      let covariance = 0;
      for (let k = 0; k < returnsI.length; k++) {
        covariance += (returnsI[k] - meanI) * (returnsJ[k] - meanJ);
      }
      covariance /= returnsI.length;
      
      const correlation = covariance / (stdDevI * stdDevJ);
      
      // Ma trận tương quan đối xứng
      correlationMatrix[i][j] = correlation;
      correlationMatrix[j][i] = correlation;
    }
  }
  
  return correlationMatrix;
}; 