import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './NewsletterSubscription.css';

const { Text } = Typography;

interface NewsletterSubscriptionProps {
  onSubscribe?: (email: string) => void;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  onSubscribe
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (values: { email: string }) => {
    setLoading(true);
    try {
      // TODO: Gửi email đăng ký lên server
      console.log('Subscribe email:', values.email);
      message.success('Đăng ký nhận tin thành công!');
      form.resetFields();
      onSubscribe?.(values.email);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="newsletter-subscription">
      <div className="newsletter-content">
        <Text strong className="newsletter-title">
          Đăng ký nhận tin
        </Text>
        <Text type="secondary" className="newsletter-description">
          Nhận thông báo về các cập nhật và tính năng mới
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubscribe}
          className="newsletter-form"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default NewsletterSubscription; 