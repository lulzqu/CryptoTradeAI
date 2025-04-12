import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import logo from '../../assets/logo.svg';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      // Error is already handled in the auth slice
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="CryptoTradeAI" style={{ height: '48px' }} />
          <Title level={4} style={{ marginLeft: 16, marginBottom: 0 }}>
            CryptoTradeAI
          </Title>
        </div>
        
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Đăng nhập
        </Title>
        
        {error && (
          <div style={{ marginBottom: 16, color: '#f5222d' }}>
            {error}
          </div>
        )}
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              size="large"
              autoComplete="email"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                Nhớ đăng nhập
              </Checkbox>
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={isLoading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Text>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 