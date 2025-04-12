import React, { useState } from 'react';
import { Table, Card, Typography, Tag, Button, Space, Input, Select, Modal, Form } from 'antd';
import { 
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import './UserManagement.css';

const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-01 09:00:00'
    }
  ];

  const handleAddUser = () => {
    setIsModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      // TODO: Delete user
      console.log('Delete user:', userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setLoading(true);
    try {
      // TODO: Toggle user status
      console.log('Toggle user status:', userId, currentStatus);
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // TODO: Save user
      console.log('Save user:', values);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: User) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Lần đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Sửa
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Xóa
          </Button>
          <Button
            type="text"
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record.id, record.status)}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở khóa'}
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Card className="user-management">
      <div className="user-header">
        <Text strong>Quản lý người dùng</Text>
        <Space>
          <Search
            placeholder="Tìm kiếm người dùng"
            allowClear
            style={{ width: 200 }}
          />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">Tất cả</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddUser}
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={mockUsers}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
      />

      <Modal
        title="Thêm/Sửa người dùng"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="admin">Quản trị viên</Option>
              <Option value="user">Người dùng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement; 