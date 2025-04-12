import React from 'react';
import { Card, Tag, Row, Col, Typography, Divider, Spin, Empty, Table, List, Image, Space } from 'antd';
import { RiseOutlined, FallOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

interface TradingRecommendation {
  action: 'BUY' | 'SELL' | 'WATCH';
  description: string;
  priceTarget?: string;
  stopLoss?: string;
}

interface PatternPoint {
  id: number;
  description: string;
}

interface CandlestickPattern {
  id: string;
  name: string;
  type: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  description: string;
  confidence: number;
  timeframe: string;
  imageUrl?: string;
  points?: PatternPoint[] | string[];
  tradingRecommendation?: TradingRecommendation;
}

interface PatternRecognitionProps {
  symbol: string;
  patterns: CandlestickPattern[] | undefined;
  loading: boolean;
}

const PatternRecognition: React.FC<PatternRecognitionProps> = ({ symbol, patterns, loading }) => {
  if (loading) {
    return <Spin tip="Đang tải nhận diện mẫu hình..." />;
  }
  
  if (!patterns || patterns.length === 0) {
    return <Empty description="Không phát hiện mẫu hình giá cho symbol này." />;
  }
  
  // Phân loại các mẫu hình
  const bullishPatterns = patterns.filter(p => p.sentiment === 'BULLISH');
  const bearishPatterns = patterns.filter(p => p.sentiment === 'BEARISH');
  const neutralPatterns = patterns.filter(p => p.sentiment === 'NEUTRAL');
  
  // Lấy màu sắc dựa vào xu hướng
  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'BULLISH') return 'green';
    if (sentiment === 'BEARISH') return 'red';
    return 'default';
  };
  
  // Lấy text dựa vào xu hướng
  const getSentimentText = (sentiment: string) => {
    if (sentiment === 'BULLISH') return 'Tăng giá';
    if (sentiment === 'BEARISH') return 'Giảm giá';
    return 'Trung lập';
  };
  
  // Lấy icon dựa vào xu hướng
  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'BULLISH') return <RiseOutlined />;
    if (sentiment === 'BEARISH') return <FallOutlined />;
    return <InfoCircleOutlined />;
  };
  
  // Định nghĩa cột cho bảng các mẫu hình
  const columns = [
    {
      title: 'Mẫu hình',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Text>{type}</Text>,
    },
    {
      title: 'Xu hướng',
      dataIndex: 'sentiment',
      key: 'sentiment',
      render: (sentiment: string) => (
        <Tag 
          color={getSentimentColor(sentiment)}
          icon={getSentimentIcon(sentiment)}
        >
          {getSentimentText(sentiment)}
        </Tag>
      ),
    },
    {
      title: 'Độ tin cậy',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => {
        let color = 'red';
        if (confidence >= 70) {
          color = 'green';
        } else if (confidence >= 50) {
          color = 'gold';
        }
        
        return (
          <Tag color={color}>{confidence}%</Tag>
        );
      },
    },
    {
      title: 'Khung thời gian',
      dataIndex: 'timeframe',
      key: 'timeframe',
      render: (timeframe: string) => <Text>{timeframe}</Text>,
    },
  ];
  
  // Render chi tiết mẫu hình
  const renderPatternDetail = (pattern: CandlestickPattern) => (
    <Card
      key={pattern.id || pattern.name}
      title={
        <Space>
          {pattern.name}
          <Tag 
            color={getSentimentColor(pattern.sentiment)}
            icon={getSentimentIcon(pattern.sentiment)}
          >
            {getSentimentText(pattern.sentiment)}
          </Tag>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={pattern.imageUrl ? 12 : 24}>
          <Paragraph>{pattern.description}</Paragraph>
          
          {pattern.points && pattern.points.length > 0 && (
            <>
              <Text strong>Điểm đánh dấu:</Text>
              <ul>
                {pattern.points.map((point: any, index: number) => (
                  <li key={index}>
                    {typeof point === 'string' ? point : point.description}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          <div style={{ marginTop: 8 }}>
            <Text strong>Độ tin cậy: </Text>
            <Tag color={
              pattern.confidence >= 70 ? 'green' : 
              pattern.confidence >= 50 ? 'gold' : 
              'red'
            }>{pattern.confidence}%</Tag>
          </div>
          
          <div style={{ marginTop: 8 }}>
            <Text strong>Khung thời gian: </Text>
            <Text>{pattern.timeframe}</Text>
          </div>
          
          {pattern.tradingRecommendation && (
            <div style={{ marginTop: 16 }}>
              <Divider orientation="left">Khuyến nghị giao dịch</Divider>
              <Paragraph>
                <Text type={
                  pattern.tradingRecommendation.action === 'BUY' ? 'success' : 
                  pattern.tradingRecommendation.action === 'SELL' ? 'danger' : 
                  'secondary'
                }>
                  {pattern.tradingRecommendation.action === 'BUY' ? 'Mua' : 
                   pattern.tradingRecommendation.action === 'SELL' ? 'Bán' : 
                   'Theo dõi'}
                </Text>
                : {pattern.tradingRecommendation.description}
              </Paragraph>
              {pattern.tradingRecommendation.priceTarget && (
                <Paragraph>
                  <Text strong>Mục tiêu giá: </Text>
                  <Text>{pattern.tradingRecommendation.priceTarget}</Text>
                </Paragraph>
              )}
              {pattern.tradingRecommendation.stopLoss && (
                <Paragraph>
                  <Text strong>Stop Loss: </Text>
                  <Text type="danger">{pattern.tradingRecommendation.stopLoss}</Text>
                </Paragraph>
              )}
            </div>
          )}
        </Col>
        
        {pattern.imageUrl && (
          <Col xs={24} md={12}>
            <Image 
              src={pattern.imageUrl} 
              alt={pattern.name}
              style={{ width: '100%' }}
            />
          </Col>
        )}
      </Row>
    </Card>
  );
  
  return (
    <div className="pattern-recognition">
      <Card 
        title={<Title level={4}>Nhận diện mẫu hình giá - {symbol}</Title>}
        className="pattern-card"
      >
        <Paragraph>
          <ExclamationCircleOutlined style={{ marginRight: 8 }} />
          <Text type="secondary">
            Phát hiện được {patterns.length} mẫu hình giá trên biểu đồ. Các mẫu hình tăng giá: {bullishPatterns.length}, 
            giảm giá: {bearishPatterns.length}, trung lập: {neutralPatterns.length}.
          </Text>
        </Paragraph>
        
        <Divider orientation="left">Tổng quan mẫu hình</Divider>
        <Table 
          columns={columns} 
          dataSource={patterns.map(p => ({ ...p, key: p.id || p.name }))} 
          pagination={false}
          size="small"
          style={{ marginBottom: 24 }}
        />
        
        <Divider orientation="left">Chi tiết mẫu hình</Divider>
        <div className="pattern-details">
          {patterns.map(pattern => renderPatternDetail(pattern))}
        </div>
      </Card>
    </div>
  );
};

export default PatternRecognition;
 