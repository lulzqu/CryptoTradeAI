import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './GuideTooltip.css';

interface GuideTooltipProps {
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

const GuideTooltip: React.FC<GuideTooltipProps> = ({
  title,
  content,
  placement = 'top'
}) => {
  return (
    <Tooltip
      title={
        <div className="guide-tooltip-content">
          <h4>{title}</h4>
          <p>{content}</p>
        </div>
      }
      placement={placement}
      color="white"
      overlayClassName="guide-tooltip"
    >
      <QuestionCircleOutlined className="guide-tooltip-icon" />
    </Tooltip>
  );
};

export default GuideTooltip; 