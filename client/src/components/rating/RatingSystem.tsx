import React, { useState } from 'react';
import { Rate, Card, Typography, Space, Button } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import './RatingSystem.css';

const { Text, Title } = Typography;

interface RatingSystemProps {
  initialRating?: number;
  totalRatings?: number;
  onRate?: (value: number) => void;
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  initialRating = 0,
  totalRatings = 0,
  onRate
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (value: number) => {
    setRating(value);
    onRate?.(value);
  };

  const getRatingText = () => {
    if (rating === 0) return 'Chưa có đánh giá';
    if (rating <= 2) return 'Không hài lòng';
    if (rating <= 3) return 'Bình thường';
    if (rating <= 4) return 'Hài lòng';
    return 'Rất hài lòng';
  };

  return (
    <Card className="rating-system">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div className="rating-header">
          <Title level={4}>Đánh giá sản phẩm</Title>
          <Text type="secondary">{totalRatings} đánh giá</Text>
        </div>

        <div className="rating-content">
          <Rate
            value={rating}
            onChange={handleRate}
            onHoverChange={setHoverRating}
            character={({ index }) => {
              const value = hoverRating || rating;
              return value > index ? <StarFilled /> : <StarOutlined />;
            }}
          />
          <Text className="rating-text">{getRatingText()}</Text>
        </div>

        {rating > 0 && (
          <Button
            type="link"
            onClick={() => handleRate(0)}
            className="clear-rating"
          >
            Xóa đánh giá
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default RatingSystem; 