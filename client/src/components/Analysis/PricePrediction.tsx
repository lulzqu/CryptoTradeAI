import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Tag, Divider, Spin, Empty, Radio, Space, Tooltip, Progress } from 'antd';
import { RiseOutlined, FallOutlined, InfoCircleOutlined, LineChartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { RadioChangeEvent } from 'antd/lib/radio';

const { Text, Title, Paragraph } = Typography;

interface PricePredictionProps {
  symbol: string;
  predictions: any;
  loading: boolean;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ symbol, predictions, loading }) => {
  const [timeframe, setTimeframe] = useState<string>('24h');
  
  if (loading) {
    return <Spin tip="Đang tải dự đoán giá..." />;
  }
  
  if (!predictions) {
    return <Empty description="Không có dữ liệu dự đoán giá cho symbol này." />;
  }
  
  // Xử lý thay đổi khoảng thời gian
  const handleTimeframeChange = (e: RadioChangeEvent) => {
    setTimeframe(e.target.value);
  };
  
  // Lấy dự đoán theo khung thời gian
  const getPrediction = () => {
    switch (timeframe) {
      case '1h':
        return {
          price: predictions.priceIn1h || 0,
          percentage: predictions.percentageIn1h || 0,
          confidence: predictions.confidenceIn1h || 0,
        };
      case '24h':
        return {
          price: predictions.priceIn24h || 0,
          percentage: predictions.percentageIn24h || 0,
          confidence: predictions.confidenceIn24h || 0,
        };
      case '7d':
        return {
          price: predictions.priceIn7d || 0,
          percentage: predictions.percentageIn7d || 0,
          confidence: predictions.confidenceIn7d || 0,
        };
      case '30d':
        return {
          price: predictions.priceIn30d || 0,
          percentage: predictions.percentageIn30d || 0,
          confidence: predictions.confidenceIn30d || 0,
        };
      default:
        return {
          price: 0,
          percentage: 0,
          confidence: 0,
        };
    }
  };
  
  const currentPrediction = getPrediction();
  const isPositive = currentPrediction.percentage >= 0;
  
  // Xác định màu sắc dựa vào giá trị dự đoán
  const getValueColor = (value: number) => {
    if (value > 0) return '#3f8600';
    if (value < 0) return '#cf1322';
    return 'inherit';
  };
  
  // Xác định màu sắc độ tin cậy
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return '#3f8600';
    if (confidence >= 50) return '#faad14';
    return '#cf1322';
  };
  
  // Loại biểu đồ
  const getModelType = () => {
    return predictions.modelType || 'AI';
  };
  
  // Mô tả mức độ tin cậy
  const getConfidenceDescription = (confidence: number) => {
    if (confidence >= 80) return 'Rất cao';
    if (confidence >= 60) return 'Cao';
    if (confidence >= 40) return 'Trung bình';
    if (confidence >= 20) return 'Thấp';
    return 'Rất thấp';
  };
  
  return (
    <div className="price-prediction">
      <Title level={4}>Dự đoán giá cho {symbol}</Title>
      
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Radio.Group value={timeframe} onChange={handleTimeframeChange}>
            <Radio.Button value="1h">1 giờ</Radio.Button>
            <Radio.Button value="24h">24 giờ</Radio.Button>
            <Radio.Button value="7d">7 ngày</Radio.Button>
            <Radio.Button value="30d">30 ngày</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title={`Dự đoán giá sau ${timeframe}`}
              value={currentPrediction.price}
              precision={predictions.decimalPlaces || 2}
              valueStyle={{ color: getValueColor(currentPrediction.percentage) }}
              prefix={isPositive ? <RiseOutlined /> : <FallOutlined />}
              suffix={predictions.currency || 'USD'}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Thay đổi dự kiến"
              value={currentPrediction.percentage}
              precision={2}
              valueStyle={{ color: getValueColor(currentPrediction.percentage) }}
              prefix={isPositive ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Độ tin cậy"
              value={currentPrediction.confidence}
              precision={0}
              valueStyle={{ color: getConfidenceColor(currentPrediction.confidence) }}
              suffix="%"
            />
            <Text type="secondary">{getConfidenceDescription(currentPrediction.confidence)}</Text>
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Chi tiết dự đoán</Divider>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <LineChartOutlined /> 
                Chi tiết dự báo
              </Space>
            }
          >
            <Paragraph>
              <Text strong>Mô hình dự đoán: </Text>
              <Tag color="blue">{getModelType()}</Tag>
            </Paragraph>
            
            <Paragraph>
              <Text strong>Giá hiện tại: </Text>
              <Text>{predictions.currentPrice || 'N/A'} {predictions.currency || 'USD'}</Text>
            </Paragraph>
            
            <Paragraph>
              <Text strong>Giá dự đoán: </Text>
              <Text style={{ color: getValueColor(currentPrediction.percentage) }}>
                {currentPrediction.price} {predictions.currency || 'USD'}
              </Text>
            </Paragraph>
            
            <Paragraph>
              <Text strong>Thay đổi: </Text>
              <Text style={{ color: getValueColor(currentPrediction.percentage) }}>
                {isPositive ? '+' : ''}{currentPrediction.percentage}%
              </Text>
            </Paragraph>
            
            <Paragraph>
              <Text strong>Thời gian dự đoán: </Text>
              <Text>{timeframe}</Text>
            </Paragraph>
            
            <Paragraph>
              <Text strong>Cập nhật gần nhất: </Text>
              <Text>{predictions.updatedAt ? new Date(predictions.updatedAt).toLocaleString() : 'N/A'}</Text>
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <InfoCircleOutlined /> 
                Độ tin cậy của dự đoán
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Độ tin cậy tổng thể: </Text>
              <Progress 
                percent={currentPrediction.confidence} 
                status={
                  currentPrediction.confidence >= 70 ? 'success' : 
                  currentPrediction.confidence >= 40 ? 'normal' : 
                  'exception'
                }
              />
              <Text type="secondary">
                {getConfidenceDescription(currentPrediction.confidence)} ({currentPrediction.confidence}%)
              </Text>
            </div>
            
            {predictions.factorsConfidence && (
              <>
                <Divider plain>Các yếu tố ảnh hưởng</Divider>
                
                <div style={{ marginBottom: 8 }}>
                  <Text>Phân tích kỹ thuật: </Text>
                  <Progress 
                    percent={predictions.factorsConfidence.technical || 0} 
                    size="small"
                    status={
                      (predictions.factorsConfidence.technical || 0) >= 70 ? 'success' : 
                      (predictions.factorsConfidence.technical || 0) >= 40 ? 'normal' : 
                      'exception'
                    }
                  />
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text>Phân tích cơ bản: </Text>
                  <Progress 
                    percent={predictions.factorsConfidence.fundamental || 0} 
                    size="small"
                    status={
                      (predictions.factorsConfidence.fundamental || 0) >= 70 ? 'success' : 
                      (predictions.factorsConfidence.fundamental || 0) >= 40 ? 'normal' : 
                      'exception'
                    }
                  />
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text>Phân tích tâm lý thị trường: </Text>
                  <Progress 
                    percent={predictions.factorsConfidence.sentiment || 0} 
                    size="small"
                    status={
                      (predictions.factorsConfidence.sentiment || 0) >= 70 ? 'success' : 
                      (predictions.factorsConfidence.sentiment || 0) >= 40 ? 'normal' : 
                      'exception'
                    }
                  />
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text>Dữ liệu lịch sử: </Text>
                  <Progress 
                    percent={predictions.factorsConfidence.historical || 0} 
                    size="small"
                    status={
                      (predictions.factorsConfidence.historical || 0) >= 70 ? 'success' : 
                      (predictions.factorsConfidence.historical || 0) >= 40 ? 'normal' : 
                      'exception'
                    }
                  />
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Lưu ý về dự đoán</Divider>
      
      <Card>
        <Paragraph>
          <InfoCircleOutlined style={{ color: '#1890ff' }} /> Các dự đoán giá chỉ mang tính chất tham khảo. Thị trường tiền điện tử rất biến động và khó đoán định. Vui lòng thực hiện nghiên cứu của riêng bạn trước khi đưa ra quyết định đầu tư.
        </Paragraph>
        
        <Paragraph>
          <ClockCircleOutlined style={{ color: '#1890ff' }} /> Dự đoán được cập nhật mỗi giờ dựa trên các dữ liệu và mô hình AI mới nhất.
        </Paragraph>
        
        {predictions.disclaimer && (
          <Paragraph type="warning">
            {predictions.disclaimer}
          </Paragraph>
        )}
      </Card>
    </div>
  );
};

export default PricePrediction; 