import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Table, 
  Tag, 
  Button, 
  Tabs, 
  Typography, 
  Space, 
  Statistic, 
  Row, 
  Col,
  Dropdown,
  Modal,
  Form,
  Input,
  Select,
  Switch
} from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  BellOutlined, 
  LockOutlined,
  DatabaseOutlined,
  AreaChartOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  PlusOutlined
} from '@ant-design/icons';
import '../styles/Admin.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const users = [
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', created: '2023-01-01', lastLogin: '2023-06-15' },
    { id: 2, username: 'trader1', email: 'trader1@example.com', role: 'trader', status: 'active', created: '2023-02-10', lastLogin: '2023-06-14' },
    { id: 3, username: 'analyst', email: 'analyst@example.com', role: 'analyst', status: 'inactive', created: '2023-03-05', lastLogin: '2023-05-20' },
    { id: 4, username: 'guest', email: 'guest@example.com', role: 'guest', status: 'active', created: '2023-04-15', lastLogin: '2023-06-10' },
    { id: 5, username: 'developer', email: 'dev@example.com', role: 'developer', status: 'active', created: '2023-01-20', lastLogin: '2023-06-12' },
  ];

  const systemLogs = [
    { id: 1, type: 'error', message: 'Database connection failed', timestamp: '2023-06-15 08:30:45', source: 'api-server' },
    { id: 2, type: 'warning', message: 'High CPU usage detected', timestamp: '2023-06-15 09:15:22', source: 'system-monitor' },
    { id: 3, type: 'info', message: 'Daily backup completed', timestamp: '2023-06-15 01:00:00', source: 'backup-service' },
    { id: 4, type: 'error', message: 'API rate limit exceeded', timestamp: '2023-06-14 17:45:33', source: 'exchange-api' },
    { id: 5, type: 'info', message: 'System update available', timestamp: '2023-06-14 12:10:05', source: 'update-service' },
  ];

  const systemStats = {
    totalUsers: 523,
    activeUsers: 312,
    dailyActiveUsers: 87,
    totalStrategies: 245,
    activeTrades: 156,
    systemUptime: '99.98%',
    serverLoad: '42%',
    memoryUsage: '3.2 GB / 8 GB',
    diskUsage: '127 GB / 500 GB'
  };

  const features = [
    { id: 1, name: 'Real-time Trading', status: true, description: 'Enable real-time trading functionality' },
    { id: 2, name: 'Social Trading', status: false, description: 'Allow users to copy trades from other traders' },
    { id: 3, name: 'Risk Analysis', status: true, description: 'Advanced risk analysis tools' },
    { id: 4, name: 'Mobile App Access', status: true, description: 'Access via mobile applications' },
    { id: 5, name: 'AI Predictions', status: false, description: 'AI-based price prediction features' },
  ];

  const handleUserEdit = (user: any) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setUserModalVisible(true);
  };

  const handleUserDelete = (user: any) => {
    setSelectedUser(user);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log(`Deleting user ${selectedUser?.username}`);
    setConfirmDeleteVisible(false);
  };

  const handleFormSubmit = (values: any) => {
    console.log('Form submitted:', values);
    setUserModalVisible(false);
  };

  const handleFeatureToggle = (featureId: number, newStatus: boolean) => {
    console.log(`Toggle feature ${featureId} to ${newStatus}`);
    // Update feature status logic here
  };

  const userColumns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        if (role === 'admin') color = 'red';
        if (role === 'trader') color = 'green';
        if (role === 'analyst') color = 'purple';
        if (role === 'guest') color = 'gray';
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown menu={{ 
          items: [
            { key: '1', label: 'Edit', onClick: () => handleUserEdit(record) },
            { key: '2', label: 'Delete', onClick: () => handleUserDelete(record) },
            { key: '3', label: 'Reset Password' },
            { key: '4', label: 'View Activity' }
          ] 
        }} trigger={['click']}>
          <Button icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const logColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'blue';
        if (type === 'error') color = 'red';
        if (type === 'warning') color = 'orange';
        if (type === 'info') color = 'blue';
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
  ];

  const featureColumns = [
    {
      title: 'Feature',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: any) => (
        <Switch 
          checked={status} 
          onChange={(checked) => handleFeatureToggle(record.id, checked)}
        />
      ),
    },
  ];

  return (
    <Layout className="admin-layout">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="admin-tabs"
        tabPosition="left"
        type="card"
      >
        <TabPane 
          tab={<span><UserOutlined />Quản lý người dùng</span>} 
          key="users"
        >
          <div className="admin-content">
            <div className="admin-header">
              <Title level={3}>Quản lý người dùng</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedUser(null);
                  form.resetFields();
                  setUserModalVisible(true);
                }}
              >
                Thêm người dùng
              </Button>
            </div>
            <Table 
              columns={userColumns} 
              dataSource={users} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </div>
        </TabPane>
        <TabPane 
          tab={<span><DatabaseOutlined />Giám sát hệ thống</span>} 
          key="system"
        >
          <div className="admin-content">
            <Title level={3}>Giám sát hệ thống</Title>
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Tổng người dùng" value={systemStats.totalUsers} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Người dùng hoạt động" value={systemStats.activeUsers} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Uptime" value={systemStats.systemUptime} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Tải CPU" value={systemStats.serverLoad} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Sử dụng bộ nhớ" value={systemStats.memoryUsage} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Sử dụng ổ đĩa" value={systemStats.diskUsage} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Giao dịch hoạt động" value={systemStats.activeTrades} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card>
                  <Statistic title="Chiến lược" value={systemStats.totalStrategies} />
                </Card>
              </Col>
            </Row>
            <Title level={4} style={{ marginTop: 20 }}>Nhật ký hệ thống</Title>
            <Table 
              columns={logColumns} 
              dataSource={systemLogs}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </div>
        </TabPane>
        <TabPane 
          tab={<span><SettingOutlined />Cấu hình hệ thống</span>} 
          key="settings"
        >
          <div className="admin-content">
            <Title level={3}>Cấu hình hệ thống</Title>
            <Card title="Cài đặt chung" style={{ marginBottom: 16 }}>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tên ứng dụng" name="appName" initialValue="CryptoTradeAI">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Email liên hệ" name="contactEmail" initialValue="support@cryptotradeai.com">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Múi giờ mặc định" name="timezone" initialValue="Asia/Ho_Chi_Minh">
                      <Select>
                        <Select.Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</Select.Option>
                        <Select.Option value="UTC">UTC</Select.Option>
                        <Select.Option value="America/New_York">America/New_York</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Đơn vị tiền tệ mặc định" name="currency" initialValue="USD">
                      <Select>
                        <Select.Option value="USD">USD</Select.Option>
                        <Select.Option value="EUR">EUR</Select.Option>
                        <Select.Option value="VND">VND</Select.Option>
                        <Select.Option value="BTC">BTC</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary">Lưu cài đặt</Button>
              </Form>
            </Card>
            <Card title="Quản lý tính năng">
              <Table 
                columns={featureColumns} 
                dataSource={features}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </div>
        </TabPane>
        <TabPane 
          tab={<span><BellOutlined />Thông báo hệ thống</span>} 
          key="announcements"
        >
          <div className="admin-content">
            <div className="admin-header">
              <Title level={3}>Thông báo hệ thống</Title>
              <Button type="primary" icon={<PlusOutlined />}>Thêm thông báo mới</Button>
            </div>
            <Card>
              <Form layout="vertical">
                <Form.Item label="Tiêu đề" name="title">
                  <Input placeholder="Nhập tiêu đề thông báo" />
                </Form.Item>
                <Form.Item label="Nội dung" name="content">
                  <Input.TextArea rows={6} placeholder="Nhập nội dung thông báo" />
                </Form.Item>
                <Form.Item label="Đối tượng nhận" name="audience">
                  <Select mode="multiple" placeholder="Chọn đối tượng nhận">
                    <Select.Option value="all">Tất cả người dùng</Select.Option>
                    <Select.Option value="admin">Quản trị viên</Select.Option>
                    <Select.Option value="trader">Traders</Select.Option>
                    <Select.Option value="premium">Người dùng Premium</Select.Option>
                  </Select>
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Ngày bắt đầu hiển thị" name="startDate">
                      <Input type="date" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Ngày kết thúc hiển thị" name="endDate">
                      <Input type="date" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary">Gửi thông báo</Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane 
          tab={<span><LockOutlined />Bảo mật</span>} 
          key="security"
        >
          <div className="admin-content">
            <Title level={3}>Cài đặt bảo mật</Title>
            <Card title="Chính sách mật khẩu" style={{ marginBottom: 16 }}>
              <Form layout="vertical">
                <Form.Item label="Độ dài tối thiểu của mật khẩu" name="minLength" initialValue={8}>
                  <Select>
                    <Select.Option value={6}>6 ký tự</Select.Option>
                    <Select.Option value={8}>8 ký tự</Select.Option>
                    <Select.Option value={10}>10 ký tự</Select.Option>
                    <Select.Option value={12}>12 ký tự</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="requireUppercase" valuePropName="checked" initialValue={true}>
                  <Switch /> Yêu cầu ít nhất một ký tự viết hoa
                </Form.Item>
                <Form.Item name="requireNumbers" valuePropName="checked" initialValue={true}>
                  <Switch /> Yêu cầu ít nhất một số
                </Form.Item>
                <Form.Item name="requireSpecial" valuePropName="checked" initialValue={true}>
                  <Switch /> Yêu cầu ít nhất một ký tự đặc biệt
                </Form.Item>
                <Form.Item name="passwordExpiry" label="Thời gian hết hạn mật khẩu" initialValue={90}>
                  <Select>
                    <Select.Option value={30}>30 ngày</Select.Option>
                    <Select.Option value={60}>60 ngày</Select.Option>
                    <Select.Option value={90}>90 ngày</Select.Option>
                    <Select.Option value={0}>Không hết hạn</Select.Option>
                  </Select>
                </Form.Item>
                <Button type="primary">Lưu chính sách</Button>
              </Form>
            </Card>
            <Card title="Xác thực hai yếu tố">
              <Form.Item name="enforce2FA" valuePropName="checked" initialValue={false}>
                <Switch /> Bắt buộc xác thực hai yếu tố cho tất cả người dùng
              </Form.Item>
              <Form.Item name="enforce2FAAdmin" valuePropName="checked" initialValue={true}>
                <Switch /> Bắt buộc xác thực hai yếu tố cho quản trị viên
              </Form.Item>
              <Button type="primary">Lưu cài đặt</Button>
            </Card>
          </div>
        </TabPane>
        <TabPane 
          tab={<span><ToolOutlined />Công cụ hệ thống</span>} 
          key="tools"
        >
          <div className="admin-content">
            <Title level={3}>Công cụ hệ thống</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card title="Sao lưu và khôi phục">
                <Space>
                  <Button type="primary">Tạo sao lưu mới</Button>
                  <Button>Khôi phục từ sao lưu</Button>
                </Space>
                <Table 
                  style={{ marginTop: 16 }}
                  columns={[
                    { title: 'Tên file', dataIndex: 'filename', key: 'filename' },
                    { title: 'Kích thước', dataIndex: 'size', key: 'size' },
                    { title: 'Ngày tạo', dataIndex: 'created', key: 'created' },
                    { 
                      title: 'Hành động', 
                      key: 'actions',
                      render: () => (
                        <Space>
                          <Button size="small">Tải về</Button>
                          <Button size="small" danger>Xóa</Button>
                        </Space>
                      )
                    }
                  ]} 
                  dataSource={[
                    { key: '1', filename: 'backup-2023-06-15.zip', size: '42 MB', created: '2023-06-15 01:00:00' },
                    { key: '2', filename: 'backup-2023-06-14.zip', size: '41 MB', created: '2023-06-14 01:00:00' },
                    { key: '3', filename: 'backup-2023-06-13.zip', size: '40 MB', created: '2023-06-13 01:00:00' },
                  ]}
                  pagination={false}
                />
              </Card>
              <Card title="Quản lý bộ nhớ cache">
                <Space>
                  <Button type="primary" danger>Xóa tất cả cache</Button>
                  <Button>Xóa cache API</Button>
                  <Button>Xóa cache dữ liệu thị trường</Button>
                </Space>
              </Card>
              <Card title="Quản lý phiên bản">
                <Statistic title="Phiên bản hiện tại" value="v1.5.3" />
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary">Kiểm tra cập nhật</Button>
                  <Button>Xem lịch sử phiên bản</Button>
                </Space>
              </Card>
            </Space>
          </div>
        </TabPane>
      </Tabs>
      
      {/* User Edit/Create Modal */}
      <Modal
        title={selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        visible={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item name="username" label="Tên người dùng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          {!selectedUser && (
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="trader">Trader</Select.Option>
              <Select.Option value="analyst">Analyst</Select.Option>
              <Select.Option value="guest">Guest</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedUser ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button onClick={() => setUserModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Confirm Delete Modal */}
      <Modal
        title="Xác nhận xóa"
        visible={confirmDeleteVisible}
        onCancel={() => setConfirmDeleteVisible(false)}
        onOk={confirmDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.username}</strong>?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </Layout>
  );
};

export default Admin; 