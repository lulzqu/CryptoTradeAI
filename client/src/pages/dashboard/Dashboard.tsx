/** @jsxImportSource react */
import React, { useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Tag, Statistic, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, FireOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { SignalType, Position } from '../../types';

const { Title, Text } = Typography;

// Mock data for initial development
const marketData = [
  { symbol: 'BTC', name: 'Bitcoin', price: 60240.5, changePercent24h: 2.3 },
  { symbol: 'ETH', name: 'Ethereum', price: 3280.75, changePercent24h: -0.5 },
  { symbol: 'SOL', name: 'Solana', price: 120.8, changePercent24h: 4.7 },
  { symbol: 'DOT', name: 'Polkadot', price: 18.45, changePercent24h: 1.2 },
  { symbol: 'MATIC', name: 'Polygon', price: 1.38, changePercent24h: -2.1 },
];

const signalData = [
  { 
    key: '1', 
    symbol: 'SOL', 
    type: SignalType.LONG, 
    confidence: 92, 
    riskReward: '1:3',
    timeframe: '4h',
    time: '2h ago' 
  },
  { 
    key: '2', 
    symbol: 'MATIC', 
    type: SignalType.SHORT, 
    confidence: 87, 
    riskReward: '1:4',
    timeframe: '1d',
    time: '4h ago' 
  },
  { 
    key: '3', 
    symbol: 'DOT', 
    type: SignalType.LONG, 
    confidence: 85, 
    riskReward: '1:3',
    timeframe: '4h',
    time: '5h ago' 
  },
  { 
    key: '4', 
    symbol: 'AVAX', 
    type: SignalType.LONG, 
    confidence: 82, 
    riskReward: '1:2.5',
    timeframe: '1h',
    time: '30m ago' 
  },
  { 
    key: '5', 
    symbol: 'UNI', 
    type: SignalType.SHORT, 
    confidence: 79, 
    riskReward: '1:2',
    timeframe: '1d',
    time: '8h ago' 
  },
];

const positionsData = [
  { 
    key: '1', 
    symbol: 'SOL', 
    type: SignalType.LONG, 
    size: 2.0, 
    entry: 120, 
    current: 126, 
    pnl: '+5%', 
    pnlPercent: 5, 
    stopLoss: 110 
  },
  { 
    key: '2', 
    symbol: 'ETH', 
    type: SignalType.SHORT, 
    size: 0.5, 
    entry: 2750, 
    current: 2693, 
    pnl: '+2.1%', 
    pnlPercent: 2.1, 
    stopLoss: 2850 
  },
];

const analysisData = [
  'BTC showing bullish divergence on 4h timeframe',
  'SOL funding rate turned positive after 3 days',
  'ETH approaching major resistance at $3,000',
];

const Dashboard: React.FC = () => {
  useEffect(() => {
    // Here we would fetch real data from the backend
    // This is just a placeholder for the actual API calls
  }, []);

  // Calculate market cap (mock data)
  const totalMarketCap = 1.89; // trillion

  const signalColumns = [
    {
      title: 'Coin',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Link to={`/analysis/${text}`}>{text}</Link>,
    },
    {
      title: 'Signal',
      dataIndex: 'type',
      key: 'type',
      render: (type: SignalType) => (
        <Tag color={type === SignalType.LONG ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Conf',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => `${confidence}%`,
    },
    {
      title: 'R:R',
      dataIndex: 'riskReward',
      key: 'riskReward',
    },
    {
      title: 'TF',
      dataIndex: 'timeframe',
      key: 'timeframe',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  const positionColumns = [
    {
      title: 'Coin',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Link to={`/analysis/${text}`}>{text}</Link>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: SignalType) => (
        <Tag color={type === SignalType.LONG ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Entry',
      dataIndex: 'entry',
      key: 'entry',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'P&L',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (pnl: string) => (
        <Text style={{ color: pnl.startsWith('+') ? '#52c41a' : '#f5222d' }}>
          {pnl}
        </Text>
      ),
    },
    {
      title: 'SL',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      render: (price: number) => `$${price}`,
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]} className="market-overview">
        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
          <Card title="Market Overview" className="stat-card">
            <Row gutter={16}>
              {marketData.map((coin) => (
                <Col key={coin.symbol} span={6}>
                  <Statistic
                    title={coin.symbol}
                    value={coin.price}
                    precision={2}
                    valueStyle={{ color: coin.changePercent24h >= 0 ? '#3f8600' : '#cf1322' }}
                    prefix={coin.changePercent24h >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="%"
                  />
                  <div>{coin.changePercent24h}%</div>
                </Col>
              ))}
              <Col span={6}>
                <Statistic
                  title="Market Cap"
                  value={totalMarketCap}
                  precision={2}
                  suffix="T"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card title="Hot Signals" className="stat-card">
            {signalData.slice(0, 3).map((signal) => (
              <div key={signal.key} style={{ marginBottom: 8 }}>
                <Link to={`/analysis/${signal.symbol}`}>
                  <FireOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                  {signal.symbol} ({signal.type})
                  <span style={{ float: 'right' }}>{signal.confidence}%</span>
                </Link>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card title="AI Signal Scanner" className="signal-table">
            <Table 
              dataSource={signalData} 
              columns={signalColumns} 
              pagination={false} 
              size="small"
            />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Link to="/signals">View All Signals</Link>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={9}>
          <Card title="Account Performance" className="stat-card">
            <Statistic
              title="Win Rate"
              value={68}
              suffix="%"
              style={{ marginBottom: 16 }}
            />
            <Statistic
              title="Avg. Profit"
              value={4.2}
              suffix="%"
              style={{ marginBottom: 16 }}
            />
            <Statistic
              title="Drawdown"
              value={12}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Active Positions">
            <Table 
              dataSource={positionsData} 
              columns={positionColumns} 
              pagination={false} 
              size="small"
            />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Link to="/portfolio">Manage All Positions</Link>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Recent Market Analysis">
            {analysisData.map((analysis, index) => (
              <React.Fragment key={index}>
                <div style={{ padding: '8px 0' }}>
                  • {analysis}
                </div>
                {index < analysisData.length - 1 && <Divider style={{ margin: '8px 0' }} />}
              </React.Fragment>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 