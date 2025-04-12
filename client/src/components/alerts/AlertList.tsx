import React, { useState } from 'react';
import { Card, Typography, Table, Tag, Space, Button, Select, Input, Tooltip } from 'antd';
import { ReloadOutlined, SearchOutlined, BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import './AlertList.css';

const { Title } = Typography;
const { Option } = Select;

interface Alert {
  id: string;
  message: string;
  symbol: string;
  type: 'price' | 'volume' | 'indicator' | 'news';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  status: 'new' | 'read' | 'dismissed';
}

const AlertList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');

  // Mock data
  const alerts: Alert[] = [
    {
      id: '1',
      message: 'BTC/USDT đã vượt qua ngưỡng kháng cự 45,000',
      symbol: 'BTC/USDT',
      type: 'price',
      priority: 'high',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      status: 'new'
    },
    {
      id: '2',
      message: 'Khối lượng giao dịch ETH/USDT tăng đột biến',
      symbol: 'ETH/USDT',
      type: 'volume',
      priority: 'medium',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      status: 'read'
    },
    {
      id: '3',
      message: 'Chỉ báo RSI cho BNB/USDT đang ở vùng quá bán',
      symbol: 'BNB/USDT',
      type: 'indicator',
      priority: 'medium',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      status: 'read'
    },
    {
      id: '4',
      message: 'Tin tức quan trọng về quy định mới từ SEC',
      symbol: 'MARKET',
      type: 'news',
      priority: 'high',
      timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
      status: 'dismissed'
    },
    {
      id: '5',
      message: 'XRP/USDT đã phá vỡ đường trung bình động 200 ngày',
      symbol: 'XRP/USDT',
      type: 'indicator',
      priority: 'low',
      timestamp: new Date(Date.now() - 480 * 60000).toISOString(),
      status: 'new'
    }
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleTypeChange = (value: string) => {
    setFilterType(value);
  };

  const handlePriorityChange = (value: string) => {
    setFilterPriority(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredAlerts = alerts.filter(alert => {
    return (
      (filterType === 'all' || alert.type === filterType) &&
      (filterPriority === 'all' || alert.priority === filterPriority) &&
      (alert.message.toLowerCase().includes(searchValue.toLowerCase()) ||
        alert.symbol.toLowerCase().includes(searchValue.toLowerCase()))
    );
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <BellOutlined style={{ color: '#1890ff' }} />;
      case 'read':
        return <CheckOutlined style={{ color: '#52c41a' }} />;
      case 'dismissed':
        return <CloseOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getTypeTag = (type: string) => {
    switch (type) {
      case 'price':
        return <Tag color="blue">Giá</Tag>;
      case 'volume':
        return <Tag color="purple">Khối lượng</Tag>;
      case 'indicator':
        return <Tag color="cyan">Chỉ báo</Tag>;
      case 'news':
        return <Tag color="orange">Tin tức</Tag>;
      default:
        return null;
    }
  };

  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Tag className="high-priority">Cao</Tag>;
      case 'medium':
        return <Tag className="medium-priority">Trung bình</Tag>;
      case 'low':
        return <Tag className="low-priority">Thấp</Tag>;
      default:
        return null;
    }
  };

  const columns: TableProps<Alert>['columns'] = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => formatTime(timestamp),
      sorter: (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    },
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => getTypeTag(type),
    },
    {
      title: 'Mức độ',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => getPriorityTag(priority),
    },
    {
      title: 'Thông báo',
      dataIndex: 'message',
      key: 'message',
      render: (message) => (
        <Tooltip title={message}>
          <div className="alert-message">{message}</div>
        </Tooltip>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let statusText = '';
        switch (status) {
          case 'new':
            statusText = 'Mới';
            break;
          case 'read':
            statusText = 'Đã đọc';
            break;
          case 'dismissed':
            statusText = 'Đã bỏ qua';
            break;
        }
        return (
          <Space>
            {getStatusIcon(status)}
            <span>{statusText}</span>
          </Space>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_text, _record) => (
        <Space size="small">
          <Button size="small" type="text">Đánh dấu đã đọc</Button>
          <Button size="small" type="text" danger>Bỏ qua</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="alert-list">
      <Card 
        title={
          <div className="alert-list-header">
            <Title level={5}>Danh sách cảnh báo</Title>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
            >
              Làm mới
            </Button>
          </div>
        }
      >
        <div className="alert-list-filters">
          <Space wrap>
            <Select 
              defaultValue="all" 
              style={{ width: 150 }} 
              onChange={handleTypeChange}
              placeholder="Loại cảnh báo"
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="price">Giá</Option>
              <Option value="volume">Khối lượng</Option>
              <Option value="indicator">Chỉ báo</Option>
              <Option value="news">Tin tức</Option>
            </Select>
            
            <Select 
              defaultValue="all" 
              style={{ width: 150 }} 
              onChange={handlePriorityChange}
              placeholder="Mức độ ưu tiên"
            >
              <Option value="all">Tất cả mức độ</Option>
              <Option value="high">Cao</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="low">Thấp</Option>
            </Select>
            
            <Input
              placeholder="Tìm kiếm..."
              value={searchValue}
              onChange={handleSearchChange}
              style={{ width: 200 }}
              suffix={<SearchOutlined />}
            />
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredAlerts}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} cảnh báo`,
            locale: { items_per_page: '/ trang' }
          }}
        />
      </Card>
    </div>
  );
};

export default AlertList; 