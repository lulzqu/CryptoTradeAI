import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Popconfirm, message, Typography, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Strategy {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  exchange: string;
  pair: string;
  status: 'active' | 'inactive' | 'testing';
  performance: {
    winRate: number;
    profitFactor: number;
    totalTrades: number;
  };
  createdAt: string;
}

const StrategyList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mô phỏng dữ liệu chiến lược
  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Chiến lược RSI',
      description: 'Chiến lược dựa trên chỉ báo RSI',
      timeframe: '1h',
      exchange: 'binance',
      pair: 'BTC/USDT',
      status: 'active',
      performance: {
        winRate: 65.4,
        profitFactor: 2.1,
        totalTrades: 156,
      },
      createdAt: '2024-03-01',
    },
    {
      id: '2',
      name: 'Chiến lược MACD',
      description: 'Chiến lược dựa trên chỉ báo MACD',
      timeframe: '4h',
      exchange: 'binance',
      pair: 'ETH/USDT',
      status: 'inactive',
      performance: {
        winRate: 58.2,
        profitFactor: 1.8,
        totalTrades: 89,
      },
      createdAt: '2024-03-15',
    },
  ];

  const handleEdit = (id: string) => {
    navigate(`/strategy/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    // Gọi API xóa chiến lược
    setTimeout(() => {
      message.success('Đã xóa chiến lược thành công');
      setLoading(false);
    }, 1000);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setLoading(true);
    // Gọi API cập nhật trạng thái
    setTimeout(() => {
      message.success(`Đã ${currentStatus === 'active' ? 'tạm dừng' : 'kích hoạt'} chiến lược`);
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: 'Tên chiến lược',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Strategy) => (
        <Space direction="vertical" size={0}>
          <span>{text}</span>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Thông số',
      dataIndex: 'settings',
      key: 'settings',
      render: (_: any, record: Strategy) => (
        <Space direction="vertical" size={0}>
          <span>{record.timeframe}</span>
          <span>{record.pair}</span>
        </Space>
      ),
    },
    {
      title: 'Hiệu suất',
      dataIndex: 'performance',
      key: 'performance',
      render: (performance: Strategy['performance']) => (
        <Space direction="vertical" size={0}>
          <span>Tỷ lệ thắng: {performance.winRate}%</span>
          <span>Hệ số lợi nhuận: {performance.profitFactor}</span>
          <span>Tổng giao dịch: {performance.totalTrades}</span>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { color: 'success', text: 'Đang hoạt động' },
          inactive: { color: 'default', text: 'Tạm dừng' },
          testing: { color: 'processing', text: 'Đang kiểm thử' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Strategy) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/strategy/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}>
            <Button
              type="text"
              icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleStatus(record.id, record.status)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chiến lược này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="strategy-list">
      <div className="strategy-list-header">
        <Title level={4}>Danh sách chiến lược</Title>
        <Button
          type="primary"
          onClick={() => navigate('/strategy/new')}
        >
          Tạo chiến lược mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={strategies}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </Card>
  );
};

export default StrategyList; 