import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { login } from '../../store/slices/authSlice';
import './LoginForm.css';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mô phỏng gọi API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gọi action login từ Redux
      // await dispatch(login(values.email, values.password) as any);
      
      // Redirect to dashboard after successful login
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <Title level={2}>Đăng nhập</Title>
        <Text type="secondary">Chào mừng quay trở lại! Vui lòng đăng nhập để tiếp tục.</Text>
      </div>
      
      {error && (
        <Alert 
          message={error} 
          type="error" 
          showIcon 
          closable 
          className="login-error" 
          onClose={() => setError(null)} 
        />
      )}
      
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
        layout="vertical"
        className="login-form"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>
        
        <Form.Item>
          <div className="login-form-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className="forgot-password-link">
              Quên mật khẩu?
            </Link>
          </div>
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="login-button" 
            loading={loading}
            block
          >
            Đăng nhập
          </Button>
        </Form.Item>
        
        <div className="signup-link">
          <Text>Chưa có tài khoản? </Text>
          <Link to="/register">Đăng ký ngay</Link>
        </div>
        
        <Divider plain>Hoặc đăng nhập với</Divider>
        
        <div className="social-login">
          <Button icon={<GoogleOutlined />} className="social-button google">
            Google
          </Button>
          <Button icon={<FacebookOutlined />} className="social-button facebook">
            Facebook
          </Button>
          <Button icon={<TwitterOutlined />} className="social-button twitter">
            Twitter
          </Button>
        </div>
        
        <div className="login-footer">
          <Text type="secondary">
            Bằng việc đăng nhập, bạn đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và <Link to="/privacy">Chính sách bảo mật</Link> của chúng tôi.
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm; 