import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Typography, 
  Tag, 
  Button, 
  Statistic, 
  Space, 
  Tabs,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Alert,
  Tooltip,
  Divider,
  DatePicker,
  Progress
} from 'antd';
import { 
  LineChartOutlined, 
  AreaChartOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PieChartOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { 
  fetchPositions,
  fetchHistory,
  fetchStats,
  createPosition,
  updatePosition,
  closePosition
} from '../../slices/portfolioSlice';
import { fetchSymbols } from '../../slices/marketSlice';
import { AppDispatch, RootState } from '../../store';
import { Position, PositionStatus } from '../../types';
import PortfolioChart from '../../components/Portfolio/PortfolioChart';
import PerformanceStats from '../../components/Portfolio/PerformanceStats';
import ProfitLossChart from '../../components/Portfolio/ProfitLossChart';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

const PortfolioPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { positions, history, stats, loading, error } = useSelector((state: RootState) => state.portfolio);
  const { symbols } = useSelector((state: RootState) => state.market);
  
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCloseModalVisible, setIsCloseModalVisible] = useState<boolean>(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [closeForm] = Form.useForm();
  const [exportForm] = Form.useForm();
  
  // Lấy dữ liệu khi component mount
  useEffect(() => {
    dispatch(fetchPositions());
    dispatch(fetchHistory());
    dispatch(fetchStats());
    dispatch(fetchSymbols());
  }, [dispatch]);
  
  // Xử lý mở modal tạo vị thế
  const handleOpenCreateModal = () => {
    createForm.resetFields();
    setIsCreateModalVisible(true);
  };
  
  // Xử lý tạo vị thế mới
  const handleCreatePosition = (values: any) => {
    dispatch(createPosition(values)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setIsCreateModalVisible(false);
        createForm.resetFields();
      }
    });
  };
  
  // Xử lý mở modal chỉnh sửa vị thế
  const handleOpenEditModal = (position: Position) => {
    setCurrentPosition(position);
    editForm.setFieldsValue({
      stopLoss: position.stopLoss,
      takeProfit: position.takeProfit,
    });
    setIsEditModalVisible(true);
  };
  
  // Xử lý cập nhật vị thế
  const handleUpdatePosition = (values: any) => {
    if (currentPosition) {
      dispatch(updatePosition({
        id: currentPosition.id,
        ...values,
      })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          setIsEditModalVisible(false);
          setCurrentPosition(null);
        }
      });
    }
  };
  
  // Xử lý mở modal đóng vị thế
  const handleOpenCloseModal = (position: Position) => {
    setCurrentPosition(position);
    closeForm.setFieldsValue({
      exitPrice: 0, // Giá hiện tại của symbol
    });
    setIsCloseModalVisible(true);
  };
  
  // Xử lý đóng vị thế
  const handleClosePosition = (values: any) => {
    if (currentPosition) {
      dispatch(closePosition({
        id: currentPosition.id,
        ...values,
      })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          setIsCloseModalVisible(false);
          setCurrentPosition(null);
        }
      });
    }
  };
  
  // Xử lý xóa vị thế
  const handleDeletePosition = (id: string) => {
    confirm({
      title: 'Xác nhận xóa vị thế',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa vị thế này không?',
      onOk() {
        // Gọi API xóa vị thế
        console.log('Xóa vị thế:', id);
      },
    });
  };
  
  // Xử lý xuất dữ liệu
  const handleExportData = (values: any) => {
    console.log('Xuất dữ liệu:', values);
    setIsExportModalVisible(false);
  };
  
  // Định nghĩa cột cho bảng vị thế đang mở
  const openPositionsColumns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => (
        <Link to={`/market?symbol=${text}`}>
          <Text strong>{text}</Text>
        </Link>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'side',
      key: 'side',
      render: (side: 'LONG' | 'SHORT') => (
        <Tag color={side === 'LONG' ? 'green' : 'red'}>
          {side === 'LONG' ? 'Mua' : 'Bán'}
        </Tag>
      ),
    },
    {
      title: 'Khối lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text>{amount.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => (
        <Text>{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
      ),
    },
    {
      title: 'Giá hiện tại',
      key: 'currentPrice',
      render: (_, record: Position) => (
        // Giả sử chúng ta có giá hiện tại từ store
        <Text>{(record.entryPrice * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
      ),
    },
    {
      title: 'P&L',
      key: 'pnl',
      render: (_, record: Position) => {
        // Tính P&L tạm thời, điều này sẽ được thay thế bằng dữ liệu thực tế từ API
        const currentPrice = record.entryPrice * 1.05;
        const pnl = record.side === 'LONG'
          ? (currentPrice - record.entryPrice) * record.amount
          : (record.entryPrice - currentPrice) * record.amount;
        
        const pnlPercentage = record.side === 'LONG'
          ? ((currentPrice - record.entryPrice) / record.entryPrice) * 100
          : ((record.entryPrice - currentPrice) / record.entryPrice) * 100;
        
        return (
          <Text type={pnl >= 0 ? 'success' : 'danger'}>
            {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({pnlPercentage.toFixed(2)}%)
          </Text>
        );
      },
    },
    {
      title: 'Stop Loss',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      render: (stopLoss: number) => (
        stopLoss ? (
          <Text type="danger">{stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
        ) : (
          <Text type="secondary">N/A</Text>
        )
      ),
    },
    {
      title: 'Take Profit',
      dataIndex: 'takeProfit',
      key: 'takeProfit',
      render: (takeProfit: number) => (
        takeProfit ? (
          <Text type="success">{takeProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
        ) : (
          <Text type="secondary">N/A</Text>
        )
      ),
    },
    {
      title: 'Thời gian mở',
      dataIndex: 'openedAt',
      key: 'openedAt',
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
      title: 'Hành động',
      key: 'action',
      render: (_, record: Position) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<CloseCircleOutlined />}
            onClick={() => handleOpenCloseModal(record)}
          >
            Đóng
          </Button>
          <Button 
            type="text" 
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePosition(record.id)}
          />
        </Space>
      ),
    },
  ];
  
  // Định nghĩa cột cho bảng lịch sử giao dịch
  const historyColumns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => (
        <Link to={`/market?symbol=${text}`}>
          <Text strong>{text}</Text>
        </Link>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'side',
      key: 'side',
      render: (side: 'LONG' | 'SHORT') => (
        <Tag color={side === 'LONG' ? 'green' : 'red'}>
          {side === 'LONG' ? 'Mua' : 'Bán'}
        </Tag>
      ),
    },
    {
      title: 'Khối lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text>{amount.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => (
        <Text>{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
      ),
    },
    {
      title: 'Giá ra',
      dataIndex: 'exitPrice',
      key: 'exitPrice',
      render: (price: number) => (
        <Text>{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Text>
      ),
    },
    {
      title: 'P&L',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (pnl: number, record: Position) => (
        <Text type={pnl >= 0 ? 'success' : 'danger'}>
          {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({record.pnlPercentage?.toFixed(2)}%)
        </Text>
      ),
      sorter: (a: Position, b: Position) => (a.pnl || 0) - (b.pnl || 0),
    },
    {
      title: 'Thời gian mở',
      dataIndex: 'openedAt',
      key: 'openedAt',
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
      title: 'Thời gian đóng',
      dataIndex: 'closedAt',
      key: 'closedAt',
      render: (timestamp: string) => {
        if (!timestamp) return <Text type="secondary">N/A</Text>;
        
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
      render: (status: PositionStatus) => {
        const statusConfig = {
          [PositionStatus.OPEN]: { color: 'processing', text: 'Đang mở' },
          [PositionStatus.CLOSED]: { color: 'success', text: 'Đã đóng' },
          [PositionStatus.CANCELLED]: { color: 'default', text: 'Đã hủy' },
        };
        
        return (
          <Tag color={statusConfig[status].color}>
            {statusConfig[status].text}
          </Tag>
        );
      },
    },
  ];
  
  // Lọc vị thế đang mở
  const openPositions = positions.filter(position => position.status === PositionStatus.OPEN);
  
  return (
    <div className="portfolio-page">
      <Title level={2}>Danh mục đầu tư</Title>
      
      {error && (
        <Alert 
          message="Lỗi" 
          description="Không thể tải dữ liệu danh mục đầu tư. Vui lòng thử lại sau."
          type="error" 
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={stats?.totalValue || 0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng lợi nhuận/lỗ"
              value={stats?.totalPnl || 0}
              precision={2}
              valueStyle={{ color: (stats?.totalPnl || 0) >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={(stats?.totalPnl || 0) >= 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tỷ lệ thắng"
              value={stats?.winRate || 0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Biểu đồ danh mục">
            <PortfolioChart />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Biểu đồ lợi nhuận/lỗ">
            <ProfitLossChart />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="open">
          <TabPane tab="Vị thế đang mở" key="open">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenCreateModal}
              >
                Mở vị thế mới
              </Button>
              
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => setIsExportModalVisible(true)}
                >
                  Xuất dữ liệu
                </Button>
              </Space>
            </div>
            
            <Table 
              columns={openPositionsColumns} 
              dataSource={openPositions} 
              rowKey="id"
              loading={loading}
              pagination={false}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          
          <TabPane tab="Lịch sử giao dịch" key="history">
            <Table 
              columns={historyColumns} 
              dataSource={history} 
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          
          <TabPane tab="Thống kê" key="stats">
            <PerformanceStats stats={stats} />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* Modal tạo vị thế mới */}
      <Modal
        title="Mở vị thế mới"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreatePosition}
        >
          <Form.Item
            name="symbol"
            label="Symbol"
            rules={[{ required: true, message: 'Vui lòng chọn symbol' }]}
          >
            <Select 
              showSearch
              placeholder="Chọn symbol"
              optionFilterProp="children"
            >
              {symbols.map(symbol => (
                <Option key={symbol} value={symbol}>{symbol}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="side"
            label="Loại giao dịch"
            rules={[{ required: true, message: 'Vui lòng chọn loại giao dịch' }]}
          >
            <Select placeholder="Chọn loại giao dịch">
              <Option value="LONG">Mua (Long)</Option>
              <Option value="SHORT">Bán (Short)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="Khối lượng"
            rules={[{ required: true, message: 'Vui lòng nhập khối lượng' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0.00000001} 
              placeholder="Nhập khối lượng" 
            />
          </Form.Item>
          
          <Form.Item
            name="entryPrice"
            label="Giá vào"
            rules={[{ required: true, message: 'Vui lòng nhập giá vào' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0.00000001} 
              placeholder="Nhập giá vào" 
            />
          </Form.Item>
          
          <Form.Item
            name="leverage"
            label="Đòn bẩy"
            rules={[{ required: true, message: 'Vui lòng chọn đòn bẩy' }]}
          >
            <Select placeholder="Chọn đòn bẩy">
              <Option value={1}>1x</Option>
              <Option value={2}>2x</Option>
              <Option value={3}>3x</Option>
              <Option value={5}>5x</Option>
              <Option value={10}>10x</Option>
              <Option value={20}>20x</Option>
              <Option value={50}>50x</Option>
              <Option value={100}>100x</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="stopLoss"
            label="Stop Loss"
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0.00000001} 
              placeholder="Nhập giá stop loss" 
            />
          </Form.Item>
          
          <Form.Item
            name="takeProfit"
            label="Take Profit"
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0.00000001} 
              placeholder="Nhập giá take profit" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Mở vị thế
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal chỉnh sửa vị thế */}
      <Modal
        title="Chỉnh sửa vị thế"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setCurrentPosition(null);
        }}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdatePosition}
        >
          <Form.Item
            name="stopLoss"
            label="Stop Loss"
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0.00000001} 
              placeholder="Nhập giá stop loss" 
            />
          </Form.Item>
          
          <Form.Item
            name="takeProfit"
            label="Take Profit"
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0.00000001} 
              placeholder="Nhập giá take profit" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal đóng vị thế */}
      <Modal
        title="Đóng vị thế"
        visible={isCloseModalVisible}
        onCancel={() => {
          setIsCloseModalVisible(false);
          setCurrentPosition(null);
        }}
        footer={null}
      >
        <Form
          form={closeForm}
          layout="vertical"
          onFinish={handleClosePosition}
        >
          <Form.Item
            name="exitPrice"
            label="Giá đóng"
            rules={[{ required: true, message: 'Vui lòng nhập giá đóng' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0.00000001} 
              placeholder="Nhập giá đóng" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" danger htmlType="submit" loading={loading} block>
              Đóng vị thế
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal xuất dữ liệu */}
      <Modal
        title="Xuất dữ liệu"
        visible={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        footer={null}
      >
        <Form
          form={exportForm}
          layout="vertical"
          onFinish={handleExportData}
        >
          <Form.Item
            name="format"
            label="Định dạng"
            rules={[{ required: true, message: 'Vui lòng chọn định dạng' }]}
          >
            <Select placeholder="Chọn định dạng">
              <Option value="csv">CSV</Option>
              <Option value="pdf">PDF</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="Khoảng thời gian"
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<DownloadOutlined />} block>
              Xuất dữ liệu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PortfolioPage; 