import React, { useState } from 'react';
import { Card, Typography, Input, Table, Tag, Space, Button } from 'antd';
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TradingPair {
  symbol: string;
  lastPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  isFavorite: boolean;
}

const TradingPairs: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data
  const pairs: TradingPair[] = [
    {
      symbol: 'BTC/USDT',
      lastPrice: 50000,
      change24h: 2.5,
      high24h: 51000,
      low24h: 49000,
      volume24h: 1000000,
      isFavorite: true,
    },
    {
      symbol: 'ETH/USDT',
      lastPrice: 3000,
      change24h: -1.2,
      high24h: 3100,
      low24h: 2900,
      volume24h: 500000,
      isFavorite: false,
    },
    {
      symbol: 'BNB/USDT',
      lastPrice: 400,
      change24h: 0.8,
      high24h: 410,
      low24h: 390,
      volume24h: 200000,
      isFavorite: true,
    },
  ];

  const columns = [
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string, record: TradingPair) => (
        <Space>
          <Button
            type="text"
            icon={record.isFavorite ? <StarFilled /> : <StarOutlined />}
            onClick={() => handleToggleFavorite(record)}
          />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Giá cuối',
      dataIndex: 'lastPrice',
      key: 'lastPrice',
      render: (price: number) => (
        <Text>{price.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: '24h',
      dataIndex: 'change24h',
      key: 'change24h',
      render: (change: number) => (
        <Text type={change >= 0 ? 'success' : 'danger'}>
          {change >= 0 ? '+' : ''}{change}%
        </Text>
      ),
    },
    {
      title: '24h Cao',
      dataIndex: 'high24h',
      key: 'high24h',
      render: (price: number) => (
        <Text>{price.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: '24h Thấp',
      dataIndex: 'low24h',
      key: 'low24h',
      render: (price: number) => (
        <Text>{price.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: '24h Khối lượng',
      dataIndex: 'volume24h',
      key: 'volume24h',
      render: (volume: number) => (
        <Text>{volume.toLocaleString()} USDT</Text>
      ),
    },
  ];

  const handleToggleFavorite = (pair: TradingPair) => {
    // TODO: Implement favorite toggle logic
    console.log('Toggle favorite:', pair.symbol);
  };

  const filteredPairs = pairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card className="trading-pairs">
      <div className="trading-pairs-header">
        <Title level={4}>Cặp giao dịch</Title>
        <Input
          placeholder="Tìm kiếm cặp giao dịch"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredPairs}
        rowKey="symbol"
        loading={loading}
        scroll={{ x: true }}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default TradingPairs; 