import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBacktest } from '../hooks/useBacktest';
import { Backtest as BacktestType, BacktestRequest } from '../types/backtest';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  message,
  Statistic,
  Row,
  Col,
  Progress,
  Alert,
  Spin
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  BarChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './Backtest.css';
import { debounce } from 'lodash';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const Backtest: React.FC = () => {
  const { t } = useTranslation();
  const {
    backtests,
    currentBacktest,
    loading,
    error,
    loadBacktests,
    loadBacktest,
    addBacktest,
    startBacktest,
    removeBacktest
  } = useBacktest();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Memoize các hàm xử lý để tránh re-render không cần thiết
  const handleCreateBacktest = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
  }, [form]);

  const handleDeleteBacktest = useCallback(async (id: string) => {
    try {
      await removeBacktest(id);
      message.success(t('backtest.deleted'));
    } catch (error) {
      message.error(t('backtest.error'));
      console.error('Delete backtest error:', error);
    }
  }, [removeBacktest, t]);

  // Debounce hàm loadBacktests để tránh gọi quá nhiều lần
  const debouncedLoadBacktests = useMemo(
    () => debounce((userId: string) => loadBacktests(userId), 500),
    [loadBacktests]
  );

  // Retry mechanism cho việc load dữ liệu
  const loadBacktestsWithRetry = useCallback(async (userId: string) => {
    try {
      await loadBacktests(userId);
      setRetryCount(0);
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadBacktestsWithRetry(userId);
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff
      } else {
        message.error(t('backtest.maxRetriesReached'));
      }
    }
  }, [loadBacktests, retryCount, t]);

  useEffect(() => {
    // TODO: Replace with actual user ID
    loadBacktestsWithRetry('current-user-id');
    
    return () => {
      debouncedLoadBacktests.cancel();
    };
  }, [loadBacktestsWithRetry, debouncedLoadBacktests]);

  const handleModalOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;
      
      if (!startDate || !endDate) {
        throw new Error('Invalid date range');
      }

      const backtestRequest: BacktestRequest = {
        strategyId: values.strategyId,
        symbol: values.symbol.toUpperCase().trim(), // Normalize symbol
        timeframe: values.timeframe,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        initialBalance: values.initialBalance
      };

      // Validate dates
      if (backtestRequest.startDate >= backtestRequest.endDate) {
        throw new Error(t('backtest.invalidDateRange'));
      }

      // Validate initial balance
      if (backtestRequest.initialBalance <= 0) {
        throw new Error(t('backtest.invalidBalance'));
      }

      await startBacktest(backtestRequest);
      setIsModalVisible(false);
      form.resetFields();
      message.success(t('backtest.created'));
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error(t('backtest.error'));
      }
      console.error('Create backtest error:', error);
    }
  }, [form, startBacktest, t]);

  // Memoize columns để tránh re-render không cần thiết
  const columns = useMemo(() => [
    {
      title: t('backtest.symbol'),
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: BacktestType, b: BacktestType) => a.symbol.localeCompare(b.symbol)
    },
    {
      title: t('backtest.timeframe'),
      dataIndex: 'timeframe',
      key: 'timeframe',
      filters: [
        { text: '1m', value: '1m' },
        { text: '5m', value: '5m' },
        { text: '15m', value: '15m' },
        { text: '1h', value: '1h' },
        { text: '4h', value: '4h' },
        { text: '1d', value: '1d' }
      ],
      onFilter: (value: string, record: BacktestType) => record.timeframe === value
    },
    {
      title: t('backtest.startDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: BacktestType, b: BacktestType) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    },
    {
      title: t('backtest.endDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: BacktestType, b: BacktestType) => 
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    },
    {
      title: t('backtest.initialBalance'),
      dataIndex: 'initialBalance',
      key: 'initialBalance',
      render: (value: number) => `$${value.toFixed(2)}`,
      sorter: (a: BacktestType, b: BacktestType) => a.initialBalance - b.initialBalance
    },
    {
      title: t('backtest.finalBalance'),
      dataIndex: 'finalBalance',
      key: 'finalBalance',
      render: (value: number) => `$${value.toFixed(2)}`,
      sorter: (a: BacktestType, b: BacktestType) => a.finalBalance - b.finalBalance
    },
    {
      title: t('backtest.winRate'),
      dataIndex: 'winRate',
      key: 'winRate',
      render: (value: number) => `${value.toFixed(2)}%`,
      sorter: (a: BacktestType, b: BacktestType) => a.winRate - b.winRate
    },
    {
      title: t('backtest.actions'),
      key: 'actions',
      render: (_: any, record: BacktestType) => (
        <Space>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => loadBacktest(record._id)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBacktest(record._id)}
          />
        </Space>
      )
    }
  ], [t, loadBacktest, handleDeleteBacktest]);

  // Error boundary component
  if (error) {
    return (
      <Alert
        message={t('backtest.error')}
        description={error}
        type="error"
        showIcon
        action={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadBacktestsWithRetry('current-user-id')}
          >
            {t('common.retry')}
          </Button>
        }
      />
    );
  }

  return (
    <div className="backtest-container">
      <div className="backtest-header">
        <h2>{t('backtest.title')}</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateBacktest}
          disabled={loading}
        >
          {t('backtest.create')}
        </Button>
      </div>

      {currentBacktest && (
        <Card className="backtest-details">
          <Spin spinning={loading}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title={t('backtest.totalTrades')}
                  value={currentBacktest.totalTrades}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('backtest.winRate')}
                  value={currentBacktest.winRate}
                  suffix="%"
                  valueStyle={{ 
                    color: currentBacktest.winRate >= 50 ? '#3f8600' : '#cf1322'
                  }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('backtest.profitFactor')}
                  value={currentBacktest.profitFactor}
                  precision={2}
                  valueStyle={{ 
                    color: currentBacktest.profitFactor > 1 ? '#3f8600' : '#cf1322'
                  }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('backtest.maxDrawdown')}
                  value={currentBacktest.maxDrawdown}
                  suffix="%"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Progress
                  percent={currentBacktest.winRate}
                  success={{ percent: currentBacktest.winRate }}
                  format={percent => `${percent}% ${t('backtest.winRate')}`}
                  status={currentBacktest.winRate >= 50 ? 'success' : 'exception'}
                />
              </Col>
              <Col span={12}>
                <Progress
                  percent={Math.abs(currentBacktest.maxDrawdown)}
                  status="exception"
                  format={percent => `${percent}% ${t('backtest.maxDrawdown')}`}
                />
              </Col>
            </Row>
          </Spin>
        </Card>
      )}

      <Table
        columns={columns}
        dataSource={backtests}
        loading={loading}
        rowKey="_id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => t('common.totalItems', { total })
        }}
        scroll={{ x: true }}
      />

      <Modal
        title={t('backtest.create')}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          validateMessages={{
            required: t('common.fieldRequired'),
            types: {
              number: t('common.invalidNumber')
            }
          }}
        >
          <Form.Item
            name="strategyId"
            label={t('backtest.strategy')}
            rules={[{ required: true }]}
          >
            <Select>
              {/* TODO: Add strategy options */}
              <Option value="strategy1">Strategy 1</Option>
              <Option value="strategy2">Strategy 2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="symbol"
            label={t('backtest.symbol')}
            rules={[
              { required: true },
              { pattern: /^[A-Z0-9/]+$/, message: t('backtest.invalidSymbol') }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="timeframe"
            label={t('backtest.timeframe')}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="1m">1 Minute</Option>
              <Option value="5m">5 Minutes</Option>
              <Option value="15m">15 Minutes</Option>
              <Option value="1h">1 Hour</Option>
              <Option value="4h">4 Hours</Option>
              <Option value="1d">1 Day</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label={t('backtest.dateRange')}
            rules={[{ required: true }]}
          >
            <RangePicker 
              showTime 
              disabledDate={current => current && current > new Date()}
            />
          </Form.Item>

          <Form.Item
            name="initialBalance"
            label={t('backtest.initialBalance')}
            rules={[
              { required: true },
              { type: 'number', min: 0 }
            ]}
          >
            <InputNumber
              min={0}
              step={100}
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 