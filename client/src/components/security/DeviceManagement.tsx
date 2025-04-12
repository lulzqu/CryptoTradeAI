import React, { useState } from 'react';
import { Table, Card, Typography, Tag, Button, Popconfirm, Space } from 'antd';
import { 
  DesktopOutlined, 
  MobileOutlined, 
  TabletOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import './DeviceManagement.css';

const { Text } = Typography;

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastActive: string;
  location: string;
  status: 'active' | 'inactive';
}

const DeviceManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockDevices: Device[] = [
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastActive: '2024-01-01 10:00:00',
      location: 'Hà Nội, Việt Nam',
      status: 'active'
    },
    {
      id: '2',
      name: 'iPhone 12',
      type: 'mobile',
      lastActive: '2024-01-01 09:00:00',
      location: 'TP.HCM, Việt Nam',
      status: 'active'
    }
  ];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <DesktopOutlined />;
      case 'mobile':
        return <MobileOutlined />;
      case 'tablet':
        return <TabletOutlined />;
      default:
        return null;
    }
  };

  const handleRevoke = async (deviceId: string) => {
    setLoading(true);
    try {
      // TODO: Revoke device access
      console.log('Revoke device:', deviceId);
    } catch (error) {
      console.error('Error revoking device:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Thiết bị',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Device) => (
        <Space>
          {getDeviceIcon(record.type)}
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Lần hoạt động cuối',
      dataIndex: 'lastActive',
      key: 'lastActive'
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? (
            <Space>
              <CheckCircleOutlined />
              Đang hoạt động
            </Space>
          ) : (
            <Space>
              <WarningOutlined />
              Không hoạt động
            </Space>
          )}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Device) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn thu hồi quyền truy cập của thiết bị này?"
          onConfirm={() => handleRevoke(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={loading}
          >
            Thu hồi
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <Card className="device-management">
      <div className="device-header">
        <Text strong>Quản lý thiết bị</Text>
        <Text type="secondary">
          {mockDevices.length} thiết bị đang hoạt động
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={mockDevices}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
      />
    </Card>
  );
};

export default DeviceManagement; 