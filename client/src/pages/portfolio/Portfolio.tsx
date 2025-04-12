import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Tabs, Card, Row, Col, Table, Tag, Button, Statistic, 
  Progress, Divider, Space, Select, DatePicker, Typography,
  Popconfirm, Modal, Form, Input, InputNumber, Empty
} from 'antd';
import { 
  LineChartOutlined, PieChartOutlined, DollarOutlined, 
  HistoryOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  SettingOutlined, CloseCircleOutlined, ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchOpenPositions, fetchClosedPositions, 
  closePosition, updatePosition 
} from '../../store/slices/portfolioSlice';
import { Position, PositionStatus } from '../../types';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Portfolio: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openPositions, closedPositions, portfolioStats, isLoading, error } = 
    useSelector((state: RootState) => state.portfolio);
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [editForm] = Form.useForm();
  
  useEffect(() => {
    dispatch(fetchOpenPositions());
    dispatch(fetchClosedPositions());
  }, [dispatch]);
  
  // Hiển thị modal chỉnh sửa vị thế
  const showEditModal = (position: Position) => {
    setCurrentPosition(position);
    editForm.setFieldsValue({
      stopLoss: position.stopLoss,
      takeProfit1: position.takeProfits[0],
      takeProfit2: position.takeProfits[1],
      takeProfit3: position.takeProfits[2],
    });
    setIsEditModalVisible(true);
  };
  
  // Xử lý khi submit form chỉnh sửa
  const handleEditSubmit = async (values: any) => {
    if (currentPosition) {
      await dispatch(updatePosition({
        id: currentPosition.id,
        stopLoss: values.stopLoss,
        takeProfits: [values.takeProfit1, values.takeProfit2, values.takeProfit3]
      }));
      setIsEditModalVisible(false);
    }
  };
  
  // Xử lý đóng vị thế
  const handleClosePosition = async (position: Position) => {
    await dispatch(closePosition(position.id));
  };
  
  // Hàm lấy màu dựa trên lợi nhuận
  const getProfitColor = (value: number) => {
    if (value > 0) return '#3f8600';
    if (value < 0) return '#cf1322';
    return 'default';
  };
  
  // Hàm lấy màu dựa trên trạng thái vị thế
  const getPositionStatusColor = (status: PositionStatus) => {
    switch (status) {
      case PositionStatus.OPEN:
        return 'blue';
      case PositionStatus.CLOSED:
        return 'green';
      case PositionStatus.LIQUIDATED:
        return 'red';
      default:
        return 'default';
    }
  };
  
  // Cột cho bảng vị thế đang mở
  const openPositionsColumns = [
    {
      title: 'Coin',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: Position, b: Position) => a.symbol.localeCompare(b.symbol),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'LONG' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatCurrency(size),
      sorter: (a: Position, b: Position) => a.size - b.size,
    },
    {
      title: 'Đòn bẩy',
      dataIndex: 'leverage',
      key: 'leverage',
      render: (leverage: number) => `${leverage}x`,
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Giá hiện tại',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Lợi nhuận (USD)',
      key: 'profitUsd',
      render: (_, record: Position) => (
        <span style={{ color: getProfitColor(record.profitLoss) }}>
          {formatCurrency(record.profitLoss)}
        </span>
      ),
      sorter: (a: Position, b: Position) => a.profitLoss - b.profitLoss,
    },
    {
      title: 'Lợi nhuận (%)',
      key: 'profitPercent',
      render: (_, record: Position) => (
        <span style={{ color: getProfitColor(record.profitLossPercent) }}>
          {formatPercent(record.profitLossPercent)}
        </span>
      ),
    },
    {
      title: 'Stop Loss',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Take Profit',
      key: 'takeProfit',
      render: (_, record: Position) => (
        <span>{formatCurrency(record.takeProfits[0])}</span>
      ),
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render: (time: string) => formatDate(time),
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
            onClick={() => showEditModal(record)} 
          />
          <Popconfirm
            title="Bạn có chắc muốn đóng vị thế này?"
            onConfirm={() => handleClosePosition(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<CloseCircleOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  // Cột cho bảng lịch sử giao dịch
  const closedPositionsColumns = [
    {
      title: 'Coin',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'LONG' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatCurrency(size),
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Giá ra',
      dataIndex: 'exitPrice',
      key: 'exitPrice',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Lợi nhuận (USD)',
      key: 'profitUsd',
      render: (_, record: Position) => (
        <span style={{ color: getProfitColor(record.profitLoss) }}>
          {formatCurrency(record.profitLoss)}
        </span>
      ),
      sorter: (a: Position, b: Position) => a.profitLoss - b.profitLoss,
    },
    {
      title: 'Lợi nhuận (%)',
      key: 'profitPercent',
      render: (_, record: Position) => (
        <span style={{ color: getProfitColor(record.profitLossPercent) }}>
          {formatPercent(record.profitLossPercent)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: PositionStatus) => (
        <Tag color={getPositionStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render: (time: string) => formatDate(time),
    },
    {
      title: 'Thời gian ra',
      dataIndex: 'exitTime',
      key: 'exitTime',
      render: (time: string) => formatDate(time),
    },
  ];
  
  return (
    <div className="portfolio-container">
      <Title level={3}>Quản lý danh mục đầu tư</Title>
      
      <Tabs defaultActiveKey="1">
        <TabPane 
          tab={<span><PieChartOutlined />Tổng quan danh mục</span>} 
          key="1"
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng giá trị danh mục"
                  value={portfolioStats?.totalValue || 0}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Lợi nhuận hôm nay"
                  value={portfolioStats?.dailyProfit || 0}
                  precision={2}
                  valueStyle={{ color: getProfitColor(portfolioStats?.dailyProfit || 0) }}
                  prefix={portfolioStats?.dailyProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng số vị thế đang mở"
                  value={openPositions?.length || 0}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tỷ lệ thắng (30 ngày)"
                  value={portfolioStats?.winRate || 0}
                  suffix="%"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Phân bổ tài sản" style={{ height: 400 }}>
                {portfolioStats?.assetAllocation ? (
                  <div className="pie-chart-container">
                    {/* Pie chart for asset allocation will be here */}
                    <div style={{ textAlign: 'center', paddingTop: 120 }}>
                      [Biểu đồ phân bổ tài sản]
                    </div>
                  </div>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Hiệu suất danh mục" style={{ height: 400 }}>
                {portfolioStats?.performanceHistory ? (
                  <div className="line-chart-container">
                    {/* Line chart for portfolio performance will be here */}
                    <div style={{ textAlign: 'center', paddingTop: 120 }}>
                      [Biểu đồ hiệu suất danh mục]
                    </div>
                  </div>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Chỉ số quan trọng">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Title level={5}>Drawdown hiện tại</Title>
                    <Progress 
                      percent={portfolioStats?.currentDrawdown || 0} 
                      status={
                        (portfolioStats?.currentDrawdown || 0) > 20 ? 'exception' : 'normal'
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <Title level={5}>Risk Exposure</Title>
                    <Progress 
                      percent={portfolioStats?.riskExposure || 0} 
                      status={
                        (portfolioStats?.riskExposure || 0) > 70 ? 'exception' : 'normal'
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <Title level={5}>Profit Factor</Title>
                    <Statistic
                      value={portfolioStats?.profitFactor || 0}
                      precision={2}
                      valueStyle={{ 
                        color: (portfolioStats?.profitFactor || 0) > 1.5 ? '#3f8600' : '#cf1322' 
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><DollarOutlined />Vị thế đang mở</span>} 
          key="2"
        >
          <Card>
            <Table 
              dataSource={openPositions || []}
              columns={openPositionsColumns}
              rowKey="id"
              scroll={{ x: 1500 }}
              loading={isLoading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
          
          {/* Modal chỉnh sửa vị thế */}
          <Modal
            title="Chỉnh sửa vị thế"
            visible={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            <Form
              form={editForm}
              layout="vertical"
              onFinish={handleEditSubmit}
            >
              <Form.Item
                name="stopLoss"
                label="Stop Loss"
                rules={[{ required: true, message: 'Vui lòng nhập Stop Loss!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Nhập giá Stop Loss"
                />
              </Form.Item>
              
              <Form.Item
                name="takeProfit1"
                label="Take Profit 1"
                rules={[{ required: true, message: 'Vui lòng nhập Take Profit 1!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Nhập giá Take Profit 1"
                />
              </Form.Item>
              
              <Form.Item
                name="takeProfit2"
                label="Take Profit 2"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Nhập giá Take Profit 2"
                />
              </Form.Item>
              
              <Form.Item
                name="takeProfit3"
                label="Take Profit 3"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Nhập giá Take Profit 3"
                />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>
        
        <TabPane 
          tab={<span><HistoryOutlined />Lịch sử giao dịch</span>} 
          key="3"
        >
          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Select defaultValue="all" style={{ width: 120, marginRight: 16 }}>
                  <Option value="all">Tất cả</Option>
                  <Option value="long">Long</Option>
                  <Option value="short">Short</Option>
                </Select>
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="win">Thắng</Option>
                  <Option value="loss">Thua</Option>
                  <Option value="liquidated">Bị thanh lý</Option>
                </Select>
              </div>
              <RangePicker />
            </div>
            
            <Table 
              dataSource={closedPositions || []}
              columns={closedPositionsColumns}
              rowKey="id"
              scroll={{ x: 1300 }}
              loading={isLoading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><LineChartOutlined />Phân tích hiệu suất</span>} 
          key="4"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Phân tích hiệu suất theo thời gian">
                <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  [Biểu đồ hiệu suất theo thời gian]
                </div>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Phân tích hiệu suất theo coin">
                <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  [Biểu đồ hiệu suất theo coin]
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Phân tích hiệu suất theo loại setup">
                <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  [Biểu đồ hiệu suất theo loại setup]
                </div>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Các chỉ số hiệu suất quan trọng">
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Statistic
                      title="Tổng số giao dịch"
                      value={portfolioStats?.totalTrades || 0}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Tỷ lệ thắng"
                      value={portfolioStats?.winRate || 0}
                      suffix="%"
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Lợi nhuận trung bình mỗi giao dịch"
                      value={portfolioStats?.avgProfit || 0}
                      precision={2}
                      valueStyle={{ color: getProfitColor(portfolioStats?.avgProfit || 0) }}
                      suffix="%"
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Drawdown lớn nhất"
                      value={portfolioStats?.maxDrawdown || 0}
                      suffix="%"
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Portfolio; 