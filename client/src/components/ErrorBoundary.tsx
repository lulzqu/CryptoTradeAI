import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Đã xảy ra lỗi"
          subTitle={this.state.error?.message || 'Vui lòng thử lại sau'}
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>,
            <Button key="home" onClick={() => window.location.href = '/'}>
              Về trang chủ
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 