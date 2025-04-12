import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Empty, Spin, Radio, RadioChangeEvent, Card } from 'antd';
import { PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6A6AFF', '#82CA9D'];

const PortfolioChart: React.FC = () => {
  const { stats, positions, loading } = useSelector((state: RootState) => state.portfolio);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([]);

  useEffect(() => {
    if (positions.length > 0) {
      // Tính tổng giá trị của từng symbol
      const symbolData = positions.reduce<{ [key: string]: number }>((acc, position) => {
        const value = position.amount * position.entryPrice;
        acc[position.symbol] = (acc[position.symbol] || 0) + value;
        return acc;
      }, {});

      const formattedData = Object.entries(symbolData).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }));

      setChartData(formattedData);
    }
  }, [positions]);

  const handleChartTypeChange = (e: RadioChangeEvent) => {
    setChartType(e.target.value);
  };

  if (loading) {
    return <Spin />;
  }

  if (positions.length === 0) {
    return <Empty description="Không có dữ liệu vị thế" />;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card size="small" style={{ background: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p>{`${payload[0].name}: ${payload[0].value.toLocaleString()} $`}</p>
          <p>{`${(payload[0].value / chartData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(2)}%`}</p>
        </Card>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Radio.Group value={chartType} onChange={handleChartTypeChange}>
          <Radio.Button value="pie"><PieChartOutlined /> Biểu đồ tròn</Radio.Button>
          <Radio.Button value="bar"><BarChartOutlined /> Biểu đồ cột</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" name="Giá trị" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioChart; 