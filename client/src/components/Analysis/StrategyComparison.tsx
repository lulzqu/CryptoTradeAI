import React, { useState, useEffect } from 'react';
import { Card, Table, Select, DatePicker, Space, Statistic, Row, Col, message } from 'antd';
import { Line } from '@ant-design/charts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchStrategyPerformance } from '../../slices/analysisSlice';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface StrategyPerformance {
  id: string;
  name: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  performanceData: Array<{
    date: string;
    equity: number;
  }>;
}

const StrategyComparison: React.FC = () => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  
  const dispatch = useDispatch<AppDispatch>();
  const { strategies, loading, error } = useSelector((state: RootState) => state.analysis);
  
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);
  
  const handleStrategyChange = (values: string[]) => {
    setSelectedStrategies(values);
    if (dateRange[0] && dateRange[1]) {
      dispatch(fetchStrategyPerformance({
        strategies: values,
        startDate: dateRange[0],
        endDate: dateRange[1]
      }));
    }
  };
  
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    if (selectedStrategies.length > 0) {
      dispatch(fetchStrategyPerformance({
        strategies: selectedStrategies,
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      }));
    }
  };
  
  const config = {
    data: strategies
      .filter(s => selectedStrategies.includes(s.id))
      .map(s => ({
        name: s.name,
        data: s.performanceData
      })),
    xField: 'date',
    yField: 'equity',
    seriesField: 'name',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };
  
  const columns = [
    {
      title: 'Chiến lược',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Lợi nhuận trung bình',
      dataIndex: 'averageWin',
      key: 'averageWin',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Thua lỗ trung bình',
      dataIndex: 'averageLoss',
      key: 'averageLoss',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Drawdown tối đa',
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      render: (value: number) => `${value.toFixed(2)}%`,
    },
  ];
  
  return (
    <Card title="So sánh hiệu suất chiến lược">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space>
          <Select
            mode="multiple"
            style={{ width: 300 }}
            placeholder="Chọn chiến lược"
            onChange={handleStrategyChange}
            value={selectedStrategies}
          >
            {strategies.map(strategy => (
              <Option key={strategy.id} value={strategy.id}>
                {strategy.name}
              </Option>
            ))}
          </Select>
          
          <RangePicker onChange={handleDateRangeChange} />
        </Space>
        
        {selectedStrategies.length > 0 && (
          <>
            <Line {...config} />
            
            <Table
              columns={columns}
              dataSource={strategies.filter(s => selectedStrategies.includes(s.id))}
              rowKey="id"
              loading={loading}
              pagination={false}
            />
            
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Chiến lược tốt nhất"
                    value={strategies
                      .filter(s => selectedStrategies.includes(s.id))
                      .sort((a, b) => b.winRate - a.winRate)[0]?.name}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tỷ lệ thắng cao nhất"
                    value={Math.max(...strategies
                      .filter(s => selectedStrategies.includes(s.id))
                      .map(s => s.winRate))}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Hệ số lợi nhuận tốt nhất"
                    value={Math.max(...strategies
                      .filter(s => selectedStrategies.includes(s.id))
                      .map(s => s.profitFactor))}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Drawdown thấp nhất"
                    value={Math.min(...strategies
                      .filter(s => selectedStrategies.includes(s.id))
                      .map(s => s.maxDrawdown))}
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

export default StrategyComparison; 