import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Select, Button, Form, Input, InputNumber, Slider, Space, Typography, Tag, Progress, Collapse, Alert, Switch, Divider } from 'antd';
import {
  SafetyOutlined,
  WarningOutlined,
  SettingOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CalculatorOutlined,
  EditOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import './RiskManagement.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const RiskManagement: React.FC = () => {
  const [riskSettings, setRiskSettings] = useState({
    maxRiskPerTrade: 2,
    maxDailyLoss: 5,
    maxWeeklyLoss: 15,
    stopLossDefault: 5,
    takeProfitDefault: 15,
    maxOpenTrades: 5,
    leverageLimit: 10,
    marginCallLevel: 75,
    liquidationLevel: 90,
    enableAutoStopLoss: true,
    enableTrailingStop: true,
    enableRiskCalculator: true
  });

  const [riskForm] = Form.useForm();

  // Thống kê hiệu suất
  const performanceStats = {
    winRate: 67,
    profitFactor: 2.7,
    averageWin: 4.8,
    averageLoss: 1.8,
    maxDrawdown: 12.5,
    sharpeRatio: 1.85,
    expectedValue: 2.04,
    riskRewardRatio: 2.5
  };

  // Dữ liệu lịch sử mức độ rủi ro theo tháng
  const riskLevelHistory = [
    { month: 'Tháng 1', level: 'Thấp', value: 25 },
    { month: 'Tháng 2', level: 'Trung bình', value: 45 },
    { month: 'Tháng 3', level: 'Cao', value: 75 },
    { month: 'Tháng 4', level: 'Trung bình', value: 55 },
    { month: 'Tháng 5', level: 'Thấp', value: 30 },
    { month: 'Tháng 6', level: 'Thấp', value: 20 },
  ];

  // Cài đặt cảnh báo
  const alertSettings = [
    { id: 1, name: 'Cảnh báo mức rủi ro cao', status: 'Kích hoạt', triggers: 'Mức rủi ro > 70%', notification: 'Email, Ứng dụng' },
    { id: 2, name: 'Cảnh báo lỗ vượt ngưỡng ngày', status: 'Kích hoạt', triggers: 'Lỗ > 5% trong ngày', notification: 'Email, Ứng dụng, SMS' },
    { id: 3, name: 'Cảnh báo thanh lý', status: 'Kích hoạt', triggers: 'Mức margin < 15%', notification: 'Email, Ứng dụng, SMS' },
    { id: 4, name: 'Cảnh báo hiệu suất thấp', status: 'Tắt', triggers: 'Win rate < 40% trong 10 giao dịch', notification: 'Email' },
  ];

  const riskExposureData = [
    { asset: 'BTC', exposure: 25, maxLoss: 2500 },
    { asset: 'ETH', exposure: 15, maxLoss: 1500 },
    { asset: 'SOL', exposure: 12, maxLoss: 1200 },
    { asset: 'BNB', exposure: 10, maxLoss: 1000 },
    { asset: 'ADA', exposure: 8, maxLoss: 800 },
    { asset: 'USDT', exposure: 30, maxLoss: 0 },
  ];

  const calculatePositionSize = (values: any) => {
    const { accountSize, riskPercent, entryPrice, stopLoss } = values;
    const riskAmount = accountSize * (riskPercent / 100);
    const priceDifference = Math.abs(entryPrice - stopLoss);
    const positionSize = riskAmount / priceDifference;
    
    return {
      riskAmount,
      positionSize,
      leverageRequired: entryPrice * positionSize / riskAmount
    };
  };

  const handleRiskFormSubmit = (values: any) => {
    const result = calculatePositionSize(values);
    
    // Update UI with calculation results
    setCalculationResult(result);
  };

  const [calculationResult, setCalculationResult] = useState<any>(null);

  return (
    <div className="risk-management-page">
      <Title level={2}>
        <SafetyOutlined /> Quản lý rủi ro
      </Title>
      <Paragraph className="page-description">
        Thiết lập và quản lý chiến lược kiểm soát rủi ro để bảo vệ vốn và tối ưu hiệu suất giao dịch của bạn.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Mức độ rủi ro hiện tại"
              value={45}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
            <Progress 
              percent={45} 
              strokeColor={{
                '0%': '#52c41a',
                '50%': '#faad14',
                '100%': '#f5222d',
              }}
              status="normal"
              showInfo={false}
              className="risk-progress"
            />
            <Text type="secondary">Trung bình</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Win Rate"
              value={performanceStats.winRate}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Profit Factor"
              value={performanceStats.profitFactor}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Max Drawdown"
              value={performanceStats.maxDrawdown}
              suffix="%"
              valueStyle={{ color: '#f5222d' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Cài đặt quản lý rủi ro" extra={<Button type="primary" icon={<EditOutlined />}>Chỉnh sửa</Button>}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Rủi ro tối đa mỗi giao dịch:</Text>
                  <Text strong>{riskSettings.maxRiskPerTrade}% vốn</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Giới hạn lỗ hàng ngày:</Text>
                  <Text strong>{riskSettings.maxDailyLoss}% vốn</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Giới hạn lỗ hàng tuần:</Text>
                  <Text strong>{riskSettings.maxWeeklyLoss}% vốn</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Mức Stop Loss mặc định:</Text>
                  <Text strong>{riskSettings.stopLossDefault}%</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Mức Take Profit mặc định:</Text>
                  <Text strong>{riskSettings.takeProfitDefault}%</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Số giao dịch tối đa cùng lúc:</Text>
                  <Text strong>{riskSettings.maxOpenTrades}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Giới hạn đòn bẩy:</Text>
                  <Text strong>{riskSettings.leverageLimit}x</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-setting-item">
                  <Text>Mức margin call:</Text>
                  <Text strong>{riskSettings.marginCallLevel}%</Text>
                </div>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="risk-feature-item">
                  <Switch checked={riskSettings.enableAutoStopLoss} /> 
                  <Text> Auto Stop Loss</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="risk-feature-item">
                  <Switch checked={riskSettings.enableTrailingStop} /> 
                  <Text> Trailing Stop</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Phân tích mức độ rủi ro">
            <div className="risk-level-analysis">
              <div className="risk-exposure-chart">
                <Title level={5}>Phân bổ rủi ro theo tài sản</Title>
                <div className="chart-placeholder">
                  {riskExposureData.map((item, index) => (
                    <div key={index} className="exposure-item">
                      <div className="exposure-info">
                        <span>{item.asset}</span>
                        <span>{item.exposure}%</span>
                      </div>
                      <Progress 
                        percent={item.exposure} 
                        showInfo={false}
                        strokeColor={
                          item.asset === 'USDT' ? '#52c41a' : 
                          item.exposure > 20 ? '#f5222d' : 
                          item.exposure > 10 ? '#faad14' : '#1890ff'
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="risk-metrics">
                <div className="metric-item">
                  <Text>Risk-to-Reward Ratio:</Text>
                  <Text strong>{performanceStats.riskRewardRatio}</Text>
                </div>
                <div className="metric-item">
                  <Text>Expected Value:</Text>
                  <Text strong>{performanceStats.expectedValue}</Text>
                </div>
                <div className="metric-item">
                  <Text>Sharpe Ratio:</Text>
                  <Text strong>{performanceStats.sharpeRatio}</Text>
                </div>
                <div className="metric-item">
                  <Text>Average Win:</Text>
                  <Text strong className="positive">{performanceStats.averageWin}%</Text>
                </div>
                <div className="metric-item">
                  <Text>Average Loss:</Text>
                  <Text strong className="negative">{performanceStats.averageLoss}%</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Công cụ tính toán rủi ro" className="risk-calculator-card">
            <Form
              form={riskForm}
              layout="vertical"
              onFinish={handleRiskFormSubmit}
              initialValues={{
                accountSize: 10000,
                riskPercent: 2,
                entryPrice: 50000,
                stopLoss: 49000,
                tradeDirection: 'long'
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Số vốn" name="accountSize">
                    <InputNumber 
                      style={{ width: '100%' }} 
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, ''))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="% Rủi ro" name="riskPercent">
                    <InputNumber style={{ width: '100%' }} min={0.1} max={10} step={0.1} suffix="%" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Hướng giao dịch" name="tradeDirection">
                    <Select>
                      <Option value="long">Long</Option>
                      <Option value="short">Short</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Loại tài sản" name="assetType">
                    <Select>
                      <Option value="crypto">Crypto</Option>
                      <Option value="forex">Forex</Option>
                      <Option value="stocks">Stocks</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Giá vào lệnh" name="entryPrice">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Giá Stop Loss" name="stopLoss">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Button type="primary" htmlType="submit" icon={<CalculatorOutlined />} block>
                Tính toán
              </Button>
            </Form>
            
            {calculationResult && (
              <div className="calculation-result">
                <Divider>Kết quả</Divider>
                <div className="result-item">
                  <Text>Số tiền rủi ro:</Text>
                  <Text strong>${calculationResult.riskAmount.toFixed(2)}</Text>
                </div>
                <div className="result-item">
                  <Text>Kích thước vị thế:</Text>
                  <Text strong>{calculationResult.positionSize.toFixed(6)}</Text>
                </div>
                <div className="result-item">
                  <Text>Đòn bẩy cần thiết:</Text>
                  <Text strong>{calculationResult.leverageRequired.toFixed(2)}x</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Cảnh báo rủi ro">
            <Alert
              message="Cảnh báo mức rủi ro cao"
              description="Portfolio hiện tại có mức độ tập trung cao vào BTC (25%). Xem xét việc đa dạng hóa để giảm thiểu rủi ro."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Table
              dataSource={alertSettings}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Tên cảnh báo',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => (
                    <Tag color={status === 'Kích hoạt' ? 'green' : 'default'}>
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: 'Điều kiện',
                  dataIndex: 'triggers',
                  key: 'triggers',
                },
                {
                  title: 'Thao tác',
                  key: 'action',
                  render: (_, record) => (
                    <Space>
                      <Button type="text" icon={<EditOutlined />} size="small">Sửa</Button>
                      <Switch checked={record.status === 'Kích hoạt'} size="small" />
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Lịch sử phân tích rủi ro">
            <Table
              dataSource={riskLevelHistory}
              rowKey="month"
              columns={[
                {
                  title: 'Tháng',
                  dataIndex: 'month',
                  key: 'month',
                },
                {
                  title: 'Mức độ rủi ro',
                  dataIndex: 'level',
                  key: 'level',
                  render: level => {
                    let color = 'green';
                    if (level === 'Trung bình') {
                      color = 'orange';
                    } else if (level === 'Cao') {
                      color = 'red';
                    }
                    return (
                      <Tag color={color}>
                        {level}
                      </Tag>
                    );
                  },
                },
                {
                  title: 'Chỉ số đo lường',
                  dataIndex: 'value',
                  key: 'value',
                  render: value => (
                    <Progress
                      percent={value}
                      size="small"
                      strokeColor={{
                        '0%': '#52c41a',
                        '40%': '#faad14',
                        '70%': '#f5222d',
                      }}
                    />
                  ),
                },
                {
                  title: 'Đòn bẩy trung bình',
                  key: 'leverage',
                  render: (_, record) => {
                    // Giả lập dữ liệu đòn bẩy trung bình dựa trên mức độ rủi ro
                    const leverage = record.level === 'Cao' ? '10x' : 
                                   record.level === 'Trung bình' ? '5x' : '2x';
                    return leverage;
                  }
                },
                {
                  title: 'Win Rate',
                  key: 'winRate',
                  render: (_, record) => {
                    // Giả lập dữ liệu tỷ lệ thắng dựa trên mức độ rủi ro
                    const winRate = record.level === 'Cao' ? '45%' : 
                                   record.level === 'Trung bình' ? '58%' : '72%';
                    return winRate;
                  }
                },
              ]}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Collapse className="risk-faq">
            <Panel header="Chiến lược quản lý rủi ro là gì?" key="1">
              <Paragraph>
                Chiến lược quản lý rủi ro là phương pháp bạn sử dụng để giảm thiểu tổn thất và bảo vệ vốn trong quá trình giao dịch. Một chiến lược hiệu quả sẽ bao gồm các yếu tố như:
              </Paragraph>
              <ul>
                <li>Xác định % rủi ro hợp lý cho mỗi giao dịch (thường là 1-2% tổng vốn)</li>
                <li>Thiết lập stop loss và take profit trước khi vào lệnh</li>
                <li>Quản lý tỷ lệ risk/reward (thường tối thiểu 1:2)</li>
                <li>Đa dạng hóa danh mục và giảm thiểu sự tương quan</li>
                <li>Kiểm soát sử dụng đòn bẩy</li>
              </ul>
            </Panel>
            <Panel header="Làm thế nào để xác định kích thước vị thế phù hợp?" key="2">
              <Paragraph>
                Công thức tính kích thước vị thế: <strong>Kích thước vị thế = (Vốn × % Rủi ro) ÷ (Giá vào - Giá stop loss)</strong>
              </Paragraph>
              <Paragraph>
                Ví dụ: Nếu bạn có $10,000, mức rủi ro 2%, giá vào $50,000 và stop loss $49,000, thì:
                <br />
                Số tiền rủi ro = $10,000 × 2% = $200
                <br />
                Kích thước vị thế = $200 ÷ ($50,000 - $49,000) = $200 ÷ $1,000 = 0.2 BTC
              </Paragraph>
            </Panel>
            <Panel header="Tại sao cần đa dạng hóa rủi ro?" key="3">
              <Paragraph>
                Đa dạng hóa giúp giảm thiểu rủi ro hệ thống bằng cách phân bổ vốn vào các tài sản khác nhau có mức độ tương quan thấp. Khi một tài sản giảm giá, các tài sản khác có thể tăng giá hoặc ít bị ảnh hưởng, giúp bảo vệ tổng giá trị danh mục.
              </Paragraph>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export default RiskManagement; 