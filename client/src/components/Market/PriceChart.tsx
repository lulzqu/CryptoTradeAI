import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChart, IChartApi, ISeriesApi, LineData, CandlestickData, Time } from 'lightweight-charts';
import { Card, Select, Space, Typography, Switch, Spin, Dropdown, Button } from 'antd';
import { DownOutlined, FullscreenOutlined, DownloadOutlined } from '@ant-design/icons';
import { fetchKlines } from '../../slices/marketSlice';
import { AppDispatch, RootState } from '../../store';
import websocketService from '../../services/websocket';

const { Option } = Select;
const { Title } = Typography;

interface PriceChartProps {
  symbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const candleSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeries = useRef<ISeriesApi<'Histogram'> | null>(null);
  
  const { klines, loading, timeframe } = useSelector((state: RootState) => state.market);
  
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  // Tạo biểu đồ khi component mount
  useEffect(() => {
    if (chartContainerRef.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: 0,
        },
        timeScale: {
          borderColor: '#ddd',
          timeVisible: true,
        },
      });

      // Tạo series cho candlestick
      candleSeries.current = chart.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Tạo series cho volume
      const volumePane = chart.current.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
      volumeSeries.current = volumePane;

      // Resize observer để biểu đồ responsive
      const resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0 || !chart.current) return;
        const { width, height } = entries[0].contentRect;
        chart.current.resize(width, height);
      });
      
      if (chartContainerRef.current) {
        resizeObserver.observe(chartContainerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
        if (chart.current) {
          chart.current.remove();
          chart.current = null;
        }
      };
    }
  }, []);

  // Cập nhật dữ liệu khi symbol hoặc timeframe thay đổi
  useEffect(() => {
    if (symbol) {
      dispatch(fetchKlines({ symbol, interval: timeframe }));
    }
  }, [symbol, timeframe, dispatch]);

  // Cập nhật series khi có dữ liệu mới
  useEffect(() => {
    if (klines && klines.length > 0 && candleSeries.current && volumeSeries.current) {
      const formattedCandles: CandlestickData[] = klines.map((kline: any) => ({
        time: kline.openTime / 1000 as Time,
        open: kline.open,
        high: kline.high,
        low: kline.low,
        close: kline.close,
      }));

      const formattedVolumes = klines.map((kline: any) => ({
        time: kline.openTime / 1000 as Time,
        value: kline.volume,
        color: kline.close >= kline.open ? '#26a69a' : '#ef5350',
      }));

      candleSeries.current.setData(formattedCandles);
      volumeSeries.current.setData(formattedVolumes);

      // Thiết lập hiển thị volume dựa trên state
      if (chart.current) {
        const volumePriceScale = chart.current.priceScaleById('volume');
        if (volumePriceScale) {
          volumePriceScale.applyOptions({
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
            visible: showVolume,
          });
        }
      }

      // Fit content để hiển thị đầy đủ dữ liệu
      if (chart.current) {
        chart.current.timeScale().fitContent();
      }
    }
  }, [klines, showVolume]);

  // Thiết lập WebSocket để cập nhật dữ liệu theo thời gian thực
  useEffect(() => {
    if (symbol) {
      // Đăng ký nhận cập nhật giá thời gian thực
      const unsubscribe = websocketService.subscribeTicker(symbol, (data) => {
        if (candleSeries.current) {
          const lastCandle = candleSeries.current.dataByIndex(
            candleSeries.current.dataByIndex().length - 1,
            1
          );
          
          if (lastCandle) {
            const updatedCandle = {
              ...lastCandle,
              high: Math.max(lastCandle.high as number, data.price),
              low: Math.min(lastCandle.low as number, data.price),
              close: data.price,
            };
            
            candleSeries.current.update(updatedCandle as CandlestickData);
          }
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [symbol]);

  // Xử lý chuyển đổi giữa full-screen và normal
  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
    
    // Resize chart sau khi DOM cập nhật
    setTimeout(() => {
      if (chart.current && chartContainerRef.current) {
        chart.current.resize(
          chartContainerRef.current.clientWidth,
          fullscreen ? 500 : window.innerHeight - 100
        );
        chart.current.timeScale().fitContent();
      }
    }, 100);
  };

  // Chuyển đổi loại biểu đồ (nến hoặc đường)
  const handleChartTypeChange = (type: 'candles' | 'line') => {
    setChartType(type);
    
    if (chart.current) {
      // Xóa series hiện tại
      chart.current.removeSeries(candleSeries.current!);
      
      if (type === 'candles') {
        // Tạo lại candlestick series
        candleSeries.current = chart.current.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
      } else {
        // Tạo line series
        candleSeries.current = chart.current.addLineSeries({
          color: '#2196F3',
          lineWidth: 2,
        }) as any;
      }
      
      // Cập nhật dữ liệu
      if (klines && klines.length > 0) {
        if (type === 'candles') {
          const formattedCandles = klines.map((kline: any) => ({
            time: kline.openTime / 1000 as Time,
            open: kline.open,
            high: kline.high,
            low: kline.low,
            close: kline.close,
          }));
          candleSeries.current.setData(formattedCandles);
        } else {
          const formattedLines = klines.map((kline: any) => ({
            time: kline.openTime / 1000 as Time,
            value: kline.close,
          }));
          candleSeries.current.setData(formattedLines as LineData[]);
        }
      }
    }
  };

  // Xử lý thay đổi timeframe
  const handleTimeframeChange = (value: string) => {
    dispatch({ type: 'market/setTimeframe', payload: value });
  };

  // Xử lý hiển thị/ẩn volume
  const handleVolumeToggle = (checked: boolean) => {
    setShowVolume(checked);
  };

  // Lưu biểu đồ dưới dạng hình ảnh
  const handleSaveChart = () => {
    if (chart.current && chartContainerRef.current) {
      const canvas = chartContainerRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${symbol}_${timeframe}_chart.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  // Menu cho chọn loại biểu đồ
  const chartTypeMenu = (
    <div className="chart-type-menu">
      <Button 
        type={chartType === 'candles' ? 'primary' : 'default'} 
        onClick={() => handleChartTypeChange('candles')}
      >
        Candlestick
      </Button>
      <Button 
        type={chartType === 'line' ? 'primary' : 'default'} 
        onClick={() => handleChartTypeChange('line')}
      >
        Line
      </Button>
    </div>
  );

  return (
    <Card 
      title={<Title level={4}>{symbol} Price Chart</Title>}
      className={`price-chart-card ${fullscreen ? 'fullscreen' : ''}`}
      extra={
        <Space>
          <Select 
            defaultValue={timeframe} 
            style={{ width: 120 }} 
            onChange={handleTimeframeChange}
          >
            <Option value="1m">1 phút</Option>
            <Option value="5m">5 phút</Option>
            <Option value="15m">15 phút</Option>
            <Option value="30m">30 phút</Option>
            <Option value="1h">1 giờ</Option>
            <Option value="4h">4 giờ</Option>
            <Option value="1d">1 ngày</Option>
            <Option value="1w">1 tuần</Option>
          </Select>
          
          <Dropdown overlay={chartTypeMenu} trigger={['click']}>
            <Button>
              {chartType === 'candles' ? 'Candlestick' : 'Line'} <DownOutlined />
            </Button>
          </Dropdown>
          
          <span>Volume: </span>
          <Switch checked={showVolume} onChange={handleVolumeToggle} />
          
          <Button 
            icon={<FullscreenOutlined />} 
            onClick={handleFullscreenToggle}
          />
          
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleSaveChart}
          />
        </Space>
      }
    >
      {loading ? (
        <div className="chart-loading">
          <Spin size="large" />
        </div>
      ) : (
        <div 
          ref={chartContainerRef} 
          className="chart-container"
          style={{ 
            height: fullscreen ? 'calc(100vh - 150px)' : '500px',
            width: '100%' 
          }}
        />
      )}
    </Card>
  );
};

export default PriceChart; 