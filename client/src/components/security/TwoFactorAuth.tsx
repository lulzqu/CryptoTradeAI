import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Switch, message, QRCode } from 'antd';
import { LockOutlined, QrcodeOutlined } from '@ant-design/icons';
import './TwoFactorAuth.css';

const { Text } = Typography;

interface TwoFactorAuthProps {
  onEnable?: (secret: string) => void;
  onDisable?: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onEnable, onDisable }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [secret, setSecret] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleEnable = async (values: { code: string }) => {
    setLoading(true);
    try {
      // TODO: Xác thực mã OTP
      console.log('Enable 2FA with code:', values.code);
      message.success('Đã bật xác thực hai yếu tố');
      setEnabled(true);
      onEnable?.(secret);
    } catch (error) {
      message.error('Mã xác thực không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      // TODO: Vô hiệu hóa 2FA
      console.log('Disable 2FA');
      message.success('Đã tắt xác thực hai yếu tố');
      setEnabled(false);
      onDisable?.();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = () => {
    // TODO: Tạo secret key từ server
    const newSecret = 'JBSWY3DPEHPK3PXP';
    setSecret(newSecret);
    setShowQR(true);
  };

  return (
    <Card className="two-factor-auth">
      <div className="two-factor-header">
        <Text strong>Xác thực hai yếu tố</Text>
        <Switch
          checked={enabled}
          onChange={(checked) => {
            if (checked) {
              generateSecret();
            } else {
              handleDisable();
            }
          }}
        />
      </div>

      {enabled && !showQR && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEnable}
          className="two-factor-form"
        >
          <Form.Item
            name="code"
            label="Mã xác thực"
            rules={[
              { required: true, message: 'Vui lòng nhập mã xác thực' },
              { len: 6, message: 'Mã xác thực phải có 6 chữ số' }
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              placeholder="Nhập mã từ ứng dụng xác thực"
              maxLength={6}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      )}

      {showQR && (
        <div className="two-factor-qr">
          <QRCode value={`otpauth://totp/YourApp:user@example.com?secret=${secret}&issuer=YourApp`} />
          <Text type="secondary" className="qr-instructions">
            Quét mã QR bằng ứng dụng xác thực của bạn
          </Text>
          <Button
            type="primary"
            icon={<QrcodeOutlined />}
            onClick={() => setShowQR(false)}
          >
            Tiếp tục
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TwoFactorAuth; 