import React, { useState } from 'react';
import { Card, Table, Button, Tooltip, Input, Tag, Space, Empty } from 'antd';
import { 
  EyeOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  DownloadOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { formatDate, formatNumber, formatPercent } from '../../utils/formatters';
import { BacktestResult } from '../../slices/backtestSlice';
import './SavedBacktests.css';

interface SavedBacktestsProps {
  backtests: BacktestResult[];
  onDelete: (id: string) => void;
  onView: (backtest: BacktestResult) => void;
}

const SavedBacktests: React.FC<SavedBacktestsProps> = ({ 
  backtests,
  onDelete,
  onView
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredBacktests = backtests.filter(backtest => 
    backtest.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
    backtest.strategyType.toLowerCase().includes(searchText.toLowerCase())
  );

  const csvData = [
    ['ID', 'Cặp giao dịch', 'Loại chiến lược', 'Khung thời gian', 'Ngày bắt đầu', 'Ngày kết thúc', 'Vốn ban đầu', 'Vốn cuối cùng', 'Lợi nhuận', 'Lợi nhuận %', 'Số giao dịch', 'Tỷ lệ thắng', 'Profit Factor', 'Max Drawdown'],
    ...backtests.map(b => [
      b.id,
      b.symbol,
      b.strategyType,
      b.timeframe,
      b.startDate,
      b.endDate,
      b.initialCapital,
      b.finalCapital,
      b.finalCapital - b.initialCapital,
      ((b.finalCapital - b.initialCapital) / b.initialCapital) * 100,
      b.totalTrades,
      b.winRate,
      b.profitFactor,
      b.maxDrawdown
    ])
  ];

  const columns = [
    {
      title: 'Cặp giao dịch',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: BacktestResult, b: BacktestResult) => a.symbol.localeCompare(b.symbol),
    },
    {
      title: 'Chiến lược',
      dataIndex: 'strategyType',
      key: 'strategyType',
      sorter: (a: BacktestResult, b: BacktestResult) => a.strategyType.localeCompare(b.strategyType),
    },
    {
      title: 'Thời gian',
      dataIndex: 'timeframe',
      key: 'timeframe',
      sorter: (a: BacktestResult, b: BacktestResult) => a.timeframe.localeCompare(b.timeframe),
    },
    {
      title: 'Khoảng thời gian',
      key: 'dateRange',
      render: (text: string, record: BacktestResult) => (
        <span>{formatDate(record.startDate)} - {formatDate(record.endDate)}</span>
      ),
    },
    {
      title: 'Lợi nhuận',
      key: 'profit',
      render: (text: string, record: BacktestResult) => {
        const profit = record.finalCapital - record.initialCapital;
        const profitPercent = (profit / record.initialCapital) * 100;
        const isPositive = profit >= 0;
        return (
          <div>
            <div style={{ color: isPositive ? 'green' : 'red' }}>
              {formatNumber(profit)}
            </div>
            <Tag color={isPositive ? 'success' : 'error'}>
              {formatPercent(profitPercent)}
            </Tag>
          </div>
        );
      },
      sorter: (a: BacktestResult, b: BacktestResult) => 
        (a.finalCapital - a.initialCapital) - (b.finalCapital - b.initialCapital),
    },
    {
      title: 'Tỷ lệ thắng',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (winRate: number) => `${winRate.toFixed(2)}%`,
      sorter: (a: BacktestResult, b: BacktestResult) => a.winRate - b.winRate,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a: BacktestResult, b: BacktestResult) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: BacktestResult) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
          <Tooltip title="Chia sẻ">
            <Button 
              type="text" 
              icon={<ShareAltOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (backtests.length === 0) {
    return (
      <Card className="saved-backtests-card">
        <Empty 
          description="Chưa có backtest nào được lưu" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card 
      className="saved-backtests-card"
      title="Danh sách Backtest đã lưu"
      extra={
        <div className="card-actions">
          <Input
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
            suffix={<SearchOutlined />}
          />
          <CSVLink 
            data={csvData} 
            filename={`backtests_${new Date().toISOString().split('T')[0]}.csv`}
          >
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
          </CSVLink>
        </div>
      }
    >
      <Table 
        dataSource={filteredBacktests} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default SavedBacktests; 