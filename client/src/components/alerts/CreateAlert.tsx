import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  InputNumber, 
  Space,
  Typography,
  message
} from 'antd';
import { InfoCircleOutlined, BellOutlined } from '@ant-design/icons';
import './CreateAlert.css';

const { Title } = Typography;
const { Option } = Select;

export interface AlertFormValues {
  symbol: string;
  type: string;
  condition: string;
  price: number;
  message: string;
  priority: string;
}

const tradingPairs = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT', 
  'XRP/USDT', 'DOT/USDT', 'DOGE/USDT', 'AVAX/USDT', 'MATIC/USDT'
];

const CreateAlert: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: AlertFormValues) => {
    setLoading(true);
    
    // Giả lập gửi dữ liệu lên server
    setTimeout(() => {
      console.log('Alert created:', values);
      message.success('Cảnh báo đã được tạo thành công');
      form.resetFields();
      setLoading(false);
    }, 800);
  };

  return (
    <Card className="create-alert">
      <div className="create-alert-header">
        <Title level={4}>
          <BellOutlined /> Tạo cảnh báo mới
        </Title>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          type: 'price',
          condition: 'above',
          priority: 'medium'
        }}
      >
        <Form.Item
          name="symbol"
          label="Cặp giao dịch"
          rules={[{ required: true, message: 'Vui lòng chọn cặp giao dịch' }]}
        >
          <Select 
            placeholder="Chọn cặp giao dịch" 
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {tradingPairs.map(pair => (
              <Option key={pair} value={pair}>{pair}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại cảnh báo"
          rules={[{ required: true, message: 'Vui lòng chọn loại cảnh báo' }]}
        >
          <Select>
            <Option value="price">Giá</Option>
            <Option value="volume">Khối lượng</Option>
            <Option value="volatility">Biến động</Option>
            <Option value="indicator">Chỉ báo kỹ thuật</Option>
            <Option value="news">Tin tức</Option>
          </Select>
        </Form.Item>

        <Space className="condition-price-group">
          <Form.Item
            name="condition"
            label="Điều kiện"
            rules={[{ required: true, message: 'Vui lòng chọn điều kiện' }]}
          >
            <Select style={{ width: 120 }}>
              <Option value="above">Cao hơn</Option>
              <Option value="below">Thấp hơn</Option>
              <Option value="equals">Bằng</Option>
              <Option value="change">Thay đổi</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber 
              min={0} 
              step={0.001} 
              style={{ width: '100%' }} 
              precision={4} 
              placeholder="0.0000"
            />
          </Form.Item>
        </Space>

        <Form.Item
          name="message"
          label="Nội dung thông báo"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
          tooltip={{ title: 'Tin nhắn sẽ hiển thị khi cảnh báo được kích hoạt', icon: <InfoCircleOutlined /> }}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Nhập nội dung thông báo khi cảnh báo được kích hoạt"
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
        >
          <Select>
            <Option value="high">Cao</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="low">Thấp</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="create-alert-button"
          >
            Tạo cảnh báo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateAlert; 