import React, { useState } from 'react';
import { Button, Dropdown, Menu, Modal, Form, Select, DatePicker, message, Space } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

// Interface cho dữ liệu
interface DataItem {
  [key: string]: any;
}

interface DownloadReportProps {
  data: DataItem[];
  title: string;
  columns: { title: string; dataIndex: string; key: string }[];
  fileNamePrefix?: string;
}

const { Option } = Select;
const { RangePicker } = DatePicker;

const DownloadReport: React.FC<DownloadReportProps> = ({
  data,
  title,
  columns,
  fileNamePrefix = 'report'
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [form] = Form.useForm();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Excel (.xlsx)',
      icon: <FileExcelOutlined />,
      onClick: () => handleExportClick('excel')
    },
    {
      key: '2',
      label: 'PDF (.pdf)',
      icon: <FilePdfOutlined />,
      onClick: () => handleExportClick('pdf')
    }
  ];

  const handleExportClick = (type: 'pdf' | 'excel') => {
    setFormat(type);
    setIsModalVisible(true);
  };

  const generateFileName = () => {
    const date = new Date();
    const timestamp = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `${fileNamePrefix}_${timestamp}`;
  };

  const handleExport = (values: any) => {
    try {
      if (format === 'excel') {
        exportToExcel(values);
      } else if (format === 'pdf') {
        exportToPdf(values);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi xuất báo cáo:', error);
      message.error('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

  const exportToExcel = (values: any) => {
    // Giả lập xuất Excel
    // Trong dự án thực tế, bạn sẽ cần sử dụng thư viện như xlsx hoặc exceljs
    message.success('Đã xuất dữ liệu sang Excel');
    
    // Ví dụ về cách tạo và tải xuống file Excel
    const fileName = `${generateFileName()}.xlsx`;
    // Code xuất Excel thực tế sẽ được thêm vào đây
    simulateDownload(fileName);
  };

  const exportToPdf = (values: any) => {
    // Giả lập xuất PDF
    // Trong dự án thực tế, bạn sẽ cần sử dụng thư viện như jspdf
    message.success('Đã xuất dữ liệu sang PDF');
    
    // Ví dụ về cách tạo và tải xuống file PDF
    const fileName = `${generateFileName()}.pdf`;
    // Code xuất PDF thực tế sẽ được thêm vào đây
    simulateDownload(fileName);
  };

  // Hàm giả lập việc tải xuống (chỉ để demo)
  const simulateDownload = (fileName: string) => {
    // Trong dự án thực tế, đây sẽ là URL thực hoặc Blob từ dữ liệu được tạo
    const dummyContent = JSON.stringify({
      title,
      data: data.slice(0, 5),  // Lấy 5 mục đầu tiên cho demo
      exportTime: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button type="primary" icon={<DownloadOutlined />}>
          Tải xuống báo cáo
        </Button>
      </Dropdown>
      
      <Modal
        title={`Xuất báo cáo ${format === 'pdf' ? 'PDF' : 'Excel'}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleExport}>
          <Form.Item
            name="dateRange"
            label="Khoảng thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="includedData"
            label="Dữ liệu bao gồm"
            rules={[{ required: true, message: 'Vui lòng chọn dữ liệu cần xuất' }]}
            initialValue={['all']}
          >
            <Select mode="multiple" placeholder="Chọn các loại dữ liệu">
              <Option value="all">Tất cả dữ liệu</Option>
              <Option value="summary">Tóm tắt</Option>
              <Option value="details">Chi tiết giao dịch</Option>
              <Option value="performance">Hiệu suất</Option>
            </Select>
          </Form.Item>
          
          {format === 'pdf' && (
            <Form.Item
              name="pdfLayout"
              label="Định dạng PDF"
              initialValue="portrait"
            >
              <Select placeholder="Chọn định dạng">
                <Option value="portrait">Dọc (Portrait)</Option>
                <Option value="landscape">Ngang (Landscape)</Option>
              </Select>
            </Form.Item>
          )}
          
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={format === 'pdf' ? <FilePdfOutlined /> : <FileExcelOutlined />}
              >
                Xuất {format === 'pdf' ? 'PDF' : 'Excel'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DownloadReport; 