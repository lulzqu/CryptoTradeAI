import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Tag } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Analysis.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Analysis: React.FC = () => {
  const data = [
    { name: '1/1', price: 28000, volume: 1000 },
    { name: '2/1', price: 28500, volume: 1200 },
    { name: '3/1', price: 29000, volume: 1500 },
    { name: '4/1', price: 29500, volume: 1300 },
    { name: '5/1', price: 30000, volume: 1400 },
  ];

  const columns = [
    {
      title: 'Mẫu hình',
      dataIndex: 'pattern',
      key: 'pattern',
    },
    {
      title: 'Độ tin cậy',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (value: number) => (
        <Tag color={value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#f5222d'}>
          {value}%
        </Tag>
      ),
    },
    {
      title: 'Khung thời gian',
      dataIndex: 'timeframe',
      key: 'timeframe',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  const tableData = [
    {
      key: '1',
      pattern: 'Mô hình vai đầu vai',
      confidence: 85,
      timeframe: '1D',
      time: '10:30:45',
    },
    {
      key: '2',
      pattern: 'Mô hình hai đáy',
      confidence: 75,
      timeframe: '4H',
      time: '10:25:30',
    },
    {
      key: '3',
      pattern: 'Mô hình nến doji',
      confidence: 65,
      timeframe: '1H',
      time: '10:20:15',
    },
  ];

  return (
    <div className="analysis">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Select defaultValue="BTC/USDT" style={{ width: '100%' }}>
                  <Option value="BTC/USDT">BTC/USDT</Option>
                  <Option value="ETH/USDT">ETH/USDT</Option>
                  <Option value="BNB/USDT">BNB/USDT</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <RangePicker style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={8}>
                <Button type="primary" block>
                  Phân tích
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Biểu đồ giá">
            <LineChart width={800} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#1890ff"
                name="Giá"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volume"
                stroke="#52c41a"
                name="Khối lượng"
              />
            </LineChart>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Mẫu hình nến">
            <Table columns={columns} dataSource={tableData} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analysis; 