import React, { useState } from 'react';
import { Card, Typography, Rate, Input, Button, List, Avatar, Form, message, Row, Col, Divider } from 'antd';
import { UserOutlined, StarOutlined, MessageOutlined } from '@ant-design/icons';
import './Feedback.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Feedback {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

const Feedback: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      user: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: 'Nền tảng giao dịch tuyệt vời! Tôi đã tăng lợi nhuận đáng kể nhờ các tín hiệu AI.',
      date: '2024-01-15'
    },
    {
      id: 2,
      user: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      comment: 'Giao diện thân thiện, dễ sử dụng. Tuy nhiên cần thêm một số tính năng phân tích.',
      date: '2024-01-10'
    },
    {
      id: 3,
      user: 'Lê Văn C',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      comment: 'Đội ngũ hỗ trợ rất nhiệt tình và chuyên nghiệp. Rất hài lòng với dịch vụ.',
      date: '2024-01-05'
    }
  ]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Gửi feedback lên server
      const newFeedback: Feedback = {
        id: feedbacks.length + 1,
        user: 'Người dùng mới',
        avatar: 'https://i.pravatar.cc/150',
        rating: values.rating,
        comment: values.comment,
        date: new Date().toISOString().split('T')[0]
      };

      setFeedbacks([newFeedback, ...feedbacks]);
      form.resetFields();
      message.success('Cảm ơn bạn đã gửi đánh giá!');
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length;

  return (
    <div className="feedback">
      <Card className="feedback-header">
        <Title level={2}>Đánh giá của người dùng</Title>
        <Paragraph>
          Chia sẻ trải nghiệm của bạn với CryptoTradeAI và giúp chúng tôi cải thiện dịch vụ.
        </Paragraph>
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <Card className="rating-summary">
            <div className="average-rating">
              <Title level={1}>{averageRating.toFixed(1)}</Title>
              <Rate disabled defaultValue={Math.round(averageRating)} />
              <Text type="secondary">{feedbacks.length} đánh giá</Text>
            </div>
            <Divider />
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = feedbacks.filter(f => f.rating === star).length;
                const percentage = (count / feedbacks.length) * 100;
                return (
                  <div key={star} className="rating-bar">
                    <Text>{star} sao</Text>
                    <div className="bar-container">
                      <div className="bar" style={{ width: `${percentage}%` }} />
                    </div>
                    <Text>{count}</Text>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Gửi đánh giá của bạn">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="rating"
                label="Đánh giá"
                rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
              >
                <Rate />
              </Form.Item>

              <Form.Item
                name="comment"
                label="Nhận xét"
                rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
              >
                <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<MessageOutlined />}
                  block
                >
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card title="Đánh giá gần đây" style={{ marginTop: 24 }}>
        <List
          dataSource={feedbacks}
          renderItem={feedback => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={feedback.avatar} icon={<UserOutlined />} />}
                title={
                  <div>
                    <Text strong>{feedback.user}</Text>
                    <Rate disabled defaultValue={feedback.rating} style={{ marginLeft: 8 }} />
                  </div>
                }
                description={
                  <div>
                    <Paragraph>{feedback.comment}</Paragraph>
                    <Text type="secondary">{feedback.date}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Feedback; 