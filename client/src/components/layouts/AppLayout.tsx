import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Button, 
  Badge, 
  Dropdown, 
  Avatar,
  Typography,
  theme 
} from 'antd';
import {
  DashboardOutlined,
  LineChartOutlined,
  WalletOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import logo from '../../assets/logo.svg';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine which menu item is active
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['dashboard'];
    if (path.startsWith('/analysis')) return ['analysis'];
    if (path.startsWith('/portfolio')) return ['portfolio'];
    if (path.startsWith('/settings')) return ['settings'];
    return [];
  };

  // Dummy notification data
  const notifications = [
    { id: 1, title: 'BTC tín hiệu mua mạnh', read: false },
    { id: 2, title: 'SOL đã đạt take profit', read: true },
    { id: 3, title: 'API MEXC đã kết nối thành công', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Notification dropdown menu
  const notificationMenu = {
    items: notifications.map(notification => ({
      key: notification.id,
      label: (
        <div style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
          {notification.title}
        </div>
      ),
    })),
    onClick: () => {
      // Handle notification click
    },
  };

  // User dropdown menu
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Tài khoản',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Cài đặt',
        onClick: () => navigate('/settings'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        // Add logout logic here
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={80}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: token.colorBgContainer,
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          zIndex: 1000
        }}
      >
        <div className="logo" style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`
        }}>
          <img 
            src={logo} 
            alt="CryptoTradeAI" 
            style={{ height: '32px', width: 'auto' }} 
          />
          {!collapsed && (
            <Text 
              strong 
              style={{ 
                marginLeft: '8px', 
                fontSize: '18px', 
                color: token.colorPrimary 
              }}
            >
              CryptoTradeAI
            </Text>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          style={{ borderRight: 0 }}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: 'analysis',
              icon: <LineChartOutlined />,
              label: <Link to="/analysis/BTC">Phân tích</Link>,
            },
            {
              key: 'portfolio',
              icon: <WalletOutlined />,
              label: <Link to="/portfolio">Danh mục</Link>,
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: <Link to="/settings">Cài đặt</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: token.colorBgContainer, 
          display: 'flex', 
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginRight: 16 }}
          />
          <div style={{ flex: 1 }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Dropdown menu={notificationMenu} trigger={['click']} placement="bottomRight">
              <Badge count={unreadCount} overflowCount={9}>
                <Button type="text" icon={<BellOutlined />} shape="circle" />
              </Badge>
            </Dropdown>
            <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <Avatar icon={<UserOutlined />} />
                {!collapsed && <span>Người dùng</span>}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className="content">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 