/**
 * Tiện ích tối ưu hóa danh mục đầu tư
 * Cung cấp các hàm tính toán phân bổ tài sản tối ưu cho portfolio
 */

/**
 * Tính tỷ trọng của từng tài sản trong danh mục sử dụng Modern Portfolio Theory (MPT)
 * @param returns Mảng chứa các mảng tỷ lệ lợi nhuận lịch sử của từng tài sản
 * @param targetReturn Tỷ suất lợi nhuận mục tiêu (có thể không cần thiết nếu chỉ tối ưu hóa theo rủi ro)
 * @returns Mảng tỷ trọng của các tài sản trong danh mục (tổng bằng 1)
 */
export const calculateEfficientFrontierWeights = (
  returns: number[][],
  targetReturn?: number
): number[] => {
  const numAssets = returns.length;
  
  if (numAssets === 0) {
    return [];
  }
  
  // Tính toán trung bình lợi nhuận của mỗi tài sản
  const meanReturns: number[] = [];
  for (let i = 0; i < numAssets; i++) {
    const assetReturns = returns[i];
    const mean = assetReturns.reduce((sum, ret) => sum + ret, 0) / assetReturns.length;
    meanReturns.push(mean);
  }
  
  // Tính ma trận hiệp phương sai
  const covarianceMatrix: number[][] = Array(numAssets).fill(0).map(() => Array(numAssets).fill(0));
  
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      const returnsI = returns[i];
      const returnsJ = returns[j];
      const meanI = meanReturns[i];
      const meanJ = meanReturns[j];
      
      let covariance = 0;
      for (let k = 0; k < returnsI.length; k++) {
        covariance += (returnsI[k] - meanI) * (returnsJ[k] - meanJ);
      }
      covariance /= returnsI.length;
      
      covarianceMatrix[i][j] = covariance;
    }
  }
  
  // Nếu có targetReturn, thực hiện tối ưu hóa có ràng buộc
  if (targetReturn !== undefined) {
    return calculateMinimumVariancePortfolio(covarianceMatrix, meanReturns, targetReturn);
  }
  
  // Nếu không có targetReturn, thực hiện tối ưu hóa không ràng buộc (danh mục phương sai tối thiểu)
  return calculateGlobalMinimumVariancePortfolio(covarianceMatrix);
};

/**
 * Tính danh mục với phương sai tối thiểu (Global Minimum Variance Portfolio - GMVP)
 * @param covarianceMatrix Ma trận hiệp phương sai
 * @returns Mảng tỷ trọng của các tài sản trong danh mục (tổng bằng 1)
 */
const calculateGlobalMinimumVariancePortfolio = (covarianceMatrix: number[][]): number[] => {
  const numAssets = covarianceMatrix.length;
  
  // Giải pháp đơn giản: sử dụng inverse của ma trận hiệp phương sai
  // và vector toàn số 1 để tìm danh mục phương sai tối thiểu
  // Đây là phương pháp đơn giản hóa
  // Trong thực tế, cần sử dụng các thư viện tối ưu hóa như mathjs, numeric.js v.v.
  
  // Tính tổng của mỗi cột trong ma trận nghịch đảo
  // Đây là phần đơn giản hóa, trong thực tế cần tính inverse của ma trận
  const columnSums: number[] = Array(numAssets).fill(0);
  
  for (let i = 0; i < numAssets; i++) {
    let sum = 0;
    for (let j = 0; j < numAssets; j++) {
      // Giả lập việc lấy inverse, trong thực tế nên dùng thư viện
      sum += 1 / (covarianceMatrix[i][j] + 0.0001); // Thêm một số nhỏ để tránh chia cho 0
    }
    columnSums[i] = sum;
  }
  
  // Tính tổng tất cả các phần tử
  const totalSum = columnSums.reduce((a, b) => a + b, 0);
  
  // Tính tỷ trọng bằng cách chuẩn hóa
  return columnSums.map(sum => sum / totalSum);
};

/**
 * Tính danh mục với phương sai tối thiểu tại một mức lợi nhuận mục tiêu
 * @param covarianceMatrix Ma trận hiệp phương sai
 * @param meanReturns Mảng lợi nhuận trung bình của các tài sản
 * @param targetReturn Tỷ suất lợi nhuận mục tiêu
 * @returns Mảng tỷ trọng của các tài sản trong danh mục (tổng bằng 1)
 */
