import React, { useState } from 'react';
import { Form, Input, Button, Rate, message, Card } from 'antd';
import { StarOutlined, MessageOutlined } from '@ant-design/icons';
import './FeedbackForm.css';

const { TextArea } = Input;

interface FeedbackFormProps {
  onSubmit?: (values: any) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Gửi feedback lên server
      console.log('Feedback:', values);
      message.success('Cảm ơn phản hồi của bạn!');
      form.resetFields();
      onSubmit?.(values);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="feedback-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="rating"
          label="Đánh giá của bạn"
          rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
        >
          <Rate character={<StarOutlined />} />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Nhận xét"
          rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
        >
          <TextArea
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            prefix={<MessageOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<MessageOutlined />}
            block
          >
            Gửi phản hồi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FeedbackForm; 