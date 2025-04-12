import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, message, Row, Col } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import './ContactForm.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ContactFormData) => {
    setLoading(true);
    try {
      // TODO: Gửi dữ liệu form đến API
      console.log('Form data:', values);
      message.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <Card className="contact-form-card">
        <Title level={2}>Liên hệ với chúng tôi</Title>
        <Text type="secondary" className="contact-form-description">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy điền form bên dưới và chúng tôi sẽ liên hệ lại sớm nhất có thể.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="contact-form-content"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ tên của bạn" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="subject"
                label="Chủ đề"
                rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}
              >
                <Select placeholder="Chọn chủ đề">
                  <Option value="general">Câu hỏi chung</Option>
                  <Option value="technical">Hỗ trợ kỹ thuật</Option>
                  <Option value="billing">Vấn đề thanh toán</Option>
                  <Option value="account">Vấn đề tài khoản</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea
              rows={6}
              placeholder="Nhập nội dung tin nhắn của bạn"
              prefix={<MessageOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<MessageOutlined />}
              size="large"
              block
            >
              Gửi tin nhắn
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContactForm; 