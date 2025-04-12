import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Button, Tabs, Tooltip, Spin, Select, DatePicker, Modal, Form, Input, InputNumber, Space, Typography, Empty, Divider, Radio } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  PieChartOutlined,
  ReloadOutlined,
  PlusOutlined,
  SettingOutlined,
  SyncOutlined,
  DownloadOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  BarChartOutlined,
  DashboardOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Line, Pie } from '@ant-design/plots';
import moment from 'moment';
import { RootState } from '../store';
import { fetchPortfolioData, rebalancePortfolio, addAsset, removeAsset, updateAsset } from '../store/slices/portfolioSlice';
import './Portfolio.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Portfolio: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('assets');
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [portfolioModalVisible, setPortfolioModalVisible] = useState<boolean>(false);
  const [assetModalVisible, setAssetModalVisible] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetForm] = Form.useForm();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('main');
  
  // const { portfolios, loading: portfolioLoading } = useSelector((state: RootState) => state.portfolio);
  const portfolioLoading = false;
  
  useEffect(() => {
    loadPortfolioData();
  }, [dispatch, selectedPortfolio]);
  
  const loadPortfolioData = async () => {
    setLoading(true);
    // await dispatch(fetchPortfolioData(selectedPortfolio) as any);
    // Giả lập delay cho loading
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };
  
  const handleRebalance = async () => {
    try {
      // await dispatch(rebalancePortfolio(selectedPortfolio) as any);
      // Hiển thị thông báo thành công
    } catch (error) {
      // Hiển thị thông báo lỗi
    }
  };
  
  const handleAddAsset = async (values: any) => {
    try {
      // await dispatch(addAsset({
      //   portfolioId: selectedPortfolio,
      //   ...values,
      // }) as any);
      setAssetModalVisible(false);
      assetForm.resetFields();
    } catch (error) {
      // Hiển thị thông báo lỗi
    }
  };
  
  const handleEditAsset = (asset: any) => {
    setSelectedAsset(asset);
    assetForm.setFieldsValue({
      symbol: asset.symbol,
      amount: asset.amount,
      targetAllocation: asset.targetAllocation,
      buyPrice: asset.buyPrice,
    });
    setAssetModalVisible(true);
  };
  
  const handleUpdateAsset = async (values: any) => {
    if (!selectedAsset) return;
    
    try {
      // await dispatch(updateAsset({
      //   portfolioId: selectedPortfolio,
      //   assetId: selectedAsset.id,
      //   ...values,
      // }) as any);
      setAssetModalVisible(false);
      setSelectedAsset(null);
      assetForm.resetFields();
    } catch (error) {
      // Hiển thị thông báo lỗi
    }
  };
  
  const handleRemoveAsset = async (assetId: string) => {
    try {
      // await dispatch(removeAsset({
      //   portfolioId: selectedPortfolio,
      //   assetId,
      // }) as any);
    } catch (error) {
      // Hiển thị thông báo lỗi
    }
  };
  
  // Mock data
  const portfolio = {
    id: 'main',
    name: 'Danh mục chính',
    totalValue: 48000,
    profit24h: 2.5,
    profit7d: 5.8,
    profit30d: 12.3,
    assets: [
      {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.5,
        buyPrice: 28000,
        currentPrice: 30000,
        profit: 7.14,
        value: 15000,
        targetAllocation: 40,
        currentAllocation: 31.25,
      },
      {
        id: '2',
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 10,
        buyPrice: 1800,
        currentPrice: 1700,
        profit: -5.56,
        value: 17000,
        targetAllocation: 30,
        currentAllocation: 35.42,
      },
      {
        id: '3',
        symbol: 'BNB',
        name: 'Binance Coin',
        amount: 50,
        buyPrice: 300,
        currentPrice: 320,
        profit: 6.67,
        value: 16000,
        targetAllocation: 30,
        currentAllocation: 33.33,
      },
    ],
    historyData: Array(30).fill(0).map((_, i) => ({
      date: moment().subtract(29 - i, 'days').format('YYYY-MM-DD'),
      value: 38000 + Math.random() * 2000 * i / 5,
    })),
  };
  
  const availablePortfolios = [
    { id: 'main', name: 'Danh mục chính' },
    { id: 'crypto', name: 'Danh mục Crypto' },
    { id: 'stocks', name: 'Danh mục Cổ phiếu' },
  ];
  
  // Columns cho bảng tài sản
  const assetColumns = [
    {
      title: 'Tài sản',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string, record: any) => (
        <Space>
          <div className="asset-icon">{symbol.substring(0, 1)}</div>
          <div>
            <div>{symbol}</div>
            <Text type="secondary">{record.name}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: 'Giá mua',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      render: (price: number) => `$${price.toLocaleString()}`,
      sorter: (a: any, b: any) => a.buyPrice - b.buyPrice,
    },
    {
      title: 'Giá hiện tại',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => `$${price.toLocaleString()}`,
      sorter: (a: any, b: any) => a.currentPrice - b.currentPrice,
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (value: number) => (
        <Tag color={value >= 0 ? '#52c41a' : '#f5222d'}>
          {value >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(value).toFixed(2)}%
        </Tag>
      ),
      sorter: (a: any, b: any) => a.profit - b.profit,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a: any, b: any) => a.value - b.value,
    },
    {
      title: 'Phân bổ',
      key: 'allocation',
      render: (text: string, record: any) => (
        <div style={{ width: 150 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text type="secondary">Hiện tại: {record.currentAllocation.toFixed(2)}%</Text>
            <Text type="secondary">Mục tiêu: {record.targetAllocation}%</Text>
          </div>
          <Progress 
            percent={record.currentAllocation} 
            success={{ percent: record.targetAllocation }}
            showInfo={false}
            size="small"
          />
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: any) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditAsset(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleRemoveAsset(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Dữ liệu cho biểu đồ phân bổ
  const allocationPieData = portfolio.assets.map(asset => ({
    type: asset.symbol,
    value: asset.currentAllocation,
  }));
  
  const pieConfig = {
    data: allocationPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{name}: {percentage}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'right-top' as const,
    },
  };
  
  // Dữ liệu cho biểu đồ hiệu suất
  const getPerformanceData = () => {
    switch (timeframe) {
      case '7d':
        return portfolio.historyData.slice(-7);
      case '30d':
        return portfolio.historyData;
      case '90d':
        // Mock data cho 90 ngày
        return Array(90).fill(0).map((_, i) => ({
          date: moment().subtract(89 - i, 'days').format('YYYY-MM-DD'),
          value: 30000 + Math.random() * 5000 * Math.sin(i/10) + i * 200,
        }));
      default:
        return portfolio.historyData.slice(-7);
    }
  };
  
  const lineConfig = {
    data: getPerformanceData(),
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
  
  // Danh sách giao dịch gần đây
  const recentTransactions = [
    {
      id: '1',
      date: '2023-05-10',
      type: 'Mua',
      asset: 'BTC',
      amount: 0.1,
      price: 29500,
      value: 2950,
    },
    {
      id: '2',
      date: '2023-05-08',
      type: 'Bán',
      asset: 'ETH',
      amount: 2,
      price: 1850,
      value: 3700,
    },
    {
      id: '3',
      date: '2023-05-05',
      type: 'Mua',
      asset: 'BNB',
      amount: 10,
      price: 310,
      value: 3100,
    },
  ];
  
  const transactionColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Mua' ? '#52c41a' : '#f5222d'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Tài sản',
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ];
  
  if (loading || portfolioLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div className="portfolio">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <div className="portfolio-header">
              <div>
                <Select
                  value={selectedPortfolio}
                  onChange={setSelectedPortfolio}
                  style={{ width: 180 }}
                >
                  {availablePortfolios.map(p => (
                    <Option key={p.id} value={p.id}>{p.name}</Option>
                  ))}
                </Select>
              </div>
              <Space>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setPortfolioModalVisible(true)}
                >
                  Tạo danh mục
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadPortfolioData}
                >
                  Cập nhật
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng giá trị"
              value={portfolio.totalValue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Lợi nhuận 24h"
              value={portfolio.profit24h}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Lợi nhuận 7 ngày"
              value={portfolio.profit7d}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Lợi nhuận 30 ngày"
              value={portfolio.profit30d}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card 
            title="Hiệu suất danh mục" 
            extra={
              <div>
                <Button.Group>
                  <Button 
                    type={timeframe === '7d' ? 'primary' : 'default'} 
                    onClick={() => setTimeframe('7d')}
                  >
                    7D
                  </Button>
                  <Button 
                    type={timeframe === '30d' ? 'primary' : 'default'} 
                    onClick={() => setTimeframe('30d')}
                  >
                    30D
                  </Button>
                  <Button 
                    type={timeframe === '90d' ? 'primary' : 'default'} 
                    onClick={() => setTimeframe('90d')}
                  >
                    90D
                  </Button>
                </Button.Group>
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

        <Col span={24}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Tài sản" key="assets">
                <div className="tab-actions">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      setSelectedAsset(null);
                      assetForm.resetFields();
                      setAssetModalVisible(true);
                    }}
                  >
                    Thêm tài sản
                  </Button>
                  <Button 
                    icon={<SyncOutlined />} 
                    onClick={handleRebalance}
                  >
                    Cân bằng lại
                  </Button>
                </div>
                <Table 
                  columns={assetColumns} 
                  dataSource={portfolio.assets} 
                  rowKey="id" 
                  pagination={false} 
                />
              </TabPane>
              <TabPane tab="Giao dịch gần đây" key="transactions">
                <Table 
                  columns={transactionColumns} 
                  dataSource={recentTransactions} 
                  rowKey="id" 
                  pagination={false} 
                />
              </TabPane>
              <TabPane tab="Phân tích" key="analysis">
                <div className="analysis-content">
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12}>
                      <Card 
                        title="Thống kê rủi ro" 
                        size="small"
                      >
                        <div className="stat-item">
                          <span className="label">Sharpe Ratio:</span>
                          <span className="value">1.85</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Volatility:</span>
                          <span className="value">12.4%</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Max Drawdown:</span>
                          <span className="value">18.2%</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Beta:</span>
                          <span className="value">0.85</span>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card 
                        title="Hiệu suất theo khoảng thời gian" 
                        size="small"
                      >
                        <div className="stat-item">
                          <span className="label">1 tháng:</span>
                          <span className="value positive">+8.3%</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">3 tháng:</span>
                          <span className="value positive">+15.7%</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">6 tháng:</span>
                          <span className="value positive">+21.2%</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">1 năm:</span>
                          <span className="value positive">+42.8%</span>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Modal thêm/sửa tài sản */}
      <Modal
        title={selectedAsset ? "Cập nhật tài sản" : "Thêm tài sản mới"}
        visible={assetModalVisible}
        onCancel={() => setAssetModalVisible(false)}
        footer={null}
      >
        <Form
          form={assetForm}
          layout="vertical"
          onFinish={selectedAsset ? handleUpdateAsset : handleAddAsset}
        >
          <Form.Item
            name="symbol"
            label="Mã tài sản"
            rules={[{ required: true, message: 'Vui lòng nhập mã tài sản!' }]}
          >
            <Select
              showSearch
              placeholder="Chọn tài sản"
              disabled={!!selectedAsset}
              options={[
                { label: 'BTC - Bitcoin', value: 'BTC' },
                { label: 'ETH - Ethereum', value: 'ETH' },
                { label: 'BNB - Binance Coin', value: 'BNB' },
                { label: 'SOL - Solana', value: 'SOL' },
                { label: 'ADA - Cardano', value: 'ADA' },
                { label: 'XRP - Ripple', value: 'XRP' },
              ]}
            />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập số lượng"
              min={0}
              step={0.000001}
              precision={6}
            />
          </Form.Item>
          
          <Form.Item
            name="buyPrice"
            label="Giá mua"
            rules={[{ required: true, message: 'Vui lòng nhập giá mua!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập giá mua"
              min={0}
              prefix="$"
            />
          </Form.Item>
          
          <Form.Item
            name="targetAllocation"
            label="Phân bổ mục tiêu (%)"
            rules={[{ required: true, message: 'Vui lòng nhập phần trăm phân bổ!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập phần trăm phân bổ mục tiêu"
              min={0}
              max={100}
              suffix="%"
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                style={{ marginRight: 8 }}
                onClick={() => setAssetModalVisible(false)}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedAsset ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal tạo danh mục */}
      <Modal
        title="Tạo danh mục đầu tư mới"
        visible={portfolioModalVisible}
        onCancel={() => setPortfolioModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea placeholder="Mô tả danh mục" rows={4} />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Loại danh mục"
          >
            <Radio.Group>
              <Radio value="crypto">Tiền điện tử</Radio>
              <Radio value="stocks">Cổ phiếu</Radio>
              <Radio value="mixed">Hỗn hợp</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                style={{ marginRight: 8 }}
                onClick={() => setPortfolioModalVisible(false)}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo danh mục
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Portfolio; 