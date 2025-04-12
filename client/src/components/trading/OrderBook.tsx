import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Select, Space, Tooltip } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Order {
  price: number;
  amount: number;
  total: number;
  type: 'bid' | 'ask';
}

const OrderBook: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [precision, setPrecision] = useState('0.01');
  const [orders, setOrders] = useState<Order[]>([]);

  // Mô phỏng dữ liệu sổ lệnh
  useEffect(() => {
    const generateOrders = () => {
      const newOrders: Order[] = [];
      let price = 50000;
      
      // Tạo lệnh mua
      for (let i = 0; i < 10; i++) {
        const amount = Math.random() * 2;
        newOrders.push({
          price: price - i * 100,
          amount,
          total: (price - i * 100) * amount,
          type: 'bid',
        });
      }
      
      // Tạo lệnh bán
      for (let i = 0; i < 10; i++) {
        const amount = Math.random() * 2;
        newOrders.push({
          price: price + i * 100,
          amount,
          total: (price + i * 100) * amount,
          type: 'ask',
        });
      }
      
      setOrders(newOrders);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Order) => (
        <Text type={record.type === 'bid' ? 'success' : 'danger'}>
          {price.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount.toFixed(4),
    },
    {
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => total.toLocaleString(),
    },
  ];

  const bidOrders = orders
    .filter(order => order.type === 'bid')
    .sort((a, b) => b.price - a.price);
  
  const askOrders = orders
    .filter(order => order.type === 'ask')
    .sort((a, b) => a.price - b.price);

  return (
    <Card className="order-book">
      <div className="order-book-header">
        <Title level={4}>Sổ lệnh</Title>
        <Space>
          <Select
            value={precision}
            onChange={setPrecision}
            style={{ width: 100 }}
          >
            <Option value="0.0001">0.0001</Option>
            <Option value="0.001">0.001</Option>
            <Option value="0.01">0.01</Option>
            <Option value="0.1">0.1</Option>
            <Option value="1">1</Option>
          </Select>
        </Space>
      </div>

      <div className="order-book-content">
        <div className="order-book-section">
          <div className="order-book-title">
            <Text type="success">Lệnh mua</Text>
          </div>
          <Table
            columns={columns}
            dataSource={bidOrders}
            rowKey="price"
            pagination={false}
            size="small"
            loading={loading}
            scroll={{ y: 300 }}
          />
        </div>

        <div className="order-book-section">
          <div className="order-book-title">
            <Text type="danger">Lệnh bán</Text>
          </div>
          <Table
            columns={columns}
            dataSource={askOrders}
            rowKey="price"
            pagination={false}
            size="small"
            loading={loading}
            scroll={{ y: 300 }}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrderBook; 