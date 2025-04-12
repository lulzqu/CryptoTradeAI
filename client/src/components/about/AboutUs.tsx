import React from 'react';
import { Card, Typography, Row, Col, Statistic, Avatar, List, Divider } from 'antd';
import {
  TeamOutlined,
  RocketOutlined,
  SafetyOutlined,
  GlobalOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import './AboutUs.css';

const { Title, Text, Paragraph } = Typography;

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      position: 'CEO & Founder',
      avatar: 'https://i.pravatar.cc/150?img=1',
      description: 'Chuyên gia về blockchain và tiền điện tử với hơn 10 năm kinh nghiệm.'
    },
    {
      name: 'Trần Thị B',
      position: 'CTO',
      avatar: 'https://i.pravatar.cc/150?img=2',
      description: 'Chuyên gia về AI và machine learning, từng làm việc tại các công ty công nghệ hàng đầu.'
    },
    {
      name: 'Lê Văn C',
      position: 'Head of Trading',
      avatar: 'https://i.pravatar.cc/150?img=3',
      description: 'Chuyên gia giao dịch với hơn 8 năm kinh nghiệm trong thị trường tiền điện tử.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Thành lập công ty',
      description: 'CryptoTradeAI được thành lập với sứ mệnh cách mạng hóa giao dịch tiền điện tử.'
    },
    {
      year: '2021',
      title: 'Ra mắt nền tảng',
      description: 'Phát hành phiên bản đầu tiên của nền tảng giao dịch AI.'
    },
    {
      year: '2022',
      title: 'Mở rộng thị trường',
      description: 'Mở rộng hoạt động ra thị trường quốc tế với hơn 50.000 người dùng.'
    },
    {
      year: '2023',
      title: 'Cải tiến công nghệ',
      description: 'Nâng cấp hệ thống AI và ra mắt các tính năng mới.'
    }
  ];

  return (
    <div className="about-us">
      <Card className="about-header">
        <Title level={2}>Về chúng tôi</Title>
        <Paragraph>
          CryptoTradeAI là nền tảng giao dịch tiền điện tử thông minh hàng đầu,
          kết hợp sức mạnh của trí tuệ nhân tạo với kinh nghiệm giao dịch chuyên nghiệp.
        </Paragraph>
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={50000}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giao dịch/ngày"
              value={100000}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ chính xác"
              value={85}
              suffix="%"
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Quốc gia"
              value={30}
              prefix={<GlobalOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Sứ mệnh của chúng tôi" style={{ marginTop: 24 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="mission-item">
              <TrophyOutlined className="mission-icon" />
              <Title level={4}>Cung cấp giải pháp giao dịch thông minh</Title>
              <Paragraph>
                Chúng tôi phát triển các công cụ và chiến lược giao dịch tiên tiến
                dựa trên AI để giúp người dùng đạt được lợi nhuận tối ưu.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mission-item">
              <SafetyOutlined className="mission-icon" />
              <Title level={4}>Đảm bảo an toàn và bảo mật</Title>
              <Paragraph>
                Chúng tôi cam kết bảo vệ tài sản và thông tin của người dùng
                thông qua các biện pháp bảo mật tiên tiến nhất.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mission-item">
              <GlobalOutlined className="mission-icon" />
              <Title level={4}>Mở rộng tiếp cận thị trường</Title>
              <Paragraph>
                Chúng tôi tạo điều kiện cho mọi người tiếp cận thị trường tiền điện tử
                một cách dễ dàng và hiệu quả.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mission-item">
              <ClockCircleOutlined className="mission-icon" />
              <Title level={4}>Cải tiến liên tục</Title>
              <Paragraph>
                Chúng tôi không ngừng cải tiến và phát triển các tính năng mới
                để đáp ứng nhu cầu ngày càng cao của người dùng.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="Đội ngũ của chúng tôi" style={{ marginTop: 24 }}>
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3 }}
          dataSource={teamMembers}
          renderItem={member => (
            <List.Item>
              <Card className="team-member-card">
                <Avatar size={100} src={member.avatar} />
                <Title level={4} style={{ marginTop: 16 }}>{member.name}</Title>
                <Text type="secondary">{member.position}</Text>
                <Paragraph style={{ marginTop: 8 }}>{member.description}</Paragraph>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Chặng đường phát triển" style={{ marginTop: 24 }}>
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-year">{milestone.year}</div>
              <div className="timeline-content">
                <Title level={4}>{milestone.title}</Title>
                <Paragraph>{milestone.description}</Paragraph>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AboutUs; 