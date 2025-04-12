import React, { useState } from 'react';
import { Table, Card, Typography, Button, Space, Tag, Select, DatePicker } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'take_profit';
  price: number;
  amount: number;
  total: number;
  fee: number;
  time: string;
  status: 'filled' | 'partial' | 'canceled';
}

const TradeHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState<string>('all');

  // Mock data
  const trades: Trade[] = [
    {
      id: '1',
      symbol: 'BTC/USDT',
      side: 'buy',
      type: 'market',
      price: 50000,
      amount: 0.5,
      total: 25000,
      fee: 25,
      time: '2024-03-20 10:30:45',
      status: 'filled',
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      side: 'sell',
      type: 'limit',
      price: 3000,
      amount: 2,
      total: 6000,
      fee: 6,
      time: '2024-03-20 09:15:22',
      status: 'filled',
    },
    {
      id: '3',
      symbol: 'BNB/USDT',
      side: 'buy',
      type: 'stop',
      price: 400,
      amount: 10,
      total: 4000,
      fee: 4,
      time: '2024-03-20 08:45:10',
      status: 'partial',
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
      title: 'Loại lệnh',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'market' ? 'blue' : 'purple'}>
          {type === 'market' ? 'Thị trường' : 
           type === 'limit' ? 'Giới hạn' :
           type === 'stop' ? 'Dừng' : 'Chốt lời'}
        </Tag>
      ),
    },
    {
      title: 'Vị thế',
      dataIndex: 'side',
      key: 'side',
      render: (side: string) => (
        <Tag color={side === 'buy' ? 'green' : 'red'}>
          {side === 'buy' ? 'Mua' : 'Bán'}
        </Tag>
      ),
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
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Trade) => (
        <Text>{amount} {record.symbol.split('/')[0]}</Text>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <Text strong>{total.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Phí',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number) => (
        <Text type="secondary">{fee.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'filled' ? 'success' :
          status === 'partial' ? 'warning' : 'default'
        }>
          {status === 'filled' ? 'Hoàn thành' :
           status === 'partial' ? 'Một phần' : 'Đã hủy'}
        </Tag>
      ),
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="trade-history">
      <div className="trade-history-header">
        <Title level={4}>Lịch sử giao dịch</Title>
        <Space>
          <Select
            value={symbol}
            onChange={setSymbol}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'BTC/USDT', label: 'BTC/USDT' },
              { value: 'ETH/USDT', label: 'ETH/USDT' },
              { value: 'BNB/USDT', label: 'BNB/USDT' },
            ]}
          />
          <RangePicker showTime />
          <Button icon={<FilterOutlined />}>Lọc</Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={trades}
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

export default TradeHistory; 