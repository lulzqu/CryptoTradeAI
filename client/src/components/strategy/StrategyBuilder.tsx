import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Space, Divider, Typography, Tabs, InputNumber, Switch, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, PlayCircleOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface StrategyBuilderProps {
  onSave?: (strategy: any) => void;
  onTest?: (strategy: any) => void;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ onSave, onTest }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [code, setCode] = useState('');

  const onFinish = (values: any) => {
    console.log('Strategy values:', values);
    if (onSave) {
      onSave({ ...values, code });
    }
  };

  const handleTest = () => {
    const values = form.getFieldsValue();
    if (onTest) {
      onTest({ ...values, code });
    }
  };

  return (
    <Card className="strategy-builder">
      <Title level={4}>Xây dựng chiến lược</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          timeframe: '1h',
          exchange: 'binance',
          baseCurrency: 'BTC',
          quoteCurrency: 'USDT',
          isActive: true,
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin cơ bản" key="1">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên chiến lược"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chiến lược' }]}
                >
                  <Input placeholder="Nhập tên chiến lược" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="Mô tả"
                >
                  <Input.TextArea rows={2} placeholder="Mô tả chiến lược" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="timeframe"
                  label="Khung thời gian"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="1m">1 phút</Option>
                    <Option value="5m">5 phút</Option>
                    <Option value="15m">15 phút</Option>
                    <Option value="1h">1 giờ</Option>
                    <Option value="4h">4 giờ</Option>
                    <Option value="1d">1 ngày</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="exchange"
                  label="Sàn giao dịch"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="binance">Binance</Option>
                    <Option value="ftx">FTX</Option>
                    <Option value="kucoin">KuCoin</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="pair"
                  label="Cặp giao dịch"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="BTC/USDT">BTC/USDT</Option>
                    <Option value="ETH/USDT">ETH/USDT</Option>
                    <Option value="BNB/USDT">BNB/USDT</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Tham số" key="2">
            <Form.List name="parameters">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Thiếu tên tham số' }]}
                      >
                        <Input placeholder="Tên tham số" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: 'Thiếu kiểu dữ liệu' }]}
                      >
                        <Select style={{ width: 120 }}>
                          <Option value="number">Số</Option>
                          <Option value="boolean">Boolean</Option>
                          <Option value="string">Chuỗi</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Thiếu giá trị' }]}
                      >
                        <Input placeholder="Giá trị" />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm tham số
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </TabPane>

          <TabPane tab="Mã nguồn" key="3">
            <Form.Item
              name="code"
              rules={[{ required: true, message: 'Vui lòng nhập mã nguồn' }]}
            >
              <MonacoEditor
                height="400px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                }}
              />
            </Form.Item>
          </TabPane>
        </Tabs>

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Lưu chiến lược
            </Button>
            <Button onClick={handleTest} icon={<PlayCircleOutlined />}>
              Kiểm thử
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StrategyBuilder; 