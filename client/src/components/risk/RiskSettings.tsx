import React, { useState } from 'react';
import { 
  Card, Typography, Form, Input, Select, Button, InputNumber, 
  Switch, Slider, Space, Divider, Row, Col, Tooltip 
} from 'antd';
import { SaveOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface RiskSettingsProps {
  onSave?: (values: any) => void;
}

const RiskSettings: React.FC<RiskSettingsProps> = ({ onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    console.log('Form values:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (onSave) {
        onSave(values);
      }
    }, 1000);
  };

  return (
    <Card className="risk-settings">
      <div className="risk-settings-header">
        <Title level={4}>Cài đặt quản lý rủi ro</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => form.resetFields()}>
            Đặt lại
          </Button>
        </Space>
      </div>

      <Paragraph className="risk-settings-intro">
        Quản lý rủi ro giúp bảo vệ danh mục đầu tư của bạn khỏi các tổn thất lớn. Thiết lập các tham số bên dưới để tự động áp dụng cho tất cả các giao dịch.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          maxRiskPerTrade: 2,
          maxRiskPerDay: 5,
          maxRiskPortfolio: 10,
          maxDrawdown: 15,
          positionSizing: 'risk',
          riskRewardRatio: 2,
          stopLossStrategy: 'fixed',
          autoHedging: false,
          maxOpenPositions: 5,
          maxLeverage: 5,
          enableAlerts: true,
          alertThreshold: 80,
        }}
      >
        <Title level={5}>Giới hạn rủi ro</Title>
        
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="maxRiskPerTrade"
              label={
                <span>
                  Rủi ro tối đa mỗi giao dịch (%)
                  <Tooltip title="Phần trăm vốn tối đa có thể mất trong một giao dịch">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập rủi ro tối đa mỗi giao dịch' }]}
            >
              <InputNumber
                min={0.1}
                max={10}
                step={0.1}
                style={{ width: '100%' }}
                formatter={(value) => `${value}%`}
                parser={(value) => value ? parseFloat(value.replace('%', '')) : 0}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={8}>
            <Form.Item
              name="maxRiskPerDay"
              label={
                <span>
                  Rủi ro tối đa mỗi ngày (%)
                  <Tooltip title="Phần trăm vốn tối đa có thể mất trong một ngày">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập rủi ro tối đa mỗi ngày' }]}
            >
              <InputNumber
                min={1}
                max={20}
                step={0.5}
                style={{ width: '100%' }}
                formatter={(value) => `${value}%`}
                parser={(value) => value ? parseFloat(value.replace('%', '')) : 0}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={8}>
            <Form.Item
              name="maxRiskPortfolio"
              label={
                <span>
                  Rủi ro tối đa danh mục (%)
                  <Tooltip title="Phần trăm vốn tối đa có thể mất trên toàn bộ danh mục">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập rủi ro tối đa danh mục' }]}
            >
              <InputNumber
                min={5}
                max={30}
                step={1}
                style={{ width: '100%' }}
                formatter={(value) => `${value}%`}
                parser={(value) => value ? parseFloat(value.replace('%', '')) : 0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="maxDrawdown"
              label={
                <span>
                  Drawdown tối đa (%)
                  <Tooltip title="Mức giảm tối đa được phép trước khi dừng giao dịch">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập drawdown tối đa' }]}
            >
              <Slider
                min={5}
                max={30}
                marks={{
                  5: '5%',
                  10: '10%',
                  15: '15%',
                  20: '20%',
                  25: '25%',
                  30: '30%'
                }}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="maxOpenPositions"
              label={
                <span>
                  Số vị thế tối đa
                  <Tooltip title="Số lượng vị thế được phép mở cùng một lúc">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập số vị thế tối đa' }]}
            >
              <InputNumber
                min={1}
                max={20}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        
        <Title level={5}>Chiến lược quản lý rủi ro</Title>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="positionSizing"
              label="Chiến lược xác định kích thước vị thế"
              rules={[{ required: true, message: 'Vui lòng chọn chiến lược' }]}
            >
              <Select>
                <Option value="fixed">Kích thước cố định</Option>
                <Option value="risk">Dựa trên rủi ro</Option>
                <Option value="volatility">Dựa trên biến động</Option>
                <Option value="kelly">Tiêu chí Kelly</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="stopLossStrategy"
              label="Chiến lược dừng lỗ"
              rules={[{ required: true, message: 'Vui lòng chọn chiến lược' }]}
            >
              <Select>
                <Option value="fixed">Cố định</Option>
                <Option value="atr">ATR</Option>
                <Option value="trailing">Trailing</Option>
                <Option value="support">Dựa trên hỗ trợ/kháng cự</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="riskRewardRatio"
              label={
                <span>
                  Tỷ lệ rủi ro/phần thưởng
                  <Tooltip title="Mục tiêu lợi nhuận so với rủi ro, ví dụ: 2 có nghĩa là mục tiêu lợi nhuận gấp 2 lần rủi ro">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ rủi ro/phần thưởng' }]}
            >
              <InputNumber
                min={1}
                max={5}
                step={0.1}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="maxLeverage"
              label={
                <span>
                  Đòn bẩy tối đa
                  <Tooltip title="Mức đòn bẩy tối đa được phép sử dụng">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập đòn bẩy tối đa' }]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: '100%' }}
                formatter={(value) => `${value}x`}
                parser={(value) => value ? parseFloat(value.replace('x', '')) : 0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        
        <Title level={5}>Cài đặt bổ sung</Title>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="autoHedging"
              label={
                <span>
                  Tự động đối ứng
                  <Tooltip title="Tự động mở vị thế đối ứng khi thị trường bất lợi">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="enableAlerts"
              label={
                <span>
                  Bật cảnh báo rủi ro
                  <Tooltip title="Nhận thông báo khi các ngưỡng rủi ro bị vượt quá">
                    <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="alertThreshold"
          label="Ngưỡng cảnh báo (%)"
          rules={[{ required: true, message: 'Vui lòng nhập ngưỡng cảnh báo' }]}
        >
          <Slider
            min={50}
            max={100}
            marks={{
              50: '50%',
              60: '60%',
              70: '70%',
              80: '80%',
              90: '90%',
              100: '100%'
            }}
          />
        </Form.Item>

        <Divider />

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            Lưu cài đặt
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RiskSettings; 