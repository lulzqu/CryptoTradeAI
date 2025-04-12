import React from 'react';
import { Layout, Typography, Card, Collapse, Input, Space, Button } from 'antd';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './FAQ.css';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

const FAQ: React.FC = () => {
  const faqCategories = [
    {
      title: 'Tài khoản & Bảo mật',
      items: [
        {
          question: 'Làm thế nào để tạo tài khoản?',
          answer: 'Để tạo tài khoản, bạn cần truy cập trang đăng ký và điền đầy đủ thông tin theo yêu cầu. Sau khi đăng ký, bạn sẽ nhận được email xác nhận để kích hoạt tài khoản.'
        },
        {
          question: 'Làm thế nào để bảo mật tài khoản?',
          answer: 'Bạn nên sử dụng mật khẩu mạnh, bật xác thực hai yếu tố (2FA), và không chia sẻ thông tin đăng nhập với người khác.'
        },
        {
          question: 'Tôi quên mật khẩu, phải làm sao?',
          answer: 'Bạn có thể sử dụng tính năng "Quên mật khẩu" trên trang đăng nhập. Hệ thống sẽ gửi email hướng dẫn đặt lại mật khẩu.'
        }
      ]
    },
    {
      title: 'Giao dịch & Đầu tư',
      items: [
        {
          question: 'Các loại lệnh giao dịch được hỗ trợ?',
          answer: 'Hệ thống hỗ trợ các loại lệnh: Market, Limit, Stop Loss, Take Profit, và Trailing Stop.'
        },
        {
          question: 'Phí giao dịch được tính như thế nào?',
          answer: 'Phí giao dịch được tính dựa trên khối lượng giao dịch và loại tài khoản của bạn. Chi tiết về phí được hiển thị trước khi đặt lệnh.'
        },
        {
          question: 'Làm thế nào để rút tiền?',
          answer: 'Bạn có thể rút tiền thông qua các phương thức thanh toán đã được liên kết với tài khoản. Quá trình rút tiền thường mất 1-3 ngày làm việc.'
        }
      ]
    },
    {
      title: 'Phân tích & Chiến lược',
      items: [
        {
          question: 'Các công cụ phân tích kỹ thuật có sẵn?',
          answer: 'Hệ thống cung cấp đầy đủ các công cụ phân tích kỹ thuật như: đường trung bình, MACD, RSI, Bollinger Bands, và nhiều chỉ báo khác.'
        },
        {
          question: 'Làm thế nào để tạo chiến lược giao dịch?',
          answer: 'Bạn có thể tạo chiến lược giao dịch bằng cách sử dụng trình tạo chiến lược trực quan hoặc viết mã bằng ngôn ngữ lập trình được hỗ trợ.'
        },
        {
          question: 'Cách kiểm tra hiệu quả chiến lược?',
          answer: 'Bạn có thể sử dụng tính năng Backtesting để kiểm tra hiệu quả chiến lược với dữ liệu lịch sử.'
        }
      ]
    },
    {
      title: 'Hỗ trợ & Dịch vụ',
      items: [
        {
          question: 'Làm thế nào để liên hệ hỗ trợ?',
          answer: 'Bạn có thể liên hệ hỗ trợ qua email, chat trực tuyến, hoặc gọi điện thoại. Thông tin liên hệ được cung cấp trên trang Hỗ trợ.'
        },
        {
          question: 'Thời gian phản hồi hỗ trợ?',
          answer: 'Đội ngũ hỗ trợ phản hồi trong vòng 24 giờ làm việc. Với các vấn đề khẩn cấp, thời gian phản hồi có thể nhanh hơn.'
        },
        {
          question: 'Có tài liệu hướng dẫn không?',
          answer: 'Có, chúng tôi cung cấp tài liệu hướng dẫn chi tiết, video hướng dẫn và các khóa học trực tuyến miễn phí.'
        }
      ]
    }
  ];

  return (
    <Layout className="faq-layout">
      <div className="faq-header">
        <Title level={1}>Câu hỏi thường gặp</Title>
        <Text type="secondary">
          Tìm câu trả lời cho các câu hỏi phổ biến về hệ thống
        </Text>
      </div>

      <div className="faq-search">
        <Search
          placeholder="Tìm kiếm câu hỏi..."
          allowClear
          enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
          size="large"
        />
      </div>

      <Space direction="vertical" size="large" className="faq-content">
        {faqCategories.map((category, index) => (
          <Card key={index}>
            <Title level={3}>{category.title}</Title>
            <Collapse defaultActiveKey={['0']}>
              {category.items.map((item, itemIndex) => (
                <Panel 
                  header={item.question} 
                  key={itemIndex}
                  extra={<QuestionCircleOutlined />}
                >
                  <Paragraph>{item.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        ))}
      </Space>
    </Layout>
  );
};

export default FAQ; 