import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface DownloadSourceCodeProps {
  repoUrl?: string;
  label?: string;
}

const DownloadSourceCode: React.FC<DownloadSourceCodeProps> = ({
  repoUrl = "/api/download/source-code",
  label = "Tải xuống mã nguồn"
}) => {
  const handleDownload = () => {
    // Tạo một thẻ a để tải xuống
    const link = document.createElement('a');
    link.href = repoUrl;
    link.setAttribute('download', 'source-code.zip'); // Attribute download khiến trình duyệt tải file thay vì điều hướng
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      type="primary" 
      icon={<DownloadOutlined />} 
      onClick={handleDownload}
    >
      {label}
    </Button>
  );
};

export default DownloadSourceCode; 