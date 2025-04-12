import React from 'react';
import { message, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ type, message: msg, description, duration = 3 }) => {
  const icons = {
    success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    warning: <WarningOutlined style={{ color: '#faad14' }} />
  };

  notification.open({
    message: msg,
    description,
    icon: icons[type],
    duration,
    placement: 'topRight'
  });

  return null;
};

export const showToast = (props: ToastProps) => {
  return <Toast {...props} />;
};

export const showSuccess = (message: string, description?: string) => {
  showToast({ type: 'success', message, description });
};

export const showError = (message: string, description?: string) => {
  showToast({ type: 'error', message, description });
};

export const showInfo = (message: string, description?: string) => {
  showToast({ type: 'info', message, description });
};

export const showWarning = (message: string, description?: string) => {
  showToast({ type: 'warning', message, description });
}; 