import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  toggleStrategy,
  executeStrategy,
  clearError,
  setCurrentStrategy
} from '../slices/autoTradingSlice';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Switch,
  Card,
  Row,
  Col,
  Dropdown,
  Menu
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import './AutoTrading.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Option } = Select;

const AutoTrading: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { strategies, loading, error } = useSelector((state: RootState) => state.autoTrading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchStrategies());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCreate = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (strategy: any) => {
    form.setFieldsValue(strategy);
    dispatch(setCurrentStrategy(strategy));
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteStrategy(id)).unwrap();
      message.success('Đã xóa chiến lược thành công');
    } catch (error) {
      message.error('Xóa chiến lược thất bại');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await dispatch(toggleStrategy(id)).unwrap();
      message.success('Đã cập nhật trạng thái chiến lược');
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleExecute = async (id: string) => {
    try {
      await dispatch(executeStrategy(id)).unwrap();
      message.success('Đã thực thi chiến lược thành công');
    } catch (error) {
      message.error('Thực thi chiến lược thất bại');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values._id) {
        await dispatch(updateStrategy({ id: values._id, data: values })).unwrap();
        message.success('Đã cập nhật chiến lược thành công');
      } else {
        await dispatch(createStrategy(values)).unwrap();
        message.success('Đã tạo chiến lược thành công');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  const handleExportCSV = () => {
    try {
      const data = strategies.map(strategy => ({
        'Tên chiến lược': strategy.name,
        'Cặp giao dịch': strategy.symbol,
        'Khung thời gian': strategy.timeframe,
        'Trạng thái': strategy.status === 'active' ? 'Hoạt động' : 'Tạm dừng',
        'Stop Loss': strategy.riskManagement.stopLoss,
        'Take Profit': strategy.riskManagement.takeProfit,
        'Kích thước vị thế tối đa': strategy.riskManagement.maxPositionSize,
        'Lỗ tối đa hàng ngày': strategy.riskManagement.maxDailyLoss,
        'Ngày tạo': new Date(strategy.createdAt).toLocaleDateString(),
        'Ngày cập nhật': new Date(strategy.updatedAt).toLocaleDateString()
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Chiến lược giao dịch');
      XLSX.writeFile(wb, 'chiến_lược_giao_dịch.xlsx');
      message.success('Xuất dữ liệu thành công');
    } catch (error) {
      message.error('Xuất dữ liệu thất bại');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const tableData = strategies.map(strategy => [
        strategy.name,
        strategy.symbol,
        strategy.timeframe,
        strategy.status === 'active' ? 'Hoạt động' : 'Tạm dừng',
        strategy.riskManagement.stopLoss,
        strategy.riskManagement.takeProfit,
        strategy.riskManagement.maxPositionSize,
        strategy.riskManagement.maxDailyLoss,
        new Date(strategy.createdAt).toLocaleDateString(),
        new Date(strategy.updatedAt).toLocaleDateString()
      ]);

      autoTable(doc, {
        head: [['Tên chiến lược', 'Cặp giao dịch', 'Khung thời gian', 'Trạng thái', 'Stop Loss', 'Take Profit', 'Kích thước vị thế tối đa', 'Lỗ tối đa hàng ngày', 'Ngày tạo', 'Ngày cập nhật']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 8 }
      });

      doc.save('chiến_lược_giao_dịch.pdf');
      message.success('Xuất dữ liệu thành công');
    } catch (error) {
      message.error('Xuất dữ liệu thất bại');
    }
  };

  const exportMenu = (
    <Menu>
      <Menu.Item key="csv" icon={<FileExcelOutlined />} onClick={handleExportCSV}>
        Xuất Excel
      </Menu.Item>
      <Menu.Item key="pdf" icon={<FilePdfOutlined />} onClick={handleExportPDF}>
        Xuất PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Tên chiến lược',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol'
    },
    {
      title: 'Khung thời gian',
      dataIndex: 'timeframe',
      key: 'timeframe'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <Switch
          checked={status === 'active'}
          onChange={() => handleToggle(record._id)}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => handleExecute(record._id)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="auto-trading">
      <Card
        title="Quản lý giao dịch tự động"
        extra={
          <Space>
            <Dropdown overlay={exportMenu} placement="bottomRight">
              <Button type="primary" icon={<DownloadOutlined />}>
                Xuất dữ liệu
              </Button>
            </Dropdown>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo chiến lược mới
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={strategies}
          loading={loading}
          rowKey="_id"
        />
      </Card>

      <Modal
        title={form.getFieldValue('_id') ? 'Cập nhật chiến lược' : 'Tạo chiến lược mới'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên chiến lược"
                rules={[{ required: true, message: 'Vui lòng nhập tên chiến lược' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="symbol"
                label="Cặp giao dịch"
                rules={[{ required: true, message: 'Vui lòng chọn cặp giao dịch' }]}
              >
                <Select>
                  <Option value="BTC/USDT">BTC/USDT</Option>
                  <Option value="ETH/USDT">ETH/USDT</Option>
                  <Option value="BNB/USDT">BNB/USDT</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="timeframe"
                label="Khung thời gian"
                rules={[{ required: true, message: 'Vui lòng chọn khung thời gian' }]}
              >
                <Select>
                  <Option value="1m">1 phút</Option>
                  <Option value="5m">5 phút</Option>
                  <Option value="15m">15 phút</Option>
                  <Option value="1h">1 giờ</Option>
                  <Option value="4h">4 giờ</Option>
                  <Option value="1d">1 ngày</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="inactive"
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Tạm dừng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="riskManagement"
            label="Quản lý rủi ro"
          >
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={['riskManagement', 'stopLoss']}
                    label="Stop Loss (%)"
                    rules={[{ required: true, message: 'Vui lòng nhập stop loss' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['riskManagement', 'takeProfit']}
                    label="Take Profit (%)"
                    rules={[{ required: true, message: 'Vui lòng nhập take profit' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={['riskManagement', 'maxPositionSize']}
                    label="Kích thước vị thế tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập kích thước vị thế' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['riskManagement', 'maxDailyLoss']}
                    label="Lỗ tối đa hàng ngày (%)"
                    rules={[{ required: true, message: 'Vui lòng nhập lỗ tối đa' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AutoTrading; 