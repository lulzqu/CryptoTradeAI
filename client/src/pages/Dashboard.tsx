import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Tabs, Button, Spin, Typography, Alert } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  LineChartOutlined,
  WalletOutlined,
  PieChartOutlined,
  RiseOutlined,
  SettingOutlined,
  BellOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import './Dashboard.css';
import { fetchPortfolioData } from '../store/slices/portfolioSlice';
import { fetchMarketData } from '../store/slices/marketSlice';
import { RootState } from '../store';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface AssetDistribution {
  name: string;
  value: number;
  color: string;
}

interface PerformanceData {
  date: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [performanceTimeframe, setPerformanceTimeframe] = useState('7d');
  
  const { portfolios, loading: portfolioLoading } = useSelector((state: RootState) => state.portfolio);
  const { marketData, loading: marketLoading } = useSelector((state: RootState) => state.market);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(fetchPortfolioData() as any),
        dispatch(fetchMarketData() as any)
      ]);
      setLoading(false);
    };
    
    fetchData();
  }, [dispatch]);

  // Mô phỏng dữ liệu phân phối tài sản
  const assetDistribution: AssetDistribution[] = [
    { name: 'BTC', value: 45, color: '#F7931A' },
    { name: 'ETH', value: 30, color: '#627EEA' },
    { name: 'USDT', value: 15, color: '#26A17B' },
    { name: 'BNB', value: 10, color: '#F3BA2F' },
  ];

  // Mô phỏng dữ liệu hiệu suất danh mục
  const generatePerformanceData = (days: number): PerformanceData[] => {
    const data: PerformanceData[] = [];
    const baseValue = 10000;
    let currentValue = baseValue;
    
    for (let i = days; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const randomChange = Math.random() * 0.04 - 0.01; // Dao động từ -1% đến +3%
      currentValue = currentValue * (1 + randomChange);
      data.push({
        date,
        value: parseFloat(currentValue.toFixed(2)),
      });
    }
    
    return data;
  };

  const getPerformanceData = () => {
    const days = performanceTimeframe === '7d' ? 7 : performanceTimeframe === '30d' ? 30 : 90;
    return generatePerformanceData(days);
  };

  const performanceData = getPerformanceData();
  
  const lineConfig = {
    data: performanceData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    point: {
      size: 3,
      shape: 'circle',
    },
    color: '#1890ff',
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Giá trị', value: `$${datum.value.toLocaleString()}` };
      },
    },
  };

  const pieConfig = {
    data: assetDistribution,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.5,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{percentage}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'right',
    },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '16px',
        },
        content: 'Tài sản',
      },
    },
  };

  const marketColumns = [
    {
      title: 'Cặp tiền',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Giá hiện tại',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Thay đổi 24h',
      dataIndex: 'change',
      key: 'change',
      render: (value: number) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      ),
      sorter: (a: any, b: any) => a.change - b.change,
    },
    {
      title: 'Khối lượng 24h',
      dataIndex: 'volume',
      key: 'volume',
      sorter: (a: any, b: any) => {
        const volA = parseFloat(a.volume.replace(/[^\d.-]/g, ''));
        const volB = parseFloat(b.volume.replace(/[^\d.-]/g, ''));
        return volA - volB;
      },
    },
  ];

  const marketOverviewData = [
    {
      key: '1',
      pair: 'BTC/USDT',
      price: '$28,500',
      change: 2.5,
      volume: '$1.2B',
    },
    {
      key: '2',
      pair: 'ETH/USDT',
      price: '$1,800',
      change: -1.2,
      volume: '$800M',
    },
    {
      key: '3',
      pair: 'BNB/USDT',
      price: '$300',
      change: 0.8,
      volume: '$200M',
    },
    {
      key: '4',
      pair: 'SOL/USDT',
      price: '$60',
      change: 5.2,
      volume: '$350M',
    },
    {
      key: '5',
      pair: 'XRP/USDT',
      price: '$0.50',
      change: -0.5,
      volume: '$150M',
    },
  ];

  const recentTradesColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <span style={{ color: text === 'Mua' ? '#52c41a' : '#f5222d' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Cặp giao dịch',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const recentTradesData = [
    {
      key: '1',
      time: '10:30 12/05/2023',
      type: 'Mua',
      pair: 'BTC/USDT',
      price: '$28,500',
      amount: '0.05 BTC',
      value: '$1,425',
    },
    {
      key: '2',
      time: '09:15 12/05/2023',
      type: 'Bán',
      pair: 'ETH/USDT',
      price: '$1,820',
      amount: '1.2 ETH',
      value: '$2,184',
    },
    {
      key: '3',
      time: '14:45 11/05/2023',
      type: 'Mua',
      pair: 'SOL/USDT',
      price: '$58.5',
      amount: '10 SOL',
      value: '$585',
    },
  ];

  const alertsData = [
    {
      key: '1',
      type: 'info',
      message: 'Bitcoin đã đạt ngưỡng kháng cự $28,500',
      timestamp: '2 giờ trước',
    },
    {
      key: '2',
      type: 'warning',
      message: 'Ethereum có dấu hiệu giảm giá trong ngắn hạn',
      timestamp: '5 giờ trước',
    },
    {
      key: '3',
      type: 'success',
      message: 'Chiến lược "DCA Bitcoin" đã tăng 15% trong tháng',
      timestamp: '1 ngày trước',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng tài sản"
              value={112893}
              precision={2}
              prefix={<WalletOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: 10 }}>
              <Text type="secondary">+3.5% so với tuần trước</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Lợi nhuận 24h"
              value={2.5}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
            <div style={{ marginTop: 10 }}>
              <Text type="secondary">+$1,250.00</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng giao dịch"
              value={1128}
              prefix={<LineChartOutlined />}
            />
            <div style={{ marginTop: 10 }}>
              <Text type="secondary">89 giao dịch trong tuần</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tỷ lệ thắng"
              value={75}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
            <div style={{ marginTop: 10 }}>
              <Progress percent={75} showInfo={false} strokeColor="#52c41a" />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Hiệu suất danh mục đầu tư" 
            extra={
              <div>
                <Button.Group>
                  <Button 
                    type={performanceTimeframe === '7d' ? 'primary' : 'default'} 
                    onClick={() => setPerformanceTimeframe('7d')}
                  >
                    7D
                  </Button>
                  <Button 
                    type={performanceTimeframe === '30d' ? 'primary' : 'default'} 
                    onClick={() => setPerformanceTimeframe('30d')}
                  >
                    30D
                  </Button>
                  <Button 
                    type={performanceTimeframe === '90d' ? 'primary' : 'default'} 
                    onClick={() => setPerformanceTimeframe('90d')}
                  >
                    90D
                  </Button>
                </Button.Group>
                <Button 
                  icon={<ReloadOutlined />} 
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    dispatch(fetchPortfolioData() as any);
                  }}
                />
              </div>
            }
          >
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bổ tài sản">
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="market">
              <TabPane tab="Thị trường" key="market">
                <Table 
                  columns={marketColumns} 
                  dataSource={marketOverviewData} 
                  pagination={{ pageSize: 5 }}
                  onRow={(record) => ({
                    onClick: () => navigate(`/market/${record.pair.replace('/', '')}`),
                  })}
                />
              </TabPane>
              <TabPane tab="Giao dịch gần đây" key="recent-trades">
                <Table 
                  columns={recentTradesColumns} 
                  dataSource={recentTradesData} 
                  pagination={{ pageSize: 5 }}
                />
              </TabPane>
              <TabPane tab="Cảnh báo" key="alerts">
                {alertsData.map(alert => (
                  <Alert
                    key={alert.key}
                    message={alert.message}
                    type={alert.type as any}
                    showIcon
                    style={{ marginBottom: 16 }}
                    description={alert.timestamp}
                  />
                ))}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card
            title="Chiến lược đang hoạt động"
            extra={<Button type="link" onClick={() => navigate('/strategies')}>Xem tất cả</Button>}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div><Text strong>DCA Bitcoin</Text></div>
                <Text type="secondary">Đang hoạt động</Text>
              </div>
              <div>
                <Text style={{ color: '#52c41a' }}>+12.5%</Text>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div><Text strong>ETH Momentum</Text></div>
                <Text type="secondary">Đang hoạt động</Text>
              </div>
              <div>
                <Text style={{ color: '#52c41a' }}>+8.2%</Text>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div><Text strong>Alt Season</Text></div>
                <Text type="secondary">Tạm dừng</Text>
              </div>
              <div>
                <Text style={{ color: '#f5222d' }}>-3.1%</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Tài sản hiệu suất tốt nhất"
            extra={<Button type="link" onClick={() => navigate('/portfolio')}>Xem danh mục</Button>}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div><Text strong>Bitcoin (BTC)</Text></div>
                <Text type="secondary">$28,500</Text>
              </div>
              <div>
                <Text style={{ color: '#52c41a' }}>+15.8%</Text>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div><Text strong>Solana (SOL)</Text></div>
                <Text type="secondary">$60</Text>
              </div>
              <div>
                <Text style={{ color: '#52c41a' }}>+12.3%</Text>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div><Text strong>Ethereum (ETH)</Text></div>
                <Text type="secondary">$1,800</Text>
              </div>
              <div>
                <Text style={{ color: '#52c41a' }}>+5.4%</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 