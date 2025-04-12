import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Tabs,
  Input,
  Button,
  Select,
  Alert,
  Spin,
  Typography,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  LineChartOutlined, 
  BarChartOutlined, 
  PieChartOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { fetchSymbols } from '../../slices/marketSlice';
import { fetchSignals, fetchPatterns } from '../../slices/analysisSlice';
import { AppDispatch, RootState } from '../../store';
import TechnicalIndicators from '../../components/Analysis/TechnicalIndicators';
import TrendAnalysis from '../../components/Analysis/TrendAnalysis';
import PricePrediction from '../../components/Analysis/PricePrediction';
import PatternRecognition from '../../components/Analysis/PatternRecognition';
import TradingSignals from '../../components/Analysis/TradingSignals';
import MarketOverview from '../../components/Analysis/MarketOverview';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const AnalysisPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { symbols, loading: symbolsLoading } = useSelector((state: RootState) => state.market);
  const { signals, candlestickPatterns, loading, patternsLoading, error } = useSelector((state: RootState) => state.analysis);
  
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
  
  // Lấy danh sách symbols khi component mount
  useEffect(() => {
    dispatch(fetchSymbols());
  }, [dispatch]);
  
  // Chọn symbol đầu tiên khi danh sách được tải
  useEffect(() => {
    if (symbols.length > 0 && !selectedSymbol) {
      setSelectedSymbol(symbols[0]);
    }
  }, [symbols, selectedSymbol]);
  
  // Lấy dữ liệu phân tích khi thay đổi symbol
  useEffect(() => {
    if (selectedSymbol) {
      // Lấy dữ liệu phân tích dựa vào tab đang active
      loadAnalysisData();
    }
  }, [selectedSymbol, activeTab, selectedTimeframe]);
  
  // Lọc symbols theo từ khóa tìm kiếm
  const filteredSymbols = symbols.filter(symbol => 
    symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Xử lý thay đổi symbol
  const handleSymbolChange = (value: string) => {
    setSelectedSymbol(value);
  };
  
  // Xử lý thay đổi tab
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Xử lý thay đổi timeframe
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
  };
  
  // Tải dữ liệu phân tích dựa vào tab đang active
  const loadAnalysisData = () => {
    switch (activeTab) {
      case 'patterns':
        dispatch(fetchPatterns({ symbol: selectedSymbol, timeframe: selectedTimeframe }));
        break;
      case 'signals':
        dispatch(fetchSignals());
        break;
      case 'overview':
      default:
        // Tải dữ liệu cần thiết cho tổng quan
        dispatch(fetchPatterns({ symbol: selectedSymbol, timeframe: selectedTimeframe }));
        dispatch(fetchSignals());
        break;
    }
  };
  
  // Làm mới dữ liệu phân tích
  const handleRefreshData = () => {
    loadAnalysisData();
  };
  
  return (
    <div className="analysis-page">
      <Title level={2}>Phân tích thị trường</Title>
      
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Input
            placeholder="Tìm kiếm symbol"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: 8 }}
            allowClear
          />
          <Select
            showSearch
            style={{ width: '100%' }}
            value={selectedSymbol}
            onChange={handleSymbolChange}
            placeholder="Chọn symbol"
            loading={symbolsLoading}
            filterOption={false}
            notFoundContent={symbolsLoading ? <Spin size="small" /> : null}
            optionFilterProp="children"
          >
            {filteredSymbols.map(symbol => (
              <Option key={symbol} value={symbol}>{symbol}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Select
            style={{ width: 120, marginRight: 8 }}
            value={selectedTimeframe}
            onChange={handleTimeframeChange}
          >
            <Option value="1m">1 phút</Option>
            <Option value="5m">5 phút</Option>
            <Option value="15m">15 phút</Option>
            <Option value="1h">1 giờ</Option>
            <Option value="4h">4 giờ</Option>
            <Option value="1d">1 ngày</Option>
            <Option value="1w">1 tuần</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<LineChartOutlined />} 
            onClick={handleRefreshData}
            loading={loading || patternsLoading}
          >
            Cập nhật phân tích
          </Button>
        </Col>
      </Row>
      
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          style={{ marginBottom: 16 }}
          closable
        />
      )}
      
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Tổng quan" key="overview">
            <MarketOverview 
              symbol={selectedSymbol}
              analysis={null}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Chỉ báo kỹ thuật" key="indicators">
            <TechnicalIndicators 
              symbol={selectedSymbol}
              indicators={[]}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Phân tích xu hướng" key="trend">
            <TrendAnalysis 
              symbol={selectedSymbol}
              analysis={null}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Dự đoán giá" key="prediction">
            <PricePrediction 
              symbol={selectedSymbol}
              predictions={null}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Nhận diện mẫu hình" key="patterns">
            <PatternRecognition 
              symbol={selectedSymbol}
              patterns={candlestickPatterns}
              loading={patternsLoading}
            />
          </TabPane>
          <TabPane tab="Tín hiệu giao dịch" key="signals">
            <TradingSignals />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AnalysisPage; 