import { useState, useEffect, useCallback } from 'react';

interface WebSocketHook {
  data: string | null;
  error: string | null;
  send: (message: string) => void;
  disconnect: () => void;
}

export const useWebSocket = (url: string): WebSocketHook => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setError(null);
      };

      ws.onmessage = (event) => {
        setData(event.data);
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Lỗi kết nối WebSocket');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setSocket(null);
        // Thử kết nối lại sau 5 giây
        setTimeout(connect, 5000);
      };

      setSocket(ws);
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setError('Không thể kết nối WebSocket');
    }
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  const send = useCallback((message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      setError('WebSocket không kết nối');
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [socket]);

  return { data, error, send, disconnect };
}; 