import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Table, Space, Statistic, Row, Col, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { runBacktest } from '../../slices/analysisSlice';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface BacktestResult {
  id: string;
  symbol: string;
  startDate: string;
  endDate: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  totalProfit: number;
  trades: Array<{
    id: string;
    entryDate: string;
    exitDate: string;
    entryPrice: number;
    exitPrice: number;
    profit: number;
    type: 'long' | 'short';
  }>;
}

const Backtest: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { backtestResults, error } = useSelector((state: RootState) => state.analysis);
  
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);
  
  const handleRunBacktest = async (values: any) => {
    try {
      setLoading(true);
      await dispatch(runBacktest({
        symbol: values.symbol,
        timeframe: values.timeframe,
        dateRange: values.dateRange,
        initialCapital: values.initialCapital,
        positionSize: values.positionSize,
        stopLoss: values.stopLoss
      }));
      message.success('Backtest hoàn thành');
    } catch (error) {
      message.error('Có lỗi xảy ra khi chạy backtest');
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Tổng giao dịch',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
    },
    {
      title: 'Tỷ lệ thắng',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: 'Hệ số lợi nhuận',
      dataIndex: 'profitFactor',
      key: 'profitFactor',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Lợi nhuận tổng',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Drawdown tối đa',
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      render: (value: number) => `${value.toFixed(2)}%`,
    },
  ];
  
  return (
    <Card title="Backtest Tín hiệu">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRunBacktest}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="symbol"
                label="Symbol"
                rules={[{ required: true, message: 'Vui lòng chọn symbol' }]}
              >
                <Select placeholder="Chọn symbol">
                  <Option value="BTCUSDT">BTC/USDT</Option>
                  <Option value="ETHUSDT">ETH/USDT</Option>
                  <Option value="BNBUSDT">BNB/USDT</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="timeframe"
                label="Khung thời gian"
                rules={[{ required: true, message: 'Vui lòng chọn khung thời gian' }]}
              >
                <Select placeholder="Chọn khung thời gian">
                  <Option value="1m">1 phút</Option>
                  <Option value="5m">5 phút</Option>
                  <Option value="15m">15 phút</Option>
                  <Option value="1h">1 giờ</Option>
                  <Option value="4h">4 giờ</Option>
                  <Option value="1d">1 ngày</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="dateRange"
                label="Khoảng thời gian"
                rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="initialCapital"
                label="Vốn ban đầu"
                rules={[{ required: true, message: 'Vui lòng nhập vốn ban đầu' }]}
              >
                <Input type="number" prefix="$" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="positionSize"
                label="Kích thước vị thế (%)"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước vị thế' }]}
              >
                <Input type="number" suffix="%" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="stopLoss"
                label="Stop Loss (%)"
                rules={[{ required: true, message: 'Vui lòng nhập stop loss' }]}
              >
                <Input type="number" suffix="%" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Chạy Backtest
            </Button>
          </Form.Item>
        </Form>
        
        {backtestResults.length > 0 && (
          <>
            <Table
              columns={columns}
              dataSource={backtestResults}
              rowKey="id"
              pagination={false}
            />
            
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tổng lợi nhuận"
                    value={backtestResults.reduce((sum: number, result: BacktestResult) => sum + result.totalProfit, 0)}
                    precision={2}
                    prefix="$"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tỷ lệ thắng trung bình"
                    value={backtestResults.reduce((sum: number, result: BacktestResult) => sum + result.winRate, 0) / backtestResults.length}
                    precision={2}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Hệ số lợi nhuận trung bình"
                    value={backtestResults.reduce((sum: number, result: BacktestResult) => sum + result.profitFactor, 0) / backtestResults.length}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Drawdown tối đa trung bình"
                    value={backtestResults.reduce((sum: number, result: BacktestResult) => sum + result.maxDrawdown, 0) / backtestResults.length}
                    precision={2}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Space>
    </Card>
  );
};

export default Backtest; 