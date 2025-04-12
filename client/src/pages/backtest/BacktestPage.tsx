import React, { useState, useEffect } from 'react';
import { Tabs, Button, Empty, Spin, Alert, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  fetchBacktestResults, 
  saveBacktestResult, 
  deleteBacktestResult, 
  setCurrentResult,
  clearCurrentResult
} from '../../slices/backtestSlice';
import BacktestForm from '../../components/backtest/BacktestForm';
import BacktestResults from '../../components/backtest/BacktestResults';
import SavedBacktests from '../../components/backtest/SavedBacktests';
import './BacktestPage.css';

const { TabPane } = Tabs;

const BacktestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [backtestToDelete, setBacktestToDelete] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { 
    currentResult, 
    savedResults, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.backtest);

  useEffect(() => {
    dispatch(fetchBacktestResults());
  }, [dispatch]);

  useEffect(() => {
    // Auto-switch to results tab when a backtest is run
    if (currentResult && activeTab === 'new') {
      setActiveTab('results');
    }
  }, [currentResult, activeTab]);

  const handleSubmit = (result: any) => {
    // Result is already set in the Redux store by the form component
    setActiveTab('results');
  };

  const handleSaveResult = () => {
    if (currentResult) {
      dispatch(saveBacktestResult(currentResult));
      setActiveTab('saved');
    }
  };

  const handleApplyStrategy = () => {
    // Implement strategy application logic
    Modal.success({
      title: 'Chiến lược đã được áp dụng',
      content: 'Chiến lược đã được áp dụng vào hệ thống giao dịch tự động.',
    });
  };

  const handleDeleteClick = (id: string) => {
    setBacktestToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (backtestToDelete) {
      dispatch(deleteBacktestResult(backtestToDelete));
      setIsDeleteModalVisible(false);
      setBacktestToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setBacktestToDelete(null);
  };

  const handleViewSavedResult = (result: any) => {
    dispatch(setCurrentResult(result));
    setActiveTab('results');
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="error-alert"
        />
      );
    }

    switch (activeTab) {
      case 'new':
        return <BacktestForm onSubmit={handleSubmit} />;
      case 'results':
        return currentResult ? (
          <BacktestResults 
            result={currentResult} 
            onSave={handleSaveResult}
            onApplyStrategy={handleApplyStrategy}
          />
        ) : (
          <Empty 
            description="Chưa có kết quả backtest nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        );
      case 'saved':
        return (
          <SavedBacktests 
            backtests={savedResults} 
            onDelete={handleDeleteClick}
            onView={handleViewSavedResult}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="backtest-page">
      <div className="page-header">
        <h1>Backtest Chiến lược</h1>
        <p>Kiểm nghiệm hiệu quả của chiến lược giao dịch trên dữ liệu lịch sử</p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="backtest-tabs"
        tabBarExtraContent={
          activeTab === 'results' && currentResult && (
            <Button 
              type="primary"
              onClick={handleSaveResult}
            >
              Lưu kết quả
            </Button>
          )
        }
      >
        <TabPane tab="Tạo mới" key="new" />
        <TabPane tab="Kết quả" key="results" />
        <TabPane tab="Đã lưu" key="saved" />
      </Tabs>

      {renderTabContent()}

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa backtest này không?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default BacktestPage; 