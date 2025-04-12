import { CandlestickPattern } from '../../types';

// Dữ liệu mẫu các mẫu hình nến phổ biến
export const candlestickPatterns: CandlestickPattern[] = [
  {
    id: 'doji',
    name: 'Doji',
    type: 'Reversal',
    sentiment: 'NEUTRAL',
    description: 'Doji là mẫu hình nến mà giá mở cửa và giá đóng cửa gần như bằng nhau, tạo thành một đường ngang nhỏ. Doji cho thấy sự do dự trong thị trường và có thể báo hiệu đảo chiều tiềm năng.',
    confidence: 60,
    timeframe: '1h, 4h, 1d',
    imageUrl: '/images/patterns/doji.png',
    points: [
      'Giá mở cửa và đóng cửa gần như bằng nhau',
      'Bóng trên và dưới cho thấy biên độ giao dịch trong phiên',
      'Thường xuất hiện sau một xu hướng rõ ràng'
    ],
    tradingRecommendation: {
      action: 'WATCH',
      description: 'Theo dõi các xác nhận bổ sung trong các phiên tiếp theo',
    }
  },
  {
    id: 'hammer',
    name: 'Búa (Hammer)',
    type: 'Reversal',
    sentiment: 'BULLISH',
    description: 'Mẫu hình Búa xuất hiện trong downtrend và có bóng dưới dài, phần thân nhỏ ở phía trên nến. Mẫu hình này báo hiệu kết thúc downtrend và đảo chiều tiềm năng.',
    confidence: 70,
    timeframe: '1h, 4h, 1d',
    imageUrl: '/images/patterns/hammer.png',
    points: [
      'Xuất hiện trong downtrend',
      'Bóng dưới ít nhất gấp đôi chiều dài thân nến',
      'Thân nến nhỏ ở gần mức cao của phiên',
      'Bóng trên rất nhỏ hoặc không tồn tại'
    ],
    tradingRecommendation: {
      action: 'BUY',
      description: 'Mua khi có xác nhận trong phiên tiếp theo (nến tăng)',
      priceTarget: 'Tối thiểu bằng chiều dài nến hammer tính từ điểm vào lệnh',
      stopLoss: 'Dưới mức thấp nhất của nến hammer'
    }
  },
  {
    id: 'shooting-star',
    name: 'Sao Băng (Shooting Star)',
    type: 'Reversal',
    sentiment: 'BEARISH',
    description: 'Mẫu hình Sao Băng xuất hiện trong uptrend và có bóng trên dài, phần thân nhỏ ở phía dưới nến. Báo hiệu kết thúc uptrend và đảo chiều tiềm năng.',
    confidence: 70,
    timeframe: '1h, 4h, 1d',
    imageUrl: '/images/patterns/shooting-star.png',
    points: [
      'Xuất hiện trong uptrend',
      'Bóng trên ít nhất gấp đôi chiều dài thân nến',
      'Thân nến nhỏ ở gần mức thấp của phiên',
      'Bóng dưới rất nhỏ hoặc không tồn tại'
    ],
    tradingRecommendation: {
      action: 'SELL',
      description: 'Bán khi có xác nhận trong phiên tiếp theo (nến giảm)',
      priceTarget: 'Tối thiểu bằng chiều dài nến shooting star tính từ điểm vào lệnh',
      stopLoss: 'Trên mức cao nhất của nến shooting star'
    }
  },
  {
    id: 'engulfing-bullish',
    name: 'Nến Bao Phủ Tăng (Bullish Engulfing)',
    type: 'Reversal',
    sentiment: 'BULLISH',
    description: 'Mẫu hình Nến Bao Phủ Tăng là mẫu hình 2 nến, xuất hiện trong downtrend. Nến thứ hai là nến tăng (xanh) với thân bao phủ hoàn toàn thân của nến trước đó (đỏ).',
    confidence: 80,
    timeframe: '1h, 4h, 1d',
    imageUrl: '/images/patterns/bullish-engulfing.png',
    points: [
      'Xuất hiện trong downtrend',
      'Nến đầu tiên có thân nhỏ và màu đỏ (giảm)',
      'Nến thứ hai có thân lớn và màu xanh (tăng)',
      'Thân nến thứ hai hoàn toàn bao phủ thân nến đầu tiên'
    ],
    tradingRecommendation: {
      action: 'BUY',
      description: 'Mua tại giá mở cửa phiên sau mẫu hình',
      priceTarget: 'Tối thiểu gấp đôi khoảng cách từ giá vào đến stop loss',
      stopLoss: 'Dưới mức thấp nhất của hai nến trong mẫu hình'
    }
  },
  {
    id: 'engulfing-bearish',
    name: 'Nến Bao Phủ Giảm (Bearish Engulfing)',
    type: 'Reversal',
    sentiment: 'BEARISH',
    description: 'Mẫu hình Nến Bao Phủ Giảm là mẫu hình 2 nến, xuất hiện trong uptrend. Nến thứ hai là nến giảm (đỏ) với thân bao phủ hoàn toàn thân của nến trước đó (xanh).',
    confidence: 80,
    timeframe: '1h, 4h, 1d',
    imageUrl: '/images/patterns/bearish-engulfing.png',
    points: [
      'Xuất hiện trong uptrend',
      'Nến đầu tiên có thân nhỏ và màu xanh (tăng)',
      'Nến thứ hai có thân lớn và màu đỏ (giảm)',
      'Thân nến thứ hai hoàn toàn bao phủ thân nến đầu tiên'
    ],
    tradingRecommendation: {
      action: 'SELL',
      description: 'Bán tại giá mở cửa phiên sau mẫu hình',
      priceTarget: 'Tối thiểu gấp đôi khoảng cách từ giá vào đến stop loss',
      stopLoss: 'Trên mức cao nhất của hai nến trong mẫu hình'
    }
  },
  {
    id: 'evening-star',
    name: 'Sao Buổi Tối (Evening Star)',
    type: 'Reversal',
    sentiment: 'BEARISH',
    description: 'Mẫu hình Sao Buổi Tối là mẫu hình 3 nến, xuất hiện tại đỉnh uptrend. Nến đầu tiên là nến tăng mạnh, nến giữa có thân nhỏ (thường là doji), và nến thứ ba là nến giảm mạnh.',
    confidence: 75,
    timeframe: '4h, 1d',
    imageUrl: '/images/patterns/evening-star.png',
    points: [
      'Xuất hiện ở đỉnh uptrend',
      'Nến đầu tiên là nến tăng mạnh',
      'Nến giữa có thân nhỏ hoặc doji, thường tạo khoảng trống giá với nến trước',
      'Nến thứ ba là nến giảm mạnh, thường đóng cửa sâu vào thân nến đầu tiên'
    ],
    tradingRecommendation: {
      action: 'SELL',
      description: 'Bán sau khi nến thứ ba hoàn thành',
      priceTarget: 'Tối thiểu bằng chiều cao của 3 nến trong mẫu hình',
      stopLoss: 'Trên mức cao nhất của mẫu hình'
    }
  },
  {
    id: 'morning-star',
    name: 'Sao Buổi Sáng (Morning Star)',
    type: 'Reversal',
    sentiment: 'BULLISH',
    description: 'Mẫu hình Sao Buổi Sáng là mẫu hình 3 nến, xuất hiện tại đáy downtrend. Nến đầu tiên là nến giảm mạnh, nến giữa có thân nhỏ (thường là doji), và nến thứ ba là nến tăng mạnh.',
    confidence: 75,
    timeframe: '4h, 1d',
    imageUrl: '/images/patterns/morning-star.png',
    points: [
      'Xuất hiện ở đáy downtrend',
      'Nến đầu tiên là nến giảm mạnh',
      'Nến giữa có thân nhỏ hoặc doji, thường tạo khoảng trống giá với nến trước',
      'Nến thứ ba là nến tăng mạnh, thường đóng cửa sâu vào thân nến đầu tiên'
    ],
    tradingRecommendation: {
      action: 'BUY',
      description: 'Mua sau khi nến thứ ba hoàn thành',
      priceTarget: 'Tối thiểu bằng chiều cao của 3 nến trong mẫu hình',
      stopLoss: 'Dưới mức thấp nhất của mẫu hình'
    }
  },
  {
    id: 'three-white-soldiers',
    name: 'Ba Chàng Lính Trắng (Three White Soldiers)',
    type: 'Reversal',
    sentiment: 'BULLISH',
    description: 'Mẫu hình Ba Chàng Lính Trắng gồm ba nến tăng liên tiếp, mỗi nến mở cửa trong phạm vi thân nến trước và đóng cửa ở mức cao hơn nến trước. Báo hiệu sự chuyển đổi từ downtrend sang uptrend.',
    confidence: 85,
    timeframe: '4h, 1d',
    imageUrl: '/images/patterns/three-white-soldiers.png',
    points: [
      'Ba nến tăng liên tiếp',
      'Mỗi nến mở cửa trong phạm vi thân nến trước',
      'Mỗi nến đóng cửa gần mức cao nhất của nó',
      'Mỗi nến đóng cửa cao hơn nến trước'
    ],
    tradingRecommendation: {
      action: 'BUY',
      description: 'Mua sau khi nến thứ ba hoàn thành',
      priceTarget: 'Tối thiểu gấp đôi chiều cao của 3 nến',
      stopLoss: 'Dưới mức mở cửa của nến đầu tiên'
    }
  },
  {
    id: 'three-black-crows',
    name: 'Ba Con Quạ Đen (Three Black Crows)',
    type: 'Reversal',
    sentiment: 'BEARISH',
    description: 'Mẫu hình Ba Con Quạ Đen gồm ba nến giảm liên tiếp, mỗi nến mở cửa trong phạm vi thân nến trước và đóng cửa ở mức thấp hơn nến trước. Báo hiệu sự chuyển đổi từ uptrend sang downtrend.',
    confidence: 85,
    timeframe: '4h, 1d',
    imageUrl: '/images/patterns/three-black-crows.png',
    points: [
      'Ba nến giảm liên tiếp',
      'Mỗi nến mở cửa trong phạm vi thân nến trước',
      'Mỗi nến đóng cửa gần mức thấp nhất của nó',
      'Mỗi nến đóng cửa thấp hơn nến trước'
    ],
    tradingRecommendation: {
      action: 'SELL',
      description: 'Bán sau khi nến thứ ba hoàn thành',
      priceTarget: 'Tối thiểu gấp đôi chiều cao của 3 nến',
      stopLoss: 'Trên mức mở cửa của nến đầu tiên'
    }
  },
  {
    id: 'piercing-line',
    name: 'Đường Xuyên Thủng (Piercing Line)',
    type: 'Reversal',
    sentiment: 'BULLISH',
    description: 'Mẫu hình Đường Xuyên Thủng là mẫu hình 2 nến, xuất hiện trong downtrend. Nến đầu tiên là nến giảm, nến thứ hai mở cửa dưới mức thấp nhất của nến trước và đóng cửa trên giữa thân nến đầu tiên.',
    confidence: 70,
    timeframe: '1h, 4h, 1d',
    imageUrl: '/images/patterns/piercing-line.png',
    points: [
      'Xuất hiện trong downtrend',
      'Nến đầu tiên là nến giảm mạnh',
      'Nến thứ hai mở cửa dưới mức thấp nhất của nến trước',
      'Nến thứ hai đóng cửa trên giữa thân nến đầu tiên'
    ],
    tradingRecommendation: {
      action: 'BUY',
      description: 'Mua sau khi nến thứ hai hoàn thành',
      priceTarget: 'Tối thiểu bằng chiều cao của 2 nến',
      stopLoss: 'Dưới mức thấp nhất của nến thứ hai'
    }
  }
];

export default candlestickPatterns; 