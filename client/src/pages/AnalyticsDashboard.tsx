import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tabs, Select, DatePicker, Spin, Typography } from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Line, Bar, Pie, Area } from '@ant-design/charts';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import './AnalyticsDashboard.css';
import { RootState } from '../store';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface PerformanceData {
  date: string;
  value: number;
}

interface AssetDistribution {
  name: string;
  value: number;
  color: string;
}

interface TradingStats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  averageTrade: number;
  maxDrawdown: number;
}

const AnalyticsDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  
  // Mô phỏng dữ liệu hiệu suất
  const generatePerformanceData = (days: number): PerformanceData[] => {
    const data: PerformanceData[] = [];
    const baseValue = 10000;
    let currentValue = baseValue;
    
    for (let i = days; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const randomChange = Math.random() * 0.04 - 0.01;
      currentValue = currentValue * (1 + randomChange);
      data.push({
        date,
        value: parseFloat(currentValue.toFixed(2)),
      });
    }
    
    return data;
  };

  // Mô phỏng dữ liệu phân phối tài sản
  const assetDistribution: AssetDistribution[] = [
    { name: 'BTC', value: 45, color: '#F7931A' },
    { name: 'ETH', value: 30, color: '#627EEA' },
    { name: 'USDT', value: 15, color: '#26A17B' },
    { name: 'BNB', value: 10, color: '#F3BA2F' },
  ];

  // Mô phỏng thống kê giao dịch
  const tradingStats: TradingStats = {
    totalTrades: 156,
    winRate: 65.4,
    profitFactor: 2.1,
    averageTrade: 125.5,
    maxDrawdown: 8.2,
  };

  const performanceData = generatePerformanceData(timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90);

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
  };

  const barConfig = {
    data: performanceData,
    xField: 'date',
    yField: 'value',
    color: '#1890ff',
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Giá trị', value: `$${datum.value.toLocaleString()}` };
      },
    },
  };

  const areaConfig = {
    data: performanceData,
    xField: 'date',
    yField: 'value',
    color: '#1890ff',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Giá trị', value: `$${datum.value.toLocaleString()}` };
      },
    },
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <Title level={2}>Phân tích hiệu suất</Title>
        <div className="dashboard-controls">
          <Select
            value={timeframe}
            onChange={setTimeframe}
            style={{ width: 120, marginRight: 16 }}
          >
            <Select.Option value="7d">7 ngày</Select.Option>
            <Select.Option value="30d">30 ngày</Select.Option>
            <Select.Option value="90d">90 ngày</Select.Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 256 }}
          />
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số giao dịch"
              value={tradingStats.totalTrades}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tỷ lệ thắng"
              value={tradingStats.winRate}
              suffix="%"
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hệ số lợi nhuận"
              value={tradingStats.profitFactor}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Thua lỗ tối đa"
              value={tradingStats.maxDrawdown}
              suffix="%"
              prefix={<FallOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Biểu đồ hiệu suất">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Đường" key="1">
                <Line {...lineConfig} />
              </TabPane>
              <TabPane tab="Cột" key="2">
                <Bar {...barConfig} />
              </TabPane>
              <TabPane tab="Vùng" key="3">
                <Area {...areaConfig} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Phân bổ tài sản">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Thống kê chi tiết">
            <Table
              columns={[
                {
                  title: 'Chỉ số',
                  dataIndex: 'metric',
                  key: 'metric',
                },
                {
                  title: 'Giá trị',
                  dataIndex: 'value',
                  key: 'value',
                },
                {
                  title: 'Thay đổi',
                  dataIndex: 'change',
                  key: 'change',
                  render: (value: number) => (
                    <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
                      {value >= 0 ? '+' : ''}{value}%
                    </span>
                  ),
                },
              ]}
              dataSource={[
                { key: '1', metric: 'Lợi nhuận ròng', value: '$12,345', change: 5.2 },
                { key: '2', metric: 'Lợi nhuận trung bình', value: '$125.5', change: 2.1 },
                { key: '3', metric: 'Tỷ lệ thắng', value: '65.4%', change: 1.5 },
                { key: '4', metric: 'Hệ số lợi nhuận', value: '2.1', change: 0.3 },
                { key: '5', metric: 'Thua lỗ tối đa', value: '8.2%', change: -0.5 },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard; 