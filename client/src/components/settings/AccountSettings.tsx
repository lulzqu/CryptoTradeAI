import React, { useState } from 'react';
import { 
  Card, Typography, Form, Input, Button, Divider, 
  Switch, Select, Upload, message, Tabs, Space, Alert, Tag 
} from 'antd';
import { 
  UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, 
  GlobalOutlined, BellOutlined, UploadOutlined, SecurityScanOutlined,
  CheckCircleOutlined, LoadingOutlined
} from '@ant-design/icons';
import './AccountSettings.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  language: string;
  country: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    trading: boolean;
    security: boolean;
    marketing: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    lastPasswordChange: string;
    loginNotifications: boolean;
  };
}

const AccountSettings: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 987 654 321',
    language: 'vi',
    country: 'VN',
    notifications: {
      email: true,
      sms: true,
      push: false,
      trading: true,
      security: true,
      marketing: false,
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      lastPasswordChange: '2024-01-15T10:30:00',
      loginNotifications: true,
    }
  });

  const [loading, setLoading] = useState(false);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Set initial form values
  React.useEffect(() => {
    profileForm.setFieldsValue({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      language: userData.language,
      country: userData.country,
    });

    notificationForm.setFieldsValue({
      emailNotifications: userData.notifications.email,
      smsNotifications: userData.notifications.sms,
      pushNotifications: userData.notifications.push,
      tradingNotifications: userData.notifications.trading,
      securityNotifications: userData.notifications.security,
      marketingNotifications: userData.notifications.marketing,
    });

    securityForm.setFieldsValue({
      twoFactorEnabled: userData.security.twoFactorEnabled,
      sessionTimeout: userData.security.sessionTimeout,
      loginNotifications: userData.security.loginNotifications,
    });
  }, [userData, profileForm, notificationForm, securityForm]);

  const handleProfileSubmit = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUserData({
        ...userData,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        language: values.language,
        country: values.country,
      });
      setIsEditingProfile(false);
      setLoading(false);
      message.success('Thông tin cá nhân đã được cập nhật');
    }, 1000);
  };

  const handlePasswordSubmit = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      passwordForm.resetFields();
      setLoading(false);
      message.success('Mật khẩu đã được cập nhật');
      
      // Update last password change
      setUserData({
        ...userData,
        security: {
          ...userData.security,
          lastPasswordChange: new Date().toISOString(),
        }
      });
    }, 1000);
  };

  const handleNotificationSubmit = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUserData({
        ...userData,
        notifications: {
          email: values.emailNotifications,
          sms: values.smsNotifications,
          push: values.pushNotifications,
          trading: values.tradingNotifications,
          security: values.securityNotifications,
          marketing: values.marketingNotifications,
        }
      });
      setLoading(false);
      message.success('Cài đặt thông báo đã được cập nhật');
    }, 1000);
  };

  const handleSecuritySubmit = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUserData({
        ...userData,
        security: {
          ...userData.security,
          twoFactorEnabled: values.twoFactorEnabled,
          sessionTimeout: values.sessionTimeout,
          loginNotifications: values.loginNotifications,
        }
      });
      setLoading(false);
      message.success('Cài đặt bảo mật đã được cập nhật');
    }, 1000);
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
      setUploadLoading(false);
      message.success('Ảnh đại diện đã được cập nhật');
    }
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <div className="account-settings">
      <Tabs defaultActiveKey="profile" className="account-settings-tabs">
        <TabPane tab="Thông tin cá nhân" key="profile">
          <Card className="account-settings-card">
            <div className="profile-header">
              <div className="avatar-container">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={(file) => {
                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!isJpgOrPng) {
                      message.error('Chỉ hỗ trợ file JPG/PNG!');
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('Kích thước ảnh không được vượt quá 2MB!');
                    }
                    return isJpgOrPng && isLt2M;
                  }}
                  onChange={handleAvatarChange}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
              <div className="profile-title">
                <Title level={4}>{isEditingProfile ? 'Chỉnh sửa thông tin cá nhân' : 'Thông tin cá nhân'}</Title>
                <Paragraph>
                  Cập nhật thông tin của bạn và cách chúng tôi có thể liên hệ với bạn
                </Paragraph>
              </div>
              {!isEditingProfile && (
                <Button 
                  type="primary" 
                  onClick={() => setIsEditingProfile(true)}
                  className="edit-profile-button"
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {isEditingProfile ? (
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleProfileSubmit}
              >
                <Form.Item
                  name="fullName"
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
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                </Form.Item>

                <Form.Item
                  name="language"
                  label="Ngôn ngữ"
                >
                  <Select placeholder="Chọn ngôn ngữ">
                    <Option value="vi">Tiếng Việt</Option>
                    <Option value="en">English</Option>
                    <Option value="zh">中文</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="country"
                  label="Quốc gia"
                >
                  <Select placeholder="Chọn quốc gia">
                    <Option value="VN">Việt Nam</Option>
                    <Option value="US">United States</Option>
                    <Option value="UK">United Kingdom</Option>
                    <Option value="JP">Japan</Option>
                    <Option value="SG">Singapore</Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Lưu thay đổi
                    </Button>
                    <Button onClick={() => setIsEditingProfile(false)}>
                      Hủy
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <div className="profile-info">
                <div className="profile-info-item">
                  <Text strong>Họ và tên:</Text>
                  <Text>{userData.fullName}</Text>
                </div>
                <div className="profile-info-item">
                  <Text strong>Email:</Text>
                  <Text>{userData.email}</Text>
                </div>
                <div className="profile-info-item">
                  <Text strong>Số điện thoại:</Text>
                  <Text>{userData.phone}</Text>
                </div>
                <div className="profile-info-item">
                  <Text strong>Ngôn ngữ:</Text>
                  <Text>{userData.language === 'vi' ? 'Tiếng Việt' : userData.language === 'en' ? 'English' : '中文'}</Text>
                </div>
                <div className="profile-info-item">
                  <Text strong>Quốc gia:</Text>
                  <Text>
                    {userData.country === 'VN' ? 'Việt Nam' : 
                     userData.country === 'US' ? 'United States' : 
                     userData.country === 'UK' ? 'United Kingdom' : 
                     userData.country === 'JP' ? 'Japan' : 'Singapore'}
                  </Text>
                </div>
              </div>
            )}
          </Card>

          <Card className="account-settings-card">
            <Title level={4}>Đổi mật khẩu</Title>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordSubmit}
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
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
                ]}
                hasFeedback
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="Thông báo" key="notifications">
          <Card className="account-settings-card">
            <Title level={4}>Cài đặt thông báo</Title>
            <Paragraph>
              Quản lý cách bạn nhận thông báo từ hệ thống giao dịch
            </Paragraph>

            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSubmit}
            >
              <Divider orientation="left">Kênh thông báo</Divider>
              
              <Form.Item
                name="emailNotifications"
                valuePropName="checked"
                label="Thông báo qua email"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item
                name="smsNotifications"
                valuePropName="checked"
                label="Thông báo qua SMS"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item
                name="pushNotifications"
                valuePropName="checked"
                label="Thông báo trên ứng dụng"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Divider orientation="left">Loại thông báo</Divider>

              <Form.Item
                name="tradingNotifications"
                valuePropName="checked"
                label="Thông báo giao dịch"
                tooltip="Nhận thông báo về hoạt động giao dịch, lệnh được khớp, tín hiệu mới"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item
                name="securityNotifications"
                valuePropName="checked"
                label="Thông báo bảo mật"
                tooltip="Nhận thông báo về đăng nhập, thay đổi mật khẩu, API key mới"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item
                name="marketingNotifications"
                valuePropName="checked"
                label="Thông báo tiếp thị"
                tooltip="Nhận cập nhật về tính năng mới, sự kiện và khuyến mãi"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Lưu cài đặt
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="Bảo mật" key="security">
          <Card className="account-settings-card">
            <div className="security-header">
              <div>
                <Title level={4}>Cài đặt bảo mật</Title>
                <Paragraph>
                  Quản lý các cài đặt bảo mật để bảo vệ tài khoản của bạn
                </Paragraph>
              </div>
              {userData.security.twoFactorEnabled && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Xác thực 2 yếu tố đã kích hoạt
                </Tag>
              )}
            </div>

            <Alert
              message="Trạng thái bảo mật tài khoản"
              description={
                <div>
                  <div>Thay đổi mật khẩu gần nhất: {new Date(userData.security.lastPasswordChange).toLocaleDateString()}</div>
                  <div>Xác thực hai yếu tố: {userData.security.twoFactorEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</div>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />

            <Form
              form={securityForm}
              layout="vertical"
              onFinish={handleSecuritySubmit}
            >
              <Form.Item
                name="twoFactorEnabled"
                valuePropName="checked"
                label="Xác thực hai yếu tố (2FA)"
              >
                <Switch 
                  checkedChildren="Bật" 
                  unCheckedChildren="Tắt" 
                />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="Thời gian hết phiên (phút)"
                tooltip="Tài khoản sẽ tự động đăng xuất sau thời gian không hoạt động"
              >
                <Select>
                  <Option value={15}>15 phút</Option>
                  <Option value={30}>30 phút</Option>
                  <Option value={60}>1 giờ</Option>
                  <Option value={120}>2 giờ</Option>
                  <Option value={240}>4 giờ</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="loginNotifications"
                valuePropName="checked"
                label="Thông báo đăng nhập"
                tooltip="Nhận email thông báo khi có đăng nhập mới vào tài khoản"
              >
                <Switch 
                  checkedChildren="Bật" 
                  unCheckedChildren="Tắt" 
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SecurityScanOutlined />}
                  loading={loading}
                >
                  Lưu cài đặt bảo mật
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <div className="security-actions">
              <Title level={5}>Phiên đăng nhập</Title>
              <Button type="default" danger>
                Đăng xuất khỏi tất cả các thiết bị
              </Button>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AccountSettings; 