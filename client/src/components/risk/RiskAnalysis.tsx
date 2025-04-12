import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tabs, Button, Form, InputNumber, Slider, Select, Alert } from 'antd';
import {
  WarningOutlined,
  DollarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  GoldOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { formatNumber, formatPercent } from '../../utils/formatters';
import './RiskAnalysis.css';

const { TabPane } = Tabs;
const { Option } = Select;

interface RiskAnalysisProps {
  portfolio?: any;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ portfolio }) => {
  const [form] = Form.useForm();
  const [riskMetrics, setRiskMetrics] = useState({
    var95: 0,
    var99: 0,
    cvar95: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    sortinoRatio: 0,
    beta: 0,
    correlationToBTC: 0,
    volatility: 0,
    expectedReturn: 0,
    riskReturnRatio: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example initial values
  const initialValues = {
    capital: 10000,
    riskPerTrade: 1,
    maxOpenPositions: 5,
    leverageLevel: 1,
    stopLossPercent: 5,
    confidenceLevel: 95,
    timeHorizon: 10,
    portfolioMix: 'balanced'
  };

  // Simulate risk calculation
  const calculateRisk = (values: any) => {
    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      // This would be replaced with real calculations from backend
      const leverage = values.leverageLevel || 1;
      const capital = values.capital || 10000;
      const riskPercent = values.riskPerTrade || 1;
      const stopLoss = values.stopLossPercent || 5;
      
      const riskAmount = capital * (riskPercent / 100);
      const positionSize = (riskAmount / (stopLoss / 100)) * leverage;
      const maxLoss = capital * (values.maxOpenPositions * riskPercent / 100);
      
      // Simulated risk metrics
      setRiskMetrics({
        var95: riskAmount * 1.65,
        var99: riskAmount * 2.33,
        cvar95: riskAmount * 2.06,
        maxDrawdown: (maxLoss / capital) * 100,
        sharpeRatio: 1.2 - (leverage * 0.1),
        sortinoRatio: 1.5 - (leverage * 0.15),
        beta: 0.7 + (leverage * 0.3),
        correlationToBTC: 0.65,
        volatility: 15 + (leverage * 5),
        expectedReturn: 8 + (leverage * 4),
        riskReturnRatio: (8 + (leverage * 4)) / (15 + (leverage * 5))
      });
      
      setLoading(false);
    }, 1000);
  };

  // Calculate initial risk metrics on component mount
  useEffect(() => {
    calculateRisk(initialValues);
  }, []);

  // Example data for charts
  const riskReturnData = [
    { asset: 'Danh mục của bạn', risk: riskMetrics.volatility, return: riskMetrics.expectedReturn },
    { asset: 'Bitcoin', risk: 25, return: 12 },
    { asset: 'Ethereum', risk: 30, return: 15 },
    { asset: 'S&P 500', risk: 10, return: 8 },
    { asset: 'Vàng', risk: 5, return: 3 }
  ];

  const allocationData = [
    { type: 'Bitcoin', value: 40 },
    { type: 'Ethereum', value: 25 },
    { type: 'Stablecoins', value: 20 },
    { type: 'Altcoins', value: 15 }
  ];

  const drawdownData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    drawdown: -Math.abs(Math.sin(i / 5) * (riskMetrics.maxDrawdown / 100) * 100)
  }));

  const riskReturnConfig = {
    data: riskReturnData,
    xField: 'risk',
    yField: 'return',
    colorField: 'asset',
    size: 10,
    shape: 'circle',
    point: {
      style: {
        fillOpacity: 1,
      },
    },
    xAxis: {
      title: {
        text: 'Rủi ro (độ biến động, %)',
      },
    },
    yAxis: {
      title: {
        text: 'Lợi nhuận kỳ vọng (%)',
      },
    },
    tooltip: {
      showTitle: false,
      formatter: (datum: any) => {
        return { name: datum.asset, value: `Rủi ro: ${datum.risk}%, Lợi nhuận: ${datum.return}%` };
      },
    },
  };

  const allocationConfig = {
    data: allocationData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `${datum.value}%` };
      },
    },
  };

  const drawdownConfig = {
    data: drawdownData,
    xField: 'day',
    yField: 'drawdown',
    seriesField: 'drawdown',
    smooth: true,
    color: '#ff4d4f',
    xAxis: {
      title: {
        text: 'Ngày',
      },
    },
    yAxis: {
      title: {
        text: 'Drawdown (%)',
      },
      min: -riskMetrics.maxDrawdown - 5,
      max: 0,
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Drawdown', value: `${datum.drawdown.toFixed(2)}%` };
      },
    },
  };

  return (
    <div className="risk-analysis-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="risk-card" title="Nhập thông số phân tích rủi ro">
            <Form
              form={form}
              layout="vertical"
              initialValues={initialValues}
              onFinish={calculateRisk}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="capital"
                    label="Vốn (USDT)"
                    rules={[{ required: true, message: 'Vui lòng nhập vốn' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={100} 
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="riskPerTrade"
                    label="Rủi ro mỗi giao dịch (%)"
                    rules={[{ required: true, message: 'Vui lòng nhập rủi ro' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0.1} 
                      max={10} 
                      step={0.1}
                      formatter={value => `${value}%`}
                      parser={value => value!.replace('%', '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="maxOpenPositions"
                    label="Vị thế mở tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập số vị thế' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={1} 
                      max={20} 
                      step={1}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="leverageLevel"
                    label="Đòn bẩy"
                    rules={[{ required: true, message: 'Vui lòng chọn đòn bẩy' }]}
                  >
                    <Select>
                      <Option value={1}>1x (Không đòn bẩy)</Option>
                      <Option value={2}>2x</Option>
                      <Option value={3}>3x</Option>
                      <Option value={5}>5x</Option>
                      <Option value={10}>10x</Option>
                      <Option value={20}>20x</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="stopLossPercent"
                label="Mức dừng lỗ (%)"
                rules={[{ required: true, message: 'Vui lòng nhập mức dừng lỗ' }]}
              >
                <Slider 
                  min={1} 
                  max={20} 
                  marks={{ 
                    1: '1%', 
                    5: '5%', 
                    10: '10%', 
                    15: '15%', 
                    20: '20%' 
                  }} 
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="confidenceLevel"
                    label="Mức độ tin cậy"
                    rules={[{ required: true, message: 'Vui lòng chọn mức độ tin cậy' }]}
                  >
                    <Select>
                      <Option value={90}>90%</Option>
                      <Option value={95}>95%</Option>
                      <Option value={99}>99%</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="timeHorizon"
                    label="Kỳ hạn (ngày)"
                    rules={[{ required: true, message: 'Vui lòng nhập kỳ hạn' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={1} 
                      max={365} 
                      step={1}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="portfolioMix"
                label="Phân bổ danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn phân bổ danh mục' }]}
              >
                <Select>
                  <Option value="conservative">Bảo toàn (70% Stablecoin, 30% Top Coins)</Option>
                  <Option value="balanced">Cân bằng (50% Top Coins, 40% Mid Caps, 10% Stablecoin)</Option>
                  <Option value="aggressive">Mạo hiểm (70% Mid/Small Caps, 30% Top Coins)</Option>
                  <Option value="custom">Tùy chỉnh</Option>
                </Select>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<BarChartOutlined />}
                >
                  Phân tích
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            className="risk-metrics-card" 
            title="Chỉ số rủi ro chính"
            extra={<Button type="link">Giải thích</Button>}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="VaR (95%)"
                  value={riskMetrics.var95}
                  precision={2}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<WarningOutlined />}
                  suffix="USDT"
                />
                <div className="metric-description">
                  Khả năng thua lỗ tối đa với độ tin cậy 95%
                </div>
              </Col>
              <Col span={12}>
                <Statistic
                  title="Max Drawdown"
                  value={riskMetrics.maxDrawdown}
                  precision={2}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<LineChartOutlined />}
                  suffix="%"
                />
                <div className="metric-description">
                  Mức sụt giảm lớn nhất dự kiến
                </div>
              </Col>
              <Col span={12}>
                <Statistic
                  title="Sharpe Ratio"
                  value={riskMetrics.sharpeRatio}
                  precision={2}
                  valueStyle={{ color: riskMetrics.sharpeRatio > 1 ? '#3f8600' : '#ff4d4f' }}
                  prefix={<BarChartOutlined />}
                />
                <div className="metric-description">
                  Tỷ lệ lợi nhuận trên rủi ro
                </div>
              </Col>
              <Col span={12}>
                <Statistic
                  title="Lợi nhuận kỳ vọng"
                  value={riskMetrics.expectedReturn}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                  suffix="%"
                />
                <div className="metric-description">
                  Lợi nhuận dự kiến trong kỳ hạn
                </div>
              </Col>
            </Row>
            
            {form.getFieldValue('leverageLevel') > 3 && (
              <Alert
                message="Cảnh báo đòn bẩy cao"
                description="Bạn đang sử dụng đòn bẩy cao, điều này làm tăng đáng kể rủi ro cho danh mục đầu tư."
                type="warning"
                showIcon
                className="margin-top-16"
              />
            )}
            
            {riskMetrics.maxDrawdown > 20 && (
              <Alert
                message="Rủi ro drawdown cao"
                description="Mức drawdown dự kiến vượt quá 20%, bạn nên xem xét giảm rủi ro mỗi giao dịch hoặc số lượng vị thế mở."
                type="warning"
                showIcon
                className="margin-top-16"
              />
            )}
          </Card>
          
          <Card className="risk-allocation-card margin-top-16">
            <Tabs defaultActiveKey="allocation">
              <TabPane tab="Phân bổ tài sản" key="allocation" icon={<PieChartOutlined />}>
                <Pie {...allocationConfig} />
              </TabPane>
              <TabPane tab="Rủi ro - Lợi nhuận" key="riskreturn" icon={<GoldOutlined />}>
                <Line {...riskReturnConfig} />
              </TabPane>
              <TabPane tab="Drawdown" key="drawdown" icon={<LineChartOutlined />}>
                <Line {...drawdownConfig} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RiskAnalysis; 