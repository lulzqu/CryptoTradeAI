import React, { useState } from 'react';
import { Card, Space, Typography, Radio, Row, Col } from 'antd';
import DownloadLink from './DownloadLink';

const { Title, Paragraph } = Typography;

const DownloadExample: React.FC = () => {
  const [buttonType, setButtonType] = useState<'default' | 'primary' | 'link' | 'text' | 'dashed'>('primary');
  
  // Giả lập tạo file để tải xuống
  const createFileUrl = (content: string, type: string): string => {
    const blob = new Blob([content], { type });
    return URL.createObjectURL(blob);
  };

  // Tạo một số ví dụ về file để tải xuống
  const csvData = 'Ngày,Giao dịch,Số lượng,Giá\n2023-01-01,BTC,0.1,45000\n2023-01-02,ETH,2,3000';
  const csvUrl = createFileUrl(csvData, 'text/csv');
  
  const jsonData = JSON.stringify({
    transactions: [
      { date: '2023-01-01', symbol: 'BTC', amount: 0.1, price: 45000 },
      { date: '2023-01-02', symbol: 'ETH', amount: 2, price: 3000 }
    ]
  }, null, 2);
  const jsonUrl = createFileUrl(jsonData, 'application/json');
  
  const textData = 'Đây là ví dụ về file văn bản.\nBạn có thể tải xuống file này.';
  const textUrl = createFileUrl(textData, 'text/plain');

  return (
    <Card title="Ví dụ về liên kết tải xuống">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Tùy chọn hiển thị</Title>
          <Radio.Group
            value={buttonType}
            onChange={(e) => setButtonType(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            <Radio.Button value="default">Mặc định</Radio.Button>
            <Radio.Button value="primary">Chính</Radio.Button>
            <Radio.Button value="dashed">Nét đứt</Radio.Button>
            <Radio.Button value="link">Liên kết</Radio.Button>
            <Radio.Button value="text">Văn bản</Radio.Button>
          </Radio.Group>
        </Col>

        <Col span={24}>
          <Title level={4}>Dạng nút</Title>
          <Space direction="horizontal" size="middle" style={{ marginBottom: 16 }}>
            <DownloadLink 
              url={csvUrl} 
              filename="giao-dich.csv" 
              label="Tải dữ liệu CSV" 
              buttonProps={{ type: buttonType }}
            />
            
            <DownloadLink 
              url={jsonUrl} 
              filename="giao-dich.json" 
              label="Tải dữ liệu JSON" 
              buttonProps={{ type: buttonType }}
            />
            
            <DownloadLink 
              url={textUrl} 
              filename="thong-tin.txt" 
              label="Tải file văn bản" 
              buttonProps={{ type: buttonType }}
            />
          </Space>
        </Col>
        
        <Col span={24}>
          <Title level={4}>Dạng liên kết</Title>
          <Space direction="vertical" size="middle">
            <DownloadLink 
              url={csvUrl} 
              filename="giao-dich.csv" 
              label="Tải dữ liệu CSV" 
              asButton={false}
            />
            
            <DownloadLink 
              url={jsonUrl} 
              filename="giao-dich.json" 
              label="Tải dữ liệu JSON" 
              asButton={false}
            />
            
            <DownloadLink 
              url={textUrl} 
              filename="thong-tin.txt" 
              label="Tải file văn bản" 
              asButton={false}
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DownloadExample; 