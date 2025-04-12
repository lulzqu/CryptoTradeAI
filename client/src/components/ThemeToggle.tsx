import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      checkedChildren={<BulbFilled />}
      unCheckedChildren={<BulbOutlined />}
      style={{
        backgroundColor: theme === 'dark' ? '#1890ff' : '#d9d9d9'
      }}
    />
  );
};

export default ThemeToggle; 