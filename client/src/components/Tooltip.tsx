import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ title, children, placement = 'top' }) => {
  return (
    <AntTooltip title={title} placement={placement}>
      {children}
    </AntTooltip>
  );
};

export const InfoTooltip: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Tooltip title={title}>
      <QuestionCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
    </Tooltip>
  );
};

export default Tooltip; 