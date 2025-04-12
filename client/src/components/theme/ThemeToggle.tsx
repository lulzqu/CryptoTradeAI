import React from 'react';
import { Switch, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import './ThemeToggle.css';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: (checked: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <Tooltip title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}>
      <Switch
        checked={isDarkMode}
        onChange={onToggle}
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
        className="theme-toggle"
      />
    </Tooltip>
  );
};

export default ThemeToggle; 