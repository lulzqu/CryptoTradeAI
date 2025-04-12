import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, Space, Tooltip } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import {
  DashboardOutlined,
  LineChartOutlined,
  WalletOutlined,
  BarChartOutlined,
  RobotOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import LanguageSwitcher from './LanguageSwitcher';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: t('dashboard.title'),
    },
    {
      key: '/trading',
      icon: <LineChartOutlined />,
      label: t('trading.title'),
    },
    {
      key: '/auto-trading',
      icon: <RobotOutlined />,
      label: t('trading.autoTrading'),
    },
    {
      key: '/community',
      icon: <TeamOutlined />,
      label: t('community.title'),
    },
    {
      key: '/analysis',
      icon: <LineChartOutlined />,
      label: t('analysis.title'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('settings.title'),
    },
    {
      key: 'backtest',
      icon: <BarChartOutlined />,
      label: t('backtest.title'),
      path: '/backtest'
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  return (
    <AntLayout className="layout">
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="sider"
        >
          <div className="logo">
            <h1>{collapsed ? 'CT' : 'CryptoTradeAI'}</h1>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </Sider>
      )}
      <AntLayout>
        <Header className="header">
          <Space>
            {!isMobile && (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="trigger"
              />
            )}
            <div className="header-right">
              <LanguageSwitcher />
              <Tooltip title={t('common.logout')}>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                />
              </Tooltip>
            </div>
          </Space>
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 