import React, { useState } from 'react';
import { Card, Typography, Collapse, Input, Space, Button, Tag, Row, Col } from 'antd';
import { SearchOutlined, QuestionCircleOutlined, MessageOutlined } from '@ant-design/icons';
import './FAQ.css';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Tất cả' },
    { key: 'account', label: 'Tài khoản' },
    { key: 'trading', label: 'Giao dịch' },
    { key: 'security', label: 'Bảo mật' },
    { key: 'payment', label: 'Thanh toán' },
    { key: 'ai', label: 'Tính năng AI' }
  ];

  const faqs = [
    {
      id: 1,
      question: 'Làm thế nào để tạo tài khoản?',
      answer: 'Để tạo tài khoản, bạn cần truy cập trang đăng ký và điền đầy đủ thông tin cá nhân. Sau đó, bạn sẽ nhận được email xác thực để kích hoạt tài khoản.',
      category: 'account',
      tags: ['đăng ký', 'tài khoản']
    },
    {
      id: 2,
      question: 'Các phương thức thanh toán được hỗ trợ?',
      answer: 'Chúng tôi hỗ trợ nhiều phương thức thanh toán như chuyển khoản ngân hàng, thẻ tín dụng, và các loại tiền điện tử phổ biến như Bitcoin, Ethereum.',
      category: 'payment',
      tags: ['thanh toán', 'tiền điện tử']
    },
    {
      id: 3,
      question: 'Làm thế nào để bảo mật tài khoản?',
      answer: 'Bạn nên bật xác thực hai yếu tố (2FA), sử dụng mật khẩu mạnh, và không chia sẻ thông tin đăng nhập với bất kỳ ai.',
      category: 'security',
      tags: ['bảo mật', '2FA']
    },
    {
      id: 4,
      question: 'Tính năng AI hoạt động như thế nào?',
      answer: 'Hệ thống AI của chúng tôi phân tích dữ liệu thị trường theo thời gian thực, sử dụng các thuật toán học máy để đưa ra dự đoán và tín hiệu giao dịch.',
      category: 'ai',
      tags: ['AI', 'phân tích']
    },
    {
      id: 5,
      question: 'Phí giao dịch là bao nhiêu?',
      answer: 'Phí giao dịch được tính dựa trên khối lượng giao dịch và loại tài khoản của bạn. Bạn có thể xem chi tiết phí trong bảng phí của chúng tôi.',
      category: 'trading',
      tags: ['phí', 'giao dịch']
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="faq">
      <Card className="faq-header">
        <Title level={2}>Câu hỏi thường gặp</Title>
        <Paragraph>
          Tìm câu trả lời cho các câu hỏi phổ biến về CryptoTradeAI.
          Nếu bạn không tìm thấy câu trả lời, hãy liên hệ với chúng tôi.
        </Paragraph>
        <Input
          placeholder="Tìm kiếm câu hỏi..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card>
            <Space wrap style={{ marginBottom: 16 }}>
              {categories.map(category => (
                <Button
                  key={category.key}
                  type={activeCategory === category.key ? 'primary' : 'default'}
                  onClick={() => setActiveCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </Space>

            <Collapse defaultActiveKey={['1']}>
              {filteredFaqs.map(faq => (
                <Panel
                  header={
                    <Space>
                      <QuestionCircleOutlined />
                      <Text strong>{faq.question}</Text>
                    </Space>
                  }
                  key={faq.id}
                  extra={
                    <Space>
                      {faq.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  }
                >
                  <Paragraph>{faq.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Không tìm thấy câu trả lời?">
            <Paragraph>
              Nếu bạn không tìm thấy câu trả lời trong danh sách trên,
              hãy liên hệ với đội ngũ hỗ trợ của chúng tôi.
            </Paragraph>
            <Button type="primary" icon={<MessageOutlined />} block>
              Liên hệ hỗ trợ
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FAQ; 