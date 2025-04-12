import React from 'react';
import { Table, Tag, Typography, Spin, Empty, Divider, Row, Col, Card, Progress } from 'antd';
import { RiseOutlined, FallOutlined, MinusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface TechnicalIndicatorsProps {
  symbol: string;
  indicators: any[] | undefined;
  loading: boolean;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ symbol, indicators, loading }) => {
  if (loading) {
    return <Spin tip="Đang tải chỉ báo kỹ thuật..." />;
  }
  
  if (!indicators || indicators.length === 0) {
    return <Empty description="Không có dữ liệu chỉ báo kỹ thuật cho symbol này." />;
  }
  
  // Tính toán tóm tắt
  const bullishCount = indicators.filter(i => i.signal === 'BUY').length;
  const bearishCount = indicators.filter(i => i.signal === 'SELL').length;
  const neutralCount = indicators.filter(i => i.signal === 'NEUTRAL').length;
  const total = indicators.length;
  
  const bullishPercent = Math.round((bullishCount / total) * 100);
  const bearishPercent = Math.round((bearishCount / total) * 100);
  const neutralPercent = Math.round((neutralCount / total) * 100);
  
  // Phân loại chỉ báo
  const trendIndicators = indicators.filter(i => i.category === 'TREND');
  const oscillatorIndicators = indicators.filter(i => i.category === 'OSCILLATOR');
  const volatilityIndicators = indicators.filter(i => i.category === 'VOLATILITY');
  const volumeIndicators = indicators.filter(i => i.category === 'VOLUME');
  
  // Cột cho bảng
  const columns = [
    {
      title: 'Chỉ báo',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => <Text>{value ? value.toFixed(4) : 'N/A'}</Text>,
    },
    {
      title: 'Tín hiệu',
      dataIndex: 'signal',
      key: 'signal',
      render: (signal: string) => {
        let color = 'default';
        let icon = null;
        let text = 'Trung lập';
        
        if (signal === 'BUY') {
          color = 'success';
          icon = <RiseOutlined />;
          text = 'Mua';
        } else if (signal === 'SELL') {
          color = 'error';
          icon = <FallOutlined />;
          text = 'Bán';
        } else {
          icon = <MinusOutlined />;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Mức độ mạnh',
      dataIndex: 'strength',
      key: 'strength',
      render: (strength: number) => (
        <Progress 
          percent={strength} 
          size="small" 
          strokeColor={
            strength >= 70 ? '#52c41a' : 
            strength >= 30 ? '#faad14' : 
            '#f5222d'
          }
          format={percent => `${percent}%`}
        />
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'timeframe',
      key: 'timeframe',
      render: (timeframe: string) => <Text type="secondary">{timeframe}</Text>,
    },
  ];
  
  return (
    <div className="technical-indicators">
      <Title level={4}>Chỉ báo kỹ thuật cho {symbol}</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ background: '#f6ffed' }}>
            <Row align="middle">
              <Col span={12}>
                <Text strong style={{ fontSize: 16 }}>Tín hiệu mua:</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Tag color="success" icon={<RiseOutlined />} style={{ fontSize: 16 }}>
                  {bullishCount} / {total}
                </Tag>
              </Col>
            </Row>
            <Progress percent={bullishPercent} status="success" showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ background: '#fcfcfc' }}>
            <Row align="middle">
              <Col span={12}>
                <Text strong style={{ fontSize: 16 }}>Trung lập:</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Tag icon={<MinusOutlined />} style={{ fontSize: 16 }}>
                  {neutralCount} / {total}
                </Tag>
              </Col>
            </Row>
            <Progress percent={neutralPercent} status="normal" showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ background: '#fff1f0' }}>
            <Row align="middle">
              <Col span={12}>
                <Text strong style={{ fontSize: 16 }}>Tín hiệu bán:</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Tag color="error" icon={<FallOutlined />} style={{ fontSize: 16 }}>
                  {bearishCount} / {total}
                </Tag>
              </Col>
            </Row>
            <Progress percent={bearishPercent} status="exception" showInfo={false} />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Chỉ báo xu hướng</Divider>
      <Table 
        dataSource={trendIndicators} 
        columns={columns} 
        rowKey="name" 
        pagination={false} 
        size="small" 
      />
      
      <Divider orientation="left">Dao động (Oscillators)</Divider>
      <Table 
        dataSource={oscillatorIndicators} 
        columns={columns} 
        rowKey="name" 
        pagination={false} 
        size="small" 
      />
      
      <Divider orientation="left">Dao động giá (Volatility)</Divider>
      <Table 
        dataSource={volatilityIndicators} 
        columns={columns} 
        rowKey="name" 
        pagination={false} 
        size="small" 
      />
      
      <Divider orientation="left">Khối lượng (Volume)</Divider>
      <Table 
        dataSource={volumeIndicators} 
        columns={columns} 
        rowKey="name" 
        pagination={false} 
        size="small" 
      />
    </div>
  );
};

export default TechnicalIndicators; 