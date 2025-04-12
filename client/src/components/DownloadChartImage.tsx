import React, { RefObject } from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface DownloadChartImageProps {
  chartRef: RefObject<HTMLDivElement>;
  filename: string;
  buttonProps?: any;
}

const DownloadChartImage: React.FC<DownloadChartImageProps> = ({ 
  chartRef, 
  filename, 
  buttonProps = {} 
}) => {
  
  const handleDownload = () => {
    if (!chartRef.current) {
      message.error('Không thể tải xuống biểu đồ');
      return;
    }

    // Tìm canvas trong container biểu đồ
    const canvas = chartRef.current.querySelector('canvas');
    if (!canvas) {
      message.error('Không tìm thấy biểu đồ để tải xuống');
      return;
    }

    try {
      // Tạo link để tải xuống
      const link = document.createElement('a');
      link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
      
      // Chuyển đổi canvas thành URL hình ảnh
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Tải xuống biểu đồ thành công');
    } catch (error) {
      console.error('Lỗi khi tải xuống biểu đồ:', error);
      message.error('Có lỗi xảy ra khi tải xuống biểu đồ');
    }
  };

  return (
    <Button
      icon={<DownloadOutlined />}
      onClick={handleDownload}
      {...buttonProps}
    >
      Lưu biểu đồ
    </Button>
  );
};

export default DownloadChartImage; 