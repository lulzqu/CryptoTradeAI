import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, Col, Card, Typography, Statistic, Tabs, Button, 
  Divider, Tag, Table, List, Space, Progress, Alert
} from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, 
  RocketOutlined, SettingOutlined, ThunderboltOutlined,
  StarOutlined, StarFilled, BookOutlined
} from '@ant-design/icons';
import { RootState, AppDispatch } from '../../store';
import { fetchCoinData, fetchCoinAnalysis } from '../../store/slices/analysisSlice';
import { createTradingViewWidget } from '../../utils/tradingView';
import { SignalType, Sentiment } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const CoinAnalysis: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [chartContainer, setChartContainer] = useState<HTMLElement | null>(null);
  
  const { 
    currentCoin, 
    technicalAnalysis, 
    aiPredictions, 
    tradeSetup, 
    webData,
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.analysis);

  useEffect(() => {
    if (symbol) {
      dispatch(fetchCoinData(symbol));
      dispatch(fetchCoinAnalysis(symbol));
    }
  }, [dispatch, symbol]);

  useEffect(() => {
    if (chartContainer && symbol) {
      const cleanup = createTradingViewWidget(chartContainer, symbol);
      return () => cleanup();
    }
  }, [chartContainer, symbol]);

  if (!symbol) {
    return <Alert message="Không tìm thấy mã coin" type="error" />;
  }

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (!currentCoin) {
    return <Alert message="Không tìm thấy dữ liệu" type="warning" />;
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Dispatch action to add/remove from favorites
  };

  const getSignalColor = (signal: SignalType) => {
    switch (signal) {
      case SignalType.STRONG_BUY:
      case SignalType.BUY:
        return 'green';
      case SignalType.SELL:
      case SignalType.STRONG_SELL:
        return 'red';
      default:
        return 'orange';
    }
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.BULLISH:
        return 'green';
      case Sentiment.BEARISH:
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <div className="coin-analysis-container">
      <div className="coin-header">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Button 
              icon={<ArrowUpOutlined />} 
              onClick={() => navigate(-1)} 
              style={{ marginRight: 16 }}
            >
              Quay lại
            </Button>
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {symbol.toUpperCase()}
              <Button 
                type="text" 
                icon={isFavorite ? <StarFilled /> : <StarOutlined />} 
                onClick={toggleFavorite}
                style={{ marginLeft: 8 }}
              />
            </Title>
          </Col>
          <Col flex="auto" />
          <Col>
            <Statistic 
              value={currentCoin.price} 
              precision={2} 
              prefix="$" 
              valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
            />
          </Col>
          <Col>
            <Statistic 
              value={currentCoin.priceChangePercent} 
              precision={2} 
              prefix={currentCoin.priceChangePercent >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%" 
              valueStyle={{ 
                fontSize: 18, 
                color: currentCoin.priceChangePercent >= 0 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 8, marginBottom: 16 }}>
          <Col>
            <Text>Khối lượng: ${(currentCoin.volume / 1000000).toFixed(2)}M</Text>
          </Col>
          <Col>
            <Text>Funding Rate: {currentCoin.fundingRate}%</Text>
          </Col>
          <Col>
            <Text>Open Interest: ${(currentCoin.openInterest / 1000000).toFixed(2)}M</Text>
          </Col>
        </Row>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Biểu đồ" bordered={false}>
            <div 
              ref={(ref) => setChartContainer(ref)} 
              style={{ height: '500px', width: '100%' }}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Tabs defaultActiveKey="1" style={{ height: '100%' }}>
            <TabPane 
              tab={<span><LineChartOutlined />Phân tích kỹ thuật</span>} 
              key="1"
            >
              <Card bordered={false} style={{ height: '500px', overflow: 'auto' }}>
                <List
                  itemLayout="horizontal"
                  dataSource={technicalAnalysis?.indicators || []}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={item.description}
                      />
                      <Tag color={getSentimentColor(item.sentiment)}>
                        {item.value}
                      </Tag>
                    </List.Item>
                  )}
                />
                
                <Divider />
                
                <Title level={5}>Đánh giá tổng thể</Title>
                <Progress 
                  percent={technicalAnalysis?.score || 50} 
                  status={
                    (technicalAnalysis?.score || 0) > 70 ? 'success' : 
                    (technicalAnalysis?.score || 0) < 30 ? 'exception' : 'normal'
                  }
                />
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <Tag color={getSignalColor(technicalAnalysis?.signal || SignalType.NEUTRAL)}>
                    {technicalAnalysis?.signal || SignalType.NEUTRAL}
                  </Tag>
                </div>
              </Card>
            </TabPane>
            
            <TabPane 
              tab={<span><RocketOutlined />Phân tích AI</span>} 
              key="2"
            >
              <Card bordered={false} style={{ height: '500px', overflow: 'auto' }}>
                {aiPredictions ? (
                  <>
                    <Paragraph>
                      <Text strong>Sentiment: </Text>
                      <Tag color={getSentimentColor(aiPredictions.sentiment)}>
                        {aiPredictions.sentiment} ({aiPredictions.sentimentScore}%)
                      </Tag>
                    </Paragraph>
                    
                    <Paragraph>
                      <Text strong>Nhận định tổng quan: </Text>
                      {aiPredictions.overview}
                    </Paragraph>
                    
                    <Paragraph>
                      <Text strong>Dự báo xu hướng: </Text>
                      {aiPredictions.prediction}
                    </Paragraph>
                    
                    <Divider />
                    
                    <Title level={5}>Nhận diện mẫu hình</Title>
                    <List
                      itemLayout="horizontal"
                      dataSource={aiPredictions.patterns || []}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.name}
                            description={item.description}
                          />
                          <Tag color={item.confidence > 80 ? 'green' : 'blue'}>
                            {item.confidence}%
                          </Tag>
                        </List.Item>
                      )}
                    />
                  </>
                ) : (
                  <div>Không có dữ liệu phân tích AI</div>
                )}
              </Card>
            </TabPane>
            
            <TabPane 
              tab={<span><ThunderboltOutlined />Thiết lập giao dịch</span>} 
              key="3"
            >
              <Card bordered={false} style={{ height: '500px', overflow: 'auto' }}>
                {tradeSetup ? (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <Tag 
                        color={getSignalColor(tradeSetup.signal)} 
                        style={{ fontSize: 16, padding: '4px 8px' }}
                      >
                        {tradeSetup.signal}
                      </Tag>
                    </div>
                    
                    <List
                      size="small"
                      bordered
                      dataSource={[
                        { label: 'Vùng giá vào', value: `$${tradeSetup.entryZone.join(' - $')}` },
                        { label: 'Stop Loss', value: `$${tradeSetup.stopLoss} (${tradeSetup.stopLossPercent}%)` },
                        { label: 'Take Profit 1', value: `$${tradeSetup.takeProfits[0].price} (${tradeSetup.takeProfits[0].percent}%)` },
                        { label: 'Take Profit 2', value: `$${tradeSetup.takeProfits[1].price} (${tradeSetup.takeProfits[1].percent}%)` },
                        { label: 'Take Profit 3', value: `$${tradeSetup.takeProfits[2].price} (${tradeSetup.takeProfits[2].percent}%)` },
                        { label: 'Risk/Reward Ratio', value: tradeSetup.riskRewardRatio },
                        { label: 'Win Probability', value: `${tradeSetup.winProbability}%` },
                        { label: 'Position Size', value: `${tradeSetup.positionSizePercent}% of portfolio` }
                      ]}
                      renderItem={item => (
                        <List.Item>
                          <Text strong>{item.label}:</Text>
                          <Text>{item.value}</Text>
                        </List.Item>
                      )}
                    />
                    
                    <Divider />
                    
                    <Space style={{ width: '100%', justifyContent: 'center' }}>
                      <Button type="primary" icon={<ThunderboltOutlined />}>
                        Thực hiện giao dịch
                      </Button>
                      <Button icon={<SettingOutlined />}>
                        Tùy chỉnh
                      </Button>
                    </Space>
                  </>
                ) : (
                  <div>Không có thiết lập giao dịch</div>
                )}
              </Card>
            </TabPane>
            
            <TabPane 
              tab={<span><BookOutlined />Dữ liệu Web</span>} 
              key="4"
            >
              <Card bordered={false} style={{ height: '500px', overflow: 'auto' }}>
                {webData ? (
                  <>
                    <Title level={5}>Phân tích từ icrypto.ai</Title>
                    <Paragraph>{webData.icryptoAnalysis}</Paragraph>
                    
                    <Divider />
                    
                    <Title level={5}>Sentiment từ mạng xã hội</Title>
                    <List
                      size="small"
                      bordered
                      dataSource={webData.socialSentiment || []}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.source}
                            description={item.content}
                          />
                          <Tag color={getSentimentColor(item.sentiment)}>
                            {item.sentiment}
                          </Tag>
                        </List.Item>
                      )}
                    />
                    
                    <Divider />
                    
                    <Title level={5}>Sự kiện sắp tới</Title>
                    <List
                      size="small"
                      dataSource={webData.upcomingEvents || []}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.title}
                            description={`${item.date} - ${item.description}`}
                          />
                        </List.Item>
                      )}
                    />
                  </>
                ) : (
                  <div>Không có dữ liệu từ web</div>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default CoinAnalysis; 