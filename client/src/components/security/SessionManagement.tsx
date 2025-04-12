import React, { useState } from 'react';
import { Table, Card, Typography, Tag, Button, Popconfirm, Space } from 'antd';
import { 
  LogoutOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DesktopOutlined
} from '@ant-design/icons';
import './SessionManagement.css';

const { Text } = Typography;

interface Session {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  status: 'active' | 'expired';
}

const SessionManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockSessions: Session[] = [
    {
      id: '1',
      device: 'Chrome trên Windows',
      ip: '192.168.1.1',
      location: 'Hà Nội, Việt Nam',
      lastActive: '2024-01-01 10:00:00',
      status: 'active'
    },
    {
      id: '2',
      device: 'Safari trên iOS',
      ip: '192.168.1.2',
      location: 'TP.HCM, Việt Nam',
      lastActive: '2024-01-01 09:00:00',
      status: 'expired'
    }
  ];

  const handleTerminate = async (sessionId: string) => {
    setLoading(true);
    try {
      // TODO: Terminate session
      console.log('Terminate session:', sessionId);
    } catch (error) {
      console.error('Error terminating session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateAll = async () => {
    setLoading(true);
    try {
      // TODO: Terminate all sessions
      console.log('Terminate all sessions');
    } catch (error) {
      console.error('Error terminating all sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Thiết bị',
      dataIndex: 'device',
      key: 'device',
      render: (text: string) => (
        <Space>
          <DesktopOutlined />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Lần hoạt động cuối',
      dataIndex: 'lastActive',
      key: 'lastActive'
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
              Đã hết hạn
            </Space>
          )}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Session) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn kết thúc phiên này?"
          onConfirm={() => handleTerminate(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            loading={loading}
          >
            Kết thúc
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <Card className="session-management">
      <div className="session-header">
        <Text strong>Quản lý phiên đăng nhập</Text>
        <Space>
          <Text type="secondary">
            {mockSessions.filter(s => s.status === 'active').length} phiên đang hoạt động
          </Text>
          <Popconfirm
            title="Bạn có chắc chắn muốn kết thúc tất cả các phiên khác?"
            onConfirm={handleTerminateAll}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              loading={loading}
            >
              Kết thúc tất cả
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={mockSessions}
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

export default SessionManagement; 