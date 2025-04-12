import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Space } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header">
      <div className="logo">CryptoTradeAI</div>
      <div className="header-right">
        <Space size="large">
          <BellOutlined className="notification-icon" />
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <span className="username">Admin</span>
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default HeaderComponent; 