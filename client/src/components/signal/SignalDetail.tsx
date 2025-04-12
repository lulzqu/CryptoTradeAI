import React from 'react';
import { Card, Typography, Descriptions, Tag, Space, Button, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface SignalDetailProps {
  signal: {
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    strategy: string;
    price: number;
    target: number;
    stopLoss: number;
    time: string;
    status: 'active' | 'completed' | 'canceled';
    result?: 'profit' | 'loss';
    profit?: number;
    profitPercent?: number;
    duration?: string;
    indicators?: {
      name: string;
      value: number;
      signal: 'buy' | 'sell' | 'neutral';
    }[];
  };
}

const SignalDetail: React.FC<SignalDetailProps> = ({ signal }) => {
  const renderIndicator = (indicator: { name: string; value: number; signal: 'buy' | 'sell' | 'neutral' }) => (
    <Descriptions.Item label={indicator.name}>
      <Space>
        <Text>{indicator.value.toFixed(2)}</Text>
        <Tag color={
          indicator.signal === 'buy' ? 'success' :
          indicator.signal === 'sell' ? 'error' : 'default'
        }>
          {indicator.signal === 'buy' ? 'Mua' :
           indicator.signal === 'sell' ? 'Bán' : 'Trung lập'}
        </Tag>
      </Space>
    </Descriptions.Item>
  );

  return (
    <Card className="signal-detail">
      <div className="signal-detail-header">
        <Title level={4}>Chi tiết tín hiệu</Title>
        <Space>
          <Button type="primary">Thực hiện giao dịch</Button>
          <Button>Hủy tín hiệu</Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Giá hiện tại"
              value={signal.price}
              precision={2}
              prefix="$"
              valueStyle={{ color: signal.type === 'buy' ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Lợi nhuận tiềm năng"
              value={Math.abs(signal.target - signal.price)}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Descriptions bordered column={2} style={{ marginTop: 16 }}>
        <Descriptions.Item label="Cặp giao dịch">
          <Text strong>{signal.symbol}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Loại">
          <Tag color={signal.type === 'buy' ? 'success' : 'error'}>
            {signal.type === 'buy' ? 'Mua' : 'Bán'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Chiến lược">
          {signal.strategy}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian">
          {new Date(signal.time).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Mục tiêu">
          <Text type="success">{signal.target.toLocaleString()} USDT</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Dừng lỗ">
          <Text type="danger">{signal.stopLoss.toLocaleString()} USDT</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Space>
            <Tag color={
              signal.status === 'active' ? 'blue' :
              signal.status === 'completed' ? (signal.result === 'profit' ? 'success' : 'error') :
              'default'
            }>
              {signal.status === 'active' ? 'Đang hoạt động' :
               signal.status === 'completed' ? (signal.result === 'profit' ? 'Lãi' : 'Lỗ') :
               'Đã hủy'}
            </Tag>
            {signal.status === 'completed' && (
              signal.result === 'profit' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            )}
          </Space>
        </Descriptions.Item>
        {signal.profit && (
          <Descriptions.Item label="Lợi nhuận">
            <Text type={signal.profit >= 0 ? 'success' : 'danger'}>
              {signal.profit.toLocaleString()} USDT ({signal.profitPercent}%)
            </Text>
          </Descriptions.Item>
        )}
        {signal.duration && (
          <Descriptions.Item label="Thời gian thực hiện">
            {signal.duration}
          </Descriptions.Item>
        )}
      </Descriptions>

      {signal.indicators && (
        <>
          <Title level={5} style={{ marginTop: 24 }}>Chỉ báo kỹ thuật</Title>
          <Descriptions bordered column={2}>
            {signal.indicators.map(renderIndicator)}
          </Descriptions>
        </>
      )}
    </Card>
  );
};

export default SignalDetail; 