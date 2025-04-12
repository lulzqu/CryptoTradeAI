import React, { useState } from 'react';
import { Card, Typography, Table, Tag, Space, Button, Select } from 'antd';
import { BellOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  strategy: string;
  price: number;
  target: number;
  stopLoss: number;
  time: string;
  status: 'active' | 'completed' | 'canceled';
  result?: 'profit' | 'loss';
}

const SignalList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock data
  const signals: Signal[] = [
    {
      id: '1',
      symbol: 'BTC/USDT',
      type: 'buy',
      strategy: 'Moving Average Crossover',
      price: 50000,
      target: 52000,
      stopLoss: 49000,
      time: '2024-03-20 10:30:45',
      status: 'completed',
      result: 'profit',
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      type: 'sell',
      strategy: 'RSI Divergence',
      price: 3000,
      target: 2900,
      stopLoss: 3100,
      time: '2024-03-20 09:15:22',
      status: 'active',
    },
    {
      id: '3',
      symbol: 'BNB/USDT',
      type: 'buy',
      strategy: 'MACD',
      price: 400,
      target: 420,
      stopLoss: 380,
      time: '2024-03-20 08:45:10',
      status: 'canceled',
    },
  ];

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => (
        <Text>{new Date(time).toLocaleString()}</Text>
      ),
    },
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'buy' ? 'green' : 'red'}>
          {type === 'buy' ? 'Mua' : 'Bán'}
        </Tag>
      ),
    },
    {
      title: 'Chiến lược',
      dataIndex: 'strategy',
      key: 'strategy',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text>{price.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'target',
      key: 'target',
      render: (target: number) => (
        <Text type="success">{target.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Dừng lỗ',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      render: (stopLoss: number) => (
        <Text type="danger">{stopLoss.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Signal) => (
        <Space>
          <Tag color={
            status === 'active' ? 'blue' :
            status === 'completed' ? (record.result === 'profit' ? 'success' : 'error') :
            'default'
          }>
            {status === 'active' ? 'Đang hoạt động' :
             status === 'completed' ? (record.result === 'profit' ? 'Lãi' : 'Lỗ') :
             'Đã hủy'}
          </Tag>
          {status === 'completed' && (
            record.result === 'profit' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
          )}
        </Space>
      ),
    },
  ];

  const filteredSignals = signals.filter(signal =>
    filter === 'all' || signal.status === filter
  );

  return (
    <Card className="signal-list">
      <div className="signal-list-header">
        <Title level={4}>Tín hiệu giao dịch</Title>
        <Space>
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'active', label: 'Đang hoạt động' },
              { value: 'completed', label: 'Đã hoàn thành' },
              { value: 'canceled', label: 'Đã hủy' },
            ]}
          />
          <Button
            icon={<BellOutlined />}
            onClick={() => setLoading(!loading)}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSignals}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </Card>
  );
};

export default SignalList; 