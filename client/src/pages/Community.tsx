import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  getPublicStrategies,
  addComment,
  addRating,
  followStrategy,
  clearError
} from '../slices/socialSlice';
import {
  Card,
  List,
  Avatar,
  Button,
  Input,
  Rate,
  Space,
  Typography,
  message,
  Row,
  Col,
  Statistic,
  Divider
} from 'antd';
import {
  MessageOutlined,
  StarOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons';
import './Community.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Community: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { publicStrategies, loading, error } = useSelector((state: RootState) => state.social);
  const [commentContent, setCommentContent] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getPublicStrategies());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleComment = async (strategyId: string) => {
    if (!commentContent.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      await dispatch(addComment({ strategyShareId: strategyId, content: commentContent })).unwrap();
      setCommentContent('');
      message.success('Đã thêm bình luận');
    } catch (error) {
      message.error('Thêm bình luận thất bại');
    }
  };

  const handleRating = async (strategyId: string, score: number) => {
    try {
      await dispatch(addRating({ strategyShareId: strategyId, score })).unwrap();
      message.success('Đã thêm đánh giá');
    } catch (error) {
      message.error('Thêm đánh giá thất bại');
    }
  };

  const handleFollow = async (strategyId: string) => {
    try {
      await dispatch(followStrategy(strategyId)).unwrap();
      message.success('Đã cập nhật trạng thái theo dõi');
    } catch (error) {
      message.error('Theo dõi thất bại');
    }
  };

  return (
    <div className="community">
      <Title level={2}>Cộng đồng giao dịch</Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={publicStrategies}
        loading={loading}
        renderItem={(strategy) => (
          <List.Item>
            <Card
              className="strategy-card"
              actions={[
                <Space>
                  <Button
                    type="text"
                    icon={strategy.followers?.includes(strategy.user._id) ? <HeartFilled /> : <HeartOutlined />}
                    onClick={() => handleFollow(strategy._id)}
                  >
                    {strategy.followers?.length || 0}
                  </Button>
                  <Button
                    type="text"
                    icon={<MessageOutlined />}
                    onClick={() => setSelectedStrategy(selectedStrategy === strategy._id ? null : strategy._id)}
                  >
                    {strategy.comments?.length || 0}
                  </Button>
                </Space>
              ]}
            >
              <Card.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={strategy.user?.username}
                description={`${strategy.strategy.name} - ${strategy.strategy.symbol}`}
              />
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Tổng giao dịch"
                    value={strategy.performance?.totalTrades || 0}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Tỷ lệ thắng"
                    value={strategy.performance?.winRate || 0}
                    suffix="%"
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Lợi nhuận trung bình"
                    value={strategy.performance?.averageReturn || 0}
                    suffix="%"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Hệ số lợi nhuận"
                    value={strategy.performance?.profitFactor || 0}
                  />
                </Col>
              </Row>
              <Divider />
              <Space direction="vertical" style={{ width: '100%' }}>
                <Rate
                  value={strategy.ratings?.reduce((acc, curr) => acc + curr.score, 0) / (strategy.ratings?.length || 1)}
                  onChange={(value) => handleRating(strategy._id, value)}
                />
                <Text type="secondary">
                  {strategy.ratings?.length || 0} đánh giá
                </Text>
              </Space>
              {selectedStrategy === strategy._id && (
                <div className="comment-section">
                  <TextArea
                    rows={4}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                  />
                  <Button
                    type="primary"
                    onClick={() => handleComment(strategy._id)}
                    style={{ marginTop: 8 }}
                  >
                    Gửi bình luận
                  </Button>
                  <List
                    dataSource={strategy.comments}
                    renderItem={(comment) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={comment.user?.username}
                          description={comment.content}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Community; 