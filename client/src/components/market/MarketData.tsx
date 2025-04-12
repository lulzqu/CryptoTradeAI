import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Tooltip, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatNumber, formatPercent } from '../../utils/formatters';
import './MarketData.css';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdate: string;
}

const MarketData: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, error: wsError } = useWebSocket('ws://184.73.5.19:8080/market');

  useEffect(() => {
    if (wsError) {
      setError('Không thể kết nối đến dữ liệu thị trường');
      setLoading(false);
    }
  }, [wsError]);

  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setMarketData(parsedData);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi xử lý dữ liệu');
        setLoading(false);
      }
    }
  }, [data]);

  const columns = [
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => (
        <Tooltip title={`Xem chi tiết ${text}`}>
          <a href={`/market/${text}`}>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatNumber(price, 2),
      sorter: (a: MarketData, b: MarketData) => a.price - b.price,
    },
    {
      title: '24h %',
      dataIndex: 'change24h',
      key: 'change24h',
      render: (change: number) => {
        const color = change >= 0 ? 'success' : 'error';
        const icon = change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        return (
          <Tag color={color} icon={icon}>
            {formatPercent(change)}
          </Tag>
        );
      },
      sorter: (a: MarketData, b: MarketData) => a.change24h - b.change24h,
    },
    {
      title: 'Khối lượng 24h',
      dataIndex: 'volume24h',
      key: 'volume24h',
      render: (volume: number) => formatNumber(volume, 2),
      sorter: (a: MarketData, b: MarketData) => a.volume24h - b.volume24h,
    },
    {
      title: 'Vốn hóa',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: (cap: number) => formatNumber(cap, 2),
      sorter: (a: MarketData, b: MarketData) => a.marketCap - b.marketCap,
    },
    {
      title: 'Cập nhật',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      render: (date: string) => new Date(date).toLocaleTimeString(),
    },
  ];

  if (loading) {
    return (
      <Card className="market-data-card">
        <div className="loading-container">
          <Spin size="large" />
          <p>Đang tải dữ liệu thị trường...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="market-data-card">
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Dữ liệu thị trường" 
      className="market-data-card"
      extra={
        <Tooltip title="Dữ liệu được cập nhật tự động">
          <span className="refresh-indicator">🔄</span>
        </Tooltip>
      }
    >
      <Table
        dataSource={marketData}
        columns={columns}
        rowKey="symbol"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        size="middle"
      />
    </Card>
  );
};

export default MarketData; 