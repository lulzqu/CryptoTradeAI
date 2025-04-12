import React, { useState } from 'react';
import { Form, Input, Button, Select, Typography, Card, Space, InputNumber, Radio, Divider } from 'antd';
import { DollarOutlined, PercentageOutlined, SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderFormProps {
  onOrderSubmit?: (order: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderSubmit }) => {
  const [form] = Form.useForm();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  const onFinish = (values: any) => {
    if (onOrderSubmit) {
      onOrderSubmit({
        ...values,
        type: orderType,
        side,
      });
    }
  };

  const handleTypeChange = (e: any) => {
    setOrderType(e.target.value);
  };

  const handleSideChange = (e: any) => {
    setSide(e.target.value);
  };

  return (
    <Card className="order-form">
      <Title level={4}>Đặt lệnh</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          amount: 0.01,
          price: 50000,
          stopPrice: 0,
          takeProfit: 0,
          stopLoss: 0,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Radio.Group
            value={side}
            onChange={handleSideChange}
            buttonStyle="solid"
            style={{ width: '100%' }}
          >
            <Radio.Button value="buy" style={{ width: '50%', textAlign: 'center' }}>
              Mua
            </Radio.Button>
            <Radio.Button value="sell" style={{ width: '50%', textAlign: 'center' }}>
              Bán
            </Radio.Button>
          </Radio.Group>

          <Radio.Group
            value={orderType}
            onChange={handleTypeChange}
            buttonStyle="solid"
            style={{ width: '100%' }}
          >
            <Radio.Button value="limit" style={{ width: '50%', textAlign: 'center' }}>
              Lệnh giới hạn
            </Radio.Button>
            <Radio.Button value="market" style={{ width: '50%', textAlign: 'center' }}>
              Lệnh thị trường
            </Radio.Button>
          </Radio.Group>

          <Form.Item
            name="amount"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0.0001}
              step={0.0001}
              precision={4}
              addonAfter="BTC"
            />
          </Form.Item>

          {orderType === 'limit' && (
            <Form.Item
              name="price"
              label="Giá"
              rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                precision={2}
                addonAfter="USDT"
              />
            </Form.Item>
          )}

          <Divider orientation="left">Quản lý rủi ro</Divider>

          <Form.Item
            name="stopLoss"
            label="Stop Loss"
            tooltip="Giá dừng lỗ"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
              addonAfter="USDT"
            />
          </Form.Item>

          <Form.Item
            name="takeProfit"
            label="Take Profit"
            tooltip="Giá chốt lời"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
              addonAfter="USDT"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              danger={side === 'sell'}
            >
              {side === 'buy' ? 'Mua' : 'Bán'} BTC
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
};

export default OrderForm; 