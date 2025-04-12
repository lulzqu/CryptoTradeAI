import React, { useState } from 'react';
import { Card, Typography, Form, Input, Select, Button, InputNumber, Space, Divider, Checkbox } from 'antd';
import { SendOutlined, SaveOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface SignalGeneratorProps {
  onSubmit?: (values: any) => void;
}

const SignalGenerator: React.FC<SignalGeneratorProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    console.log('Form values:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (onSubmit) {
        onSubmit(values);
      }
    }, 1000);
  };

  return (
    <Card className="signal-generator">
      <div className="signal-generator-header">
        <Title level={4}>Tạo tín hiệu giao dịch</Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'buy',
          symbol: 'BTC/USDT',
          strategy: 'manual',
          timeframe: '1h',
          profitTarget: 5,
          stopLoss: 2,
        }}
      >
        <Form.Item
          name="symbol"
          label="Cặp giao dịch"
          rules={[{ required: true, message: 'Vui lòng chọn cặp giao dịch' }]}
        >
          <Select placeholder="Chọn cặp giao dịch">
            <Option value="BTC/USDT">BTC/USDT</Option>
            <Option value="ETH/USDT">ETH/USDT</Option>
            <Option value="BNB/USDT">BNB/USDT</Option>
            <Option value="SOL/USDT">SOL/USDT</Option>
            <Option value="XRP/USDT">XRP/USDT</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại tín hiệu"
          rules={[{ required: true, message: 'Vui lòng chọn loại tín hiệu' }]}
        >
          <Select placeholder="Chọn loại tín hiệu">
            <Option value="buy">Mua</Option>
            <Option value="sell">Bán</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="strategy"
          label="Chiến lược"
          rules={[{ required: true, message: 'Vui lòng chọn chiến lược' }]}
        >
          <Select placeholder="Chọn chiến lược">
            <Option value="manual">Thủ công</Option>
            <Option value="macd">MACD</Option>
            <Option value="rsi">RSI</Option>
            <Option value="ma_cross">MA Cross</Option>
            <Option value="bollinger">Bollinger Bands</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá vào lệnh"
          rules={[{ required: true, message: 'Vui lòng nhập giá vào lệnh' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="Nhập giá vào lệnh"
            formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={(value) => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="profitTarget"
              label="Mục tiêu lợi nhuận (%)"
              rules={[{ required: true, message: 'Vui lòng nhập mục tiêu lợi nhuận' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="Ví dụ: 5%"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stopLoss"
              label="Dừng lỗ (%)"
              rules={[{ required: true, message: 'Vui lòng nhập mức dừng lỗ' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="Ví dụ: 2%"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="timeframe"
          label="Khung thời gian"
          rules={[{ required: true, message: 'Vui lòng chọn khung thời gian' }]}
        >
          <Select placeholder="Chọn khung thời gian">
            <Option value="5m">5 phút</Option>
            <Option value="15m">15 phút</Option>
            <Option value="30m">30 phút</Option>
            <Option value="1h">1 giờ</Option>
            <Option value="4h">4 giờ</Option>
            <Option value="1d">1 ngày</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="note"
          label="Ghi chú"
        >
          <Input.TextArea rows={4} placeholder="Nhập ghi chú cho tín hiệu này" />
        </Form.Item>

        <Checkbox checked={showAdvanced} onChange={(e) => setShowAdvanced(e.target.checked)}>
          Hiển thị tùy chọn nâng cao
        </Checkbox>

        {showAdvanced && (
          <>
            <Divider />
            <Title level={5}>Tùy chọn nâng cao</Title>

            <Form.Item
              name="leverage"
              label="Đòn bẩy"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={100}
                placeholder="Ví dụ: 10x"
              />
            </Form.Item>

            <Form.Item
              name="entryType"
              label="Loại vào lệnh"
            >
              <Select placeholder="Chọn loại vào lệnh" defaultValue="market">
                <Option value="market">Market</Option>
                <Option value="limit">Limit</Option>
                <Option value="conditional">Điều kiện</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="riskLevel"
              label="Mức độ rủi ro"
            >
              <Select placeholder="Chọn mức độ rủi ro" defaultValue="medium">
                <Option value="low">Thấp</Option>
                <Option value="medium">Trung bình</Option>
                <Option value="high">Cao</Option>
              </Select>
            </Form.Item>
          </>
        )}

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
              Tạo tín hiệu
            </Button>
            <Button icon={<SaveOutlined />}>
              Lưu bản nháp
            </Button>
            <Button icon={<PlayCircleOutlined />}>
              Kiểm tra
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignalGenerator; 