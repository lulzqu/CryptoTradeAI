import React, { useState } from 'react';
import { Table, Card, Typography, Tag, DatePicker, Select, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import './SecurityAuditLog.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const SecurityAuditLog: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const mockData: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-01 10:00:00',
      action: 'Đăng nhập',
      user: 'user1@example.com',
      ip: '192.168.1.1',
      status: 'success',
      details: 'Đăng nhập thành công'
    },
    {
      id: '2',
      timestamp: '2024-01-01 11:00:00',
      action: 'Thay đổi mật khẩu',
      user: 'user2@example.com',
      ip: '192.168.1.2',
      status: 'success',
      details: 'Mật khẩu đã được cập nhật'
    }
  ];

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: (a: AuditLogEntry, b: AuditLogEntry) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action'
    },
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'success' ? 'success' : status === 'failed' ? 'error' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Chi tiết',
      dataIndex: 'details',
      key: 'details'
    }
  ];

  const handleDateChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
    } else {
      setDateRange(['', '']);
    }
  };

  return (
    <Card className="security-audit-log">
      <div className="audit-log-header">
        <Text strong>Nhật ký bảo mật</Text>
        <Space>
          <RangePicker onChange={handleDateChange} />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="success">Thành công</Option>
            <Option value="failed">Thất bại</Option>
            <Option value="warning">Cảnh báo</Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={mockData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
      />
    </Card>
  );
};

export default SecurityAuditLog; 