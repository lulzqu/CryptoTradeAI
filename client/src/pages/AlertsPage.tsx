import React, { useState } from 'react';
import { Card, Button, Modal, Tabs, Statistic, Row, Col, Typography, message } from 'antd';
import { PlusOutlined, BellOutlined, WarningOutlined, SettingOutlined } from '@ant-design/icons';
import AlertList from '../components/alerts/AlertList';
import AlertForm from '../components/alerts/AlertForm';
import useAlert from '../hooks/useAlert';
import { Alert } from '../services/AlertService';

const { TabPane } = Tabs;
const { Title } = Typography;

const AlertsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | undefined>(undefined);
  const { activeAlerts, triggeredAlerts, priceAlerts, indicatorAlerts, riskAlerts } = useAlert();
  
  const handleAddAlert = () => {
    setSelectedAlert(undefined);
    setIsModalVisible(true);
  };
  
  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAlert(undefined);
  };
  
  const handleSuccess = () => {
    setIsModalVisible(false);
    setSelectedAlert(undefined);
    message.success(selectedAlert ? 'Cảnh báo đã được cập nhật' : 'Cảnh báo mới đã được tạo');
  };
  
  return (
    <div className="alerts-page">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Title level={2}>
              <BellOutlined /> Quản lý cảnh báo
            </Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddAlert}
            >
              Tạo cảnh báo mới
            </Button>
          </Col>
        </Row>
      </div>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Cảnh báo đang hoạt động"
              value={activeAlerts.length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Cảnh báo đã kích hoạt"
              value={triggeredAlerts.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Cảnh báo về giá"
              value={priceAlerts.length}
              valueStyle={{ color: '#722ed1' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Cảnh báo về chỉ báo"
              value={indicatorAlerts.length}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Tabs defaultActiveKey="all">
          <TabPane tab="Tất cả cảnh báo" key="all">
            <AlertList onEdit={handleEditAlert} />
          </TabPane>
          <TabPane tab="Cảnh báo đang hoạt động" key="active">
            <AlertList 
              onEdit={handleEditAlert} 
            />
          </TabPane>
          <TabPane tab="Cảnh báo theo giá" key="price">
            <AlertList 
              onEdit={handleEditAlert} 
            />
          </TabPane>
          <TabPane tab="Cảnh báo theo chỉ báo" key="indicator">
            <AlertList 
              onEdit={handleEditAlert} 
            />
          </TabPane>
          <TabPane tab="Cảnh báo rủi ro" key="risk">
            <AlertList 
              onEdit={handleEditAlert} 
            />
          </TabPane>
        </Tabs>
      </Card>
      
      <Modal
        title={selectedAlert ? "Chỉnh sửa cảnh báo" : "Tạo cảnh báo mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <AlertForm
          initialValues={selectedAlert}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default AlertsPage; 