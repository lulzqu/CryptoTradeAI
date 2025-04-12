import React, { useState } from 'react';
import { Card, Typography, List, Badge, Avatar, Tag, Button, Space, Dropdown, Menu, Empty } from 'antd';
import { 
  BellOutlined, CheckOutlined, DeleteOutlined, EllipsisOutlined, 
  SettingOutlined, ExclamationCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  time: string;
  read: boolean;
  link?: string;
}

interface NotificationListProps {
  onMarkAllAsRead?: () => void;
  onDeleteAll?: () => void;
  onSettingsClick?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  onMarkAllAsRead, 
  onDeleteAll, 
  onSettingsClick 
}) => {
  // Mock data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Tín hiệu mua mới',
      message: 'Đã phát hiện tín hiệu mua BTC/USDT theo chiến lược MA Cross',
      type: 'success',
      time: '2024-03-20T10:30:45',
      read: false,
    },
    {
      id: '2',
      title: 'Cảnh báo rủi ro',
      message: 'Đòn bẩy trên danh mục của bạn đã vượt quá 5x, vui lòng kiểm tra',
      type: 'warning',
      time: '2024-03-20T09:15:22',
      read: false,
    },
    {
      id: '3',
      title: 'Lệnh đã hoàn thành',
      message: 'Lệnh mua ETH/USDT đã được thực hiện thành công với giá 3000 USDT',
      type: 'success',
      time: '2024-03-20T08:45:10',
      read: true,
    },
    {
      id: '4',
      title: 'Mức dừng lỗ đã kích hoạt',
      message: 'Lệnh dừng lỗ cho BNB/USDT đã được kích hoạt ở mức 380 USDT',
      type: 'error',
      time: '2024-03-19T15:10:30',
      read: true,
    },
    {
      id: '5',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ bảo trì vào 22:00 ngày 25/03/2024, thời gian dự kiến 2 giờ',
      type: 'info',
      time: '2024-03-19T12:00:00',
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    if (onDeleteAll) {
      onDeleteAll();
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'success':
        return <Avatar style={{ backgroundColor: '#52c41a' }} icon={<CheckOutlined />} />;
      case 'warning':
        return <Avatar style={{ backgroundColor: '#faad14' }} icon={<ExclamationCircleOutlined />} />;
      case 'error':
        return <Avatar style={{ backgroundColor: '#f5222d' }} icon={<ExclamationCircleOutlined />} />;
      case 'info':
      default:
        return <Avatar style={{ backgroundColor: '#1890ff' }} icon={<BellOutlined />} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderMenu = (notification: Notification) => (
    <Menu>
      {!notification.read && (
        <Menu.Item key="read" onClick={() => handleMarkAsRead(notification.id)}>
          <CheckOutlined /> Đánh dấu đã đọc
        </Menu.Item>
      )}
      <Menu.Item key="delete" onClick={() => handleDelete(notification.id)}>
        <DeleteOutlined /> Xóa thông báo
      </Menu.Item>
    </Menu>
  );

  return (
    <Card className="notification-list">
      <div className="notification-list-header">
        <Title level={4}>
          Thông báo <Badge count={unreadCount} style={{ backgroundColor: '#1890ff' }} />
        </Title>
        <Space>
          <Button icon={<CheckOutlined />} onClick={handleMarkAllAsRead}>
            Đánh dấu tất cả đã đọc
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleDeleteAll}>
            Xóa tất cả
          </Button>
          <Button icon={<SettingOutlined />} onClick={onSettingsClick}>
            Cài đặt
          </Button>
        </Space>
      </div>

      {notifications.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="Không có thông báo nào" 
        />
      ) : (
        <List
          className="notification-list-items"
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={notification => (
            <List.Item 
              className={`notification-item ${notification.read ? 'notification-read' : 'notification-unread'}`}
              actions={[
                <Dropdown overlay={renderMenu(notification)} trigger={['click']}>
                  <Button type="text" icon={<EllipsisOutlined />} />
                </Dropdown>
              ]}
            >
              <List.Item.Meta
                avatar={getIconByType(notification.type)}
                title={
                  <Space>
                    <Text strong>{notification.title}</Text>
                    {!notification.read && <Badge status="processing" />}
                    <Tag color={
                      notification.type === 'success' ? 'success' :
                      notification.type === 'warning' ? 'warning' :
                      notification.type === 'error' ? 'error' :
                      'default'
                    }>
                      {notification.type === 'success' ? 'Thành công' :
                       notification.type === 'warning' ? 'Cảnh báo' :
                       notification.type === 'error' ? 'Lỗi' : 'Thông tin'}
                    </Tag>
                  </Space>
                }
                description={
                  <>
                    <Paragraph>{notification.message}</Paragraph>
                    <div className="notification-time">
                      <ClockCircleOutlined /> {new Date(notification.time).toLocaleString()}
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default NotificationList; 