const calculateMinimumVariancePortfolio = (
  covarianceMatrix: number[][],
  meanReturns: number[],
  targetReturn: number
): number[] => {
  const numAssets = covarianceMatrix.length;
  
  // Đây là một phương pháp tiếp cận đơn giản
  // Trong thực tế, nên sử dụng các thư viện tối ưu hóa
  
  // Kiểm tra xem targetReturn có nằm trong khoảng lợi nhuận khả thi không
  const minReturn = Math.min(...meanReturns);
  const maxReturn = Math.max(...meanReturns);
  
  if (targetReturn < minReturn || targetReturn > maxReturn) {
    // Nếu targetReturn không khả thi, trả về phân bổ đều
    return Array(numAssets).fill(1 / numAssets);
  }
  
  // Tạo một ứng cử tối ưu ban đầu (phân bổ đều)
  let weights = Array(numAssets).fill(1 / numAssets);
  
  // Tính lợi nhuận với weights hiện tại
  let currentReturn = 0;
  for (let i = 0; i < numAssets; i++) {
    currentReturn += weights[i] * meanReturns[i];
  }
  
  // Điều chỉnh weights để đạt được targetReturn
  // Đây là cách tiếp cận đơn giản, không đảm bảo tối ưu
  // Trong thực tế, nên sử dụng các thuật toán tối ưu hóa như quadratic programming
  let iterations = 0;
  const maxIterations = 1000;
  const tolerance = 0.0001;
  
  while (Math.abs(currentReturn - targetReturn) > tolerance && iterations < maxIterations) {
    // Tìm tài sản có rủi ro thấp nhất và cao nhất
    let minRiskAsset = 0;
    let maxRiskAsset = 0;
    let minRisk = Infinity;
    let maxRisk = -Infinity;
    
    for (let i = 0; i < numAssets; i++) {
      const risk = covarianceMatrix[i][i]; // Variance as a simple risk measure
      
      if (risk < minRisk) {
        minRisk = risk;
        minRiskAsset = i;
      }
      
      if (risk > maxRisk) {
        maxRisk = risk;
        maxRiskAsset = i;
      }
    }
    
    // Điều chỉnh tỷ trọng
    const adjustmentStep = 0.01;
    
    if (currentReturn < targetReturn) {
      // Cần tăng lợi nhuận
      // Giảm tỷ trọng của tài sản có rủi ro thấp và tăng tỷ trọng của tài sản có lợi nhuận cao
      const highReturnAsset = meanReturns.indexOf(Math.max(...meanReturns));
      
      weights[minRiskAsset] -= adjustmentStep;
      weights[highReturnAsset] += adjustmentStep;
    } else {
      // Cần giảm lợi nhuận
      // Giảm tỷ trọng của tài sản có rủi ro cao và tăng tỷ trọng của tài sản có lợi nhuận thấp
      const lowReturnAsset = meanReturns.indexOf(Math.min(...meanReturns));
      
      weights[maxRiskAsset] -= adjustmentStep;
      weights[lowReturnAsset] += adjustmentStep;
    }
    
    // Chuẩn hóa weights để tổng bằng 1
    const weightsSum = weights.reduce((a, b) => a + b, 0);
    weights = weights.map(w => w / weightsSum);
    
    // Tính lợi nhuận mới
    currentReturn = 0;
    for (let i = 0; i < numAssets; i++) {
      currentReturn += weights[i] * meanReturns[i];
    }
    
    iterations++;
  }
  
  return weights;
};

/**
 * Tính tỷ trọng Maximum Sharpe Ratio Portfolio (Tangency Portfolio)
 * @param returns Mảng chứa các mảng tỷ lệ lợi nhuận lịch sử của từng tài sản
 * @param riskFreeRate Lãi suất phi rủi ro
 * @returns Mảng tỷ trọng của các tài sản trong danh mục (tổng bằng 1)
 */
export const calculateMaximumSharpeRatioWeights = (
  returns: number[][],
  riskFreeRate: number = 0.02
): number[] => {
  const numAssets = returns.length;
  
  if (numAssets === 0) {
    return [];
  }
  
  // Tính toán trung bình lợi nhuận vượt trội (excess return) của mỗi tài sản
  const excessReturns: number[] = [];
  for (let i = 0; i < numAssets; i++) {
    const assetReturns = returns[i];
    const mean = assetReturns.reduce((sum, ret) => sum + ret, 0) / assetReturns.length;
    excessReturns.push(mean - riskFreeRate);
  }
  
  // Tính ma trận hiệp phương sai
  const covarianceMatrix: number[][] = Array(numAssets).fill(0).map(() => Array(numAssets).fill(0));
  
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      const returnsI = returns[i];
      const returnsJ = returns[j];
      const meanI = excessReturns[i] + riskFreeRate;
      const meanJ = excessReturns[j] + riskFreeRate;
      
      let covariance = 0;
      for (let k = 0; k < returnsI.length; k++) {
        covariance += (returnsI[k] - meanI) * (returnsJ[k] - meanJ);
      }
      covariance /= returnsI.length;
      
      covarianceMatrix[i][j] = covariance;
    }
  }
  
  // Định nghĩa một heuristic đơn giản để ước tính tỷ trọng tối đa Sharpe ratio
  // Trong thực tế, nên sử dụng các thư viện tối ưu hóa
  
  // Tính ước lượng tỷ trọng: weight_i proportional to excess_return_i / variance_i
  const weights: number[] = [];
  
  for (let i = 0; i < numAssets; i++) {
    const variance = covarianceMatrix[i][i];
    // Tránh chia cho 0 hoặc giá trị rất nhỏ
    const weight = excessReturns[i] / (variance + 0.0001);
    weights.push(weight);
  }
  
  // Chuẩn hóa weights để tổng bằng 1
  // Hoặc đảm bảo tất cả weights đều dương
  const totalWeight = weights.reduce((a, b) => a + Math.max(0, b), 0);
  
  if (totalWeight <= 0) {
    // Nếu không có tài sản nào có excess return dương, trả về phân bổ đều
    return Array(numAssets).fill(1 / numAssets);
  }
  
  return weights.map(w => Math.max(0, w) / totalWeight);
};

