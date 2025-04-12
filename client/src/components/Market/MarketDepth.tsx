import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Typography, Spin } from 'antd';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { fetchOrderBook } from '../../slices/marketSlice';
import { AppDispatch, RootState } from '../../store';
import websocketService from '../../services/websocket';

const { Title } = Typography;

interface MarketDepthProps {
  symbol: string;
}

const MarketDepth: React.FC<MarketDepthProps> = ({ symbol }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orderBook, loading } = useSelector((state: RootState) => state.market);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const areaSeries = useRef<ISeriesApi<'Area'> | null>(null);
  
  // Lấy dữ liệu orderbook khi component mount hoặc symbol thay đổi
  useEffect(() => {
    if (symbol) {
      dispatch(fetchOrderBook({ symbol, limit: 100 }));
    }
  }, [symbol, dispatch]);

  // Thiết lập WebSocket để nhận dữ liệu thời gian thực
  useEffect(() => {
    if (symbol) {
      const unsubscribe = websocketService.subscribeOrderBook(symbol, (data) => {
        // WebSocket service sẽ cập nhật Redux store
      });

      return () => {
        unsubscribe();
      };
    }
  }, [symbol]);

  // Tạo biểu đồ khi component mount
  useEffect(() => {
    if (chartContainerRef.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
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
      });

      // Tạo series cho asks (bên bán)
      const askSeries = chart.current.addAreaSeries({
        topColor: 'rgba(239, 83, 80, 0.56)',
        bottomColor: 'rgba(239, 83, 80, 0.04)',
        lineColor: 'rgba(239, 83, 80, 1)',
        lineWidth: 2,
        title: 'Asks',
      });

      // Tạo series cho bids (bên mua)
      const bidSeries = chart.current.addAreaSeries({
        topColor: 'rgba(38, 166, 154, 0.56)',
        bottomColor: 'rgba(38, 166, 154, 0.04)',
        lineColor: 'rgba(38, 166, 154, 1)',
        lineWidth: 2,
        title: 'Bids',
      });

      // Resize observer để biểu đồ responsive
      const resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0 || !chart.current) return;
        const { width, height } = entries[0].contentRect;
        chart.current.resize(width, height);
      });
      
      if (chartContainerRef.current) {
        resizeObserver.observe(chartContainerRef.current);
      }

      // Cập nhật dữ liệu khi orderbook thay đổi
      if (orderBook && orderBook.bids && orderBook.asks) {
        updateDepthChart(bidSeries, askSeries);
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

  // Cập nhật dữ liệu khi orderbook thay đổi
  useEffect(() => {
    if (chart.current && orderBook && orderBook.bids && orderBook.asks) {
      const bidSeries = chart.current.series()[0];
      const askSeries = chart.current.series()[1];
      
      if (bidSeries && askSeries) {
        updateDepthChart(bidSeries, askSeries);
      }
    }
  }, [orderBook]);

  // Cập nhật dữ liệu biểu đồ
  const updateDepthChart = (bidSeries: any, askSeries: any) => {
    if (!orderBook || !orderBook.bids || !orderBook.asks) return;

    // Xử lý dữ liệu cho bids (mua)
    let bidsCumulative = 0;
    const bidsData = orderBook.bids.map(bid => {
      bidsCumulative += bid.quantity;
      return {
        price: bid.price,
        value: bidsCumulative,
      };
    }).sort((a, b) => a.price - b.price);

    // Xử lý dữ liệu cho asks (bán)
    let asksCumulative = 0;
    const asksData = orderBook.asks.map(ask => {
      asksCumulative += ask.quantity;
      return {
        price: ask.price,
        value: asksCumulative,
      };
    }).sort((a, b) => a.price - b.price);

    // Cập nhật dữ liệu
    bidSeries.setData(bidsData);
    askSeries.setData(asksData);

    // Fit content để hiển thị đầy đủ dữ liệu
    chart.current?.timeScale().fitContent();
  };

  return (
    <Card 
      title={<Title level={5}>Market Depth</Title>}
      style={{ height: '100%' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin />
        </div>
      ) : (
        <div 
          ref={chartContainerRef} 
          className="depth-chart-container"
          style={{ height: 400, width: '100%' }}
        />
      )}
    </Card>
  );
};

export default MarketDepth; 