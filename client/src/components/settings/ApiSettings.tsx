import React, { useState } from 'react';
import { 
  Card, Typography, Table, Button, Space, Tag, Modal, Form, 
  Input, Select, Alert, Popconfirm, Tooltip, Divider, Row, Col, Switch 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, CopyOutlined, EyeOutlined, 
  EyeInvisibleOutlined, LockOutlined, ApiOutlined, ExclamationCircleOutlined 
} from '@ant-design/icons';
import './ApiSettings.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  exchange: string;
  created: string;
  permissions: string[];
  ipWhitelist: string[];
  status: 'active' | 'inactive';
}

const ApiSettings: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Binance Main API',
      key: '1a2b3c4d5e6f7g8h9i0j',
      secret: '******************************',
      exchange: 'binance',
      created: '2024-01-15T10:30:00',
      permissions: ['read', 'trade'],
      ipWhitelist: ['192.168.1.1'],
      status: 'active',
    },
    {
      id: '2',
      name: 'Binance Futures',
      key: '9i8h7g6f5e4d3c2b1a0',
      secret: '******************************',
      exchange: 'binance_futures',
      created: '2024-02-10T14:45:00',
      permissions: ['read', 'trade', 'withdraw'],
      ipWhitelist: ['192.168.1.1', '10.0.0.1'],
      status: 'active',
    },
    {
      id: '3',
      name: 'OKX API',
      key: 'j0i9h8g7f6e5d4c3b2a1',
      secret: '******************************',
      exchange: 'okx',
      created: '2024-03-05T08:15:00',
      permissions: ['read'],
      ipWhitelist: [],
      status: 'inactive',
    },
  ]);

  const showCreateModal = () => {
    form.resetFields();
    setSelectedKey(null);
    setVisible(true);
  };

  const showEditModal = (record: ApiKey) => {
    setSelectedKey(record);
    form.setFieldsValue({
      name: record.name,
      exchange: record.exchange,
      apiKey: record.key,
      apiSecret: record.secret,
      permissions: record.permissions,
      ipWhitelist: record.ipWhitelist.join(', '),
      status: record.status === 'active',
    });
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleToggleSecret = (id: string) => {
    setShowSecret({
      ...showSecret,
      [id]: !showSecret[id],
    });
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    
    const ipWhitelist = values.ipWhitelist
      ? values.ipWhitelist.split(',').map((ip: string) => ip.trim()).filter(Boolean)
      : [];
    
    // Create or update API key
    setTimeout(() => {
      if (selectedKey) {
        // Update existing key
        setApiKeys(
          apiKeys.map(key => 
            key.id === selectedKey.id
              ? {
                  ...key,
                  name: values.name,
                  exchange: values.exchange,
                  key: values.apiKey,
                  secret: values.apiSecret,
                  permissions: values.permissions,
                  ipWhitelist,
                  status: values.status ? 'active' : 'inactive',
                }
              : key
          )
        );
      } else {
        // Create new key
        const newKey: ApiKey = {
          id: String(apiKeys.length + 1),
          name: values.name,
          key: values.apiKey,
          secret: values.apiSecret,
          exchange: values.exchange,
          created: new Date().toISOString(),
          permissions: values.permissions,
          ipWhitelist,
          status: values.status ? 'active' : 'inactive',
        };
        setApiKeys([...apiKeys, newKey]);
      }
      
      setLoading(false);
      setVisible(false);
    }, 1000);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Sàn giao dịch',
      dataIndex: 'exchange',
      key: 'exchange',
      render: (exchange: string) => {
        const exchangeMap: Record<string, { name: string; color: string }> = {
          binance: { name: 'Binance', color: 'gold' },
          binance_futures: { name: 'Binance Futures', color: 'gold' },
          okx: { name: 'OKX', color: 'green' },
          bybit: { name: 'Bybit', color: 'blue' },
          kucoin: { name: 'Kucoin', color: 'cyan' },
        };
        
        const config = exchangeMap[exchange] || { name: exchange, color: 'default' };
        
        return <Tag color={config.color}>{config.name}</Tag>;
      },
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      key: 'key',
      render: (text: string, record: ApiKey) => (
        <Space>
          <Text copyable>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'API Secret',
      dataIndex: 'secret',
      key: 'secret',
      render: (text: string, record: ApiKey) => (
        <Space>
          <Text>{showSecret[record.id] ? record.secret : '••••••••••••••••••••••••••'}</Text>
          <Button 
            type="text" 
            icon={showSecret[record.id] ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
            onClick={() => handleToggleSecret(record.id)}
          />
        </Space>
      ),
    },
    {
      title: 'Quyền',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <>
          {permissions.includes('read') && <Tag color="blue">Đọc</Tag>}
          {permissions.includes('trade') && <Tag color="green">Giao dịch</Tag>}
          {permissions.includes('withdraw') && <Tag color="red">Rút tiền</Tag>}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: ApiKey) => (
        <Space size="small">
          <Button type="text" onClick={() => showEditModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa API key này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: ApiKey) => (
    <div className="api-key-details">
      <Row gutter={16}>
        <Col span={12}>
          <Paragraph>
            <Text strong>Thời gian tạo:</Text> {new Date(record.created).toLocaleString()}
          </Paragraph>
          <Paragraph>
            <Text strong>IP được phép:</Text> {record.ipWhitelist.length > 0 ? record.ipWhitelist.join(', ') : 'Tất cả'}
          </Paragraph>
        </Col>
        <Col span={12}>
          <Alert
            message="Lưu ý bảo mật"
            description="Không chia sẻ API key và secret với bất kỳ ai. Giới hạn quyền truy cập và sử dụng IP whitelist khi có thể."
            type="warning"
            showIcon
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="api-settings">
      <Card className="api-settings-card">
        <div className="api-settings-header">
          <Title level={4}>Cài đặt API</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
            Thêm API Key
          </Button>
        </div>

        <Paragraph className="api-settings-description">
          Quản lý các API key kết nối với các sàn giao dịch. Đảm bảo chỉ cấp quyền cần thiết và sử dụng IP whitelist khi có thể.
        </Paragraph>

        <Table 
          dataSource={apiKeys} 
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
        />

        <Modal
          title={selectedKey ? 'Cập nhật API Key' : 'Thêm API Key mới'}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              permissions: ['read'],
              status: true,
            }}
          >
            <Form.Item
              name="name"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input prefix={<ApiOutlined />} placeholder="VD: Binance Main Account" />
            </Form.Item>

            <Form.Item
              name="exchange"
              label="Sàn giao dịch"
              rules={[{ required: true, message: 'Vui lòng chọn sàn giao dịch' }]}
            >
              <Select placeholder="Chọn sàn giao dịch">
                <Option value="binance">Binance</Option>
                <Option value="binance_futures">Binance Futures</Option>
                <Option value="okx">OKX</Option>
                <Option value="bybit">Bybit</Option>
                <Option value="kucoin">Kucoin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="apiKey"
              label="API Key"
              rules={[{ required: true, message: 'Vui lòng nhập API Key' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Nhập API Key của bạn" 
                visibilityToggle={{ visible: false }}
              />
            </Form.Item>

            <Form.Item
              name="apiSecret"
              label="API Secret"
              rules={[{ required: true, message: 'Vui lòng nhập API Secret' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Nhập API Secret của bạn" 
              />
            </Form.Item>

            <Form.Item
              name="permissions"
              label="Quyền"
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một quyền' }]}
            >
              <Select mode="multiple" placeholder="Chọn quyền">
                <Option value="read">Đọc (Xem thông tin tài khoản, số dư, lịch sử)</Option>
                <Option value="trade">Giao dịch (Đặt lệnh, hủy lệnh)</Option>
                <Option value="withdraw">
                  <Tooltip title="Chỉ cấp quyền này khi thực sự cần thiết">
                    <span>
                      Rút tiền <ExclamationCircleOutlined style={{ color: 'red' }} />
                    </span>
                  </Tooltip>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="ipWhitelist"
              label="IP Whitelist (tùy chọn)"
              tooltip="Nhập danh sách các địa chỉ IP được phép, cách nhau bằng dấu phẩy. Để trống nếu cho phép tất cả IP."
            >
              <Input placeholder="VD: 192.168.1.1, 10.0.0.1" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Vô hiệu" />
            </Form.Item>

            <Divider />

            <Alert
              message="Lưu ý bảo mật"
              description={
                <ul>
                  <li>Không bao giờ chia sẻ API key và secret của bạn.</li>
                  <li>Chỉ cấp quyền mà ứng dụng thực sự cần.</li>
                  <li>Hãy sử dụng IP whitelist khi có thể.</li>
                  <li>Kiểm tra hoạt động của API key thường xuyên.</li>
                </ul>
              }
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {selectedKey ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button onClick={() => setVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ApiSettings; 