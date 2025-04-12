import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../slices/authSlice';
import './Login.css';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success('Đăng nhập thành công');
      navigate('/');
    } catch (error: any) {
      message.error(error.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <h1>CryptoTradeAI</h1>
        <p>Nền tảng giao dịch tiền điện tử thông minh</p>
      </div>
      <Card className="login-card">
        <h2 className="login-title">Đăng nhập</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="login-links">
            <Link to="/register">Đăng ký tài khoản</Link>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 