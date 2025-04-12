import React, { useEffect } from 'react';
import { Form, Input, Select, Button, InputNumber, Switch, Radio, Space, Divider } from 'antd';
import { Alert } from '../../services/AlertService';
import useAlert from '../../hooks/useAlert';

const { Option } = Select;
const { TextArea } = Input;

interface AlertFormProps {
  initialValues?: Alert;
  onSuccess: () => void;
  onCancel: () => void;
}

const AlertForm: React.FC<AlertFormProps> = ({ initialValues, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const { addAlert, editAlert, creating, updating, error } = useAlert();
  
  const isEditing = !!initialValues;
  
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        // Đảm bảo các mảng và object được copy đúng
        notificationChannels: [...initialValues.notificationChannels],
        indicatorParams: initialValues.indicatorParams ? { ...initialValues.indicatorParams } : undefined
      });
    }
  }, [initialValues, form]);
  
  const handleSubmit = async (values: any) => {
    try {
      if (isEditing && initialValues?._id) {
        await editAlert(initialValues._id, values);
      } else {
        await addAlert(values);
      }
      onSuccess();
      form.resetFields();
    } catch (err) {
      console.error('Lỗi khi lưu cảnh báo:', err);
    }
  };
  
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 'active',
        priority: 'medium',
        frequency: 'once',
        notificationChannels: ['app'],
        type: 'price',
        condition: 'above'
      }}
    >
      <Form.Item
        name="name"
        label="Tên cảnh báo"
        rules={[{ required: true, message: 'Vui lòng nhập tên cảnh báo' }]}
      >
        <Input placeholder="Nhập tên cảnh báo" />
      </Form.Item>
      
      <Space style={{ display: 'flex', width: '100%' }} align="start">
        <Form.Item
          name="type"
          label="Loại cảnh báo"
          rules={[{ required: true, message: 'Vui lòng chọn loại cảnh báo' }]}
          style={{ width: '50%' }}
        >
          <Select placeholder="Chọn loại cảnh báo">
            <Option value="price">Giá</Option>
            <Option value="indicator">Chỉ báo</Option>
            <Option value="risk">Rủi ro</Option>
            <Option value="system">Hệ thống</Option>
            <Option value="custom">Tùy chỉnh</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="symbol"
          label="Mã giao dịch"
          rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch' }]}
          style={{ width: '50%' }}
        >
          <Input placeholder="Ví dụ: BTC/USDT" />
        </Form.Item>
      </Space>
      
      <Space style={{ display: 'flex', width: '100%' }} align="start">
        <Form.Item
          name="condition"
          label="Điều kiện"
          rules={[{ required: true, message: 'Vui lòng chọn điều kiện' }]}
          style={{ width: '50%' }}
        >
          <Select placeholder="Chọn điều kiện">
            <Option value="above">Lớn hơn</Option>
            <Option value="below">Nhỏ hơn</Option>
            <Option value="equals">Bằng</Option>
            <Option value="crosses_above">Vượt lên trên</Option>
            <Option value="crosses_below">Vượt xuống dưới</Option>
            <Option value="custom">Tùy chỉnh</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="value"
          label="Giá trị"
          rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
          style={{ width: '50%' }}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            placeholder="Nhập giá trị" 
            precision={2}
          />
        </Form.Item>
      </Space>
      
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
      >
        {({ getFieldValue }) => (
          getFieldValue('type') === 'indicator' && (
            <>
              <Space style={{ display: 'flex', width: '100%' }} align="start">
                <Form.Item
                  name="indicator"
                  label="Chỉ báo"
                  rules={[{ required: true, message: 'Vui lòng chọn chỉ báo' }]}
                  style={{ width: '100%' }}
                >
                  <Select placeholder="Chọn chỉ báo">
                    <Option value="RSI">RSI</Option>
                    <Option value="MACD">MACD</Option>
                    <Option value="MA">MA</Option>
                    <Option value="EMA">EMA</Option>
                    <Option value="Bollinger Bands">Bollinger Bands</Option>
                  </Select>
                </Form.Item>
              </Space>
              
              <Divider orientation="left" plain>Tham số chỉ báo</Divider>
              
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.indicator !== currentValues.indicator}
              >
                {({ getFieldValue }) => {
                  const indicator = getFieldValue('indicator');
                  if (indicator === 'RSI') {
                    return (
                      <Form.Item
                        name={['indicatorParams', 'period']}
                        label="Chu kỳ"
                        initialValue={14}
                      >
                        <InputNumber min={1} max={100} />
                      </Form.Item>
                    );
                  }
                  
                  if (indicator === 'MACD') {
                    return (
                      <Space style={{ display: 'flex', width: '100%' }} align="start">
                        <Form.Item
                          name={['indicatorParams', 'fast']}
                          label="Chu kỳ nhanh"
                          initialValue={12}
                          style={{ width: '33%' }}
                        >
                          <InputNumber min={1} max={100} />
                        </Form.Item>
                        
                        <Form.Item
                          name={['indicatorParams', 'slow']}
                          label="Chu kỳ chậm"
                          initialValue={26}
                          style={{ width: '33%' }}
                        >
                          <InputNumber min={1} max={100} />
                        </Form.Item>
                        
                        <Form.Item
                          name={['indicatorParams', 'signal']}
                          label="Tín hiệu"
                          initialValue={9}
                          style={{ width: '33%' }}
                        >
                          <InputNumber min={1} max={100} />
                        </Form.Item>
                      </Space>
                    );
                  }
                  
                  return null;
                }}
              </Form.Item>
            </>
          )
        )}
      </Form.Item>
      
      <Form.Item
        name="message"
        label="Nội dung thông báo"
        rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
      >
        <TextArea 
          rows={3} 
          placeholder="Nhập nội dung thông báo khi cảnh báo được kích hoạt" 
        />
      </Form.Item>
      
      <Space style={{ display: 'flex', width: '100%' }} align="start">
        <Form.Item
          name="priority"
          label="Độ ưu tiên"
          style={{ width: '50%' }}
        >
          <Select>
            <Option value="low">Thấp</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="high">Cao</Option>
            <Option value="critical">Nghiêm trọng</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="status"
          label="Trạng thái"
          style={{ width: '50%' }}
        >
          <Select>
            <Option value="active">Hoạt động</Option>
            <Option value="disabled">Tắt</Option>
          </Select>
        </Form.Item>
      </Space>
      
      <Form.Item
        name="frequency"
        label="Tần suất"
      >
        <Radio.Group>
          <Radio value="once">Một lần</Radio>
          <Radio value="always">Liên tục</Radio>
        </Radio.Group>
      </Form.Item>
      
      <Form.Item
        name="notificationChannels"
        label="Kênh thông báo"
      >
        <Select mode="multiple" placeholder="Chọn kênh thông báo">
          <Option value="app">Ứng dụng</Option>
          <Option value="email">Email</Option>
          <Option value="sms">SMS</Option>
          <Option value="webhook">Webhook</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => {
          const prevChannels = prevValues.notificationChannels || [];
          const currentChannels = currentValues.notificationChannels || [];
          return (
            prevChannels.includes('webhook') !== currentChannels.includes('webhook')
          );
        }}
      >
        {({ getFieldValue }) => {
          const channels = getFieldValue('notificationChannels') || [];
          return channels.includes('webhook') ? (
            <Form.Item
              name="webhookUrl"
              label="URL Webhook"
              rules={[
                { required: true, message: 'Vui lòng nhập URL webhook' },
                { type: 'url', message: 'URL không hợp lệ' }
              ]}
            >
              <Input placeholder="https://" />
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
      
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={creating || updating}>
            {isEditing ? 'Cập nhật' : 'Tạo cảnh báo'}
          </Button>
          <Button onClick={handleCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AlertForm; 