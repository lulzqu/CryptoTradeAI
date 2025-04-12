import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
  theme?: 'light' | 'dark';
  locale?: string;
  autosize?: boolean;
  height?: number;
  width?: number;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = 'BINANCE:BTCUSDT',
  interval = '1D',
  theme = 'light',
  locale = 'vi_VN',
  autosize = true,
  height = 500,
  width = 800,
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Đảm bảo script trading view đã được tải
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (container.current && window.TradingView) {
        new window.TradingView.widget({
          container_id: container.current.id,
          symbol: symbol,
          interval: interval,
          timezone: 'Asia/Ho_Chi_Minh',
          theme: theme,
          locale: locale,
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: true,
          studies: ['MASimple@tv-basicstudies', 'MACD@tv-basicstudies'],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          autosize: autosize,
          height: height,
          width: width,
        });
      }
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, theme, locale, autosize, height, width]);

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview_widget" ref={container} />
    </div>
  );
};

export default TradingViewWidget; 