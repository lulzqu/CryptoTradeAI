import React, { useEffect } from 'react';
import { Card, Form, Input, Switch, Select, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchSettings, updateSettings } from '../slices/settingsSlice';
import './Settings.css';

const { Option } = Select;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);

  const onFinish = async (values: any) => {
    try {
      await dispatch(updateSettings(values)).unwrap();
      message.success('Cập nhật cài đặt thành công');
    } catch (error: any) {
      message.error(error.message || 'Cập nhật cài đặt thất bại');
    }
  };

  return (
    <div className="settings-container">
      <Card title="Cài đặt người dùng">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={settings}
        >
          <Form.Item
            label="Giao diện"
            name="theme"
          >
            <Select>
              <Option value="light">Sáng</Option>
              <Option value="dark">Tối</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngôn ngữ"
            name="language"
          >
            <Select>
              <Option value="vi">Tiếng Việt</Option>
              <Option value="en">English</Option>
            </Select>
          </Form.Item>

          <Card title="Thông báo" className="settings-section">
            <Form.Item
              label="Email"
              name={['notifications', 'email']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Push"
              name={['notifications', 'push']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Âm thanh"
              name={['notifications', 'sound']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <Card title="Giao dịch" className="settings-section">
            <Form.Item
              label="Số tiền mặc định"
              name={['trading', 'defaultAmount']}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Đòn bẩy mặc định"
              name={['trading', 'defaultLeverage']}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Stop Loss (%)"
              name={['trading', 'stopLoss']}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Take Profit (%)"
              name={['trading', 'takeProfit']}
            >
              <Input type="number" />
            </Form.Item>
          </Card>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu cài đặt
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 