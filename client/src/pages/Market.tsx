import React, { useEffect } from 'react';
import { Card, Row, Col, Table, Tag, Select, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchMarketData, setSelectedSymbol, setTimeframe } from '../slices/marketSlice';
import './Market.css';

const { Option } = Select;

const Market: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    symbols,
    selectedSymbol,
    timeframe,
    price,
    volume,
    change24h,
    loading,
    error
  } = useSelector((state: RootState) => state.market);

  useEffect(() => {
    dispatch(fetchMarketData({ symbol: selectedSymbol, timeframe }));
  }, [dispatch, selectedSymbol, timeframe]);

  const columns = [
    {
      title: 'Cặp tiền',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Thay đổi 24h',
      dataIndex: 'change24h',
      key: 'change24h',
      render: (change: number) => (
        <Tag color={change >= 0 ? 'green' : 'red'}>
          {change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(change).toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: 'Khối lượng 24h',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => `$${volume.toLocaleString()}`,
    },
  ];

  const mockData = [
    {
      key: '1',
      symbol: 'BTC/USDT',
      price: 50000,
      change24h: 2.5,
      volume: 1000000000,
    },
    {
      key: '2',
      symbol: 'ETH/USDT',
      price: 3000,
      change24h: -1.2,
      volume: 500000000,
    },
    {
      key: '3',
      symbol: 'BNB/USDT',
      price: 400,
      change24h: 0.8,
      volume: 200000000,
    },
  ];

  return (
    <div className="market-container">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div className="market-filters">
              <Select
                value={selectedSymbol}
                onChange={(value) => dispatch(setSelectedSymbol(value))}
                style={{ width: 200 }}
              >
                {symbols.map((symbol) => (
                  <Option key={symbol} value={symbol}>
                    {symbol}
                  </Option>
                ))}
              </Select>
              <Select
                value={timeframe}
                onChange={(value) => dispatch(setTimeframe(value))}
                style={{ width: 120 }}
              >
                <Option value="1m">1 phút</Option>
                <Option value="5m">5 phút</Option>
                <Option value="15m">15 phút</Option>
                <Option value="1h">1 giờ</Option>
                <Option value="4h">4 giờ</Option>
                <Option value="1d">1 ngày</Option>
              </Select>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Giá hiện tại"
              value={price}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Thay đổi 24h"
              value={change24h}
              precision={2}
              valueStyle={{ color: change24h >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={change24h >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Khối lượng 24h"
              value={volume}
              precision={0}
              prefix="$"
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Danh sách cặp tiền">
            <Table
              columns={columns}
              dataSource={mockData}
              loading={loading}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Market; 