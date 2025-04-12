import React, { useState } from 'react';
import { Card, Typography, Tabs, Select, Checkbox, Button, Space, InputNumber, Form, Divider } from 'antd';
import { LineChartOutlined, SettingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface ChartIndicatorProps {
  onApply?: (indicators: any[]) => void;
}

const ChartIndicator: React.FC<ChartIndicatorProps> = ({ onApply }) => {
  const [activeTab, setActiveTab] = useState('trend');
  const [indicators, setIndicators] = useState<any[]>([
    { id: 1, type: 'ma', params: { period: 20, source: 'close' }, visible: true },
    { id: 2, type: 'ma', params: { period: 50, source: 'close' }, visible: true },
    { id: 3, type: 'ma', params: { period: 200, source: 'close' }, visible: true },
  ]);

  const handleAddIndicator = (type: string, defaultParams: any) => {
    const newIndicator = {
      id: Math.max(0, ...indicators.map(i => i.id)) + 1,
      type,
      params: defaultParams,
      visible: true,
    };
    
    setIndicators([...indicators, newIndicator]);
  };

  const handleRemoveIndicator = (id: number) => {
    setIndicators(indicators.filter(i => i.id !== id));
  };

  const handleToggleIndicator = (id: number) => {
    setIndicators(indicators.map(i => {
      if (i.id === id) {
        return { ...i, visible: !i.visible };
      }
      return i;
    }));
  };

  const handleUpdateIndicator = (id: number, params: any) => {
    setIndicators(indicators.map(i => {
      if (i.id === id) {
        return { ...i, params: { ...i.params, ...params } };
      }
      return i;
    }));
  };

  const handleApply = () => {
    if (onApply) {
      onApply(indicators);
    }
  };

  const renderIndicatorParams = (indicator: any) => {
    switch (indicator.type) {
      case 'ma':
        return (
          <Form layout="inline" initialValues={indicator.params}>
            <Form.Item label="Loại" name="type">
              <Select style={{ width: 120 }} defaultValue={indicator.params.type || 'sma'}>
                <Option value="sma">SMA</Option>
                <Option value="ema">EMA</Option>
                <Option value="wma">WMA</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Chu kỳ" name="period">
              <InputNumber
                min={1}
                max={200}
                defaultValue={indicator.params.period}
                onChange={(value) => handleUpdateIndicator(indicator.id, { period: value })}
              />
            </Form.Item>
            <Form.Item label="Nguồn" name="source">
              <Select 
                style={{ width: 90 }} 
                defaultValue={indicator.params.source}
                onChange={(value) => handleUpdateIndicator(indicator.id, { source: value })}
              >
                <Option value="close">Đóng</Option>
                <Option value="open">Mở</Option>
                <Option value="high">Cao</Option>
                <Option value="low">Thấp</Option>
                <Option value="hl2">(H+L)/2</Option>
                <Option value="hlc3">(H+L+C)/3</Option>
              </Select>
            </Form.Item>
          </Form>
        );
        
      case 'rsi':
        return (
          <Form layout="inline" initialValues={indicator.params}>
            <Form.Item label="Chu kỳ" name="period">
              <InputNumber
                min={1}
                max={100}
                defaultValue={indicator.params.period}
                onChange={(value) => handleUpdateIndicator(indicator.id, { period: value })}
              />
            </Form.Item>
            <Form.Item label="Overbought" name="overbought">
              <InputNumber
                min={50}
                max={100}
                defaultValue={indicator.params.overbought}
                onChange={(value) => handleUpdateIndicator(indicator.id, { overbought: value })}
              />
            </Form.Item>
            <Form.Item label="Oversold" name="oversold">
              <InputNumber
                min={0}
                max={50}
                defaultValue={indicator.params.oversold}
                onChange={(value) => handleUpdateIndicator(indicator.id, { oversold: value })}
              />
            </Form.Item>
          </Form>
        );
        
      case 'macd':
        return (
          <Form layout="inline" initialValues={indicator.params}>
            <Form.Item label="Fast" name="fastPeriod">
              <InputNumber
                min={1}
                max={100}
                defaultValue={indicator.params.fastPeriod}
                onChange={(value) => handleUpdateIndicator(indicator.id, { fastPeriod: value })}
              />
            </Form.Item>
            <Form.Item label="Slow" name="slowPeriod">
              <InputNumber
                min={1}
                max={100}
                defaultValue={indicator.params.slowPeriod}
                onChange={(value) => handleUpdateIndicator(indicator.id, { slowPeriod: value })}
              />
            </Form.Item>
            <Form.Item label="Signal" name="signalPeriod">
              <InputNumber
                min={1}
                max={100}
                defaultValue={indicator.params.signalPeriod}
                onChange={(value) => handleUpdateIndicator(indicator.id, { signalPeriod: value })}
              />
            </Form.Item>
          </Form>
        );
        
      case 'bollinger':
        return (
          <Form layout="inline" initialValues={indicator.params}>
            <Form.Item label="Chu kỳ" name="period">
              <InputNumber
                min={1}
                max={100}
                defaultValue={indicator.params.period}
                onChange={(value) => handleUpdateIndicator(indicator.id, { period: value })}
              />
            </Form.Item>
            <Form.Item label="Độ lệch" name="stdDev">
              <InputNumber
                min={0.1}
                max={5}
                step={0.1}
                defaultValue={indicator.params.stdDev}
                onChange={(value) => handleUpdateIndicator(indicator.id, { stdDev: value })}
              />
            </Form.Item>
          </Form>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="chart-indicator">
      <div className="chart-indicator-header">
        <Title level={4}>Chỉ báo kỹ thuật</Title>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Xu hướng" key="trend">
          <div className="chart-indicator-buttons">
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('ma', { period: 20, source: 'close', type: 'sma' })}
            >
              MA
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('bollinger', { period: 20, stdDev: 2 })}
            >
              Bollinger
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('ichimoku', {})}
            >
              Ichimoku
            </Button>
          </div>
        </TabPane>
        
        <TabPane tab="Dao động" key="oscillator">
          <div className="chart-indicator-buttons">
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('rsi', { period: 14, overbought: 70, oversold: 30 })}
            >
              RSI
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('macd', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 })}
            >
              MACD
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('stochastic', { kPeriod: 14, dPeriod: 3, smooth: 3 })}
            >
              Stochastic
            </Button>
          </div>
        </TabPane>
        
        <TabPane tab="Khối lượng" key="volume">
          <div className="chart-indicator-buttons">
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('volume', {})}
            >
              Volume
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAddIndicator('obv', {})}
            >
              OBV
            </Button>
          </div>
        </TabPane>
      </Tabs>

      <Divider />

      <div className="chart-indicator-list">
        <Title level={5}>Chỉ báo đang áp dụng</Title>
        
        {indicators.length === 0 ? (
          <Text type="secondary">Chưa có chỉ báo nào được thêm. Vui lòng thêm chỉ báo từ các tab phía trên.</Text>
        ) : (
          indicators.map(indicator => (
            <div key={indicator.id} className="chart-indicator-item">
              <div className="chart-indicator-item-header">
                <Checkbox 
                  checked={indicator.visible} 
                  onChange={() => handleToggleIndicator(indicator.id)}
                >
                  <Text strong>
                    {indicator.type === 'ma' ? 'Moving Average' : 
                     indicator.type === 'rsi' ? 'RSI' :
                     indicator.type === 'macd' ? 'MACD' :
                     indicator.type === 'bollinger' ? 'Bollinger Bands' :
                     indicator.type === 'ichimoku' ? 'Ichimoku Cloud' :
                     indicator.type === 'stochastic' ? 'Stochastic' :
                     indicator.type === 'volume' ? 'Volume' :
                     indicator.type === 'obv' ? 'On Balance Volume' :
                     indicator.type}
                  </Text>
                </Checkbox>
                
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  danger 
                  onClick={() => handleRemoveIndicator(indicator.id)}
                />
              </div>
              
              <div className="chart-indicator-item-params">
                {renderIndicatorParams(indicator)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chart-indicator-footer">
        <Button type="primary" icon={<LineChartOutlined />} onClick={handleApply}>
          Áp dụng
        </Button>
      </div>
    </Card>
  );
};

export default ChartIndicator; 