import React, { useState, useEffect } from 'react';
import { Card, Typography, Select, Slider, Progress } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Order {
  price: number;
  amount: number;
  total: number;
}

interface MarketDepthData {
  bids: Order[];
  asks: Order[];
  maxTotal: number;
}

const MarketDepth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [precision, setPrecision] = useState(2);
  const [depth, setDepth] = useState(20);
  const [data, setData] = useState<MarketDepthData>({
    bids: [],
    asks: [],
    maxTotal: 0,
  });

  // Mock data generator
  const generateMockData = () => {
    const bids: Order[] = [];
    const asks: Order[] = [];
    let maxTotal = 0;

    // Generate bids (descending order)
    let currentPrice = 50000;
    for (let i = 0; i < depth; i++) {
      const amount = Math.random() * 2;
      const total = currentPrice * amount;
      maxTotal = Math.max(maxTotal, total);
      bids.push({
        price: currentPrice,
        amount,
        total,
      });
      currentPrice -= 100;
    }

    // Generate asks (ascending order)
    currentPrice = 50000;
    for (let i = 0; i < depth; i++) {
      const amount = Math.random() * 2;
      const total = currentPrice * amount;
      maxTotal = Math.max(maxTotal, total);
      asks.push({
        price: currentPrice,
        amount,
        total,
      });
      currentPrice += 100;
    }

    return { bids, asks, maxTotal };
  };

  useEffect(() => {
    const updateData = () => {
      setData(generateMockData());
    };

    updateData();
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, [depth]);

  const renderOrderRow = (order: Order, isBid: boolean) => {
    const percentage = (order.total / data.maxTotal) * 100;
    return (
      <div className="market-depth-row" key={order.price}>
        <div className="market-depth-cell">
          <Text type={isBid ? 'success' : 'danger'}>
            {order.price.toLocaleString()}
          </Text>
        </div>
        <div className="market-depth-cell">
          <Text>{order.amount.toFixed(4)}</Text>
        </div>
        <div className="market-depth-cell">
          <Text strong>{order.total.toLocaleString()}</Text>
        </div>
        <div className="market-depth-progress">
          <Progress
            percent={percentage}
            showInfo={false}
            strokeColor={isBid ? '#52c41a' : '#ff4d4f'}
            trailColor="transparent"
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="market-depth">
      <div className="market-depth-header">
        <Title level={4}>Độ sâu thị trường</Title>
        <div className="market-depth-controls">
          <Select
            value={precision}
            onChange={setPrecision}
            style={{ width: 100 }}
            options={[
              { value: 1, label: '0.1' },
              { value: 2, label: '0.01' },
              { value: 3, label: '0.001' },
              { value: 4, label: '0.0001' },
            ]}
          />
          <Slider
            value={depth}
            onChange={setDepth}
            min={5}
            max={50}
            style={{ width: 150 }}
          />
        </div>
      </div>

      <div className="market-depth-content">
        <div className="market-depth-header-row">
          <div className="market-depth-cell">
            <Text strong>Giá (USDT)</Text>
          </div>
          <div className="market-depth-cell">
            <Text strong>Số lượng</Text>
          </div>
          <div className="market-depth-cell">
            <Text strong>Tổng (USDT)</Text>
          </div>
        </div>

        <div className="market-depth-asks">
          {data.asks.map((order) => renderOrderRow(order, false))}
        </div>

        <div className="market-depth-spread">
          <Text strong>Spread: 100 USDT</Text>
        </div>

        <div className="market-depth-bids">
          {data.bids.map((order) => renderOrderRow(order, true))}
        </div>
      </div>
    </Card>
  );
};

export default MarketDepth; 