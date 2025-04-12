import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import logo from '../../assets/logo.svg';

const { Title, Text, Paragraph } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const onFinish = async (values: { email: string; username: string; password: string }) => {
    try {
      await dispatch(register(values)).unwrap();
      message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
      navigate('/login');
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
          Đăng ký tài khoản
        </Title>
        
        {error && (
          <div style={{ marginBottom: 16, color: '#f5222d' }}>
            {error}
          </div>
        )}
        
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large"
              autoComplete="email"
            />
          </Form.Item>
          
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người dùng!' },
              { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Tên người dùng" 
              size="large"
              autoComplete="username"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đọc và đồng ý với điều khoản sử dụng')),
              },
            ]}
          >
            <Checkbox 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            >
              Tôi đã đọc và đồng ý với <Link to="/terms">Điều khoản sử dụng</Link> và <Link to="/privacy">Chính sách bảo mật</Link>
            </Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={isLoading}
              disabled={!agreeTerms}
            >
              Đăng ký
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Text>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 