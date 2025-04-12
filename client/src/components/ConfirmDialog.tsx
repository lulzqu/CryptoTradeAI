import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmDialogProps {
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'error' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  const showConfirm = () => {
    Modal.confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      content,
      okText,
      cancelText,
      onOk: onConfirm,
      onCancel,
      okButtonProps: {
        danger: type === 'error'
      }
    });
  };

  return null;
};

export const showConfirmDialog = (props: ConfirmDialogProps) => {
  return <ConfirmDialog {...props} />;
};

export const showDeleteConfirm = (onConfirm: () => void, content = 'Are you sure you want to delete this item?') => {
  showConfirmDialog({
    title: 'Delete Confirmation',
    content,
    onConfirm,
    type: 'error',
    okText: 'Delete'
  });
};

export const showUpdateConfirm = (onConfirm: () => void, content = 'Are you sure you want to update this item?') => {
  showConfirmDialog({
    title: 'Update Confirmation',
    content,
    onConfirm,
    type: 'info'
  });
}; 