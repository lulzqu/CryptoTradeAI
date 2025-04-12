import React, { useState } from 'react';
import { Card, Typography, Collapse, Input, Space, Button, List, Tag, Row, Col } from 'antd';
import { SearchOutlined, BookOutlined, VideoCameraOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './Documentation.css';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      key: 'getting-started',
      title: 'Bắt đầu',
      icon: <BookOutlined />,
      items: [
        {
          title: 'Giới thiệu về CryptoTradeAI',
          content: 'Tìm hiểu về nền tảng giao dịch tiền điện tử thông minh của chúng tôi...'
        },
        {
          title: 'Cách tạo tài khoản',
          content: 'Hướng dẫn chi tiết cách đăng ký và xác thực tài khoản...'
        },
        {
          title: 'Hướng dẫn nạp tiền',
          content: 'Các phương thức nạp tiền và quy trình thực hiện...'
        }
      ]
    },
    {
      key: 'trading',
      title: 'Giao dịch',
      icon: <VideoCameraOutlined />,
      items: [
        {
          title: 'Cách đặt lệnh',
          content: 'Hướng dẫn chi tiết về các loại lệnh và cách đặt lệnh...'
        },
        {
          title: 'Chiến lược giao dịch',
          content: 'Các chiến lược giao dịch phổ biến và cách áp dụng...'
        },
        {
          title: 'Quản lý rủi ro',
          content: 'Các phương pháp quản lý rủi ro hiệu quả...'
        }
      ]
    },
    {
      key: 'ai-features',
      title: 'Tính năng AI',
      icon: <QuestionCircleOutlined />,
      items: [
        {
          title: 'Phân tích thị trường',
          content: 'Cách sử dụng các công cụ phân tích thị trường AI...'
        },
        {
          title: 'Tín hiệu giao dịch',
          content: 'Hiểu và sử dụng các tín hiệu giao dịch AI...'
        },
        {
          title: 'Tối ưu hóa danh mục',
          content: 'Cách AI giúp tối ưu hóa danh mục đầu tư...'
        }
      ]
    }
  ];

  const recentArticles = [
    {
      title: 'Cập nhật tính năng mới: AI Signal Scanner',
      date: '2024-01-15',
      category: 'Tính năng'
    },
    {
      title: 'Hướng dẫn sử dụng API mới',
      date: '2024-01-10',
      category: 'API'
    },
    {
      title: 'Cải thiện hiệu suất giao dịch',
      date: '2024-01-05',
      category: 'Tối ưu hóa'
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <div className="documentation">
      <Card className="documentation-header">
        <Title level={2}>Tài liệu hướng dẫn</Title>
        <Paragraph>
          Tìm hiểu cách sử dụng CryptoTradeAI một cách hiệu quả nhất. 
          Chúng tôi cung cấp các hướng dẫn chi tiết và tài liệu đầy đủ.
        </Paragraph>
        <Input
          placeholder="Tìm kiếm tài liệu..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Danh mục tài liệu">
            {filteredCategories.map(category => (
              <Collapse key={category.key} defaultActiveKey={['getting-started']}>
                <Panel 
                  header={
                    <Space>
                      {category.icon}
                      <Text strong>{category.title}</Text>
                    </Space>
                  } 
                  key={category.key}
                >
                  <List
                    dataSource={category.items}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Text strong>{item.title}</Text>}
                          description={item.content}
                        />
                        <Button type="link">Xem chi tiết</Button>
                      </List.Item>
                    )}
                  />
                </Panel>
              </Collapse>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Bài viết gần đây">
            <List
              dataSource={recentArticles}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space>
                        <Text type="secondary">{item.date}</Text>
                        <Tag>{item.category}</Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Cần hỗ trợ?" style={{ marginTop: 24 }}>
            <Paragraph>
              Nếu bạn không tìm thấy câu trả lời trong tài liệu, 
              hãy liên hệ với đội ngũ hỗ trợ của chúng tôi.
            </Paragraph>
            <Button type="primary" block>
              Liên hệ hỗ trợ
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Documentation; 