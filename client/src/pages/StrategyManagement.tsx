import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Drawer,
  Tabs,
  Tooltip,
  Divider,
  message,
  Spin,
  Typography,
  Popconfirm,
  Steps
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  LineChartOutlined,
  CodeOutlined,
  AreaChartOutlined,
  SearchOutlined,
  ExperimentOutlined,
  RobotOutlined,
  QuestionCircleOutlined,
  PieChartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import CodeEditor from '@uiw/react-textarea-code-editor';

import { RootState } from '../store';
import { fetchStrategies, createStrategy, updateStrategy, deleteStrategy } from '../store/slices/strategySlice';
import './StrategyManagement.css';

const StrategyManagement: React.FC = () => {
  // ... existing code ...
};

// Thêm các alias cho biểu tượng theo cách đơn giản
const CustomAppstoreOutlined = () => <PieChartOutlined />;
const CustomUnorderedListOutlined = () => <LineChartOutlined />;

export default StrategyManagement; 