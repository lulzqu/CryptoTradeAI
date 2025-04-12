import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Typography, Button, Row, Col, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { fetchOrderBook } from '../../slices/marketSlice';
import { AppDispatch, RootState } from '../../store';
import websocketService from '../../services/websocket';

const { Title } = Typography;

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orderBook, loading } = useSelector((state: RootState) => state.market);
  const [depth, setDepth] = useState<number>(10);

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
        // Dữ liệu orderbook mới từ websocket
        // WebSocket service sẽ cập nhật Redux store
      });

      return () => {
        unsubscribe();
      };
    }
  }, [symbol]);

  // Reload orderbook
  const handleReload = () => {
    dispatch(fetchOrderBook({ symbol, limit: 100 }));
  };

  // Thay đổi độ sâu hiển thị
  const handleDepthChange = (newDepth: number) => {
    setDepth(newDepth);
  };

  // Tính toán giá trung bình
  const calculateMidPrice = () => {
    if (!orderBook || !orderBook.bids || !orderBook.asks || 
        orderBook.bids.length === 0 || orderBook.asks.length === 0) {
      return 0;
    }
    
    const bestBid = orderBook.bids[0].price;
    const bestAsk = orderBook.asks[0].price;
    return (bestBid + bestAsk) / 2;
  };

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

  // Columns cho bảng bid (mua)
  const bidColumns = [
    {
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      render: (text: number) => formatQuantity(text),
      width: '30%',
    },
    {
      title: 'Khối lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number) => formatQuantity(text),
      width: '30%',
    },
    {
      title: 'Giá (USDT)',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => (
        <span style={{ color: '#26a69a' }}>{formatPrice(text)}</span>
      ),
      width: '40%',
    },
  ];

  // Columns cho bảng ask (bán)
  const askColumns = [
    {
      title: 'Giá (USDT)',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => (
        <span style={{ color: '#ef5350' }}>{formatPrice(text)}</span>
      ),
      width: '40%',
    },
    {
      title: 'Khối lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number) => formatQuantity(text),
      width: '30%',
    },
    {
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      render: (text: number) => formatQuantity(text),
      width: '30%',
    },
  ];

  // Xử lý dữ liệu cho bảng bid
  const getBidData = () => {
    if (!orderBook || !orderBook.bids) return [];
    
    let cumulativeTotal = 0;
    return orderBook.bids
      .slice(0, depth)
      .map((bid, index) => {
        cumulativeTotal += bid.quantity;
        return {
          key: `bid-${index}`,
          price: bid.price,
          quantity: bid.quantity,
          total: cumulativeTotal,
        };
      });
  };

  // Xử lý dữ liệu cho bảng ask
  const getAskData = () => {
    if (!orderBook || !orderBook.asks) return [];
    
    let cumulativeTotal = 0;
    return orderBook.asks
      .slice(0, depth)
      .map((ask, index) => {
        cumulativeTotal += ask.quantity;
        return {
          key: `ask-${index}`,
          price: ask.price,
          quantity: ask.quantity,
          total: cumulativeTotal,
        };
      });
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5}>Order Book</Title>
          <div>
            <Button size="small" onClick={() => handleDepthChange(10)} type={depth === 10 ? 'primary' : 'default'}>10</Button>
            <Button size="small" onClick={() => handleDepthChange(20)} type={depth === 20 ? 'primary' : 'default'} style={{ marginLeft: 8 }}>20</Button>
            <Button size="small" onClick={() => handleDepthChange(50)} type={depth === 50 ? 'primary' : 'default'} style={{ marginLeft: 8 }}>50</Button>
            <Button 
              icon={<SyncOutlined />} 
              size="small" 
              onClick={handleReload} 
              style={{ marginLeft: 8 }}
            />
          </div>
        </div>
      }
      style={{ marginTop: 16 }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin />
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <Title level={5}>
              Mid Price: {formatPrice(calculateMidPrice())}
            </Title>
          </div>
          
          <Row gutter={16}>
            <Col span={24}>
              <Table 
                columns={askColumns} 
                dataSource={getAskData()} 
                size="small"
                pagination={false}
                scroll={{ y: 240 }}
              />
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Table 
                columns={bidColumns} 
                dataSource={getBidData()} 
                size="small"
                pagination={false}
                scroll={{ y: 240 }}
              />
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default OrderBook; 