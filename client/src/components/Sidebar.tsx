import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  LineChartOutlined,
  BarChartOutlined,
  WalletOutlined,
  SettingOutlined,
  RobotOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/signals',
      icon: <LineChartOutlined />,
      label: 'Tín hiệu',
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: 'Phân tích',
    },
    {
      key: '/portfolio',
      icon: <WalletOutlined />,
      label: 'Danh mục',
    },
    {
      key: '/alerts',
      icon: <BellOutlined />,
      label: 'Cảnh báo',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      key: '/auto-trading',
      icon: <RobotOutlined />,
      label: <Link to="/auto-trading">Giao dịch tự động</Link>,
    },
    {
      key: '/community',
      icon: <TeamOutlined />,
      label: 'Community',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  return (
    <Sider width={200} className="sidebar">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar; 