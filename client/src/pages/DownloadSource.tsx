import React from 'react';
import { Card, Typography, Space } from 'antd';
import DownloadSourceCode from '../components/DownloadSourceCode';

const { Title, Paragraph } = Typography;

const DownloadSource: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>Tải xuống mã nguồn</Title>
          
          <Paragraph>
            Bạn có thể tải xuống toàn bộ mã nguồn của dự án CryptoTradeAI dưới dạng file ZIP.
            File ZIP sẽ bao gồm tất cả các file mã nguồn, trừ các thư mục node_modules và các file cấu hình nhạy cảm.
          </Paragraph>
          
          <Paragraph>
            <strong>Lưu ý:</strong> File tải xuống có thể khá lớn tùy thuộc vào kích thước của dự án.
            Vui lòng đảm bảo bạn có đủ dung lượng lưu trữ và kết nối internet ổn định.
          </Paragraph>
          
          <DownloadSourceCode />
        </Space>
      </Card>
    </div>
  );
};

export default DownloadSource; 