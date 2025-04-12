import React, { useState, useEffect } from 'react';
import { Card, Typography, Select, Space, Button, Radio } from 'antd';
import { LineChartOutlined, BarChartOutlined, AreaChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const PriceChart: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1h');
  const [chartType, setChartType] = useState('candlestick');

  // Mock data generator
  const generateMockData = (count: number): ChartData[] => {
    const data: ChartData[] = [];
    let currentPrice = 50000;
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const time = new Date(now.getTime() - (count - i) * 3600000);
      const open = currentPrice;
      const high = open * (1 + Math.random() * 0.02);
      const low = open * (1 - Math.random() * 0.02);
      const close = low + Math.random() * (high - low);
      const volume = Math.random() * 100;

      data.push({
        time: time.toISOString(),
        open,
        high,
        low,
        close,
        volume,
      });

      currentPrice = close;
    }

    return data;
  };

  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const updateData = () => {
      setData(generateMockData(100));
    };

    updateData();
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, [timeframe]);

  return (
    <Card className="price-chart">
      <div className="price-chart-header">
        <Title level={4}>Biểu đồ giá</Title>
        <Space>
          <Radio.Group
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="candlestick">
              <LineChartOutlined /> Nến
            </Radio.Button>
            <Radio.Button value="line">
              <AreaChartOutlined /> Đường
            </Radio.Button>
            <Radio.Button value="bar">
              <BarChartOutlined /> Cột
            </Radio.Button>
          </Radio.Group>
          <Select
            value={timeframe}
            onChange={setTimeframe}
            style={{ width: 100 }}
            options={[
              { value: '1m', label: '1 phút' },
              { value: '5m', label: '5 phút' },
              { value: '15m', label: '15 phút' },
              { value: '1h', label: '1 giờ' },
              { value: '4h', label: '4 giờ' },
              { value: '1d', label: '1 ngày' },
            ]}
          />
        </Space>
      </div>

      <div className="price-chart-container">
        {/* TODO: Integrate with TradingView or other charting library */}
        <div className="price-chart-placeholder">
          <Text>Biểu đồ sẽ được hiển thị ở đây</Text>
        </div>
      </div>
    </Card>
  );
};

export default PriceChart; 