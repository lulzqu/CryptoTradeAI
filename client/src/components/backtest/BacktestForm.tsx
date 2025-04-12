import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, Card, Alert, Spin } from 'antd';
import { DownloadOutlined, LineChartOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { saveBacktestResult } from '../../slices/backtestSlice';
import './BacktestForm.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface BacktestFormProps {
  onSubmit: (result: any) => void;
}

const BacktestForm: React.FC<BacktestFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const timeframes = ['5m', '15m', '30m', '1h', '4h', '1d', '1w'];
  const strategyTypes = ['MA Cross', 'RSI', 'MACD', 'Bollinger Bands', 'Ichimoku', 'Custom'];
  const indicatorOptions = [
    { label: 'MA (Moving Average)', value: 'MA' },
    { label: 'EMA (Exponential Moving Average)', value: 'EMA' },
    { label: 'RSI (Relative Strength Index)', value: 'RSI' },
    { label: 'MACD (Moving Average Convergence Divergence)', value: 'MACD' },
    { label: 'Bollinger Bands', value: 'BB' },
    { label: 'Stochastic', value: 'STOCH' },
    { label: 'ATR (Average True Range)', value: 'ATR' },
    { label: 'OBV (On-Balance Volume)', value: 'OBV' },
    { label: 'Ichimoku Cloud', value: 'ICHIMOKU' },
  ];

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      setError(null);

      // Format dates for API
      const dateRange = {
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
      };

      // Prepare request payload
      const payload = {
        ...values,
        ...dateRange,
        dateRange: undefined,
      };

      // API call to run backtest
      const response = await axios.post('/api/v1/backtest/run', payload);
      
      // Save result to Redux store
      dispatch(saveBacktestResult(response.data));

      // Call the onSubmit callback with the result
      onSubmit(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi chạy backtest');
    } finally {
      setLoading(false);
    }
  };

  const handleStrategyChange = (value: string) => {
    // Reset strategy-specific parameters when strategy changes
    form.setFieldsValue({
      params: {},
    });
  };

  return (
    <Card 
      title="Tạo Backtest" 
      className="backtest-form-card"
      extra={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => form.submit()}
          loading={loading}
        >
          Lưu & Chạy
        </Button>
      }
    >
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="backtest-error"
          closable
          onClose={() => setError(null)}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          initialCapital: 1000,
          feeRate: 0.1,
          timeframe: '1h',
          dateRange: [moment().subtract(3, 'months'), moment()],
        }}
      >
        <div className="form-row">
          <Form.Item
            name="symbol"
            label="Cặp giao dịch"
            rules={[{ required: true, message: 'Vui lòng chọn cặp giao dịch' }]}
            className="form-item"
          >
            <Input placeholder="Ví dụ: BTC/USDT" />
          </Form.Item>

          <Form.Item
            name="timeframe"
            label="Khung thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn khung thời gian' }]}
            className="form-item"
          >
            <Select>
              {timeframes.map(tf => (
                <Option key={tf} value={tf}>{tf}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item
            name="dateRange"
            label="Khoảng thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
            className="form-item"
          >
            <RangePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="initialCapital"
            label="Vốn ban đầu (USDT)"
            rules={[{ required: true, message: 'Vui lòng nhập vốn ban đầu' }]}
            className="form-item"
          >
            <InputNumber
              min={1}
              step={100}
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item
            name="strategyType"
            label="Loại chiến lược"
            rules={[{ required: true, message: 'Vui lòng chọn loại chiến lược' }]}
            className="form-item"
          >
            <Select onChange={handleStrategyChange}>
              {strategyTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="feeRate"
            label="Phí giao dịch (%)"
            rules={[{ required: true, message: 'Vui lòng nhập phí giao dịch' }]}
            className="form-item"
          >
            <InputNumber
              min={0}
              max={5}
              step={0.01}
              style={{ width: '100%' }}
              formatter={value => `${value}%`}
              parser={value => value!.replace('%', '')}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="indicators"
          label="Chỉ báo kỹ thuật"
          className="form-item-full"
        >
          <Select
            mode="multiple"
            placeholder="Chọn các chỉ báo kỹ thuật"
            options={indicatorOptions}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          className="form-item-full"
        >
          <Input.TextArea rows={4} placeholder="Mô tả ngắn gọn về chiến lược của bạn" />
        </Form.Item>

        <Form.Item className="form-actions">
          <Button 
            type="default" 
            onClick={() => form.resetFields()}
          >
            Đặt lại
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<LineChartOutlined />}
            loading={loading}
          >
            Chạy Backtest
          </Button>
        </Form.Item>
      </Form>

      {loading && (
        <div className="loading-overlay">
          <Spin size="large" />
          <p>Đang chạy backtest...</p>
        </div>
      )}
    </Card>
  );
};

export default BacktestForm; 