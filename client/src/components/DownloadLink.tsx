import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface DownloadLinkProps {
  url: string;
  filename: string;
  label?: string;
  buttonProps?: any;
  asButton?: boolean;
}

const DownloadLink: React.FC<DownloadLinkProps> = ({ 
  url, 
  filename, 
  label = 'Tải xuống', 
  buttonProps = {}, 
  asButton = true 
}) => {
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (asButton) {
    return (
      <Button
        icon={<DownloadOutlined />}
        onClick={handleDownload}
        {...buttonProps}
      >
        {label}
      </Button>
    );
  }

  return (
    <a
      href={url}
      download={filename}
      onClick={(e) => {
        if (!url.startsWith('http') && !url.startsWith('blob:')) {
          e.preventDefault();
          handleDownload();
        }
      }}
    >
      {label}
    </a>
  );
};

export default DownloadLink; 