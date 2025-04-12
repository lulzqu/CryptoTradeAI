import React, { useEffect, useState } from 'react';
import { Card, List, Tag, Tooltip, Button, Modal, Spin } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  InfoCircleOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatDate, formatNumber } from '../../utils/formatters';
import './AISignals.css';

interface AISignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  price: number;
  target: number;
  stopLoss: number;
  timeframe: string;
  indicators: string[];
  timestamp: string;
  description: string;
}

const AISignals: React.FC = () => {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<AISignal | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, error: wsError } = useWebSocket('ws://184.73.5.19:8080/signals');

  useEffect(() => {
    if (wsError) {
      setError('Không thể kết nối đến dữ liệu tín hiệu');
      setLoading(false);
    }
  }, [wsError]);

  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setSignals(parsedData);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi xử lý dữ liệu');
        setLoading(false);
      }
    }
  }, [data]);

  const handleSignalClick = (signal: AISignal) => {
    setSelectedSignal(signal);
    setIsModalVisible(true);
  };

  const handleSubscribe = (signal: AISignal) => {
    // TODO: Implement subscription logic
    console.log('Subscribing to signal:', signal);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Card className="ai-signals-card">
        <div className="loading-container">
          <Spin size="large" />
          <p>Đang tải tín hiệu AI...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="ai-signals-card">
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        title="Tín hiệu AI" 
        className="ai-signals-card"
        extra={
          <Tooltip title="Tín hiệu được cập nhật tự động">
            <span className="refresh-indicator">🔄</span>
          </Tooltip>
        }
      >
        <List
          dataSource={signals}
          renderItem={(signal) => (
            <List.Item
              className="signal-item"
              actions={[
                <Button 
                  type="text" 
                  icon={<InfoCircleOutlined />}
                  onClick={() => handleSignalClick(signal)}
                >
                  Chi tiết
                </Button>,
                <Button
                  type="primary"
                  icon={<BellOutlined />}
                  onClick={() => handleSubscribe(signal)}
                >
                  Theo dõi
                </Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="signal-title">
                    <span>{signal.symbol}</span>
                    <Tag color={signal.type === 'BUY' ? 'success' : 'error'}>
                      {signal.type === 'BUY' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {signal.type}
                    </Tag>
                  </div>
                }
                description={
                  <div className="signal-description">
                    <div>Độ tin cậy: <Tag color={getConfidenceColor(signal.confidence)}>{signal.confidence}%</Tag></div>
                    <div>Giá hiện tại: {formatNumber(signal.price)}</div>
                    <div>Mục tiêu: {formatNumber(signal.target)}</div>
                    <div>Dừng lỗ: {formatNumber(signal.stopLoss)}</div>
                    <div>Thời gian: {signal.timeframe}</div>
                    <div>Chỉ báo: {signal.indicators.join(', ')}</div>
                    <div>Cập nhật: {formatDate(signal.timestamp)}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Chi tiết tín hiệu"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedSignal && (
          <div className="signal-detail">
            <h3>{selectedSignal.symbol}</h3>
            <div className="signal-info">
              <p><strong>Loại:</strong> {selectedSignal.type}</p>
              <p><strong>Độ tin cậy:</strong> {selectedSignal.confidence}%</p>
              <p><strong>Giá hiện tại:</strong> {formatNumber(selectedSignal.price)}</p>
              <p><strong>Mục tiêu:</strong> {formatNumber(selectedSignal.target)}</p>
              <p><strong>Dừng lỗ:</strong> {formatNumber(selectedSignal.stopLoss)}</p>
              <p><strong>Thời gian:</strong> {selectedSignal.timeframe}</p>
              <p><strong>Chỉ báo:</strong> {selectedSignal.indicators.join(', ')}</p>
              <p><strong>Cập nhật:</strong> {formatDate(selectedSignal.timestamp)}</p>
            </div>
            <div className="signal-description-full">
              <h4>Phân tích</h4>
              <p>{selectedSignal.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AISignals; 