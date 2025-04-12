import React, { useState } from 'react';
import { Drawer, Menu, Button } from 'antd';
import {
  MenuOutlined,
  DashboardOutlined,
  LineChartOutlined,
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
  RobotOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const MobileMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/market',
      icon: <LineChartOutlined />,
      label: 'Market'
    },
    {
      key: '/portfolio',
      icon: <WalletOutlined />,
      label: 'Portfolio'
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: 'Analysis'
    },
    {
      key: '/auto-trading',
      icon: <RobotOutlined />,
      label: 'Auto Trading'
    },
    {
      key: '/community',
      icon: <TeamOutlined />,
      label: 'Community'
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setVisible(true)}
        style={{ fontSize: '16px', width: 64, height: 64 }}
      />
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setVisible(false)}
        visible={visible}
        width={250}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <ThemeToggle />
        </div>
      </Drawer>
    </>
  );
};

export default MobileMenu; 