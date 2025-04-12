import React, { useState } from 'react';
import { Button, message, Spin } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

interface DownloadApiDataProps {
  apiUrl: string;
  filename: string;
  label?: string;
  buttonProps?: any;
  params?: any;
  requestConfig?: any;
  transformData?: (data: any) => any;
}

const DownloadApiData: React.FC<DownloadApiDataProps> = ({
  apiUrl,
  filename,
  label = 'Tải xuống dữ liệu',
  buttonProps = {},
  params = {},
  requestConfig = {},
  transformData
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Gọi API để lấy dữ liệu
      const response = await axios({
        url: apiUrl,
        method: 'GET',
        params,
        responseType: 'blob',
        ...requestConfig
      });

      let data = response.data;
      
      // Áp dụng chuyển đổi dữ liệu nếu cần
      if (transformData && response.headers['content-type'] !== 'application/octet-stream') {
        // Chỉ áp dụng chuyển đổi nếu dữ liệu không phải là blob
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const text = event.target?.result as string;
            const jsonData = JSON.parse(text);
            const transformedData = transformData(jsonData);
            
            // Tạo blob mới từ dữ liệu đã chuyển đổi
            const transformedBlob = new Blob(
              [JSON.stringify(transformedData)], 
              { type: 'application/json' }
            );
            
            // Tải xuống dữ liệu đã chuyển đổi
            downloadBlob(transformedBlob, filename);
          } catch (error) {
            console.error('Lỗi khi chuyển đổi dữ liệu:', error);
            message.error('Có lỗi xảy ra khi xử lý dữ liệu');
          } finally {
            setLoading(false);
          }
        };
        
        reader.readAsText(data);
        return;
      }
      
      // Tải xuống dữ liệu
      downloadBlob(data, filename);
      message.success('Tải xuống dữ liệu thành công');
    } catch (error) {
      console.error('Lỗi khi tải xuống dữ liệu:', error);
      message.error('Có lỗi xảy ra khi tải xuống dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, name: string) => {
    // Tạo URL từ blob
    const url = URL.createObjectURL(blob);
    
    // Tạo thẻ a để tải xuống
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      icon={loading ? <LoadingOutlined /> : <DownloadOutlined />}
      onClick={handleDownload}
      disabled={loading}
      {...buttonProps}
    >
      {loading ? <Spin size="small" /> : label}
    </Button>
  );
};

export default DownloadApiData; 