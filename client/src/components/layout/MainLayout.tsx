import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Switch } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  DashboardOutlined,
  LineChartOutlined,
  WalletOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = theme.useToken();

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'market':
        navigate('/market');
        break;
      case 'portfolio':
        navigate('/portfolio');
        break;
      case 'analysis':
        navigate('/analysis');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'logout':
        dispatch(logout());
        navigate('/login');
        break;
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'market',
      icon: <LineChartOutlined />,
      label: 'Thị trường'
    },
    {
      key: 'portfolio',
      icon: <WalletOutlined />,
      label: 'Danh mục'
    },
    {
      key: 'analysis',
      icon: <LineChartOutlined />,
      label: 'Phân tích'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt'
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất'
    }
  ];

  return (
    <Layout className={`main-layout ${isDarkMode ? 'dark' : 'light'}`}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="main-sider"
      >
        <div className="logo">
          <img src="/logo.png" alt="CryptoTradeAI" />
          {!collapsed && <span>CryptoTradeAI</span>}
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header className="main-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="trigger-button"
          />
          <div className="header-right">
            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </div>
        </Header>
        <Content className="main-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 