import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Typography, Tag, Spin } from 'antd';
import { fetchRecentTrades } from '../../slices/marketSlice';
import { AppDispatch, RootState } from '../../store';
import websocketService from '../../services/websocket';

const { Title } = Typography;

interface RecentTradesProps {
  symbol: string;
}

interface Trade {
  id: string;
  price: number;
  quantity: number;
  quoteQuantity: number;
  time: number;
  isBuyerMaker: boolean;
}

const RecentTrades: React.FC<RecentTradesProps> = ({ symbol }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { recentTrades, loading } = useSelector((state: RootState) => state.market);
  
  // Lấy dữ liệu giao dịch gần đây khi component mount hoặc symbol thay đổi
  useEffect(() => {
    if (symbol) {
      dispatch(fetchRecentTrades({ symbol, limit: 50 }));
    }
  }, [symbol, dispatch]);

  // Thiết lập WebSocket để nhận dữ liệu thời gian thực
  useEffect(() => {
    if (symbol) {
      const unsubscribe = websocketService.subscribeTrades(symbol, (data) => {
        // WebSocket service sẽ cập nhật Redux store
      });

      return () => {
        unsubscribe();
      };
    }
  }, [symbol]);

  // Định dạng giá thành chuỗi
  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  // Định dạng khối lượng thành chuỗi
  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  // Định dạng thời gian thành chuỗi
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Trade) => (
        <span style={{ color: record.isBuyerMaker ? '#ef5350' : '#26a69a' }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: 'Khối lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => formatQuantity(quantity),
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (time: number) => formatTime(time),
    },
    {
      title: 'Loại',
      dataIndex: 'isBuyerMaker',
      key: 'isBuyerMaker',
      render: (isBuyerMaker: boolean) => (
        <Tag color={isBuyerMaker ? '#ef5350' : '#26a69a'}>
          {isBuyerMaker ? 'SELL' : 'BUY'}
        </Tag>
      ),
    },
  ];

  return (
    <Card 
      title={<Title level={5}>Giao dịch gần đây</Title>}
      style={{ height: '100%' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={recentTrades} 
          rowKey="id" 
          pagination={false}
          size="small"
          scroll={{ y: 400 }}
        />
      )}
    </Card>
  );
};

export default RecentTrades; 