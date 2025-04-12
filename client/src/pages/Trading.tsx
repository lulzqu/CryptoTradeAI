import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tabs, Select, Input, Form, InputNumber, Slider, Switch, Table, Tag, Space, Typography, Divider, Alert, Statistic } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined,
  DollarOutlined,
  RocketOutlined,
  SafetyOutlined,
  SettingOutlined,
  SyncOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import './Trading.css';
import TradingViewWidget from '../components/TradingViewWidget';

const { TabPane } = Tabs;
const { Option } = Select;
const { Text, Title } = Typography;

const Trading: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('spot');
  const [activePair, setActivePair] = useState<string>('BTC/USDT');
  const [orderType, setOrderType] = useState<string>('limit');
  const [positionType, setPositionType] = useState<string>('long');
  const [leverage, setLeverage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock data
  const marketPairs = [
    { symbol: 'BTC/USDT', price: 65432.10, change: 2.3 },
    { symbol: 'ETH/USDT', price: 3456.78, change: -1.2 },
    { symbol: 'BNB/USDT', price: 575.43, change: 0.8 },
    { symbol: 'XRP/USDT', price: 0.5678, change: 1.5 },
    { symbol: 'SOL/USDT', price: 156.78, change: 3.2 },
    { symbol: 'ADA/USDT', price: 0.4321, change: -0.7 },
  ];

  const orderColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Cặp',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Mua' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        
        if (status === 'Đã khớp') {
          color = 'success';
          icon = <CheckCircleOutlined />;
        } else if (status === 'Đã hủy') {
          color = 'error';
          icon = <CloseCircleOutlined />;
        } else if (status === 'Đang xử lý') {
          color = 'processing';
          icon = <SyncOutlined spin />;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          {record.status === 'Đang xử lý' && (
            <Button size="small" danger>
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const openOrdersData = [
    {
      key: '1',
      time: '2023-05-10 14:32:10',
      pair: 'BTC/USDT',
      type: 'Mua',
      price: 64000,
      amount: 0.5,
      status: 'Đang xử lý',
    },
    {
      key: '2',
      time: '2023-05-10 14:25:30',
      pair: 'ETH/USDT',
      type: 'Bán',
      price: 3500,
      amount: 2.5,
      status: 'Đang xử lý',
    },
  ];

  const orderHistoryData = [
    {
      key: '1',
      time: '2023-05-09 10:12:30',
      pair: 'BTC/USDT',
      type: 'Mua',
      price: 63500,
      amount: 0.2,
      status: 'Đã khớp',
    },
    {
      key: '2',
      time: '2023-05-08 15:45:20',
      pair: 'SOL/USDT',
      type: 'Mua',
      price: 150.25,
      amount: 10,
      status: 'Đã khớp',
    },
    {
      key: '3',
      time: '2023-05-07 09:30:00',
      pair: 'ETH/USDT',
      type: 'Bán',
      price: 3450,
      amount: 1.5,
      status: 'Đã khớp',
    },
    {
      key: '4',
      time: '2023-05-06 16:20:10',
      pair: 'BNB/USDT',
      type: 'Bán',
      price: 580,
      amount: 5,
      status: 'Đã hủy',
    },
  ];

  const positionColumns = [
    {
      title: 'Cặp',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Loại',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => (
        <Tag color={direction === 'Long' ? 'green' : 'red'}>
          {direction}
        </Tag>
      ),
    },
    {
      title: 'Đòn bẩy',
      dataIndex: 'leverage',
      key: 'leverage',
      render: (leverage: number) => `${leverage}x`,
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Giá hiện tại',
      dataIndex: 'markPrice',
      key: 'markPrice',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Lãi/Lỗ',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (pnl: number, record: any) => {
        const isPositive = pnl >= 0;
        return (
          <div className={isPositive ? 'profit-positive' : 'profit-negative'}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {`$${Math.abs(pnl).toLocaleString()} (${Math.abs(record.pnlPercent).toFixed(2)}%)`}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          <Button size="small" type="primary">
            Đóng
          </Button>
          <Button size="small">
            SL/TP
          </Button>
        </Space>
      ),
    },
  ];

  const openPositionsData = [
    {
      key: '1',
      pair: 'BTC/USDT',
      size: 0.2,
      direction: 'Long',
      leverage: 5,
      entryPrice: 63800,
      markPrice: 65432.10,
      pnl: 326.42,
      pnlPercent: 2.56,
    },
    {
      key: '2',
      pair: 'ETH/USDT',
      size: 1.5,
      direction: 'Short',
      leverage: 10,
      entryPrice: 3600,
      markPrice: 3456.78,
      pnl: 215.43,
      pnlPercent: 3.98,
    },
  ];

  const handleBuySell = (type: string) => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      
      // Reset form or show success notification
    }, 1000);
  };

  return (
    <div className="trading-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card title="Cặp giao dịch" className="market-pairs-card">
            <Input 
              placeholder="Tìm kiếm"
              prefix={<span className="search-icon">🔍</span>}
              className="market-search"
            />

            <Table
              dataSource={marketPairs}
              pagination={false}
              size="small"
              rowClassName={(record) => record.symbol === activePair ? 'selected-pair' : ''}
              onRow={(record) => ({
                onClick: () => setActivePair(record.symbol),
              })}
              columns={[
                {
                  title: 'Cặp',
                  dataIndex: 'symbol',
                  key: 'symbol',
                },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `$${price.toLocaleString()}`,
                },
                {
                  title: 'Thay đổi',
                  dataIndex: 'change',
                  key: 'change',
                  render: (change) => (
                    <span className={change >= 0 ? 'profit-positive' : 'profit-negative'}>
                      {change >= 0 ? '+' : ''}{change}%
                    </span>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="chart-card">
            <div className="chart-header">
              <div className="chart-pair">
                <Title level={4}>{activePair}</Title>
                <div className="price-info">
                  <span className="current-price">${marketPairs.find(p => p.symbol === activePair)?.price.toLocaleString()}</span>
                  <span className={`price-change ${marketPairs.find(p => p.symbol === activePair)?.change && marketPairs.find(p => p.symbol === activePair)?.change! >= 0 ? 'positive' : 'negative'}`}>
                    {marketPairs.find(p => p.symbol === activePair)?.change! >= 0 ? '+' : ''}
                    {marketPairs.find(p => p.symbol === activePair)?.change}%
                  </span>
                </div>
              </div>
              <div className="chart-controls">
                <Select defaultValue="1h" style={{ width: 100 }}>
                  <Option value="1m">1 phút</Option>
                  <Option value="5m">5 phút</Option>
                  <Option value="15m">15 phút</Option>
                  <Option value="1h">1 giờ</Option>
                  <Option value="4h">4 giờ</Option>
                  <Option value="1d">1 ngày</Option>
                </Select>
                <Button icon={<SettingOutlined />} />
              </div>
            </div>
            
            <div className="chart-container">
              {/* Thường sẽ tích hợp TradingView hoặc một thư viện biểu đồ ở đây */}
              <div className="placeholder-chart">
                <img 
                  src="https://i.ibb.co/YQnzZyx/crypto-chart-placeholder.png" 
                  alt="Biểu đồ giao dịch"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </Card>

          <Card className="orders-card">
            <Tabs defaultActiveKey="openOrders">
              <TabPane tab="Lệnh đang mở" key="openOrders">
                <Table 
                  dataSource={openOrdersData} 
                  columns={orderColumns} 
                  pagination={false}
                  size="small"
                />
              </TabPane>
              <TabPane tab="Lịch sử lệnh" key="orderHistory">
                <Table 
                  dataSource={orderHistoryData} 
                  columns={orderColumns} 
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              </TabPane>
              {activeTab === 'futures' && (
                <TabPane tab="Vị thế" key="positions">
                  <Table 
                    dataSource={openPositionsData} 
                    columns={positionColumns} 
                    pagination={false}
                    size="small"
                  />
                </TabPane>
              )}
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card className="order-form-card">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="trading-type-tabs"
            >
              <TabPane tab="Spot" key="spot" />
              <TabPane tab="Futures" key="futures" />
            </Tabs>

            <div className="market-info">
              <div className="info-item">
                <span className="label">Giá mới nhất</span>
                <span className="value">${marketPairs.find(p => p.symbol === activePair)?.price.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Khối lượng 24h</span>
                <span className="value">$231.5M</span>
              </div>
            </div>

            {activeTab === 'futures' && (
              <div className="futures-controls">
                <div className="position-type-selector">
                  <Button 
                    type={positionType === 'long' ? 'primary' : 'default'} 
                    className={positionType === 'long' ? 'long-button' : ''}
                    onClick={() => setPositionType('long')}
                    block
                  >
                    Long
                  </Button>
                  <Button 
                    type={positionType === 'short' ? 'primary' : 'default'} 
                    className={positionType === 'short' ? 'short-button' : ''}
                    onClick={() => setPositionType('short')}
                    block
                  >
                    Short
                  </Button>
                </div>
                
                <div className="leverage-control">
                  <div className="leverage-header">
                    <span>Đòn bẩy: {leverage}x</span>
                    <Button size="small">Margin</Button>
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    value={leverage}
                    onChange={setLeverage}
                    marks={{
                      1: '1x',
                      25: '25x',
                      50: '50x',
                      75: '75x',
                      100: '100x'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="order-type-selector">
              <Select 
                value={orderType} 
                onChange={setOrderType}
                style={{ width: '100%' }}
              >
                <Option value="limit">Limit</Option>
                <Option value="market">Market</Option>
                <Option value="stopLimit">Stop Limit</Option>
                <Option value="stopMarket">Stop Market</Option>
              </Select>
            </div>

            <Form layout="vertical" className="order-form">
              {orderType !== 'market' && (
                <Form.Item label="Giá">
                  <InputNumber 
                    style={{ width: '100%' }}
                    defaultValue={marketPairs.find(p => p.symbol === activePair)?.price}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, ''))}
                  />
                </Form.Item>
              )}
              
              <Form.Item label="Số lượng">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              
              {activeTab === 'futures' && (
                <>
                  <Form.Item label="Take Profit">
                    <InputNumber 
                      style={{ width: '100%' }}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, ''))}
                    />
                  </Form.Item>
                  
                  <Form.Item label="Stop Loss">
                    <InputNumber 
                      style={{ width: '100%' }}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, ''))}
                    />
                  </Form.Item>
                </>
              )}
              
              <Row gutter={8}>
                <Col span={12}>
                  <Button
                    type="primary"
                    className="buy-button"
                    block
                    onClick={() => handleBuySell('buy')}
                    loading={loading}
                  >
                    {activeTab === 'futures' && positionType === 'short' ? 'Short' : 'Mua'}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    danger
                    className="sell-button"
                    block
                    onClick={() => handleBuySell('sell')}
                    loading={loading}
                  >
                    {activeTab === 'futures' && positionType === 'long' ? 'Đóng' : 'Bán'}
                  </Button>
                </Col>
              </Row>
            </Form>

            <Divider />

            <div className="account-info">
              <div className="balance-info">
                <Text strong>Số dư khả dụng:</Text>
                <Text>${activeTab === 'spot' ? '12,345.67' : '25,890.43'}</Text>
              </div>
              {activeTab === 'futures' && (
                <>
                  <div className="balance-info">
                    <Text>Margin khả dụng:</Text>
                    <Text>$15,432.10</Text>
                  </div>
                  <div className="balance-info">
                    <Text>Tỷ lệ margin:</Text>
                    <Text className="safe-value">32.5%</Text>
                  </div>
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Trading; 