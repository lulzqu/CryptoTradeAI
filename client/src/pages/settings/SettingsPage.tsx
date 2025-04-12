import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Row,
  Col,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Slider,
  Divider,
  notification,
  Typography,
  Space,
  Avatar,
  Upload,
  Spin,
  InputNumber
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SettingOutlined,
  GlobalOutlined,
  DollarCircleOutlined,
  UploadOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { fetchSettings, updateSettings } from '../../slices/settingsSlice';
import { updateProfile, updatePassword } from '../../slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import { UserSettings } from '../../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings, loading, error } = useSelector((state: RootState) => state.settings);
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [tradingForm] = Form.useForm();
  const [displayForm] = Form.useForm();
  const [apiKeysForm] = Form.useForm();
  
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  
  // Lấy cài đặt người dùng khi component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);
  
  // Cập nhật form khi có dữ liệu
  useEffect(() => {
    if (settings) {
      notificationForm.setFieldsValue({
        email: settings.notifications.email,
        push: settings.notifications.push,
        signalAlerts: settings.notifications.signalAlerts,
        priceAlerts: settings.notifications.priceAlerts,
      });
      
      tradingForm.setFieldsValue({
        defaultLeverage: settings.trading.defaultLeverage,
        riskPerTrade: settings.trading.riskPerTrade,
        autoTrade: settings.trading.autoTrade,
      });
      
      displayForm.setFieldsValue({
        theme: settings.theme,
        language: settings.language,
        defaultTimeframe: settings.display.defaultTimeframe,
        defaultChart: settings.display.defaultChart,
        showVolume: settings.display.showVolume,
      });
    }
    
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [settings, user, notificationForm, tradingForm, displayForm, profileForm]);
  
  // Xử lý cập nhật hồ sơ người dùng
  const handleProfileUpdate = (values: any) => {
    dispatch(updateProfile(values)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Thông tin hồ sơ của bạn đã được cập nhật.',
        });
      }
    });
  };
  
  // Xử lý cập nhật mật khẩu
  const handlePasswordUpdate = (values: any) => {
    dispatch(updatePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Mật khẩu của bạn đã được cập nhật.',
        });
        passwordForm.resetFields();
      }
    });
  };
  
  // Xử lý cập nhật cài đặt thông báo
  const handleNotificationUpdate = (values: any) => {
    const updatedSettings = {
      ...settings,
      notifications: values,
    };
    
    dispatch(updateSettings(updatedSettings)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Cài đặt thông báo của bạn đã được cập nhật.',
        });
      }
    });
  };
  
  // Xử lý cập nhật cài đặt giao dịch
  const handleTradingUpdate = (values: any) => {
    const updatedSettings = {
      ...settings,
      trading: values,
    };
    
    dispatch(updateSettings(updatedSettings)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Cài đặt giao dịch của bạn đã được cập nhật.',
        });
      }
    });
  };
  
  // Xử lý cập nhật cài đặt hiển thị
  const handleDisplayUpdate = (values: any) => {
    const { theme, language, ...displaySettings } = values;
    
    const updatedSettings = {
      ...settings,
      theme,
      language,
      display: displaySettings,
    };
    
    dispatch(updateSettings(updatedSettings)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Cài đặt hiển thị của bạn đã được cập nhật.',
        });
      }
    });
  };
  
  // Xử lý cập nhật khóa API
  const handleApiKeysUpdate = (values: any) => {
    // Thực hiện cập nhật khóa API
    notification.success({
      message: 'Cập nhật thành công',
      description: 'Khóa API của bạn đã được cập nhật.',
    });
  };
  
  // Xử lý tải lên avatar
  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
      notification.success({
        message: 'Tải lên thành công',
        description: 'Ảnh đại diện của bạn đã được cập nhật.',
      });
    }
  };
  
  // Hiển thị trang loading
  if (loading && !settings) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div className="settings-page">
      <Title level={2}>Cài đặt</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card className="settings-menu">
            <div className="user-info" style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />} 
              />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {user?.name}
              </Title>
              <Text type="secondary">{user?.email}</Text>
              
              <div style={{ marginTop: 16 }}>
                <Upload 
                  name="avatar"
                  action="/api/user/avatar"
                  showUploadList={false}
                  onChange={handleAvatarUpload}
                >
                  <Button icon={<UploadOutlined />}>Đổi ảnh đại diện</Button>
                </Upload>
              </div>
            </div>
            
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabPosition="left"
              style={{ height: '100%' }}
            >
              <TabPane 
                tab={<span><UserOutlined /> Hồ sơ</span>} 
                key="profile"
              />
              <TabPane 
                tab={<span><LockOutlined /> Mật khẩu</span>} 
                key="password"
              />
              <TabPane 
                tab={<span><BellOutlined /> Thông báo</span>} 
                key="notifications"
              />
              <TabPane 
                tab={<span><DollarCircleOutlined /> Giao dịch</span>} 
                key="trading"
              />
              <TabPane 
                tab={<span><SettingOutlined /> Hiển thị</span>} 
                key="display"
              />
              <TabPane 
                tab={<span><ApiOutlined /> API Keys</span>} 
                key="api-keys"
              />
            </Tabs>
          </Card>
        </Col>
        
        <Col xs={24} lg={18}>
          <Card className="settings-content">
            {activeTab === 'profile' && (
              <div>
                <Title level={4}>Thông tin hồ sơ</Title>
                <Divider />
                
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                >
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input disabled prefix={<UserOutlined />} placeholder="Email" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Cập nhật hồ sơ
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
            
            {activeTab === 'password' && (
              <div>
                <Title level={4}>Đổi mật khẩu</Title>
                <Divider />
                
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordUpdate}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Mật khẩu hiện tại"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
                  </Form.Item>
                  
                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                      { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                  </Form.Item>
                  
                  <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Đổi mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <Title level={4}>Cài đặt thông báo</Title>
                <Divider />
                
                <Form
                  form={notificationForm}
                  layout="vertical"
                  onFinish={handleNotificationUpdate}
                >
                  <Form.Item
                    name="email"
                    label="Thông báo qua email"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="push"
                    label="Thông báo đẩy"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="signalAlerts"
                    label="Thông báo tín hiệu giao dịch"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="priceAlerts"
                    label="Thông báo biến động giá"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Lưu cài đặt
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
            
            {activeTab === 'trading' && (
              <div>
                <Title level={4}>Cài đặt giao dịch</Title>
                <Divider />
                
                <Form
                  form={tradingForm}
                  layout="vertical"
                  onFinish={handleTradingUpdate}
                >
                  <Form.Item
                    name="defaultLeverage"
                    label="Đòn bẩy mặc định"
                    rules={[{ required: true, message: 'Vui lòng chọn đòn bẩy mặc định' }]}
                  >
                    <Slider
                      min={1}
                      max={100}
                      marks={{
                        1: '1x',
                        25: '25x',
                        50: '50x',
                        75: '75x',
                        100: '100x',
                      }}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="riskPerTrade"
                    label="Rủi ro mỗi giao dịch (%)"
                    rules={[{ required: true, message: 'Vui lòng nhập mức rủi ro' }]}
                  >
                    <InputNumber
                      min={0.1}
                      max={100}
                      step={0.1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="autoTrade"
                    label="Giao dịch tự động"
                    valuePropName="checked"
                    extra="Tự động mở vị thế dựa trên tín hiệu giao dịch"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Lưu cài đặt
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
            
            {activeTab === 'display' && (
              <div>
                <Title level={4}>Cài đặt hiển thị</Title>
                <Divider />
                
                <Form
                  form={displayForm}
                  layout="vertical"
                  onFinish={handleDisplayUpdate}
                >
                  <Form.Item
                    name="theme"
                    label="Giao diện"
                    rules={[{ required: true, message: 'Vui lòng chọn giao diện' }]}
                  >
                    <Select>
                      <Option value="light">Sáng</Option>
                      <Option value="dark">Tối</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="language"
                    label="Ngôn ngữ"
                    rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ' }]}
                  >
                    <Select>
                      <Option value="vi">Tiếng Việt</Option>
                      <Option value="en">Tiếng Anh</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="defaultTimeframe"
                    label="Khung thời gian mặc định"
                    rules={[{ required: true, message: 'Vui lòng chọn khung thời gian mặc định' }]}
                  >
                    <Select>
                      <Option value="1m">1 phút</Option>
                      <Option value="5m">5 phút</Option>
                      <Option value="15m">15 phút</Option>
                      <Option value="30m">30 phút</Option>
                      <Option value="1h">1 giờ</Option>
                      <Option value="4h">4 giờ</Option>
                      <Option value="1d">1 ngày</Option>
                      <Option value="1w">1 tuần</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="defaultChart"
                    label="Loại biểu đồ mặc định"
                    rules={[{ required: true, message: 'Vui lòng chọn loại biểu đồ mặc định' }]}
                  >
                    <Select>
                      <Option value="candles">Nến</Option>
                      <Option value="line">Đường</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="showVolume"
                    label="Hiển thị khối lượng"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Lưu cài đặt
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
            
            {activeTab === 'api-keys' && (
              <div>
                <Title level={4}>Khóa API</Title>
                <Divider />
                
                <Text type="warning">
                  Chú ý: Không chia sẻ khóa API với bất kỳ ai. Hệ thống sẽ không lưu trữ khóa bí mật của bạn.
                </Text>
                
                <Form
                  form={apiKeysForm}
                  layout="vertical"
                  onFinish={handleApiKeysUpdate}
                  style={{ marginTop: 24 }}
                >
                  <Form.Item
                    name="mexc_api_key"
                    label="MEXC API Key"
                  >
                    <Input.Password placeholder="Nhập MEXC API Key" />
                  </Form.Item>
                  
                  <Form.Item
                    name="mexc_api_secret"
                    label="MEXC API Secret"
                  >
                    <Input.Password placeholder="Nhập MEXC API Secret" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Lưu khóa API
                      </Button>
                      <Button danger>
                        Xóa khóa API
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage; 