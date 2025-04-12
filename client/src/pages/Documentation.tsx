import React from 'react';
import { Layout, Typography, Card, Collapse, Space, Button } from 'antd';
import { QuestionCircleOutlined, BookOutlined, VideoCameraOutlined, FileTextOutlined } from '@ant-design/icons';
import './Documentation.css';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Documentation: React.FC = () => {
  const sections = [
    {
      title: 'Bắt đầu',
      items: [
        {
          title: 'Đăng ký và đăng nhập',
          content: 'Hướng dẫn cách tạo tài khoản và đăng nhập vào hệ thống.'
        },
        {
          title: 'Cài đặt ban đầu',
          content: 'Các bước cài đặt cần thiết trước khi bắt đầu sử dụng.'
        },
        {
          title: 'Giao diện tổng quan',
          content: 'Giới thiệu về các thành phần chính của giao diện.'
        }
      ]
    },
    {
      title: 'Giao dịch',
      items: [
        {
          title: 'Đặt lệnh',
          content: 'Hướng dẫn cách đặt các loại lệnh giao dịch khác nhau.'
        },
        {
          title: 'Quản lý vị thế',
          content: 'Cách theo dõi và quản lý các vị thế đang mở.'
        },
        {
          title: 'Lịch sử giao dịch',
          content: 'Xem và phân tích lịch sử giao dịch.'
        }
      ]
    },
    {
      title: 'Phân tích',
      items: [
        {
          title: 'Biểu đồ giá',
          content: 'Cách sử dụng các công cụ phân tích kỹ thuật trên biểu đồ.'
        },
        {
          title: 'Tín hiệu giao dịch',
          content: 'Cách nhận và sử dụng các tín hiệu giao dịch.'
        },
        {
          title: 'Backtesting',
          content: 'Hướng dẫn kiểm tra chiến lược giao dịch với dữ liệu lịch sử.'
        }
      ]
    },
    {
      title: 'Quản lý rủi ro',
      items: [
        {
          title: 'Cài đặt rủi ro',
          content: 'Cách thiết lập các thông số quản lý rủi ro.'
        },
        {
          title: 'Cảnh báo',
          content: 'Cách thiết lập và quản lý các cảnh báo rủi ro.'
        },
        {
          title: 'Báo cáo rủi ro',
          content: 'Xem và phân tích các báo cáo rủi ro.'
        }
      ]
    }
  ];

  return (
    <Layout className="documentation-layout">
      <div className="documentation-header">
        <Title level={1}>Tài liệu hướng dẫn</Title>
        <Text type="secondary">
          Tìm hiểu cách sử dụng tất cả các tính năng của hệ thống
        </Text>
      </div>

      <Space direction="vertical" size="large" className="documentation-content">
        <Card>
          <Space direction="vertical" size="middle">
            <Title level={2}>Tài nguyên học tập</Title>
            <Space wrap>
              <Button icon={<BookOutlined />} size="large">
                Hướng dẫn chi tiết
              </Button>
              <Button icon={<VideoCameraOutlined />} size="large">
                Video hướng dẫn
              </Button>
              <Button icon={<FileTextOutlined />} size="large">
                Tài liệu PDF
              </Button>
            </Space>
          </Space>
        </Card>

        {sections.map((section, index) => (
          <Card key={index}>
            <Title level={3}>{section.title}</Title>
            <Collapse defaultActiveKey={['0']}>
              {section.items.map((item, itemIndex) => (
                <Panel 
                  header={item.title} 
                  key={itemIndex}
                  extra={<QuestionCircleOutlined />}
                >
                  <Paragraph>{item.content}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        ))}
      </Space>
    </Layout>
  );
};

export default Documentation; 