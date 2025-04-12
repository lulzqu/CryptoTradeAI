import React, { useEffect, useState } from 'react';
import { Badge, Tooltip } from 'antd';
import websocketService from '../../services/websocket';

const WebsocketStatus: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // Đăng ký lắng nghe trạng thái kết nối
    const unsubscribe = websocketService.onConnectionChange((isConnected) => {
      setConnected(isConnected);
    });

    // Kết nối khi component mount
    websocketService.connect();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Tooltip title={connected ? 'WebSocket Connected' : 'WebSocket Disconnected'}>
      <Badge 
        status={connected ? 'success' : 'error'} 
        text={connected ? 'Online' : 'Offline'}
      />
    </Tooltip>
  );
};

export default WebsocketStatus; 