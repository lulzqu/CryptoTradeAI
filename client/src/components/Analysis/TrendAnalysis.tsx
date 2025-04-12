import React from 'react';
import { Card, Statistic, Row, Col, Typography, Tag, Divider, Spin, Empty, Table, Progress } from 'antd';
import { RiseOutlined, FallOutlined, InfoCircleOutlined, LineChartOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

interface TrendAnalysisProps {
  symbol: string;
  analysis: any;
  loading: boolean;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ symbol, analysis, loading }) => {
  if (loading) {
    return <Spin tip="Đang tải phân tích xu hướng..." />;
  }
  
  if (!analysis) {
    return <Empty description="Không có dữ liệu phân tích xu hướng cho symbol này." />;
  }
  
  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'BULLISH') return 'green';
    if (sentiment === 'BEARISH') return 'red';
    return 'default';
  };
  
  const getSentimentText = (sentiment: string) => {
    if (sentiment === 'BULLISH') return 'Tăng giá';
    if (sentiment === 'BEARISH') return 'Giảm giá';
    return 'Trung lập';
  };
  
  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'BULLISH') return <RiseOutlined />;
    if (sentiment === 'BEARISH') return <FallOutlined />;
    return <InfoCircleOutlined />;
  };
  
  // Các mức giá quan trọng
  const supportLevels = analysis.supportLevels || [];
  const resistanceLevels = analysis.resistanceLevels || [];
  const currentPrice = analysis.currentPrice || 0;
  
  // Các chỉ số thời gian
  const timeframes = [
    { key: 'hour', name: '1 giờ', sentiment: analysis.sentimentByTimeframe?.hour || 'NEUTRAL', strength: analysis.strengthByTimeframe?.hour || 0 },
    { key: 'day', name: '1 ngày', sentiment: analysis.sentimentByTimeframe?.day || 'NEUTRAL', strength: analysis.strengthByTimeframe?.day || 0 },
    { key: 'week', name: '1 tuần', sentiment: analysis.sentimentByTimeframe?.week || 'NEUTRAL', strength: analysis.strengthByTimeframe?.week || 0 },
    { key: 'month', name: '1 tháng', sentiment: analysis.sentimentByTimeframe?.month || 'NEUTRAL', strength: analysis.strengthByTimeframe?.month || 0 },
  ];
  
  const timeframeColumns = [
    {
      title: 'Khung thời gian',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Độ mạnh',
      dataIndex: 'strength',
      key: 'strength',
      render: (strength: number) => (
        <Progress 
          percent={strength} 
          size="small" 
          status={
            strength >= 70 ? 'success' : 
            strength >= 30 ? 'normal' : 
            'exception'
          }
        />
      ),
    },
  ];
  
  // Tính khoảng cách % từ giá hiện tại đến mức hỗ trợ/kháng cự
  const calculatePercentage = (level: number) => {
    if (!currentPrice || !level) return 0;
    return ((level - currentPrice) / currentPrice * 100).toFixed(2);
  };
  
  return (
    <div className="trend-analysis">
      <Title level={4}>Phân tích xu hướng cho {symbol}</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Xu hướng tổng thể"
              value={getSentimentText(analysis.overallSentiment || 'NEUTRAL')}
              valueStyle={{ 
                color: getSentimentColor(analysis.overallSentiment || 'NEUTRAL') === 'green' ? '#3f8600' : 
                       getSentimentColor(analysis.overallSentiment || 'NEUTRAL') === 'red' ? '#cf1322' : 
                       'inherit'
              }}
              prefix={getSentimentIcon(analysis.overallSentiment || 'NEUTRAL')}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Độ tin cậy"
              value={analysis.confidence || 0}
              suffix="%"
              precision={0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Độ mạnh"
              value={analysis.strength || 0}
              suffix="%"
              precision={0}
              valueStyle={{ 
                color: (analysis.strength || 0) >= 70 ? '#3f8600' : 
                       (analysis.strength || 0) >= 30 ? '#faad14' : 
                       '#cf1322'
              }}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Mức giá quan trọng</Divider>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Mức kháng cự (Resistance)" bordered={false} style={{ background: '#fff1f0' }}>
            {resistanceLevels.length > 0 ? (
              resistanceLevels.map((level: number, index: number) => (
                <div key={`resistance-${index}`} style={{ marginBottom: 8 }}>
                  <Row>
                    <Col span={12}>
                      <Text strong>R{index + 1}: </Text>
                      <Text type="danger">{level}</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Tag color="red">
                        +{calculatePercentage(level)}%
                      </Tag>
                    </Col>
                  </Row>
                </div>
              ))
            ) : (
              <Empty description="Không có dữ liệu mức kháng cự" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Mức hỗ trợ (Support)" bordered={false} style={{ background: '#f6ffed' }}>
            {supportLevels.length > 0 ? (
              supportLevels.map((level: number, index: number) => (
                <div key={`support-${index}`} style={{ marginBottom: 8 }}>
                  <Row>
                    <Col span={12}>
                      <Text strong>S{index + 1}: </Text>
                      <Text type="success">{level}</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Tag color="green">
                        {calculatePercentage(level)}%
                      </Tag>
                    </Col>
                  </Row>
                </div>
              ))
            ) : (
              <Empty description="Không có dữ liệu mức hỗ trợ" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 16 }}>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Text strong>Giá hiện tại: </Text>
            <Text style={{ fontSize: 18 }}>{currentPrice}</Text>
          </Col>
        </Row>
      </Card>
      
      <Divider orientation="left">Phân tích theo khung thời gian</Divider>
      
      <Table 
        dataSource={timeframes} 
        columns={timeframeColumns} 
        rowKey="key" 
        pagination={false} 
        size="small" 
      />
      
      <Divider orientation="left">Phân tích chi tiết</Divider>
      
      <Card>
        <Paragraph>
          {analysis.analysis || 'Không có phân tích chi tiết cho symbol này.'}
        </Paragraph>
        
        {analysis.tradingRecommendation && (
          <>
            <Divider>Khuyến nghị giao dịch</Divider>
            <Paragraph>
              <Text strong>Khuyến nghị: </Text>
              <Tag 
                color={getSentimentColor(analysis.tradingRecommendation.action || 'NEUTRAL')}
                icon={getSentimentIcon(analysis.tradingRecommendation.action || 'NEUTRAL')}
              >
                {getSentimentText(analysis.tradingRecommendation.action || 'NEUTRAL')}
              </Tag>
            </Paragraph>
            <Paragraph>
              {analysis.tradingRecommendation.reason || 'Không có lý do chi tiết.'}
            </Paragraph>
            {analysis.tradingRecommendation.entryPrice && (
              <Paragraph>
                <Text strong>Giá vào lý tưởng: </Text>
                <Text>{analysis.tradingRecommendation.entryPrice}</Text>
              </Paragraph>
            )}
            {analysis.tradingRecommendation.stopLoss && (
              <Paragraph>
                <Text strong>Stop Loss: </Text>
                <Text type="danger">{analysis.tradingRecommendation.stopLoss}</Text>
              </Paragraph>
            )}
            {analysis.tradingRecommendation.takeProfit && (
              <Paragraph>
                <Text strong>Take Profit: </Text>
                <Text type="success">{analysis.tradingRecommendation.takeProfit}</Text>
              </Paragraph>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default TrendAnalysis; 