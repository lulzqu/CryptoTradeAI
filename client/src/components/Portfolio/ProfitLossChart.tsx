import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Empty, Spin, Radio, RadioChangeEvent } from 'antd';
import { LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ChartDataItem {
  date: string;
  pnl: number;
  cumulative: number;
}

const ProfitLossChart: React.FC = () => {
  const { stats, history, loading } = useSelector((state: RootState) => state.portfolio);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'all'>('monthly');

  useEffect(() => {
    if (history.length > 0) {
      // Chỉ lấy các giao dịch đã đóng và có P&L
      const closedTrades = history
        .filter(trade => trade.pnl !== undefined && trade.closedAt)
        .sort((a, b) => new Date(a.closedAt!).getTime() - new Date(b.closedAt!).getTime());

      // Nhóm theo timeframe
      const groupedData: { [key: string]: number } = {};

      closedTrades.forEach(trade => {
        const date = new Date(trade.closedAt!);
        let timeKey = '';

        if (timeFrame === 'weekly') {
          // Lấy ngày đầu tiên của tuần
          const firstDayOfWeek = new Date(date);
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Chuyển về thứ 2
          firstDayOfWeek.setDate(diff);
          timeKey = firstDayOfWeek.toISOString().split('T')[0];
        } else if (timeFrame === 'monthly') {
          // Lấy tháng và năm
          timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else {
          // Lấy ngày cụ thể
          timeKey = date.toISOString().split('T')[0];
        }

        groupedData[timeKey] = (groupedData[timeKey] || 0) + (trade.pnl || 0);
      });

      // Chuyển đổi thành mảng dữ liệu cho biểu đồ
      const sortedKeys = Object.keys(groupedData).sort();
      let cumulativePnl = 0;
      
      const formattedData = sortedKeys.map(key => {
        cumulativePnl += groupedData[key];
        
        let displayDate = key;
        if (timeFrame === 'monthly') {
          const [year, month] = key.split('-');
          displayDate = `${month}/${year}`;
        } else if (timeFrame === 'weekly') {
          // Định dạng ngày đầu tuần
          const date = new Date(key);
          displayDate = `${date.getDate()}/${date.getMonth() + 1}`;
        } else {
          // Định dạng ngày cụ thể
          const date = new Date(key);
          displayDate = `${date.getDate()}/${date.getMonth() + 1}`;
        }
        
        return {
          date: displayDate,
          pnl: Number(groupedData[key].toFixed(2)),
          cumulative: Number(cumulativePnl.toFixed(2))
        };
      });

      setChartData(formattedData);
    }
  }, [history, timeFrame]);

  const handleChartTypeChange = (e: RadioChangeEvent) => {
    setChartType(e.target.value);
  };

  const handleTimeFrameChange = (e: RadioChangeEvent) => {
    setTimeFrame(e.target.value);
  };

  if (loading) {
    return <Spin />;
  }

  if (history.length === 0 || chartData.length === 0) {
    return <Empty description="Không có dữ liệu lịch sử giao dịch" />;
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Radio.Group value={chartType} onChange={handleChartTypeChange} style={{ marginRight: 16 }}>
          <Radio.Button value="area"><LineChartOutlined /> Biểu đồ đường</Radio.Button>
          <Radio.Button value="bar"><BarChartOutlined /> Biểu đồ cột</Radio.Button>
        </Radio.Group>
        
        <Radio.Group value={timeFrame} onChange={handleTimeFrameChange}>
          <Radio.Button value="weekly">Tuần</Radio.Button>
          <Radio.Button value="monthly">Tháng</Radio.Button>
          <Radio.Button value="all">Tất cả</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {chartType === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} $`, undefined]}
                labelFormatter={(label) => `Ngày: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="pnl" 
                name="Lợi nhuận/Lỗ" 
                stroke="#8884d8" 
                fill="url(#colorPnl)" 
                activeDot={{ r: 8 }}
              />
              <Area 
                type="monotone" 
                dataKey="cumulative" 
                name="Tích lũy" 
                stroke="#82ca9d" 
                fill="url(#colorCumulative)" 
              />
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </AreaChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} $`, undefined]}
                labelFormatter={(label) => `Ngày: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="pnl" 
                name="Lợi nhuận/Lỗ" 
                fill="#8884d8" 
                barSize={20} 
              />
              <Bar 
                dataKey="cumulative" 
                name="Tích lũy" 
                fill="#82ca9d" 
                barSize={20} 
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitLossChart; 