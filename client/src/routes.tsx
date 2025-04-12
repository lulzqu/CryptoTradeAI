import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Analysis from './pages/Analysis';
import Market from './pages/Market';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Signals from './pages/Signals';
import Community from './pages/Community';
import AutoTrading from './pages/AutoTrading';
import PrivateRoute from './components/PrivateRoute';
import PricePrediction from './pages/analysis/PricePrediction';
import PatternRecognition from './pages/analysis/PatternRecognition';
import StrategyManagement from './pages/StrategyManagement';
import Trading from './pages/Trading';
import RiskManagement from './pages/RiskManagement';
import DownloadSource from './pages/DownloadSource';
import Admin from './pages/Admin';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
      <Route path="/risk-management" element={<PrivateRoute><RiskManagement /></PrivateRoute>} />
      <Route path="/trading" element={<PrivateRoute><Trading /></PrivateRoute>} />
      <Route path="/analysis" element={<PrivateRoute><Analysis /></PrivateRoute>} />
      <Route path="/analysis/prediction" element={<PrivateRoute><PricePrediction /></PrivateRoute>} />
      <Route path="/analysis/patterns" element={<PrivateRoute><PatternRecognition /></PrivateRoute>} />
      <Route path="/market" element={<PrivateRoute><Market /></PrivateRoute>} />
      <Route path="/signals" element={<PrivateRoute><Signals /></PrivateRoute>} />
      <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
      <Route path="/autotrading" element={<PrivateRoute><AutoTrading /></PrivateRoute>} />
      <Route path="/strategy" element={<PrivateRoute><StrategyManagement /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/download-source" element={<PrivateRoute><DownloadSource /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
      
      {/* Redirect and 404 */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 