import React, { useState } from 'react';
import { 
  Card, Avatar, Typography, Tabs, Descriptions, Table, Tag, Button, 
  Statistic, Row, Col, Divider, Space, Progress
} from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, 
  TrophyOutlined, SettingOutlined, TeamOutlined, GlobalOutlined,
  ShoppingOutlined, BellOutlined, LockOutlined, DollarOutlined
} from '@ant-design/icons';
import './UserProfile.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface UserProfileProps {
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const user = {
    id: userId || '12345',
    fullName: 'Nguyễn Văn A',
    username: 'nguyenvana',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    avatar: null,
    joinDate: '2023-01-15',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    role: 'trader',
    level: 'advanced',
    verificationStatus: 'verified',
    totalTrades: 253,
    winRate: 65.2,
    portfolioValue: 124950,
    profitLoss: 24950,
    profitLossPercent: 24.95,
    badges: [
      { id: '1', name: 'Nhà giao dịch hàng đầu', icon: 'trophy', color: 'gold' },
      { id: '2', name: 'Người dùng lâu năm', icon: 'calendar', color: 'blue' },
      { id: '3', name: 'Chiến lược sáng tạo', icon: 'bulb', color: 'purple' },
    ],
    activities: [
      { id: '1', type: 'trade', description: 'Mua BTC ở mức $50,000', time: '2024-03-22T10:30:45' },
      { id: '2', type: 'login', description: 'Đăng nhập từ thiết bị mới', time: '2024-03-21T15:10:30' },
      { id: '3', type: 'deposit', description: 'Nạp 5,000 USDT', time: '2024-03-20T08:45:10' },
      { id: '4', type: 'settings', description: 'Cập nhật cài đặt bảo mật', time: '2024-03-18T14:22:15' },
      { id: '5', type: 'trade', description: 'Bán ETH ở mức $3,000', time: '2024-03-15T09:30:00' },
    ],
    strategies: [
      { id: '1', name: 'MA Cross Strategy', type: 'technical', winRate: 72.5, usage: 45 },
      { id: '2', name: 'RSI Divergence', type: 'technical', winRate: 68.3, usage: 32 },
      { id: '3', name: 'News Trading', type: 'fundamental', winRate: 54.1, usage: 15 },
      { id: '4', name: 'Range Trading', type: 'manual', winRate: 61.7, usage: 8 },
    ],
  };

  const activityColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => (
        <Text>{new Date(time).toLocaleString()}</Text>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          trade: { icon: <ShoppingOutlined />, color: 'blue', text: 'Giao dịch' },
          login: { icon: <UserOutlined />, color: 'purple', text: 'Đăng nhập' },
          deposit: { icon: <DollarOutlined />, color: 'green', text: 'Nạp tiền' },
          withdraw: { icon: <DollarOutlined />, color: 'orange', text: 'Rút tiền' },
          settings: { icon: <SettingOutlined />, color: 'cyan', text: 'Cài đặt' },
        };
        // @ts-ignore
        const config = typeConfig[type] || { icon: <UserOutlined />, color: 'default', text: type };
        
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Chi tiết',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const strategyColumns = [
    {
      title: 'Tên chiến lược',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          technical: { color: 'blue', text: 'Kỹ thuật' },
          fundamental: { color: 'green', text: 'Cơ bản' },
          manual: { color: 'orange', text: 'Thủ công' },
        };
        // @ts-ignore
        const config = typeConfig[type] || { color: 'default', text: type };
        
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Tỷ lệ thắng',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (winRate: number) => (
        <Text type={winRate >= 60 ? 'success' : winRate >= 50 ? 'warning' : 'danger'}>
          {winRate}%
        </Text>
      ),
    },
    {
      title: 'Sử dụng',
      dataIndex: 'usage',
      key: 'usage',
      render: (usage: number) => (
        <Progress percent={usage} size="small" />
      ),
    },
  ];

  return (
    <div className="user-profile">
      <Card className="user-profile-header">
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} md={6} className="user-profile-avatar-col">
            <Avatar 
              size={120}
              icon={<UserOutlined />}
              src={user.avatar}
              className="user-profile-avatar"
            />
          </Col>
          
          <Col xs={24} sm={16} md={18}>
            <Title level={3}>{user.fullName}</Title>
            <Space size="large" wrap>
              <Text><UserOutlined /> @{user.username}</Text>
              <Text><MailOutlined /> {user.email}</Text>
              <Text><CalendarOutlined /> Tham gia: {new Date(user.joinDate).toLocaleDateString()}</Text>
              <Tag color="blue" icon={<TrophyOutlined />}>{user.level === 'advanced' ? 'Nâng cao' : 'Cơ bản'}</Tag>
              <Tag color="green" icon={<LockOutlined />}>{user.verificationStatus === 'verified' ? 'Đã xác minh' : 'Chưa xác minh'}</Tag>
            </Space>
            
            <div className="user-profile-badges">
              {user.badges.map(badge => (
                <Tag key={badge.id} color={badge.color} icon={<TrophyOutlined />}>
                  {badge.name}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="user-profile-content">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tổng quan" key="overview">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Tổng giao dịch" 
                    value={user.totalTrades} 
                    prefix={<ShoppingOutlined />} 
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Tỷ lệ thắng" 
                    value={user.winRate} 
                    precision={1} 
                    suffix="%" 
                    valueStyle={{ color: user.winRate >= 60 ? '#3f8600' : '#cf1322' }}
                    prefix={<TrophyOutlined />} 
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Giá trị danh mục" 
                    value={user.portfolioValue} 
                    precision={2} 
                    suffix="USDT" 
                    prefix={<DollarOutlined />} 
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Lợi nhuận/Lỗ" 
                    value={user.profitLossPercent} 
                    precision={2} 
                    suffix="%" 
                    valueStyle={{ color: user.profitLossPercent >= 0 ? '#3f8600' : '#cf1322' }}
                    prefix={user.profitLossPercent >= 0 ? "+" : "-"}
                  />
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Thông tin cá nhân</Divider>
            
            <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item label="Họ và tên">{user.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="Quốc gia"><GlobalOutlined /> {user.country}</Descriptions.Item>
              <Descriptions.Item label="Ngôn ngữ">{user.language}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color="blue">{user.role === 'trader' ? 'Nhà giao dịch' : 'Quản trị viên'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Cấp độ">
                <Tag color="green">{user.level === 'advanced' ? 'Nâng cao' : 'Cơ bản'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color="purple">{user.verificationStatus === 'verified' ? 'Đã xác minh' : 'Chưa xác minh'}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Hoạt động gần đây</Divider>
            
            <Table 
              dataSource={user.activities} 
              columns={activityColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="Chiến lược" key="strategies">
            <div className="user-profile-strategies">
              <Paragraph>
                Danh sách các chiến lược giao dịch được sử dụng bởi {user.fullName}. Các chiến lược được sắp xếp theo tần suất sử dụng.
              </Paragraph>
              
              <Table 
                dataSource={user.strategies} 
                columns={strategyColumns}
                rowKey="id"
                pagination={false}
              />
            </div>
          </TabPane>
          
          <TabPane tab="Thành tích" key="achievements">
            <div className="user-profile-achievements">
              <Paragraph>
                Thành tích và huy hiệu của {user.fullName} đạt được trong quá trình giao dịch.
              </Paragraph>
              
              <Row gutter={[16, 16]}>
                {user.badges.map(badge => (
                  <Col key={badge.id} xs={24} sm={12} md={8}>
                    <Card className="user-profile-achievement-card">
                      <div className="user-profile-achievement-icon">
                        <TrophyOutlined style={{ fontSize: 48, color: badge.color === 'gold' ? '#faad14' : 
                        badge.color === 'blue' ? '#1890ff' : '#722ed1' }} />
                      </div>
                      <div className="user-profile-achievement-content">
                        <Title level={4}>{badge.name}</Title>
                        <Paragraph>
                          {badge.name === 'Nhà giao dịch hàng đầu' ? 
                            'Đạt tỷ lệ thắng trên 65% trong 30 ngày liên tiếp.' : 
                            badge.name === 'Người dùng lâu năm' ? 
                            'Đã sử dụng hệ thống hơn 1 năm.' : 
                            'Tạo ra chiến lược giao dịch được nhiều người sử dụng.'}
                        </Paragraph>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile; 