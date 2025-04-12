import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button, Space, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { useTrading } from '../hooks/useTrading';
import { Position, Signal } from '../types/trading';
import './Trading.css';

const { Option } = Select;

export const Trading: React.FC = () => {
  const { t } = useTranslation();
  const {
    positions,
    signals,
    loading,
    error,
    openPosition,
    modifyPosition,
    closePosition,
    addSignal,
    loadPositions,
    loadSignals,
    subscribeToMarket,
    unsubscribeFromMarket
  } = useTrading();

  const [isPositionModalVisible, setIsPositionModalVisible] = useState(false);
  const [isSignalModalVisible, setIsSignalModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPositions();
    loadSignals();
  }, [loadPositions, loadSignals]);

  const handleOpenPosition = () => {
    setSelectedPosition(null);
    form.resetFields();
    setIsPositionModalVisible(true);
  };

  const handleEditPosition = (position: Position) => {
    setSelectedPosition(position);
    form.setFieldsValue(position);
    setIsPositionModalVisible(true);
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      await closePosition(positionId);
      message.success(t('trading.positionClosed'));
    } catch (error) {
      message.error(t('trading.positionCloseError'));
    }
  };

  const handlePositionSubmit = async (values: any) => {
    try {
      if (selectedPosition) {
        await modifyPosition({ ...selectedPosition, ...values });
        message.success(t('trading.positionUpdated'));
      } else {
        await openPosition(values);
        message.success(t('trading.positionCreated'));
      }
      setIsPositionModalVisible(false);
    } catch (error) {
      message.error(t('trading.positionError'));
    }
  };

  const handleSignalSubmit = async (values: any) => {
    try {
      await addSignal(values);
      message.success(t('trading.signalCreated'));
      setIsSignalModalVisible(false);
    } catch (error) {
      message.error(t('trading.signalError'));
    }
  };

  const positionColumns = [
    {
      title: t('trading.symbol'),
      dataIndex: 'symbol',
      key: 'symbol'
    },
    {
      title: t('trading.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => t(`trading.${type}`)
    },
    {
      title: t('trading.entryPrice'),
      dataIndex: 'entryPrice',
      key: 'entryPrice'
    },
    {
      title: t('trading.currentPrice'),
      dataIndex: 'currentPrice',
      key: 'currentPrice'
    },
    {
      title: t('trading.quantity'),
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: t('trading.leverage'),
      dataIndex: 'leverage',
      key: 'leverage'
    },
    {
      title: t('trading.pnl'),
      dataIndex: 'pnl',
      key: 'pnl',
      render: (pnl: number) => (
        <span className={pnl >= 0 ? 'profit' : 'loss'}>
          {pnl.toFixed(2)} ({((pnl / 100) * 100).toFixed(2)}%)
        </span>
      )
    },
    {
      title: t('trading.actions'),
      key: 'actions',
      render: (_, record: Position) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditPosition(record)}
          />
          <Button
            type="primary"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleClosePosition(record._id)}
          />
        </Space>
      )
    }
  ];

  const signalColumns = [
    {
      title: t('trading.symbol'),
      dataIndex: 'symbol',
      key: 'symbol'
    },
    {
      title: t('trading.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => t(`trading.${type}`)
    },
    {
      title: t('trading.price'),
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: t('trading.timestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: Date) => new Date(timestamp).toLocaleString()
    },
    {
      title: t('trading.source'),
      dataIndex: 'source',
      key: 'source'
    },
    {
      title: t('trading.confidence'),
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => `${(confidence * 100).toFixed(2)}%`
    }
  ];

  return (
    <div className="trading-container">
      <div className="trading-header">
        <h2>{t('trading.title')}</h2>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenPosition}
          >
            {t('trading.openPosition')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsSignalModalVisible(true)}
          >
            {t('trading.addSignal')}
          </Button>
        </Space>
      </div>

      <div className="trading-content">
        <div className="positions-section">
          <h3>{t('trading.openPositions')}</h3>
          <Table
            columns={positionColumns}
            dataSource={positions.filter(p => p.status === 'open')}
            loading={loading}
            rowKey="_id"
          />
        </div>

        <div className="signals-section">
          <h3>{t('trading.signals')}</h3>
          <Table
            columns={signalColumns}
            dataSource={signals}
            loading={loading}
            rowKey="_id"
          />
        </div>
      </div>

      <Modal
        title={selectedPosition ? t('trading.editPosition') : t('trading.openPosition')}
        visible={isPositionModalVisible}
        onCancel={() => setIsPositionModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePositionSubmit}
        >
          <Form.Item
            name="symbol"
            label={t('trading.symbol')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label={t('trading.type')}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="long">{t('trading.long')}</Option>
              <Option value="short">{t('trading.short')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="entryPrice"
            label={t('trading.entryPrice')}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="quantity"
            label={t('trading.quantity')}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="leverage"
            label={t('trading.leverage')}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>

          <Form.Item
            name="stopLoss"
            label={t('trading.stopLoss')}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="takeProfit"
            label={t('trading.takeProfit')}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedPosition ? t('trading.update') : t('trading.create')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t('trading.addSignal')}
        visible={isSignalModalVisible}
        onCancel={() => setIsSignalModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSignalSubmit}
        >
          <Form.Item
            name="symbol"
            label={t('trading.symbol')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label={t('trading.type')}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="buy">{t('trading.buy')}</Option>
              <Option value="sell">{t('trading.sell')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label={t('trading.price')}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="source"
            label={t('trading.source')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="confidence"
            label={t('trading.confidence')}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={1} step={0.01} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('trading.create')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 