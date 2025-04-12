import React, { useState } from 'react';
import { Card, Tabs, Table, Statistic, Row, Col, Button, Tag, Tooltip, DatePicker } from 'antd';
import { 
  ArrowUpOutlined,
  ArrowDownOutlined, 
  DownloadOutlined,
  LineChartOutlined,
  SaveOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { CSVLink } from 'react-csv';
import { formatNumber, formatPercent, formatDate } from '../../utils/formatters';
import './BacktestResults.css';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryTime: string;
  exitTime: string;
  profit: number;
  profitPercent: number;
}

interface BacktestResult {
  id: string;
  symbol: string;
  timeframe: string;
  strategyType: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Trade[];
  equityCurve: { date: string; equity: number }[];
  drawdownCurve: { date: string; drawdown: number }[];
  monthlyReturns: { month: string; return: number }[];
}

interface BacktestResultsProps {
  result: BacktestResult;
  onSave?: () => void;
  onApplyStrategy?: () => void;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ 
  result,
  onSave,
  onApplyStrategy
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<[string, string] | null>(null);

  const filteredTrades = selectedDateRange 
    ? result.trades.filter(trade => {
        const entryTime = new Date(trade.entryTime).getTime();
        const startTime = new Date(selectedDateRange[0]).getTime();
        const endTime = new Date(selectedDateRange[1]).getTime();
        return entryTime >= startTime && entryTime <= endTime;
      })
    : result.trades;

  const csvData = [
    ['ID', 'Loại', 'Giá vào', 'Giá ra', 'Số lượng', 'Thời gian vào', 'Thời gian ra', 'Lợi nhuận', 'Lợi nhuận %'],
    ...filteredTrades.map(trade => [
      trade.id,
      trade.type,
      trade.entryPrice,
      trade.exitPrice,
      trade.quantity,
      trade.entryTime,
      trade.exitTime,
      trade.profit,
      trade.profitPercent
    ])
  ];

  const tradeColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'BUY' ? 'success' : 'error';
        const icon = type === 'BUY' ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        return (
          <Tag color={color} icon={icon}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: 'Giá vào',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => formatNumber(price),
    },
    {
      title: 'Giá ra',
      dataIndex: 'exitPrice',
      key: 'exitPrice',
      render: (price: number) => formatNumber(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => formatNumber(quantity, 6),
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render: (time: string) => formatDate(time),
    },
    {
      title: 'Thời gian ra',
      dataIndex: 'exitTime',
      key: 'exitTime',
      render: (time: string) => formatDate(time),
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => {
        const color = profit >= 0 ? 'green' : 'red';
        return <span style={{ color }}>{formatNumber(profit)}</span>;
      },
      sorter: (a: Trade, b: Trade) => a.profit - b.profit,
    },
    {
      title: 'Lợi nhuận %',
      dataIndex: 'profitPercent',
      key: 'profitPercent',
      render: (profit: number) => {
        const color = profit >= 0 ? 'green' : 'red';
        return <span style={{ color }}>{formatPercent(profit)}</span>;
      },
      sorter: (a: Trade, b: Trade) => a.profitPercent - b.profitPercent,
    },
  ];

  const equityConfig = {
    data: result.equityCurve,
    height: 400,
    xField: 'date',
    yField: 'equity',
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: '#5B8FF9',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Vốn', value: formatNumber(datum.equity) };
      },
    },
    xAxis: {
      title: {
        text: 'Ngày',
      },
    },
    yAxis: {
      title: {
        text: 'Vốn ($)',
      },
    },
  };

  const drawdownConfig = {
    data: result.drawdownCurve,
    height: 400,
    xField: 'date',
    yField: 'drawdown',
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: '#F4664A',
        stroke: '#F4664A',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Drawdown', value: formatPercent(datum.drawdown) };
      },
    },
    xAxis: {
      title: {
        text: 'Ngày',
      },
    },
    yAxis: {
      title: {
        text: 'Drawdown (%)',
      },
    },
  };

  const monthlyConfig = {
    data: result.monthlyReturns,
    height: 400,
    xField: 'month',
    yField: 'return',
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: '#5AD8A6',
        stroke: '#5AD8A6',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Lợi nhuận', value: formatPercent(datum.return) };
      },
    },
    xAxis: {
      title: {
        text: 'Tháng',
      },
    },
    yAxis: {
      title: {
        text: 'Lợi nhuận (%)',
      },
    },
  };

  const totalProfit = result.finalCapital - result.initialCapital;
  const totalProfitPercent = (totalProfit / result.initialCapital) * 100;

  return (
    <Card className="backtest-results-card">
      <div className="backtest-header">
        <div className="backtest-title">
          <h2>{result.symbol} - {result.strategyType} ({result.timeframe})</h2>
          <p>{formatDate(result.startDate)} - {formatDate(result.endDate)}</p>
        </div>
        <div className="backtest-actions">
          <Tooltip title="Lưu kết quả">
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={onSave}
            />
          </Tooltip>
          <Tooltip title="Áp dụng chiến lược">
            <Button 
              type="default" 
              icon={<LineChartOutlined />}
              onClick={onApplyStrategy}
            />
          </Tooltip>
          <Tooltip title="Chia sẻ kết quả">
            <Button 
              type="default" 
              icon={<ShareAltOutlined />}
            />
          </Tooltip>
          <CSVLink 
            data={csvData} 
            filename={`backtest_${result.symbol}_${result.timeframe}_${new Date().toISOString().split('T')[0]}.csv`}
          >
            <Button 
              type="default" 
              icon={<DownloadOutlined />}
            />
          </CSVLink>
        </div>
      </div>

      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Vốn ban đầu" 
            value={result.initialCapital} 
            precision={2} 
            prefix="$" 
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Vốn cuối cùng" 
            value={result.finalCapital} 
            precision={2} 
            prefix="$" 
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Lợi nhuận ròng" 
            value={totalProfit} 
            precision={2} 
            prefix="$"
            valueStyle={{ color: totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
            prefix={totalProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Lợi nhuận %" 
            value={totalProfitPercent} 
            precision={2} 
            suffix="%"
            valueStyle={{ color: totalProfitPercent >= 0 ? '#3f8600' : '#cf1322' }}
            prefix={totalProfitPercent >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Tổng giao dịch" 
            value={result.totalTrades} 
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Tỷ lệ thắng" 
            value={result.winRate} 
            precision={2}
            suffix="%" 
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Profit Factor" 
            value={result.profitFactor} 
            precision={2} 
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic 
            title="Max Drawdown" 
            value={result.maxDrawdown} 
            precision={2}
            suffix="%"
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="equity" className="backtest-tabs">
        <TabPane tab="Đường vốn" key="equity">
          <Line {...equityConfig} />
        </TabPane>
        <TabPane tab="Drawdown" key="drawdown">
          <Line {...drawdownConfig} />
        </TabPane>
        <TabPane tab="Lợi nhuận theo tháng" key="monthly">
          <Line {...monthlyConfig} />
        </TabPane>
        <TabPane tab="Giao dịch" key="trades">
          <div className="filter-container">
            <span>Lọc theo thời gian:</span>
            <RangePicker 
              onChange={(dates: any) => {
                if (dates) {
                  setSelectedDateRange([dates[0].toISOString(), dates[1].toISOString()]);
                } else {
                  setSelectedDateRange(null);
                }
              }}
            />
          </div>
          <Table 
            dataSource={filteredTrades} 
            columns={tradeColumns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default BacktestResults;