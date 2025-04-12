import React from 'react';
import { Row, Col, Card, Statistic, Typography, Descriptions, Tag, Spin, Empty, Divider } from 'antd';
import { RiseOutlined, FallOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface MarketOverviewProps {
  symbol: string;
  analysis: any;
  loading: boolean;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ symbol, analysis, loading }) => {
  if (loading) {
    return <Spin tip="Đang tải dữ liệu phân tích..." />;
  }
  
  if (!analysis) {
    return <Empty description="Chưa có dữ liệu phân tích. Vui lòng chọn một symbol để phân tích." />;
  }
  
  // Xử lý dữ liệu phân tích cho hiển thị tóm tắt
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
    return null;
  };
  
  // Tóm tắt từ các chỉ báo kỹ thuật (ví dụ)
  const getIndicatorSummary = () => {
    // Đây là logic giả định, cần điều chỉnh dựa trên dữ liệu thực tế từ API
    const techIndicators = analysis.technicalIndicators || [];
    
    if (!techIndicators.length) return null;
    
    const bullishCount = techIndicators.filter((i: any) => i.signal === 'BUY').length;
    const bearishCount = techIndicators.filter((i: any) => i.signal === 'SELL').length;
    const neutralCount = techIndicators.filter((i: any) => i.signal === 'NEUTRAL').length;
    
    const total = techIndicators.length;
    const bullishPercent = Math.round((bullishCount / total) * 100);
    const bearishPercent = Math.round((bearishCount / total) * 100);
    
    let overallSentiment = 'NEUTRAL';
    if (bullishCount > bearishCount && bullishPercent > 60) {
      overallSentiment = 'BULLISH';
    } else if (bearishCount > bullishCount && bearishPercent > 60) {
      overallSentiment = 'BEARISH';
    }
    
    return {
      bullishCount,
      bearishCount,
      neutralCount,
      total,
      sentiment: overallSentiment,
    };
  };
  
  const indicatorSummary = getIndicatorSummary();
  
  return (
    <div className="market-overview">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Tổng quan phân tích cho {symbol}</Title>
          <Text type="secondary">Phân tích dựa trên dữ liệu thị trường hiện tại</Text>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Xu hướng tổng thể"
              value={getSentimentText(analysis.trendAnalysis?.overallSentiment || 'NEUTRAL')}
              valueStyle={{ 
                color: getSentimentColor(analysis.trendAnalysis?.overallSentiment || 'NEUTRAL') === 'green' ? '#3f8600' : 
                       getSentimentColor(analysis.trendAnalysis?.overallSentiment || 'NEUTRAL') === 'red' ? '#cf1322' : 
                       'inherit'
              }}
              prefix={getSentimentIcon(analysis.trendAnalysis?.overallSentiment || 'NEUTRAL')}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Độ tin cậy"
              value={analysis.trendAnalysis?.confidence || 0}
              suffix="%"
              precision={0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Dự đoán giá (24h)"
              value={analysis.predictions?.priceIn24h || 0}
              precision={2}
              valueStyle={{ 
                color: (analysis.predictions?.priceIn24h || 0) > 0 ? '#3f8600' : '#cf1322' 
              }}
              prefix={(analysis.predictions?.priceIn24h || 0) > 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Tóm tắt chỉ báo kỹ thuật</Divider>
      
      {indicatorSummary ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card bordered={false} style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <Statistic
                title="Tín hiệu tăng"
                value={indicatorSummary.bullishCount}
                suffix={`/${indicatorSummary.total}`}
                valueStyle={{ color: '#3f8600' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} style={{ background: '#fff7e6', borderColor: '#ffe7ba' }}>
              <Statistic
                title="Trung lập"
                value={indicatorSummary.neutralCount}
                suffix={`/${indicatorSummary.total}`}
                valueStyle={{ color: '#d48806' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} style={{ background: '#fff1f0', borderColor: '#ffccc7' }}>
              <Statistic
                title="Tín hiệu giảm"
                value={indicatorSummary.bearishCount}
                suffix={`/${indicatorSummary.total}`}
                valueStyle={{ color: '#cf1322' }}
                prefix={<FallOutlined />}
              />
            </Card>
          </Col>
        </Row>
      ) : (
        <Empty description="Không có dữ liệu chỉ báo kỹ thuật" />
      )}
      
      <Divider orientation="left">Mức hỗ trợ và kháng cự</Divider>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Descriptions bordered size="small">
              <Descriptions.Item label="Mức kháng cự mạnh" span={3}>
                {analysis.trendAnalysis?.resistanceLevels?.[0] || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Mức kháng cự" span={3}>
                {analysis.trendAnalysis?.resistanceLevels?.[1] || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Giá hiện tại" span={3}>
                <Text strong>{analysis.trendAnalysis?.currentPrice || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mức hỗ trợ" span={3}>
                {analysis.trendAnalysis?.supportLevels?.[0] || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Mức hỗ trợ mạnh" span={3}>
                {analysis.trendAnalysis?.supportLevels?.[1] || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Dự đoán giá</Divider>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Descriptions bordered size="small">
              <Descriptions.Item label="24 giờ" span={2}>
                <Text type={analysis.predictions?.priceIn24h > 0 ? 'success' : 'danger'}>
                  {analysis.predictions?.priceIn24h > 0 ? '+' : ''}{analysis.predictions?.priceIn24h || 0}%
                </Text>
                <Text> ({analysis.predictions?.confidenceIn24h || 0}% độ tin cậy)</Text>
              </Descriptions.Item>
              <Descriptions.Item label="7 ngày" span={2}>
                <Text type={analysis.predictions?.priceIn7d > 0 ? 'success' : 'danger'}>
                  {analysis.predictions?.priceIn7d > 0 ? '+' : ''}{analysis.predictions?.priceIn7d || 0}%
                </Text>
                <Text> ({analysis.predictions?.confidenceIn7d || 0}% độ tin cậy)</Text>
              </Descriptions.Item>
              <Descriptions.Item label="30 ngày" span={2}>
                <Text type={analysis.predictions?.priceIn30d > 0 ? 'success' : 'danger'}>
                  {analysis.predictions?.priceIn30d > 0 ? '+' : ''}{analysis.predictions?.priceIn30d || 0}%
                </Text>
                <Text> ({analysis.predictions?.confidenceIn30d || 0}% độ tin cậy)</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Thông báo quan trọng</Divider>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {analysis.patterns?.length > 0 ? (
            <Card>
              {analysis.patterns.map((pattern: any, index: number) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <Tag 
                    color={pattern.sentiment === 'BULLISH' ? 'green' : 
                           pattern.sentiment === 'BEARISH' ? 'red' : 'default'}
                    icon={pattern.sentiment === 'BULLISH' ? <RiseOutlined /> : 
                          pattern.sentiment === 'BEARISH' ? <FallOutlined /> : 
                          <ExclamationCircleOutlined />}
                  >
                    {pattern.name}
                  </Tag>
                  <Text> {pattern.description}</Text>
                </div>
              ))}
            </Card>
          ) : (
            <Empty description="Không phát hiện mẫu hình đáng chú ý" />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MarketOverview; 