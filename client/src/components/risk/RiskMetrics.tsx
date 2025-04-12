import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Tooltip, Divider, Table } from 'antd';
import { InfoCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RiskMetricsProps {
  portfolio?: {
    value: number;
    drawdown: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
    beta: number;
    profitFactor: number;
    winRate: number;
    exposureRatio: number;
    positionsCount: number;
    riskPositions: {
      symbol: string;
      position: number;
      risk: number;
      riskRatio: number;
      unrealizedPnl: number;
      unrealizedPnlPercent: number;
    }[];
  };
}

const RiskMetrics: React.FC<RiskMetricsProps> = ({ 
  portfolio = {
    value: 100000,
    drawdown: 3.2,
    maxDrawdown: 15.7,
    sharpeRatio: 1.8,
    volatility: 12.5,
    beta: 0.85,
    profitFactor: 2.3,
    winRate: 65,
    exposureRatio: 42,
    positionsCount: 5,
    riskPositions: [
      {
        symbol: 'BTC/USDT',
        position: 25000,
        risk: 1250,
        riskRatio: 5,
        unrealizedPnl: 1200,
        unrealizedPnlPercent: 4.8,
      },
      {
        symbol: 'ETH/USDT',
        position: 15000,
        risk: 900,
        riskRatio: 6,
        unrealizedPnl: -500,
        unrealizedPnlPercent: -3.3,
      },
      {
        symbol: 'SOL/USDT',
        position: 10000,
        risk: 800,
        riskRatio: 8,
        unrealizedPnl: 350,
        unrealizedPnlPercent: 3.5,
      },
    ]
  }
}) => {
  const totalRisk = portfolio.riskPositions.reduce((total, position) => total + position.risk, 0);
  const riskPercent = (totalRisk / portfolio.value) * 100;

  const columns = [
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Vị thế',
      dataIndex: 'position',
      key: 'position',
      render: (value: number) => <Text>{value.toLocaleString()} USDT</Text>,
    },
    {
      title: 'Rủi ro',
      dataIndex: 'risk',
      key: 'risk',
      render: (value: number, record: any) => (
        <Text type={record.riskRatio > 5 ? 'danger' : 'secondary'}>
          {value.toLocaleString()} USDT ({record.riskRatio}%)
        </Text>
      ),
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'unrealizedPnl',
      key: 'unrealizedPnl',
      render: (value: number, record: any) => (
        <Text type={value >= 0 ? 'success' : 'danger'}>
          {value.toLocaleString()} USDT ({record.unrealizedPnlPercent}%)
          {value >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </Text>
      ),
    },
  ];

  return (
    <Card className="risk-metrics">
      <div className="risk-metrics-header">
        <Title level={4}>Chỉ số rủi ro</Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={
                <span>
                  Tổng rủi ro hiện tại
                  <Tooltip title="Tổng số tiền có thể mất nếu tất cả các vị thế đạt đến mức dừng lỗ">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              value={totalRisk}
              precision={2}
              valueStyle={{ color: riskPercent > 10 ? '#cf1322' : '#3f8600' }}
              suffix="USDT"
            />
            <Progress
              percent={riskPercent}
              status={riskPercent > 15 ? 'exception' : 'active'}
              strokeColor={
                riskPercent <= 5 ? '#52c41a' :
                riskPercent <= 10 ? '#faad14' : '#f5222d'
              }
            />
            <Text type={riskPercent > 10 ? 'danger' : 'secondary'}>
              {riskPercent.toFixed(2)}% danh mục
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={
                <span>
                  Drawdown hiện tại
                  <Tooltip title="Mức giảm từ đỉnh cao nhất gần đây">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              value={portfolio.drawdown}
              precision={2}
              valueStyle={{ color: portfolio.drawdown > 10 ? '#cf1322' : '#3f8600' }}
              suffix="%"
            />
            <Progress
              percent={(portfolio.drawdown / portfolio.maxDrawdown) * 100}
              status={(portfolio.drawdown / portfolio.maxDrawdown) * 100 > 80 ? 'exception' : 'active'}
              strokeColor={
                portfolio.drawdown <= 5 ? '#52c41a' :
                portfolio.drawdown <= 10 ? '#faad14' : '#f5222d'
              }
            />
            <Text type="secondary">Max: {portfolio.maxDrawdown}%</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={
                <span>
                  Sharpe Ratio
                  <Tooltip title="Tỷ lệ lợi nhuận trên biến động, >= 1 là tốt">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              value={portfolio.sharpeRatio}
              precision={2}
              valueStyle={{ color: portfolio.sharpeRatio >= 1 ? '#3f8600' : '#cf1322' }}
            />
            <Progress
              percent={Math.min(portfolio.sharpeRatio / 3 * 100, 100)}
              status={portfolio.sharpeRatio < 1 ? 'exception' : 'active'}
              strokeColor={
                portfolio.sharpeRatio >= 2 ? '#52c41a' :
                portfolio.sharpeRatio >= 1 ? '#faad14' : '#f5222d'
              }
            />
            <Text type={portfolio.sharpeRatio >= 1 ? 'success' : 'danger'}>
              {portfolio.sharpeRatio >= 2 ? 'Rất tốt' : 
               portfolio.sharpeRatio >= 1 ? 'Tốt' : 'Cần cải thiện'}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Tỷ lệ thắng"
            value={portfolio.winRate}
            suffix="%"
            valueStyle={{ color: portfolio.winRate >= 50 ? '#3f8600' : '#cf1322' }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Profit Factor"
            value={portfolio.profitFactor}
            precision={2}
            valueStyle={{ color: portfolio.profitFactor >= 1.5 ? '#3f8600' : '#cf1322' }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Biến động"
            value={portfolio.volatility}
            suffix="%"
            precision={1}
            valueStyle={{ color: portfolio.volatility <= 15 ? '#3f8600' : '#cf1322' }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Beta"
            value={portfolio.beta}
            precision={2}
            valueStyle={{ color: portfolio.beta <= 1 ? '#3f8600' : '#cf1322' }}
          />
        </Col>
      </Row>

      <Divider />

      <Title level={5}>Rủi ro theo vị thế</Title>
      <Table
        dataSource={portfolio.riskPositions}
        columns={columns}
        rowKey="symbol"
        size="small"
        pagination={false}
      />
    </Card>
  );
};

export default RiskMetrics; 