/**
 * Tính phân bổ theo phương pháp Equal Risk Contribution (ERC)
 * @param covarianceMatrix Ma trận hiệp phương sai
 * @returns Mảng tỷ trọng của các tài sản trong danh mục (tổng bằng 1)
 */
export const calculateEqualRiskContribution = (covarianceMatrix: number[][]): number[] => {
  const numAssets = covarianceMatrix.length;
  
  // Khởi tạo với tỷ trọng bằng nhau
  let weights = Array(numAssets).fill(1 / numAssets);
  
  // Thuật toán lặp đơn giản để tìm tỷ trọng ERC
  // Trong thực tế, nên sử dụng các thuật toán tối ưu hóa phức tạp hơn
  const maxIterations = 1000;
  const tolerance = 0.0001;
  let iterations = 0;
  
  while (iterations < maxIterations) {
    // Tính tổng rủi ro của danh mục
    let portfolioRisk = 0;
    for (let i = 0; i < numAssets; i++) {
      for (let j = 0; j < numAssets; j++) {
        portfolioRisk += weights[i] * weights[j] * covarianceMatrix[i][j];
      }
    }
    portfolioRisk = Math.sqrt(portfolioRisk);
    
    // Tính đóng góp rủi ro của mỗi tài sản
    const riskContributions: number[] = [];
    for (let i = 0; i < numAssets; i++) {
      let marginalRisk = 0;
      for (let j = 0; j < numAssets; j++) {
        marginalRisk += weights[j] * covarianceMatrix[i][j];
      }
      riskContributions.push(weights[i] * marginalRisk / portfolioRisk);
    }
    
    // Tính toán trung bình đóng góp rủi ro
    const avgRiskContribution = portfolioRisk / numAssets;
    
    // Kiểm tra xem các đóng góp rủi ro có gần bằng nhau không
    let maxDiff = 0;
    for (let i = 0; i < numAssets; i++) {
      const diff = Math.abs(riskContributions[i] - avgRiskContribution);
      maxDiff = Math.max(maxDiff, diff);
    }
    
    if (maxDiff < tolerance) {
      break;
    }
    
    // Điều chỉnh tỷ trọng
    const newWeights: number[] = [];
    for (let i = 0; i < numAssets; i++) {
      // Nếu đóng góp rủi ro lớn hơn trung bình, giảm tỷ trọng
      // Nếu đóng góp rủi ro nhỏ hơn trung bình, tăng tỷ trọng
      const adjustmentFactor = avgRiskContribution / riskContributions[i];
      newWeights.push(weights[i] * Math.sqrt(adjustmentFactor));
    }
    
    // Chuẩn hóa tỷ trọng mới
    const totalWeight = newWeights.reduce((a, b) => a + b, 0);
    weights = newWeights.map(w => w / totalWeight);
    
    iterations++;
  }
  
  return weights;
};

/**
 * Tính phân bổ theo phương pháp Inverting Volatility (Risk Parity)
 * @param returns Mảng chứa các mảng tỷ lệ lợi nhuận lịch sử của từng tài sản
 * @returns Mảng tỷ trọng của các tài sản trong danh mục (tổng bằng 1)
 */
