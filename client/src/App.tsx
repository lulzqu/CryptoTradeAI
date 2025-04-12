import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import AutoTrading from './pages/AutoTrading';
import Community from './pages/Community';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import Signals from './pages/Signals';
import { Trading } from './components/Trading';
import { Backtest } from './components/Backtest';
import StrategyManagement from './pages/StrategyManagement';
import AlertsPage from './pages/AlertsPage';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
        locale={i18n.language === 'vi' ? require('antd/locale/vi_VN').default : undefined}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="market" element={<PrivateRoute><Market /></PrivateRoute>} />
            <Route path="portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
            <Route path="analysis" element={<PrivateRoute><Analysis /></PrivateRoute>} />
            <Route path="signals" element={<PrivateRoute><Signals /></PrivateRoute>} />
            <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="auto-trading" element={<PrivateRoute><AutoTrading /></PrivateRoute>} />
            <Route path="community" element={<PrivateRoute><Community /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="trading" element={<PrivateRoute><Trading /></PrivateRoute>} />
            <Route path="strategies" element={<PrivateRoute><StrategyManagement /></PrivateRoute>} />
            <Route path="backtest" element={<Backtest />} />
            <Route path="alerts" element={<PrivateRoute><AlertsPage /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App; 