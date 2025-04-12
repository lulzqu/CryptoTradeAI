import React from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Divider, Empty, Typography } from 'antd';
import { RiseOutlined, FallOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { PortfolioStats } from '../../types';

const { Title, Text } = Typography;

interface PerformanceStatsProps {
  stats: PortfolioStats | null;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ stats }) => {
  if (!stats) {
    return <Empty description="Không có dữ liệu thống kê" />;
  }

  // Cột cho thống kê theo tháng
  const monthlyColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Lợi nhuận/Lỗ',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (pnl: number) => (
        <Text type={pnl >= 0 ? 'success' : 'danger'}>
          {pnl >= 0 ? '+' : ''}{pnl.toLocaleString()} $
        </Text>
      ),
      sorter: (a: { pnl: number }, b: { pnl: number }) => a.pnl - b.pnl,
    },
    {
      title: 'Tỷ lệ',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Text type={percentage >= 0 ? 'success' : 'danger'}>
          {percentage >= 0 ? '+' : ''}{percentage.toFixed(2)}%
        </Text>
      ),
      sorter: (a: { percentage: number }, b: { percentage: number }) => a.percentage - b.percentage,
    },
  ];

  // Cột cho phân phối theo symbol
  const distributionColumns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Tỷ lệ',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <div>
          <Text>{percentage.toFixed(2)}%</Text>
          <Progress percent={percentage} size="small" showInfo={false} />
        </div>
      ),
      sorter: (a: { percentage: number }, b: { percentage: number }) => b.percentage - a.percentage,
    },
  ];

  return (
    <div className="performance-stats">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ thắng"
              value={stats.winRate}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lợi nhuận trung bình"
              value={stats.avgWin}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lỗ trung bình"
              value={stats.avgLoss}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<FallOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số giao dịch"
              value={stats.winCount + stats.lossCount}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Giao dịch tốt nhất/xấu nhất</Divider>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={<><TrophyOutlined style={{ color: '#faad14' }} /> Giao dịch tốt nhất</>}
            headStyle={{ backgroundColor: '#f6ffed', borderBottom: '1px solid #b7eb8f' }}
          >
            <Statistic
              title={stats.bestTrade.symbol}
              value={stats.bestTrade.pnl}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="$"
            />
            <Text type="success">+{stats.bestTrade.percentage.toFixed(2)}%</Text>
            <div><Text type="secondary">Ngày: {new Date(stats.bestTrade.date).toLocaleDateString()}</Text></div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={<><WarningOutlined style={{ color: '#ff4d4f' }} /> Giao dịch xấu nhất</>}
            headStyle={{ backgroundColor: '#fff2f0', borderBottom: '1px solid #ffccc7' }}
          >
            <Statistic
              title={stats.worstTrade.symbol}
              value={stats.worstTrade.pnl}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="$"
            />
            <Text type="danger">{stats.worstTrade.percentage.toFixed(2)}%</Text>
            <div><Text type="secondary">Ngày: {new Date(stats.worstTrade.date).toLocaleDateString()}</Text></div>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Phân phối theo Symbol</Divider>
      <Table 
        columns={distributionColumns} 
        dataSource={stats.symbolDistribution.map((item, index) => ({ 
          ...item, 
          key: index 
        }))} 
        pagination={false} 
        size="small"
      />

      <Divider orientation="left">Hiệu suất theo tháng</Divider>
      <Table 
        columns={monthlyColumns} 
        dataSource={stats.monthlyPerformance.map((item, index) => ({ 
          ...item, 
          key: index 
        }))} 
        pagination={false}
        size="small"
      />
    </div>
  );
};

export default PerformanceStats; 