import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addPattern, updatePattern, deletePattern } from '../../slices/analysisSlice';

const { Option } = Select;

interface CandlePattern {
  id: string;
  name: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
  reliability: number;
  notes: string;
}

const CandlePatternManager: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPattern, setEditingPattern] = useState<CandlePattern | null>(null);
  const [form] = Form.useForm();
  
  const dispatch = useDispatch<AppDispatch>();
  const { patterns, loading, error } = useSelector((state: RootState) => state.analysis);
  
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);
  
  const handleAddPattern = () => {
    setEditingPattern(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  
  const handleEditPattern = (pattern: CandlePattern) => {
    setEditingPattern(pattern);
    form.setFieldsValue(pattern);
    setIsModalVisible(true);
  };
  
  const handleDeletePattern = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa mẫu hình này?',
      onOk: () => {
        dispatch(deletePattern(id));
        message.success('Đã xóa mẫu hình thành công');
      },
    });
  };
  
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingPattern) {
        dispatch(updatePattern({ ...editingPattern, ...values }));
        message.success('Cập nhật mẫu hình thành công');
      } else {
        dispatch(addPattern({ ...values, id: Date.now().toString() }));
        message.success('Thêm mẫu hình thành công');
      }
      setIsModalVisible(false);
    });
  };
  
  const columns = [
    {
      title: 'Tên mẫu hình',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span style={{ 
          color: type === 'bullish' ? 'green' : type === 'bearish' ? 'red' : 'gray'
        }}>
          {type === 'bullish' ? 'Tăng' : type === 'bearish' ? 'Giảm' : 'Trung lập'}
        </span>
      ),
    },
    {
      title: 'Khung thời gian',
      dataIndex: 'timeframe',
      key: 'timeframe',
    },
    {
      title: 'Độ tin cậy',
      dataIndex: 'reliability',
      key: 'reliability',
      render: (reliability: number) => `${reliability}%`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: CandlePattern) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditPattern(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeletePattern(record.id)}
          />
        </Space>
      ),
    },
  ];
  
  return (
    <Card 
      title="Quản lý mẫu hình nến" 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddPattern}
        >
          Thêm mẫu hình
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={patterns} 
        rowKey="id"
        loading={loading}
      />
      
      <Modal
        title={editingPattern ? 'Chỉnh sửa mẫu hình' : 'Thêm mẫu hình mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên mẫu hình"
            rules={[{ required: true, message: 'Vui lòng nhập tên mẫu hình' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
          >
            <Select>
              <Option value="bullish">Tăng</Option>
              <Option value="bearish">Giảm</Option>
              <Option value="neutral">Trung lập</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="timeframe"
            label="Khung thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn khung thời gian' }]}
          >
            <Select>
              <Option value="1m">1 phút</Option>
              <Option value="5m">5 phút</Option>
              <Option value="15m">15 phút</Option>
              <Option value="1h">1 giờ</Option>
              <Option value="4h">4 giờ</Option>
              <Option value="1d">1 ngày</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="reliability"
            label="Độ tin cậy (%)"
            rules={[
              { required: true, message: 'Vui lòng nhập độ tin cậy' },
              { type: 'number', min: 0, max: 100, message: 'Độ tin cậy phải từ 0-100%' }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CandlePatternManager; 