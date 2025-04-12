import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tabs, Card, Form, Input, Button, Switch, InputNumber, 
  Select, Slider, Row, Col, Typography, Divider, List,
  Alert, Checkbox, Radio, Space, Tag, Tooltip
} from 'antd';
import {
  ApiOutlined, RobotOutlined, SettingOutlined, 
  SafetyOutlined, BellOutlined, LockOutlined,
  CheckCircleOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchSettings, 
  updateApiSettings, 
  updateAiSettings, 
  updateTradingSettings, 
  updateRiskSettings, 
  updateNotificationSettings 
} from '../../store/slices/settingsSlice';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    apiSettings, 
    aiSettings, 
    tradingSettings, 
    riskSettings, 
    notificationSettings, 
    isLoading, 
    error,
    successMessage
  } = useSelector((state: RootState) => state.settings);
  
  const [apiForm] = Form.useForm();
  const [aiForm] = Form.useForm();
  const [tradingForm] = Form.useForm();
  const [riskForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isApiSecretVisible, setIsApiSecretVisible] = useState(false);
  
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);
  
  useEffect(() => {
    if (apiSettings) {
      apiForm.setFieldsValue(apiSettings);
    }
    if (aiSettings) {
      aiForm.setFieldsValue(aiSettings);
    }
    if (tradingSettings) {
      tradingForm.setFieldsValue(tradingSettings);
    }
    if (riskSettings) {
      riskForm.setFieldsValue(riskSettings);
    }
    if (notificationSettings) {
      notificationForm.setFieldsValue(notificationSettings);
    }
  }, [
    apiSettings, 
    aiSettings, 
    tradingSettings, 
    riskSettings, 
    notificationSettings, 
    apiForm, 
    aiForm,
    tradingForm,
    riskForm,
    notificationForm
  ]);
  
  const handleApiSubmit = (values: any) => {
    dispatch(updateApiSettings(values));
  };
  
  const handleAiSubmit = (values: any) => {
    dispatch(updateAiSettings(values));
  };
  
  const handleTradingSubmit = (values: any) => {
    dispatch(updateTradingSettings(values));
  };
  
  const handleRiskSubmit = (values: any) => {
    dispatch(updateRiskSettings(values));
  };
  
  const handleNotificationSubmit = (values: any) => {
    dispatch(updateNotificationSettings(values));
  };
  
  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };
  
  const toggleApiSecretVisibility = () => {
    setIsApiSecretVisible(!isApiSecretVisible);
  };
  
  return (
    <div className="settings-container">
      <Title level={3}>Cài đặt hệ thống</Title>
      
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {successMessage && (
        <Alert
          message="Thành công"
          description={successMessage}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={<span><ApiOutlined />API Sàn giao dịch</span>}
          key="1"
        >
          <Card>
            <Form
              form={apiForm}
              layout="vertical"
              onFinish={handleApiSubmit}
              initialValues={apiSettings}
            >
              <Title level={4}>Cài đặt API MEXC</Title>
              <Paragraph>
                Kết nối tài khoản MEXC của bạn để giao dịch tự động. Hệ thống sẽ sử dụng 
                các API keys này để truy cập vào tài khoản của bạn. Đảm bảo rằng bạn cấp 
                quyền cho API keys đúng với mục đích sử dụng.
              </Paragraph>
              
              <Form.Item
                name="apiKey"
                label="API Key"
                rules={[{ required: true, message: 'Vui lòng nhập API Key!' }]}
              >
                <Input.Password
                  placeholder="Nhập API Key"
                  visibilityToggle={{ visible: isApiKeyVisible, onVisibleChange: toggleApiKeyVisibility }}
                />
              </Form.Item>
              
              <Form.Item
                name="apiSecret"
                label="API Secret"
                rules={[{ required: true, message: 'Vui lòng nhập API Secret!' }]}
              >
                <Input.Password
                  placeholder="Nhập API Secret"
                  visibilityToggle={{ visible: isApiSecretVisible, onVisibleChange: toggleApiSecretVisibility }}
                />
              </Form.Item>
              
              <Form.Item
                name="testnetMode"
                valuePropName="checked"
              >
                <Checkbox>Sử dụng Testnet (Môi trường thử nghiệm)</Checkbox>
              </Form.Item>
              
              <Form.Item
                name="accountSummaryVisible"
                valuePropName="checked"
              >
                <Checkbox>Hiển thị thông tin tài khoản trên Dashboard</Checkbox>
              </Form.Item>
              
              <Divider />
              
              <Title level={5}>Quyền API</Title>
              <Form.Item
                name="apiPermissions"
              >
                <Checkbox.Group>
                  <Row>
                    <Col span={12}>
                      <Checkbox value="readMarketData">Đọc dữ liệu thị trường</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="readAccountBalance">Đọc số dư tài khoản</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="tradeFutures">Giao dịch Futures</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="transferFunds">Chuyển tiền</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isLoading}
                >
                  Lưu cài đặt API
                </Button>
                <Button 
                  onClick={() => {
                    // Implement API connection test
                  }}
                >
                  Kiểm tra kết nối
                </Button>
              </Space>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane
          tab={<span><RobotOutlined />Cài đặt AI</span>}
          key="2"
        >
          <Card>
            <Form
              form={aiForm}
              layout="vertical"
              onFinish={handleAiSubmit}
              initialValues={aiSettings}
            >
              <Title level={4}>Cài đặt AI & Dịch vụ phân tích</Title>
              <Paragraph>
                Cấu hình các dịch vụ AI và mô hình phân tích được sử dụng trong hệ thống.
                Điều chỉnh các tham số để tối ưu hóa kết quả phân tích cho chiến lược của bạn.
              </Paragraph>
              
              <Form.Item
                name="aiServiceType"
                label="Loại dịch vụ AI"
              >
                <Radio.Group>
                  <Radio value="internal">Sử dụng AI tích hợp</Radio>
                  <Radio value="openai">Sử dụng API OpenAI</Radio>
                  <Radio value="huggingface">Sử dụng Hugging Face API</Radio>
                  <Radio value="custom">Tùy chỉnh API</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item
                name="openaiApiKey"
                label="OpenAI API Key"
                tooltip="Chỉ cần điền nếu bạn chọn 'Sử dụng API OpenAI'"
              >
                <Input.Password placeholder="Nhập OpenAI API Key" />
              </Form.Item>
              
              <Form.Item
                name="huggingfaceApiKey"
                label="Hugging Face API Key"
                tooltip="Chỉ cần điền nếu bạn chọn 'Sử dụng Hugging Face API'"
              >
                <Input.Password placeholder="Nhập Hugging Face API Key" />
              </Form.Item>
              
              <Form.Item
                name="customApiEndpoint"
                label="Custom API Endpoint"
                tooltip="Chỉ cần điền nếu bạn chọn 'Tùy chỉnh API'"
              >
                <Input placeholder="https://" />
              </Form.Item>
              
              <Divider />
              
              <Title level={5}>Tham số AI</Title>
              
              <Form.Item
                name="analysisFrequency"
                label="Tần suất phân tích (phút)"
                tooltip="Tần suất AI sẽ phân tích thị trường"
              >
                <Select>
                  <Option value={5}>5 phút</Option>
                  <Option value={15}>15 phút</Option>
                  <Option value={30}>30 phút</Option>
                  <Option value={60}>1 giờ</Option>
                  <Option value={240}>4 giờ</Option>
                  <Option value={1440}>24 giờ</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="sentimentWeight"
                label="Trọng số Sentiment Analysis"
                tooltip="Ảnh hưởng của phân tích sentiment đến kết quả cuối cùng"
              >
                <Slider min={0} max={100} />
              </Form.Item>
              
              <Form.Item
                name="technicalWeight"
                label="Trọng số Technical Analysis"
                tooltip="Ảnh hưởng của phân tích kỹ thuật đến kết quả cuối cùng"
              >
                <Slider min={0} max={100} />
              </Form.Item>
              
              <Form.Item
                name="patternRecognitionWeight"
                label="Trọng số Pattern Recognition"
                tooltip="Ảnh hưởng của nhận diện mẫu hình đến kết quả cuối cùng"
              >
                <Slider min={0} max={100} />
              </Form.Item>
              
              <Form.Item
                name="confidenceThreshold"
                label="Ngưỡng độ tin cậy (%)"
                tooltip="Chỉ tạo tín hiệu khi độ tin cậy vượt ngưỡng này"
              >
                <InputNumber min={50} max={100} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="learningEnabled"
                valuePropName="checked"
                label="Kích hoạt chế độ học tập"
                tooltip="Cho phép AI học từ kết quả giao dịch trước đó"
              >
                <Switch />
              </Form.Item>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
              >
                Lưu cài đặt AI
              </Button>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane
          tab={<span><SettingOutlined />Chiến lược giao dịch</span>}
          key="3"
        >
          <Card>
            <Form
              form={tradingForm}
              layout="vertical"
              onFinish={handleTradingSubmit}
              initialValues={tradingSettings}
            >
              <Title level={4}>Cài đặt chiến lược giao dịch</Title>
              <Paragraph>
                Tùy chỉnh chiến lược giao dịch của bạn, bao gồm điều kiện vào lệnh, 
                take profit, stop loss và các tham số giao dịch khác.
              </Paragraph>
              
              <Form.Item
                name="autoTradingEnabled"
                valuePropName="checked"
                label="Kích hoạt giao dịch tự động"
                tooltip="Cho phép hệ thống tự động thực hiện giao dịch"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="tradingStrategy"
                label="Chiến lược giao dịch"
              >
                <Select>
                  <Option value="trend_following">Trend Following</Option>
                  <Option value="breakout">Breakout</Option>
                  <Option value="reversal">Reversal</Option>
                  <Option value="combined">Combined</Option>
                  <Option value="custom">Custom</Option>
                </Select>
              </Form.Item>
              
              <Divider />
              
              <Title level={5}>Tham số vào lệnh</Title>
              
              <Form.Item
                name="minConfirmations"
                label="Số lượng xác nhận tối thiểu"
                tooltip="Số lượng tín hiệu xác nhận cần thiết trước khi vào lệnh"
              >
                <InputNumber min={1} max={5} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="entryTimeframes"
                label="Timeframes xác nhận"
                tooltip="Các khung thời gian được sử dụng để xác nhận tín hiệu"
              >
                <Select mode="multiple">
                  <Option value="1m">1 phút</Option>
                  <Option value="5m">5 phút</Option>
                  <Option value="15m">15 phút</Option>
                  <Option value="1h">1 giờ</Option>
                  <Option value="4h">4 giờ</Option>
                  <Option value="1d">1 ngày</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="entryType"
                label="Kiểu vào lệnh"
              >
                <Radio.Group>
                  <Radio value="market">Market Order</Radio>
                  <Radio value="limit">Limit Order</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Divider />
              
              <Title level={5}>Tham số Take Profit & Stop Loss</Title>
              
              <Form.Item
                name="takeProfitType"
                label="Chiến lược Take Profit"
              >
                <Radio.Group>
                  <Radio value="single">Single Target</Radio>
                  <Radio value="multiple">Multiple Targets</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item
                name="takeProfitLevels"
                label="Số lượng Take Profit"
                tooltip="Chỉ áp dụng khi chọn Multiple Targets"
              >
                <InputNumber min={1} max={5} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="stopLossType"
                label="Loại Stop Loss"
              >
                <Radio.Group>
                  <Radio value="fixed">Fixed Stop Loss</Radio>
                  <Radio value="trailing">Trailing Stop Loss</Radio>
                  <Radio value="atr">ATR-based Stop Loss</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item
                name="riskRewardRatioMin"
                label="Risk-Reward Ratio tối thiểu"
                tooltip="Chỉ vào lệnh khi tỷ lệ lợi nhuận/rủi ro đạt mức này"
              >
                <InputNumber min={1} max={10} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="trailingStopActivation"
                label="Điều kiện kích hoạt Trailing Stop (%)"
                tooltip="Kích hoạt trailing stop khi lợi nhuận đạt mức này"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
              >
                Lưu cài đặt giao dịch
              </Button>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane
          tab={<span><SafetyOutlined />Quản lý rủi ro</span>}
          key="4"
        >
          <Card>
            <Form
              form={riskForm}
              layout="vertical"
              onFinish={handleRiskSubmit}
              initialValues={riskSettings}
            >
              <Title level={4}>Cài đặt quản lý rủi ro</Title>
              <Paragraph>
                Thiết lập các tham số quản lý rủi ro để bảo vệ vốn và tối ưu hiệu suất giao dịch.
              </Paragraph>
              
              <Form.Item
                name="riskPerTrade"
                label="Rủi ro tối đa mỗi giao dịch (%)"
                tooltip="Phần trăm tài khoản tối đa có thể mất trong một giao dịch"
                rules={[{ required: true, message: 'Vui lòng nhập mức rủi ro mỗi giao dịch!' }]}
              >
                <InputNumber min={0.1} max={10} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="maxOpenPositions"
                label="Số vị thế mở tối đa"
                tooltip="Số lượng vị thế được phép mở cùng lúc"
              >
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="maxDailyLoss"
                label="Giới hạn thua lỗ hàng ngày (%)"
                tooltip="Tạm dừng giao dịch khi tổng thua lỗ trong ngày vượt quá mức này"
              >
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="maxDrawdownPaused"
                label="Drawdown tạm dừng giao dịch (%)"
                tooltip="Tạm dừng giao dịch khi drawdown vượt quá mức này"
              >
                <InputNumber min={5} max={50} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="maxLeverageAllowed"
                label="Đòn bẩy tối đa được phép"
                tooltip="Giới hạn đòn bẩy tối đa cho mỗi giao dịch"
              >
                <Select>
                  <Option value={1}>1x</Option>
                  <Option value={3}>3x</Option>
                  <Option value={5}>5x</Option>
                  <Option value={10}>10x</Option>
                  <Option value={20}>20x</Option>
                  <Option value={50}>50x</Option>
                  <Option value={100}>100x</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="volatilityAdjustment"
                valuePropName="checked"
                label="Điều chỉnh theo biến động"
                tooltip="Tự động điều chỉnh kích thước vị thế dựa trên biến động thị trường"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="correlationCheck"
                valuePropName="checked"
                label="Kiểm tra tương quan"
                tooltip="Kiểm tra tương quan giữa các vị thế để tránh rủi ro tập trung"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="circuitBreakerEnabled"
                valuePropName="checked"
                label="Kích hoạt Circuit Breaker"
                tooltip="Tự động dừng giao dịch khi có biến động đột ngột"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="circuitBreakerThreshold"
                label="Ngưỡng Circuit Breaker (%)"
                tooltip="Kích hoạt circuit breaker khi biến động vượt quá mức này"
              >
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
              >
                Lưu cài đặt rủi ro
              </Button>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane
          tab={<span><BellOutlined />Cài đặt thông báo</span>}
          key="5"
        >
          <Card>
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSubmit}
              initialValues={notificationSettings}
            >
              <Title level={4}>Cài đặt thông báo</Title>
              <Paragraph>
                Cấu hình các thông báo để nhận được cập nhật về tín hiệu giao dịch, 
                thay đổi trạng thái vị thế và cảnh báo hệ thống.
              </Paragraph>
              
              <Form.Item
                name="emailNotifications"
                valuePropName="checked"
                label="Kích hoạt thông báo Email"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email nhận thông báo"
                rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>
              
              <Form.Item
                name="browserNotifications"
                valuePropName="checked"
                label="Kích hoạt thông báo trình duyệt"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="telegramNotifications"
                valuePropName="checked"
                label="Kích hoạt thông báo Telegram"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="telegramBotToken"
                label="Telegram Bot Token"
                tooltip="Nhập token của Telegram bot của bạn"
              >
                <Input.Password placeholder="Nhập Telegram Bot Token" />
              </Form.Item>
              
              <Form.Item
                name="telegramChatId"
                label="Telegram Chat ID"
                tooltip="ID của chat nơi bot sẽ gửi thông báo"
              >
                <Input placeholder="Nhập Telegram Chat ID" />
              </Form.Item>
              
              <Divider />
              
              <Title level={5}>Loại thông báo</Title>
              
              <Form.Item name="notificationTypes">
                <Checkbox.Group>
                  <Row>
                    <Col span={12}>
                      <Checkbox value="newSignals">Tín hiệu giao dịch mới</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="positionOpened">Mở vị thế mới</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="positionClosed">Đóng vị thế</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="stopLossHit">Stop Loss đạt đến</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="takeProfitHit">Take Profit đạt đến</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="systemErrors">Lỗi hệ thống</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="dailySummary">Tóm tắt hàng ngày</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="marketAlerts">Cảnh báo thị trường</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              
              <Form.Item
                name="notificationFrequency"
                label="Tần suất thông báo"
              >
                <Radio.Group>
                  <Radio value="realtime">Thời gian thực</Radio>
                  <Radio value="hourly">Hàng giờ</Radio>
                  <Radio value="daily">Hàng ngày</Radio>
                  <Radio value="important_only">Chỉ thông báo quan trọng</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
              >
                Lưu cài đặt thông báo
              </Button>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Settings; 