import React, { useState } from 'react';
import { Table, Card, Typography, Button, Space, Tag, Tooltip } from 'antd';
import { CaretUpOutlined, CaretDownOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  leverage: number;
  liquidationPrice: number;
  marginType: 'isolated' | 'cross';
}

const PositionList: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Mock data
  const positions: Position[] = [
    {
      id: '1',
      symbol: 'BTC/USDT',
      side: 'long',
      size: 0.5,
      entryPrice: 50000,
      markPrice: 52000,
      unrealizedPnl: 1000,
      unrealizedPnlPercent: 4,
      leverage: 10,
      liquidationPrice: 45000,
      marginType: 'isolated',
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      side: 'short',
      size: 2,
      entryPrice: 3000,
      markPrice: 2900,
      unrealizedPnl: 200,
      unrealizedPnlPercent: 3.33,
      leverage: 5,
      liquidationPrice: 3500,
      marginType: 'cross',
    },
  ];

  const columns = [
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Vị thế',
      dataIndex: 'side',
      key: 'side',
      render: (side: string) => (
        <Tag color={side === 'long' ? 'green' : 'red'}>
          {side === 'long' ? 'Mua' : 'Bán'}
        </Tag>
      ),
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      render: (size: number, record: Position) => (
        <Text>{size} {record.symbol.split('/')[0]}</Text>
      ),
    },
    {
      title: 'Giá vào lệnh',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => (
        <Text>{price.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Giá thị trường',
      dataIndex: 'markPrice',
      key: 'markPrice',
      render: (price: number) => (
        <Text>{price.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'unrealizedPnl',
      key: 'unrealizedPnl',
      render: (pnl: number, record: Position) => (
        <Space>
          <Text type={pnl >= 0 ? 'success' : 'danger'}>
            {pnl.toLocaleString()} USDT
          </Text>
          <Text type={pnl >= 0 ? 'success' : 'danger'}>
            ({record.unrealizedPnlPercent}%)
          </Text>
        </Space>
      ),
    },
    {
      title: 'Đòn bẩy',
      dataIndex: 'leverage',
      key: 'leverage',
      render: (leverage: number) => (
        <Text>{leverage}x</Text>
      ),
    },
    {
      title: 'Giá thanh lý',
      dataIndex: 'liquidationPrice',
      key: 'liquidationPrice',
      render: (price: number) => (
        <Text type="danger">{price.toLocaleString()} USDT</Text>
      ),
    },
    {
      title: 'Loại margin',
      dataIndex: 'marginType',
      key: 'marginType',
      render: (type: string) => (
        <Tag color={type === 'isolated' ? 'blue' : 'purple'}>
          {type === 'isolated' ? 'Cô lập' : 'Chéo'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: string, record: Position) => (
        <Space>
          <Tooltip title="Đóng vị thế">
            <Button
              type="primary"
              danger={record.side === 'long'}
              onClick={() => handleClosePosition(record)}
            >
              Đóng
            </Button>
          </Tooltip>
          <Tooltip title="Cài đặt">
            <Button icon={<SettingOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleClosePosition = (position: Position) => {
    // TODO: Implement close position logic
    console.log('Closing position:', position);
  };

  return (
    <Card className="position-list">
      <div className="position-list-header">
        <Title level={4}>Vị thế đang mở</Title>
        <Space>
          <Button type="primary" onClick={() => setLoading(!loading)}>
            Làm mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={positions}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
        pagination={false}
      />
    </Card>
  );
};

export default PositionList; 