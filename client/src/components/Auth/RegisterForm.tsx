import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Alert, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined, FacebookOutlined, GlobalOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { register } from '../../store/slices/authSlice';
import './RegisterForm.css';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mô phỏng gọi API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gọi action register từ Redux
      // await dispatch(register(values) as any);
      
      // Redirect to login after successful registration
      navigate('/login', { state: { registered: true } });
    } catch (err: any) {
      setError(err.message || 'Đăng ký không thành công. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form-header">
        <Title level={2}>Đăng ký tài khoản</Title>
        <Text type="secondary">Hãy tạo tài khoản để trải nghiệm đầy đủ tính năng của CryptoTradeAI</Text>
      </div>
      
      {error && (
        <Alert 
          message={error} 
          type="error" 
          showIcon 
          closable 
          className="register-error" 
          onClose={() => setError(null)} 
        />
      )}
      
      <Form
        form={form}
        name="register"
        initialValues={{ experience: 'beginner', country: 'VN' }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        className="register-form"
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Nhập email" />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
        </Form.Item>
        
        <Form.Item
          name="country"
          label="Quốc gia"
          rules={[{ required: true, message: 'Vui lòng chọn quốc gia!' }]}
        >
          <Select
            placeholder="Chọn quốc gia"
            suffixIcon={<GlobalOutlined />}
          >
            <Option value="VN">Việt Nam</Option>
            <Option value="US">Hoa Kỳ</Option>
            <Option value="GB">Vương quốc Anh</Option>
            <Option value="JP">Nhật Bản</Option>
            <Option value="SG">Singapore</Option>
            <Option value="Other">Khác</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="experience"
          label="Kinh nghiệm giao dịch"
          rules={[{ required: true, message: 'Vui lòng chọn kinh nghiệm giao dịch!' }]}
        >
          <Select placeholder="Chọn mức độ kinh nghiệm">
            <Option value="beginner">Người mới bắt đầu</Option>
            <Option value="intermediate">Trung cấp</Option>
            <Option value="advanced">Nâng cao</Option>
            <Option value="professional">Chuyên nghiệp</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
        </Form.Item>
        
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản dịch vụ!')),
            },
          ]}
        >
          <Checkbox>
            Tôi đã đọc và đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và <Link to="/privacy">Chính sách bảo mật</Link>
          </Checkbox>
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="register-button" 
            loading={loading}
            block
          >
            Đăng ký
          </Button>
        </Form.Item>
        
        <div className="login-link">
          <Text>Đã có tài khoản? </Text>
          <Link to="/login">Đăng nhập</Link>
        </div>
        
        <Divider plain>Hoặc đăng ký với</Divider>
        
        <div className="social-signup">
          <Button icon={<GoogleOutlined />} className="social-button google">
            Google
          </Button>
          <Button icon={<FacebookOutlined />} className="social-button facebook">
            Facebook
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm; 