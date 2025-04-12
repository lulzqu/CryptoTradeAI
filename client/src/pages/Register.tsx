import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../slices/authSlice';
import { AppDispatch } from '../store';
import './Register.css';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu không khớp');
      return;
    }

    try {
      await dispatch(register({
        name: values.name,
        email: values.email,
        password: values.password,
      })).unwrap();
      message.success('Đăng ký thành công');
      navigate('/');
    } catch (error: any) {
      message.error(error.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card" title="Đăng ký">
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng ký
            </Button>
          </Form.Item>

          <div className="register-links">
            <a href="/login">Đã có tài khoản? Đăng nhập</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 