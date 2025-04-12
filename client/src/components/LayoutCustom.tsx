import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Dropdown, Avatar, Tooltip, Badge } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  LineChartOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  TeamOutlined,
  LogoutOutlined,
  GlobalOutlined,
  FundOutlined,
  RocketOutlined,
  SafetyOutlined,
  WalletOutlined,
  SyncOutlined
} from '@ant-design/icons';
import './Layout.css';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const { Header, Sider, Content } = Layout;

const LayoutCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const location = useLocation();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const showMobileMenu = () => {
    setMobileMenuVisible(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  const renderMenu = () => (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={['analysis', 'portfolio', 'trade']}
    >
      <Menu.Item key="/" icon={<DashboardOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>

      <Menu.SubMenu key="trade" icon={<RocketOutlined />} title="Giao dịch">
        <Menu.Item key="/trading" icon={<SyncOutlined />}>
          <Link to="/trading">Giao dịch</Link>
        </Menu.Item>
        <Menu.Item key="/signals" icon={<FundOutlined />}>
          <Link to="/signals">Tín hiệu</Link>
        </Menu.Item>
        <Menu.Item key="/autotrading" icon={<RocketOutlined />}>
          <Link to="/autotrading">Giao dịch tự động</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="portfolio" icon={<WalletOutlined />} title="Danh mục">
        <Menu.Item key="/portfolio" icon={<WalletOutlined />}>
          <Link to="/portfolio">Quản lý danh mục</Link>
        </Menu.Item>
        <Menu.Item key="/risk-management" icon={<SafetyOutlined />}>
          <Link to="/risk-management">Quản lý rủi ro</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="analysis" icon={<LineChartOutlined />} title="Phân tích">
        <Menu.Item key="/analysis" icon={<BarChartOutlined />}>
          <Link to="/analysis">Phân tích kỹ thuật</Link>
        </Menu.Item>
        <Menu.Item key="/analysis/prediction" icon={<LineChartOutlined />}>
          <Link to="/analysis/prediction">Dự đoán giá</Link>
        </Menu.Item>
        <Menu.Item key="/analysis/patterns" icon={<FundOutlined />}>
          <Link to="/analysis/patterns">Mẫu hình giá</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="/market" icon={<GlobalOutlined />}>
        <Link to="/market">Thị trường</Link>
      </Menu.Item>

      <Menu.Item key="/community" icon={<TeamOutlined />}>
        <Link to="/community">Cộng đồng</Link>
      </Menu.Item>

      <Menu.Item key="/settings" icon={<SettingOutlined />}>
        <Link to="/settings">Cài đặt</Link>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Hồ sơ cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Cài đặt</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      <Menu.Item key="notification1">
        <div className="notification-item">
          <div className="notification-title">Cảnh báo giá</div>
          <div className="notification-desc">BTC vừa tăng vượt $65,000</div>
          <div className="notification-time">10 phút trước</div>
        </div>
      </Menu.Item>
      <Menu.Item key="notification2">
        <div className="notification-item">
          <div className="notification-title">Tín hiệu mới</div>
          <div className="notification-desc">Tín hiệu mua ETH đã được kích hoạt</div>
          <div className="notification-time">30 phút trước</div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="viewAll">
        <Link to="/notifications">Xem tất cả thông báo</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="main-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        className="main-sidebar"
      >
        <div className="logo">
          {collapsed ? 'CT' : 'CryptoTradeAI'}
        </div>
        {renderMenu()}
      </Sider>
      <Layout className="site-layout">
        <Header className="site-header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle,
            })}
            <Button className="mobile-trigger" onClick={showMobileMenu}>
              <MenuUnfoldOutlined />
            </Button>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <ThemeToggle />
              <LanguageSwitcher />
              <Dropdown overlay={notificationMenu} placement="bottomRight" arrow>
                <Badge count={2} className="notification-badge">
                  <Button type="text" icon={<BellOutlined />} />
                </Badge>
              </Dropdown>
              <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                <div className="user-dropdown">
                  <Avatar icon={<UserOutlined />} />
                  <span className="username">John Doe</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content className="site-content">
          {children}
        </Content>
      </Layout>

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeMobileMenu}
        visible={mobileMenuVisible}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0' }}
      >
        {renderMenu()}
      </Drawer>
    </Layout>
  );
};

export default LayoutCustom; 