import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  Switch, 
  Alert, 
  Typography, 
  Tooltip,
  Modal,
  Skeleton,
  Badge,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  StarOutlined, 
  StarFilled, 
  BellOutlined, 
  BellFilled, 
  FilterOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { fetchSignals, toggleFavoriteSignal, subscribeToSignal } from '../../slices/analysisSlice';
import { AppDispatch, RootState } from '../../store';
import { Signal, SignalType, SignalSentiment, SignalStatus } from '../../types';

const { Text, Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const TradingSignals: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { signals, loading, error } = useSelector((state: RootState) => state.analysis);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<SignalType[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<SignalSentiment[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<SignalStatus[]>([]);
  const [favorites, setFavorites] = useState<boolean>(false);
  const [notified, setNotified] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<string>('all');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);

  // Lấy tín hiệu khi component mount
  useEffect(() => {
    dispatch(fetchSignals());
    
    // Set up polling làm mới tín hiệu mỗi 5 phút
    const intervalId = setInterval(() => {
      dispatch(fetchSignals());
    }, 300000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Lọc tín hiệu
  const filteredSignals = signals.filter((signal) => {
    const matchesSearch = signal.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(signal.type);
    const matchesSentiment = selectedSentiments.length === 0 || selectedSentiments.includes(signal.sentiment);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(signal.status);
    const matchesFavorite = !favorites || signal.favorite;
    const matchesNotified = !notified || signal.notified;
    
    // Lọc theo khung thời gian
    let matchesTimeFrame = true;
    if (timeFrame !== 'all') {
      const now = new Date();
      const signalDate = new Date(signal.timestamp);
      const diff = now.getTime() - signalDate.getTime();
      const diffHours = diff / (1000 * 60 * 60);
      
      switch (timeFrame) {
        case 'today':
          matchesTimeFrame = diffHours <= 24;
          break;
        case 'week':
          matchesTimeFrame = diffHours <= 168; // 7 * 24
          break;
        case 'month':
          matchesTimeFrame = diffHours <= 720; // 30 * 24
          break;
        default:
          matchesTimeFrame = true;
      }
    }
    
    return matchesSearch && matchesType && matchesSentiment && matchesStatus && matchesFavorite && matchesNotified && matchesTimeFrame;
  });

  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý thay đổi loại tín hiệu
  const handleTypeChange = (values: SignalType[]) => {
    setSelectedTypes(values);
  };

  // Xử lý thay đổi xu hướng
  const handleSentimentChange = (values: SignalSentiment[]) => {
    setSelectedSentiments(values);
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (values: SignalStatus[]) => {
    setSelectedStatuses(values);
  };

  // Xử lý toggle yêu thích
  const handleToggleFavorite = (id: string, favorite: boolean) => {
    dispatch(toggleFavoriteSignal({ id, favorite: !favorite }));
  };

  // Xử lý đăng ký thông báo
  const handleToggleNotification = (id: string, notified: boolean) => {
    confirm({
      title: notified 
        ? 'Bạn có muốn hủy đăng ký thông báo cho tín hiệu này?' 
        : 'Bạn có muốn đăng ký thông báo cho tín hiệu này?',
      content: notified 
        ? 'Bạn sẽ không nhận được thông báo khi tín hiệu này có cập nhật.' 
        : 'Bạn sẽ nhận được thông báo qua email khi tín hiệu này có cập nhật.',
      onOk() {
        dispatch(subscribeToSignal({ id, subscribed: !notified }));
      },
    });
  };

  // Xử lý xem chi tiết tín hiệu
  const handleViewSignalDetail = (signal: Signal) => {
    setCurrentSignal(signal);
    setIsDetailModalVisible(true);
  };

  // Định nghĩa cột của bảng
  const columns = [
    {
      title: 'Yêu thích',
      dataIndex: 'favorite',
      key: 'favorite',
      width: 80,
      render: (favorite: boolean, record: Signal) => (
        <Button
          type="text"
          icon={favorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={() => handleToggleFavorite(record.id, favorite)}
        />
      ),
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: Signal, b: Signal) => a.symbol.localeCompare(b.symbol),
      render: (symbol: string) => <Text strong>{symbol}</Text>,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Pattern', value: SignalType.PATTERN },
        { text: 'Indicator', value: SignalType.INDICATOR },
        { text: 'AI', value: SignalType.AI },
        { text: 'News', value: SignalType.NEWS },
      ] as { text: string; value: any }[],
      onFilter: (value: any, record: Signal) => record.type === value,
      render: (type: SignalType) => {
        const typeConfig: Record<SignalType, { color: string; text: string }> = {
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
          <Tag color={typeConfig[type].color}>
            {typeConfig[type].text}
          </Tag>
        );
      },
    },
    {
      title: 'Xu hướng',
      dataIndex: 'sentiment',
      key: 'sentiment',
      filters: [
        { text: 'Bullish', value: SignalSentiment.BULLISH },
        { text: 'Bearish', value: SignalSentiment.BEARISH },
        { text: 'Neutral', value: SignalSentiment.NEUTRAL },
      ],
      onFilter: (value: string, record: Signal) => record.sentiment === value,
      render: (sentiment: SignalSentiment) => {
        const sentimentConfig = {
          [SignalSentiment.BULLISH]: { color: 'green', text: 'Bullish', icon: <RiseOutlined /> },
          [SignalSentiment.BEARISH]: { color: 'red', text: 'Bearish', icon: <FallOutlined /> },
          [SignalSentiment.NEUTRAL]: { color: 'gray', text: 'Neutral', icon: null },
        };
        
        return (
          <Tag color={sentimentConfig[sentiment].color} icon={sentimentConfig[sentiment].icon}>
            {sentimentConfig[sentiment].text}
          </Tag>
        );
      },
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      sorter: (a: Signal, b: Signal) => a.entryPrice - b.entryPrice,
      render: (price: number) => (
        <Text>{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
      ),
    },
    {
      title: 'Stop Loss',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      render: (price?: number) => (
        price ? (
          <Text type="danger">{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
        ) : (
          <Text type="secondary">N/A</Text>
        )
      ),
    },
    {
      title: 'Take Profit',
      dataIndex: 'takeProfit',
      key: 'takeProfit',
      render: (price?: number) => (
        price ? (
          <Text type="success">{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
        ) : (
          <Text type="secondary">N/A</Text>
        )
      ),
    },
    {
      title: 'Độ tin cậy',
      dataIndex: 'confidence',
      key: 'confidence',
      sorter: (a: Signal, b: Signal) => a.confidence - b.confidence,
      render: (confidence: number) => {
        let color = 'red';
        if (confidence >= 70) {
          color = 'green';
        } else if (confidence >= 50) {
          color = 'gold';
        }
        
        return (
          <Tooltip title={`${confidence}% độ tin cậy`}>
            <Tag color={color}>{confidence}%</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: (a: Signal, b: Signal) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      render: (timestamp: string) => {
        const date = new Date(timestamp);
        return (
          <Tooltip title={date.toLocaleString()}>
            {date.toLocaleDateString()}
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Mới', value: SignalStatus.NEW },
        { text: 'Đang theo dõi', value: SignalStatus.ACTIVE },
        { text: 'Thành công', value: SignalStatus.COMPLETED },
        { text: 'Thất bại', value: SignalStatus.FAILED },
        { text: 'Hết hạn', value: SignalStatus.EXPIRED },
      ],
      onFilter: (value: string, record: Signal) => record.status === value,
      render: (status: SignalStatus) => {
        const statusConfig = {
          [SignalStatus.NEW]: { color: 'blue', text: 'Mới' },
          [SignalStatus.ACTIVE]: { color: 'processing', text: 'Đang theo dõi' },
          [SignalStatus.COMPLETED]: { color: 'success', text: 'Thành công' },
          [SignalStatus.FAILED]: { color: 'error', text: 'Thất bại' },
          [SignalStatus.EXPIRED]: { color: 'default', text: 'Hết hạn' },
        };
        
        return (
          <Tag color={statusConfig[status].color}>
            {statusConfig[status].text}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_: any, record: Signal) => (
        <Space size="small">
          <Button
            type="text"
            icon={record.notified ? <BellFilled style={{ color: '#1890ff' }} /> : <BellOutlined />}
            onClick={() => handleToggleNotification(record.id, record.notified)}
            title={record.notified ? 'Hủy đăng ký thông báo' : 'Đăng ký thông báo'}
          />
          <Button
            type="primary"
            size="small"
            icon={<LineChartOutlined />}
            onClick={() => handleViewSignalDetail(record)}
          >
            Chi tiết
          </Button>
          {record.status === SignalStatus.NEW || record.status === SignalStatus.ACTIVE ? (
            <Button
              type="primary"
              size="small"
              icon={<DollarOutlined />}
            >
              Giao dịch
            </Button>
          ) : null}
        </Space>
      ),
    },
  ] as any;

  return (
    <div className="trading-signals">
      <Card title={<Title level={4}>Tín hiệu Giao dịch</Title>} bordered={false}>
        {error && (
          <Alert
            message="Lỗi"
            description="Không thể tải dữ liệu tín hiệu giao dịch. Vui lòng thử lại sau."
            type="error"
            style={{ marginBottom: 16 }}
          />
        )}
        
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={6}>
              <Input
                placeholder="Tìm kiếm theo symbol"
                value={searchTerm}
                onChange={handleSearch}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                placeholder="Lọc theo loại tín hiệu"
                value={selectedTypes}
                onChange={handleTypeChange}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value={SignalType.PATTERN}>Pattern</Option>
                <Option value={SignalType.INDICATOR}>Indicator</Option>
                <Option value={SignalType.AI}>AI</Option>
                <Option value={SignalType.NEWS}>News</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                placeholder="Lọc theo xu hướng"
                value={selectedSentiments}
                onChange={handleSentimentChange}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value={SignalSentiment.BULLISH}>Bullish</Option>
                <Option value={SignalSentiment.BEARISH}>Bearish</Option>
                <Option value={SignalSentiment.NEUTRAL}>Neutral</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                placeholder="Lọc theo trạng thái"
                value={selectedStatuses}
                onChange={handleStatusChange}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value={SignalStatus.NEW}>Mới</Option>
                <Option value={SignalStatus.ACTIVE}>Đang theo dõi</Option>
                <Option value={SignalStatus.COMPLETED}>Thành công</Option>
                <Option value={SignalStatus.FAILED}>Thất bại</Option>
                <Option value={SignalStatus.EXPIRED}>Hết hạn</Option>
              </Select>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
            <Col>
              <Space>
                <Text>Chỉ yêu thích:</Text>
                <Switch checked={favorites} onChange={setFavorites} />
              </Space>
            </Col>
            <Col>
              <Space>
                <Text>Đã đăng ký:</Text>
                <Switch checked={notified} onChange={setNotified} />
              </Space>
            </Col>
            <Col>
              <Space>
                <Text>Thời gian:</Text>
                <Select
                  value={timeFrame}
                  onChange={setTimeFrame}
                  style={{ width: 120 }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="today">Hôm nay</Option>
                  <Option value="week">Tuần này</Option>
                  <Option value="month">Tháng này</Option>
                </Select>
              </Space>
            </Col>
            <Col flex="auto" style={{ textAlign: 'right' }}>
              <Space>
                <Badge count={filteredSignals.length}>
                  <Button
                    type="primary"
                    icon={<SyncOutlined />}
                    onClick={() => dispatch(fetchSignals())}
                    loading={loading}
                  >
                    Làm mới
                  </Button>
                </Badge>
              </Space>
            </Col>
          </Row>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredSignals}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
        
        {/* Modal xem chi tiết tín hiệu */}
        <Modal
          title={currentSignal ? `Chi tiết tín hiệu - ${currentSignal.symbol}` : 'Chi tiết tín hiệu'}
          visible={isDetailModalVisible}
          onCancel={() => {
            setIsDetailModalVisible(false);
            setCurrentSignal(null);
          }}
          width={800}
          footer={[
            <Button key="close" onClick={() => {
              setIsDetailModalVisible(false);
              setCurrentSignal(null);
            }}>
              Đóng
            </Button>,
          ]}
        >
          {currentSignal ? (
            <div className="signal-detail">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="Thông tin cơ bản">
                    <p><strong>Symbol:</strong> {currentSignal.symbol}</p>
                    <p>
                      <strong>Loại:</strong> {' '}
                      <Tag color={
                        currentSignal.type === SignalType.PATTERN ? 'blue' :
                        currentSignal.type === SignalType.INDICATOR ? 'purple' :
                        currentSignal.type === SignalType.AI ? 'geekblue' : 'cyan'
                      }>
                        {currentSignal.type}
                      </Tag>
                    </p>
                    <p>
                      <strong>Xu hướng:</strong> {' '}
                      <Tag color={
                        currentSignal.sentiment === SignalSentiment.BULLISH ? 'green' :
                        currentSignal.sentiment === SignalSentiment.BEARISH ? 'red' : 'gray'
                      }>
                        {currentSignal.sentiment}
                      </Tag>
                    </p>
                    <p><strong>Thời gian:</strong> {new Date(currentSignal.timestamp).toLocaleString()}</p>
                    <p>
                      <strong>Trạng thái:</strong> {' '}
                      <Tag color={
                        currentSignal.status === SignalStatus.NEW ? 'blue' :
                        currentSignal.status === SignalStatus.ACTIVE ? 'processing' :
                        currentSignal.status === SignalStatus.COMPLETED ? 'success' :
                        currentSignal.status === SignalStatus.FAILED ? 'error' : 'default'
                      }>
                        {currentSignal.status}
                      </Tag>
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="Thông tin giao dịch">
                    <p><strong>Giá vào:</strong> {currentSignal.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</p>
                    <p>
                      <strong>Stop Loss:</strong> {' '}
                      {currentSignal.stopLoss 
                        ? currentSignal.stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })
                        : 'N/A'
                      }
                    </p>
                    <p>
                      <strong>Take Profit:</strong> {' '}
                      {currentSignal.takeProfit 
                        ? currentSignal.takeProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })
                        : 'N/A'
                      }
                    </p>
                    <p>
                      <strong>Độ tin cậy:</strong> {' '}
                      <Tag color={
                        currentSignal.confidence >= 70 ? 'green' :
                        currentSignal.confidence >= 50 ? 'gold' : 'red'
                      }>
                        {currentSignal.confidence}%
                      </Tag>
                    </p>
                    <p>
                      <strong>Tỷ lệ R:R:</strong> {' '}
                      {
                        currentSignal.stopLoss && currentSignal.takeProfit
                        ? (() => {
                            const risk = Math.abs(currentSignal.entryPrice - currentSignal.stopLoss);
                            const reward = Math.abs(currentSignal.takeProfit - currentSignal.entryPrice);
                            const ratio = (reward / risk).toFixed(2);
                            return `${ratio}:1`;
                          })()
                        : 'N/A'
                      }
                    </p>
                  </Card>
                </Col>
              </Row>
              
              <Card size="small" title="Phân tích" style={{ marginTop: 16 }}>
                <p>{currentSignal.analysis || 'Không có thông tin phân tích.'}</p>
              </Card>
              
              <Card size="small" title="Lịch sử cập nhật" style={{ marginTop: 16 }}>
                {currentSignal.updates && currentSignal.updates.length > 0 ? (
                  <ul>
                    {currentSignal.updates.map((update, index) => (
                      <li key={index}>
                        <Text>{new Date(update.timestamp).toLocaleString()}: {update.message}</Text>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text type="secondary">Không có cập nhật.</Text>
                )}
              </Card>
              
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  type={currentSignal.favorite ? 'default' : 'text'}
                  icon={currentSignal.favorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                  onClick={() => handleToggleFavorite(currentSignal.id, currentSignal.favorite)}
                >
                  {currentSignal.favorite ? 'Hủy yêu thích' : 'Yêu thích'}
                </Button>
                
                <Button
                  type={currentSignal.notified ? 'default' : 'text'}
                  icon={currentSignal.notified ? <BellFilled style={{ color: '#1890ff' }} /> : <BellOutlined />}
                  onClick={() => handleToggleNotification(currentSignal.id, currentSignal.notified)}
                >
                  {currentSignal.notified ? 'Hủy đăng ký thông báo' : 'Đăng ký thông báo'}
                </Button>
              </div>
            </div>
          ) : (
            <Skeleton active />
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default TradingSignals; 