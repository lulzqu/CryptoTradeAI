import { IAutoTradingStrategy } from '../models/AutoTradingStrategy';
import { TechnicalAnalysisService } from './technicalAnalysis';
import { PatternRecognitionService } from './patternRecognition';
import { RiskManagementService } from './riskManagement';
import { MexcService } from './mexc';
import { NotificationService } from './notification';
import { logger } from '../utils/logger';

export class AutoTradingService {
  private static instance: AutoTradingService;
  private technicalAnalysis: TechnicalAnalysisService;
  private patternRecognition: PatternRecognitionService;
  private riskManagement: RiskManagementService;
  private mexc: MexcService;
  private notification: NotificationService;

  private constructor() {
    this.technicalAnalysis = TechnicalAnalysisService.getInstance();
    this.patternRecognition = PatternRecognitionService.getInstance();
    this.riskManagement = RiskManagementService.getInstance();
    this.mexc = MexcService.getInstance();
    this.notification = NotificationService.getInstance();
  }

  public static getInstance(): AutoTradingService {
    if (!AutoTradingService.instance) {
      AutoTradingService.instance = new AutoTradingService();
    }
    return AutoTradingService.instance;
  }

  public async executeStrategy(strategy: IAutoTradingStrategy): Promise<void> {
    try {
      // Kiểm tra điều kiện thực thi
      if (strategy.status !== 'active') {
        return;
      }

      // Lấy dữ liệu thị trường
      const marketData = await this.mexc.getMarketData(strategy.symbol, strategy.timeframe);

      // Tính toán các chỉ báo
      const indicators = await this.calculateIndicators(marketData, strategy.indicators);

      // Kiểm tra điều kiện vào lệnh
      const shouldEnter = this.checkEntryConditions(indicators, strategy.entryConditions);
      if (shouldEnter) {
        // Kiểm tra rủi ro
        const riskCheck = await this.riskManagement.checkRisk(strategy);
        if (riskCheck.allowed) {
          // Thực hiện giao dịch
          await this.executeTrade(strategy, 'buy', riskCheck.positionSize);
        }
      }

      // Kiểm tra điều kiện thoát lệnh
      const shouldExit = this.checkExitConditions(indicators, strategy.exitConditions);
      if (shouldExit) {
        await this.executeTrade(strategy, 'sell');
      }

      // Cập nhật thời gian thực thi cuối cùng
      strategy.lastExecuted = new Date();
      await strategy.save();

    } catch (error) {
      logger.error(`Error executing strategy ${strategy.name}: ${error.message}`);
      await this.notification.sendErrorNotification(strategy.user, error.message);
    }
  }

  private async calculateIndicators(marketData: any[], indicators: any[]): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    
    for (const indicator of indicators) {
      results[indicator.name] = await this.technicalAnalysis.calculateIndicator(
        marketData,
        indicator
      );
    }

    return results;
  }

  private checkEntryConditions(indicators: Record<string, any>, conditions: any[]): boolean {
    return conditions.every(condition => {
      const indicatorValue = indicators[condition.type];
      return this.evaluateCondition(indicatorValue, condition.value);
    });
  }

  private checkExitConditions(indicators: Record<string, any>, conditions: any[]): boolean {
    return conditions.some(condition => {
      const indicatorValue = indicators[condition.type];
      return this.evaluateCondition(indicatorValue, condition.value);
    });
  }

  private evaluateCondition(value: any, condition: any): boolean {
    // Logic đánh giá điều kiện
    // TODO: Implement condition evaluation logic
    return true;
  }

  private async executeTrade(strategy: IAutoTradingStrategy, side: 'buy' | 'sell', amount?: number): Promise<void> {
    try {
      const order = await this.mexc.createOrder({
        symbol: strategy.symbol,
        side,
        type: 'market',
        quantity: amount
      });

      await this.notification.sendTradeNotification(
        strategy.user,
        `Đã thực hiện giao dịch ${side.toUpperCase()} cho chiến lược ${strategy.name}`
      );

      logger.info(`Executed ${side} trade for strategy ${strategy.name}: ${JSON.stringify(order)}`);
    } catch (error) {
      logger.error(`Error executing trade for strategy ${strategy.name}: ${error.message}`);
      throw error;
    }
  }
} 