import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import './Signals.css';

const Signals: React.FC = () => {
  const columns = [
    {
      title: 'Cặp tiền',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'MUA' ? '#52c41a' : '#f5222d'}>
          {type === 'MUA' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {type}
        </Tag>
      ),
    },
    {
      title: 'Giá vào',
      dataIndex: 'entry',
      key: 'entry',
    },
    {
      title: 'Stop Loss',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
    },
    {
      title: 'Take Profit',
      dataIndex: 'takeProfit',
      key: 'takeProfit',
    },
    {
      title: 'Độ tin cậy',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (value: number) => (
        <Tag color={value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#f5222d'}>
          {value}%
        </Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={record.favorite ? <StarFilled /> : <StarOutlined />}
            onClick={() => console.log('Toggle favorite', record)}
          />
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      pair: 'BTC/USDT',
      type: 'MUA',
      entry: '$28,500',
      stopLoss: '$27,500',
      takeProfit: '$30,000',
      confidence: 85,
      time: '10:30:45',
      favorite: true,
    },
    {
      key: '2',
      pair: 'ETH/USDT',
      type: 'BÁN',
      entry: '$1,800',
      stopLoss: '$1,900',
      takeProfit: '$1,600',
      confidence: 75,
      time: '10:25:30',
      favorite: false,
    },
    {
      key: '3',
      pair: 'BNB/USDT',
      type: 'MUA',
      entry: '$300',
      stopLoss: '$290',
      takeProfit: '$320',
      confidence: 65,
      time: '10:20:15',
      favorite: false,
    },
  ];

  return (
    <div className="signals">
      <Card title="Tín hiệu giao dịch">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Signals; 