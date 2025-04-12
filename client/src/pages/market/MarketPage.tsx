import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Table, Typography, Tabs, Input, Select, Statistic, Tag, Space, Button } from 'antd';
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { fetchSymbols, fetchTicker24h, fetchFavorites, setSelectedSymbol } from '../../slices/marketSlice';
import { AppDispatch, RootState } from '../../store';
import PriceChart from '../../components/Market/PriceChart';
import OrderBook from '../../components/Market/OrderBook';
import RecentTrades from '../../components/Market/RecentTrades';
import MarketDepth from '../../components/Market/MarketDepth';
import WebsocketStatus from '../../components/Common/WebsocketStatus';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const MarketPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { symbols, favorites, selectedSymbol, loading, ticker24h } = useSelector((state: RootState) => state.market);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [base, setBase] = useState('USDT');

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    dispatch(fetchSymbols());
    dispatch(fetchFavorites());
  }, [dispatch]);

  // Lấy dữ liệu ticker 24h
  useEffect(() => {
    if (symbols.length > 0) {
      dispatch(fetchTicker24h(''));
    }
  }, [symbols, dispatch]);

  // Xử lý chọn symbol
  const handleSymbolSelect = (symbol: string) => {
    dispatch(setSelectedSymbol(symbol));
  };

  // Xử lý thay đổi base (USDT, BTC, ETH, etc.)
  const handleBaseChange = (value: string) => {
    setBase(value);
    setSearchTerm('');
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toUpperCase());
  };

  // Xử lý thêm/xóa khỏi danh sách yêu thích
  const handleToggleFavorite = (symbol: string) => {
    // Sẽ thực hiện API call khi kết nối với backend
    console.log('Toggle favorite:', symbol);
  };

  // Lọc danh sách symbols dựa trên base và từ khóa tìm kiếm
  const filteredSymbols = symbols.filter(symbol => 
    symbol.endsWith(base) && 
    (searchTerm === '' || symbol.includes(searchTerm))
  );

  // Lọc danh sách favorites
  const filteredFavorites = favorites.filter(item => 
    item.symbol.endsWith(base) && 
    (searchTerm === '' || item.symbol.includes(searchTerm))
  );

  // Tạo dữ liệu cho bảng
  const createMarketTableData = (dataSource: any[]) => {
    return dataSource.map((item) => ({
      key: item.symbol,
      symbol: item.symbol,
      lastPrice: Number(item.lastPrice),
      priceChange: Number(item.priceChange),
      priceChangePercent: Number(item.priceChangePercent),
      volume: Number(item.quoteVolume || item.volume),
      isFavorite: favorites.some(fav => fav.symbol === item.symbol),
    }));
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'Yêu thích',
      dataIndex: 'isFavorite',
      key: 'isFavorite',
      width: 80,
      render: (isFavorite: boolean, record: any) => (
        <Button 
          type="text" 
          icon={isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
          onClick={() => handleToggleFavorite(record.symbol)}
        />
      ),
    },
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => {
        const base = text.slice(-4);
        const coin = text.slice(0, -4);
        return (
          <Space>
            <span>{coin}</span>
            <Text type="secondary">{base}</Text>
          </Space>
        );
      },
      sorter: (a: any, b: any) => a.symbol.localeCompare(b.symbol),
    },
    {
      title: 'Giá gần nhất',
      dataIndex: 'lastPrice',
      key: 'lastPrice',
      render: (value: number) => value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
      }),
      sorter: (a: any, b: any) => a.lastPrice - b.lastPrice,
    },
    {
      title: 'Thay đổi 24h',
      dataIndex: 'priceChangePercent',
      key: 'priceChangePercent',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}%
        </Tag>
      ),
      sorter: (a: any, b: any) => a.priceChangePercent - b.priceChangePercent,
    },
    {
      title: 'Khối lượng 24h',
      dataIndex: 'volume',
      key: 'volume',
      render: (value: number) => value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      sorter: (a: any, b: any) => a.volume - b.volume,
    },
  ];

  // Xử lý khi click vào hàng trong bảng
  const handleRowClick = (record: any) => {
    return {
      onClick: () => {
        handleSymbolSelect(record.symbol);
      },
    };
  };

  return (
    <div className="market-page">
      {/* WebSocket status indicator */}
      <div className="websocket-status-container" style={{ position: 'absolute', top: 10, right: 10 }}>
        <WebsocketStatus />
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>Thị trường</Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16} xl={18}>
          {/* Biểu đồ giá */}
          <PriceChart symbol={selectedSymbol} />
        </Col>
        
        <Col xs={24} lg={8} xl={6}>
          {/* Thông tin coin */}
          <Card title="Thông tin thị trường" className="market-info-card">
            <Statistic
              title="Giá gần nhất"
              value={ticker24h?.lastPrice || 0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Statistic
                  title="Thay đổi (24h)"
                  value={ticker24h?.priceChangePercent || 0}
                  precision={2}
                  valueStyle={{ color: (ticker24h?.priceChangePercent || 0) >= 0 ? '#3f8600' : '#cf1322' }}
                  suffix="%"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Khối lượng (24h)"
                  value={ticker24h?.volume || 0}
                  precision={2}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Statistic
                  title="Giá cao nhất (24h)"
                  value={ticker24h?.highPrice || 0}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Giá thấp nhất (24h)"
                  value={ticker24h?.lowPrice || 0}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>
          </Card>

          {/* Order Book */}
          <OrderBook symbol={selectedSymbol} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          {/* Recent Trades */}
          <RecentTrades symbol={selectedSymbol} />
        </Col>
        <Col xs={24} md={12}>
          {/* Market Depth */}
          <MarketDepth symbol={selectedSymbol} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="all">
              <TabPane tab="Tất cả" key="all">
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Input
                      placeholder="Tìm kiếm coin"
                      prefix={<SearchOutlined />}
                      onChange={handleSearch}
                      value={searchTerm}
                    />
                  </Col>
                  <Col span={8}>
                    <Select 
                      defaultValue="USDT" 
                      style={{ width: 120 }} 
                      onChange={handleBaseChange}
                    >
                      <Option value="USDT">USDT</Option>
                      <Option value="BTC">BTC</Option>
                      <Option value="ETH">ETH</Option>
                      <Option value="BNB">BNB</Option>
                    </Select>
                  </Col>
                </Row>
                <Table
                  columns={columns}
                  dataSource={createMarketTableData(ticker24h || [])}
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  onRow={handleRowClick}
                  rowClassName={(record) => record.symbol === selectedSymbol ? 'selected-row' : ''}
                  scroll={{ x: 800 }}
                />
              </TabPane>
              <TabPane tab="Yêu thích" key="favorites">
                <Table
                  columns={columns}
                  dataSource={createMarketTableData(filteredFavorites)}
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  onRow={handleRowClick}
                  rowClassName={(record) => record.symbol === selectedSymbol ? 'selected-row' : ''}
                  scroll={{ x: 800 }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketPage; 