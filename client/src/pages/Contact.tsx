import React from 'react';
import { Layout, Typography, Form, Input, Button, Card, Space, Row, Col, message } from 'antd';
import { MailOutlined, PhoneOutlined, GlobalOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './Contact.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Contact: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    message.success('Tin nhắn của bạn đã được gửi thành công!');
    form.resetFields();
  };

  const contactInfo = [
    {
      icon: <MailOutlined />,
      title: 'Email',
      content: 'support@cryptotradeai.com',
      description: 'Phản hồi trong vòng 24 giờ'
    },
    {
      icon: <PhoneOutlined />,
      title: 'Điện thoại',
      content: '+84 123 456 789',
      description: 'Thứ 2 - Thứ 6: 8:00 - 18:00'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận XYZ, TP.HCM',
      description: 'Văn phòng chính'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6',
      description: '8:00 - 18:00 (GMT+7)'
    }
  ];

  return (
    <Layout className="contact-layout">
      <div className="contact-header">
        <Title level={1}>Liên hệ & Hỗ trợ</Title>
        <Text type="secondary">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn
        </Text>
      </div>

      <Row gutter={[24, 24]} className="contact-content">
        <Col xs={24} md={12}>
          <Card className="contact-form-card">
            <Title level={3}>Gửi tin nhắn cho chúng tôi</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nhập họ tên của bạn" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input placeholder="Nhập tiêu đề tin nhắn" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
              >
                <TextArea rows={6} placeholder="Nhập nội dung tin nhắn" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Space direction="vertical" size="large" className="contact-info">
            {contactInfo.map((info, index) => (
              <Card key={index} className="contact-info-card">
                <Space direction="vertical" size="small">
                  <Space>
                    {info.icon}
                    <Title level={4} style={{ margin: 0 }}>{info.title}</Title>
                  </Space>
                  <Text strong>{info.content}</Text>
                  <Text type="secondary">{info.description}</Text>
                </Space>
              </Card>
            ))}
          </Space>
        </Col>
      </Row>
    </Layout>
  );
};

export default Contact; 