import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Table, 
  Card, 
  Tag, 
  Typography, 
  Space, 
  Button, 
  Badge, 
  Tooltip, 
  Input, 
  Select,
  Dropdown,
  Menu,
  Modal,
  Alert,
  Row,
  Col
} from 'antd';
import { 
  LineChartOutlined, 
  RiseOutlined, 
  FallOutlined, 
  ExclamationCircleOutlined,
  FilterOutlined,
  BellOutlined,
  InfoCircleOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { fetchSignals } from '../../slices/analysisSlice';
import { AppDispatch, RootState } from '../../store';
import { Signal, SignalType, SignalSentiment, SignalStatus } from '../../types';
import websocketService from '../../services/websocket';
import { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

// Danh sách các filters
const signalTypes = [
  { text: SignalType.PRICE_BREAKOUT, value: SignalType.PRICE_BREAKOUT },
  { text: SignalType.SUPPORT_RESISTANCE, value: SignalType.SUPPORT_RESISTANCE },
  { text: SignalType.TREND_REVERSAL, value: SignalType.TREND_REVERSAL },
  { text: SignalType.MOVING_AVERAGE_CROSS, value: SignalType.MOVING_AVERAGE_CROSS },
  { text: SignalType.VOLUME_SPIKE, value: SignalType.VOLUME_SPIKE },
  { text: SignalType.RSI_DIVERGENCE, value: SignalType.RSI_DIVERGENCE },
  { text: SignalType.MACD_CROSS, value: SignalType.MACD_CROSS },
  { text: SignalType.PATTERN_RECOGNITION, value: SignalType.PATTERN_RECOGNITION },
];

const SignalsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { signals, loading, error } = useSelector((state: RootState) => state.analysis);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [selectedType, setSelectedType] = useState<SignalType | ''>('');
  const [selectedSentiment, setSelectedSentiment] = useState<SignalSentiment | ''>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(true);
  
  // Lấy dữ liệu tín hiệu khi component mount
  useEffect(() => {
    dispatch(fetchSignals());
  }, [dispatch]);
  
  // Thiết lập WebSocket để nhận tín hiệu thời gian thực
  useEffect(() => {
    const unsubscribe = websocketService.subscribeSignals((data) => {
      // Nhận tín hiệu mới qua WebSocket
      dispatch(fetchSignals());
    });
    
    return () => {
      unsubscribe();
    };
  }, [dispatch]);
  
  // Xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  // Xử lý lọc theo symbol
  const handleSymbolChange = (value: string) => {
    setSelectedSymbol(value);
  };
  
  // Xử lý lọc theo loại tín hiệu
  const handleTypeChange = (value: SignalType | '') => {
    setSelectedType(value);
  };
  
  // Xử lý lọc theo khuynh hướng
  const handleSentimentChange = (value: SignalSentiment | '') => {
    setSelectedSentiment(value);
  };
  
  // Xử lý thêm/xóa tín hiệu khỏi danh sách yêu thích
  const handleToggleFavorite = (signalId: string) => {
    if (favorites.includes(signalId)) {
      setFavorites(favorites.filter(id => id !== signalId));
    } else {
      setFavorites([...favorites, signalId]);
    }
  };
  
  // Xử lý đăng ký theo dõi tín hiệu
  const handleSubscribe = (signalId: string) => {
    confirm({
      title: 'Bạn có muốn đăng ký nhận thông báo cho tín hiệu này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn sẽ nhận được email và thông báo khi có cập nhật.',
      onOk() {
        console.log('Đăng ký thông báo cho tín hiệu ', signalId);
        // dispatch(subscribToSignal(signalId));
      },
    });
  };
  
  // Xử lý xem chi tiết tín hiệu
  const handleViewDetails = (signalId: string) => {
    console.log('Xem chi tiết tín hiệu: ', signalId);
    // dispatch(viewSignalDetails(signalId));
    // hoặc
    // history.push(`/analysis/signals/${signalId}`);
  };
  
  // Lọc tín hiệu theo các điều kiện
  const filteredSignals = signals.filter(signal => {
    // Lọc theo trạng thái hoạt động
    if (showActiveOnly && signal.status !== SignalStatus.ACTIVE) {
      return false;
    }
    
    // Lọc theo tìm kiếm
    if (searchTerm && !signal.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Lọc theo symbol
    if (selectedSymbol && signal.symbol !== selectedSymbol) {
      return false;
    }
    
    // Lọc theo loại tín hiệu
    if (selectedType && signal.type !== selectedType) {
      return false;
    }
    
    // Lọc theo khuynh hướng
    if (selectedSentiment && signal.sentiment !== selectedSentiment) {
      return false;
    }
    
    return true;
  });
  
  // Lấy danh sách symbol duy nhất cho dropdown
  const uniqueSymbols = Array.from(new Set(signals.map(signal => signal.symbol)));
  
  // Render tag màu cho confidence
  const renderConfidenceTag = (confidence: number) => {
    let color = 'green';
    if (confidence < 40) {
      color = 'red';
    } else if (confidence < 75) {
      color = 'orange';
    }
    
    return (
      <Tag color={color}>
        {confidence}%
      </Tag>
    );
  };
  
  // Render tag màu cho sentiment
  const renderSentimentTag = (sentiment: SignalSentiment) => {
    const sentimentMap = {
      [SignalSentiment.BULLISH]: { color: 'green', text: 'Tăng', icon: <RiseOutlined /> },
      [SignalSentiment.BEARISH]: { color: 'red', text: 'Giảm', icon: <FallOutlined /> },
      [SignalSentiment.NEUTRAL]: { color: 'gray', text: 'Trung lập', icon: null },
    };
    
    return (
      <Tag color={sentimentMap[sentiment].color}>
        {sentimentMap[sentiment].icon} {sentimentMap[sentiment].text}
      </Tag>
    );
  };
  
  // Render tag màu cho loại tín hiệu
  const renderSignalTypeTag = (type: SignalType) => {
    const typeMap = {
      [SignalType.PRICE_BREAKOUT]: { color: 'magenta', text: 'Breakout' },
      [SignalType.SUPPORT_RESISTANCE]: { color: 'volcano', text: 'S/R' },
      [SignalType.TREND_REVERSAL]: { color: 'purple', text: 'Reversal' },
      [SignalType.MOVING_AVERAGE_CROSS]: { color: 'cyan', text: 'MA Cross' },
      [SignalType.VOLUME_SPIKE]: { color: 'blue', text: 'Volume' },
      [SignalType.RSI_DIVERGENCE]: { color: 'geekblue', text: 'RSI' },
      [SignalType.MACD_CROSS]: { color: 'lime', text: 'MACD' },
      [SignalType.PATTERN_RECOGNITION]: { color: 'gold', text: 'Pattern' },
      [SignalType.PATTERN]: { color: 'gold', text: 'Pattern' },
      [SignalType.INDICATOR]: { color: 'green', text: 'Indicator' },
      [SignalType.AI]: { color: 'blue', text: 'AI' },
      [SignalType.NEWS]: { color: 'purple', text: 'News' },
    };
    
    return (
      <Tag color={typeMap[type]?.color || 'default'}>
        {typeMap[type]?.text || type}
      </Tag>
    );
  };
  
  // Cấu hình các cột cho bảng
  const columns: ColumnsType<Signal> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: string) => <Text copyable={{ text: id }}>{id.slice(0, 6)}...</Text>,
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: Signal, b: Signal) => a.symbol.localeCompare(b.symbol),
      filters: uniqueSymbols.map(symbol => ({ text: symbol, value: symbol })),
      onFilter: (value: boolean | React.Key, record: Signal) => record.symbol === value,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: SignalType) => renderSignalTypeTag(type),
      filters: signalTypes,
      onFilter: (value: any, record: Signal) => record.type === value,
    },
    {
      title: 'Khuynh hướng',
      dataIndex: 'sentiment',
      key: 'sentiment',
      render: (sentiment: SignalSentiment) => renderSentimentTag(sentiment),
      filters: [
        { text: 'Tăng', value: SignalSentiment.BULLISH },
        { text: 'Giảm', value: SignalSentiment.BEARISH },
        { text: 'Trung lập', value: SignalSentiment.NEUTRAL },
      ],
      onFilter: (value: any, record: Signal) => record.sentiment === value,
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => <Text strong>${price.toLocaleString()}</Text>,
      sorter: (a: Signal, b: Signal) => a.entryPrice - b.entryPrice,
    },
    {
      title: 'Stop Loss',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      render: (price: number | undefined) => price ? <Text type="danger">${price.toLocaleString()}</Text> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Take Profit',
      dataIndex: 'takeProfit',
      key: 'takeProfit',
      render: (price: number | undefined) => price ? <Text type="success">${price.toLocaleString()}</Text> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Độ tin cậy',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => renderConfidenceTag(confidence),
      sorter: (a: Signal, b: Signal) => a.confidence - b.confidence,
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => <Text>{new Date(timestamp).toLocaleString()}</Text>,
      sorter: (a: Signal, b: Signal) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = status;
        
        switch (status) {
          case SignalStatus.NEW:
            color = 'processing';
            text = 'Mới';
            break;
          case SignalStatus.ACTIVE:
            color = 'success';
            text = 'Đang chạy';
            break;
          case SignalStatus.COMPLETED:
            color = 'green';
            text = 'Hoàn thành';
            break;
          case SignalStatus.FAILED:
            color = 'error';
            text = 'Thất bại';
            break;
          case SignalStatus.EXPIRED:
            color = 'warning';
            text = 'Hết hạn';
            break;
        }
        
        return <Badge status={color as any} text={text} />;
      },
      filters: [
        { text: 'Mới', value: SignalStatus.NEW },
        { text: 'Đang chạy', value: SignalStatus.ACTIVE },
        { text: 'Hoàn thành', value: SignalStatus.COMPLETED },
        { text: 'Thất bại', value: SignalStatus.FAILED },
        { text: 'Hết hạn', value: SignalStatus.EXPIRED },
      ],
      onFilter: (value: any, record: Signal) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Signal) => (
        <Space size="small">
          <Tooltip title="Xem biểu đồ">
            <Button 
              type="text" 
              shape="circle" 
              icon={<LineChartOutlined />} 
              onClick={() => handleViewDetails(record.id)} 
            />
          </Tooltip>
          <Tooltip title={record.favorite ? "Bỏ yêu thích" : "Yêu thích"}>
            <Button 
              type="text" 
              shape="circle" 
              icon={record.favorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
              onClick={() => handleToggleFavorite(record.id)} 
            />
          </Tooltip>
          <Tooltip title="Đăng ký thông báo">
            <Button 
              type="text" 
              shape="circle" 
              icon={<BellOutlined />} 
              onClick={() => handleSubscribe(record.id)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  if (error) {
    return <Alert message="Lỗi tải dữ liệu" description={error} type="error" />;
  }
  
  return (
    <Card title="Tín hiệu giao dịch" className="signals-card">
      <div className="filters-container" style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Search
              placeholder="Tìm kiếm symbol"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Lọc theo symbol"
              allowClear
              style={{ width: '100%' }}
              onChange={handleSymbolChange}
            >
              {uniqueSymbols.map(symbol => (
                <Option key={symbol} value={symbol}>{symbol}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Lọc theo loại tín hiệu"
              allowClear
              style={{ width: '100%' }}
              onChange={handleTypeChange}
            >
              {signalTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.text}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Lọc theo khuynh hướng"
              allowClear
              style={{ width: '100%' }}
              onChange={handleSentimentChange}
            >
              <Option value={SignalSentiment.BULLISH}>Tăng</Option>
              <Option value={SignalSentiment.BEARISH}>Giảm</Option>
              <Option value={SignalSentiment.NEUTRAL}>Trung lập</Option>
            </Select>
          </Col>
        </Row>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredSignals} 
        rowKey="id"
        loading={loading}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
      />
    </Card>
  );
};

export default SignalsList; 