export const calculateInverseVolatilityWeights = (returns: number[][]): number[] => {
  const numAssets = returns.length;
  
  if (numAssets === 0) {
    return [];
  }
  
  // Tính volatility (độ lệch chuẩn) của mỗi tài sản
  const volatilities: number[] = [];
  
  for (let i = 0; i < numAssets; i++) {
    const assetReturns = returns[i];
    const mean = assetReturns.reduce((sum, ret) => sum + ret, 0) / assetReturns.length;
    
    let sumSquaredDiff = 0;
    for (let j = 0; j < assetReturns.length; j++) {
      sumSquaredDiff += Math.pow(assetReturns[j] - mean, 2);
    }
    
    const variance = sumSquaredDiff / assetReturns.length;
    const volatility = Math.sqrt(variance);
    
    volatilities.push(volatility);
  }
  
  // Tính tỷ trọng tỷ lệ nghịch với volatility
  const inverseVolatilities = volatilities.map(vol => 1 / (vol + 0.0001)); // Tránh chia cho 0
  
  // Chuẩn hóa để tổng bằng 1
  const totalInverseVol = inverseVolatilities.reduce((a, b) => a + b, 0);
  
  return inverseVolatilities.map(invVol => invVol / totalInverseVol);
};

/**
 * Tính phân bổ tài sản theo phương pháp Black-Litterman
 * @param marketCap Mảng vốn hóa thị trường của các tài sản
 * @param covarianceMatrix Ma trận hiệp phương sai
 * @param views Mảng quan điểm về lợi nhuận dự kiến
 * @param riskAversion Độ không ưa thích rủi ro (mặc định 2.5)
 * @returns Mảng tỷ trọng của các tài sản trong danh mục (tổng bằng 1)
 */
export const calculateBlackLittermanWeights = (
  marketCap: number[],
  covarianceMatrix: number[][],
  views: { assetIndex: number; expectedReturn: number; confidence: number }[],
  riskAversion: number = 2.5
): number[] => {
  const numAssets = marketCap.length;
  
  // Tính tỷ trọng theo vốn hóa thị trường
  const totalMarketCap = marketCap.reduce((a, b) => a + b, 0);
  const marketWeights = marketCap.map(cap => cap / totalMarketCap);
  
  // Tính lợi nhuận cân bằng thị trường (market equilibrium returns)
  const equilibriumReturns: number[] = [];
  for (let i = 0; i < numAssets; i++) {
    let expected = 0;
    for (let j = 0; j < numAssets; j++) {
      expected += covarianceMatrix[i][j] * marketWeights[j];
    }
    equilibriumReturns.push(riskAversion * expected);
  }
  
  // Nếu không có quan điểm, trả về tỷ trọng thị trường
  if (!views || views.length === 0) {
    return marketWeights;
  }
  
  // Tạo ma trận P (ma trận quan điểm)
  const P: number[][] = [];
  const q: number[] = [];
  const omega: number[][] = Array(views.length).fill(0).map(() => Array(views.length).fill(0));
  
  for (let i = 0; i < views.length; i++) {
    const view = views[i];
    const viewRow = Array(numAssets).fill(0);
    viewRow[view.assetIndex] = 1;
    P.push(viewRow);
    q.push(view.expectedReturn);
    
    // Tạo ma trận Omega (tin cậy của quan điểm)
    // Trong mô hình đơn giản, chúng ta sử dụng tin cậy như là một phần trăm của phương sai
    const variance = covarianceMatrix[view.assetIndex][view.assetIndex];
    omega[i][i] = variance * (1 - view.confidence);
  }
  
  // Đây là một mô phỏng đơn giản của thuật toán Black-Litterman
  // Trong thực tế, cần sử dụng các thư viện đại số tuyến tính để tính
  // inverse của ma trận và nhân ma trận
  
  // Trong phương pháp đơn giản, chúng ta sẽ dựa trên công thức:
  // E(R) = [(tau * Σ)^(-1) + P' * Ω^(-1) * P]^(-1) * [(tau * Σ)^(-1) * π + P' * Ω^(-1) * q]
  // Và sau đó w = (λΣ)^(-1) * E(R)
  
  // Nhưng vì tính toán matrix inverse phức tạp, chúng ta sẽ đơn giản hóa
  // và trả về một kết quả xấp xỉ dựa trên equilibrium returns và views
  
  const combinedReturns: number[] = Array(numAssets).fill(0);
  
  // Sử dụng equilibrium returns làm cơ sở
  for (let i = 0; i < numAssets; i++) {
    combinedReturns[i] = equilibriumReturns[i];
  }
  
  // Kết hợp với views
  for (const view of views) {
    const assetIndex = view.assetIndex;
    const confidence = view.confidence;
    
    // Kết hợp tuyến tính
    combinedReturns[assetIndex] = (1 - confidence) * equilibriumReturns[assetIndex] + confidence * view.expectedReturn;
  }
  
  // Tính tỷ trọng dựa trên combined returns
  // w = (λΣ)^(-1) * E(R)
  const weights: number[] = [];
  
  // Đơn giản hóa bằng cách chia expected return cho risk (variance)
  for (let i = 0; i < numAssets; i++) {
    const variance = covarianceMatrix[i][i];
    weights.push(combinedReturns[i] / (riskAversion * variance));
  }
  
  // Chuẩn hóa weights
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => w / totalWeight);
}; 