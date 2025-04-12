import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';

const { Option } = Select;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue={i18n.language}
      style={{ width: 120 }}
      onChange={handleLanguageChange}
      suffixIcon={<GlobalOutlined />}
    >
      <Option value="en">English</Option>
      <Option value="vi">Tiếng Việt</Option>
    </Select>
  );
};

export default LanguageSwitcher; 