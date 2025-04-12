import React from 'react';
import { Layout, Typography, Card, Divider } from 'antd';
import './Terms.css';

const { Title, Text, Paragraph } = Typography;

const Terms: React.FC = () => {
  const sections = [
    {
      title: '1. Giới thiệu',
      content: `Chào mừng bạn đến với CryptoTradeAI. Bằng cách truy cập hoặc sử dụng nền tảng của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ của chúng tôi.`
    },
    {
      title: '2. Định nghĩa',
      content: `Trong tài liệu này, các thuật ngữ sau đây có nghĩa như sau:
      - "Nền tảng" đề cập đến website và ứng dụng CryptoTradeAI
      - "Người dùng" là bất kỳ cá nhân hoặc tổ chức nào truy cập hoặc sử dụng nền tảng
      - "Dịch vụ" bao gồm tất cả các tính năng và chức năng được cung cấp bởi nền tảng`
    },
    {
      title: '3. Điều kiện sử dụng',
      content: `3.1. Bạn phải đủ 18 tuổi trở lên để sử dụng nền tảng
      3.2. Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký
      3.3. Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình
      3.4. Bạn không được sử dụng nền tảng cho mục đích bất hợp pháp`
    },
    {
      title: '4. Quyền sở hữu trí tuệ',
      content: `Tất cả nội dung, phần mềm, thiết kế và tài liệu trên nền tảng là tài sản độc quyền của CryptoTradeAI. Bạn không được sao chép, phân phối hoặc sử dụng bất kỳ phần nào của nền tảng mà không có sự cho phép bằng văn bản của chúng tôi.`
    },
    {
      title: '5. Bảo mật và quyền riêng tư',
      content: `Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Chính sách bảo mật của chúng tôi mô tả chi tiết cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.`
    },
    {
      title: '6. Trách nhiệm pháp lý',
      content: `6.1. Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất hoặc thiệt hại nào phát sinh từ việc sử dụng nền tảng
      6.2. Bạn chịu trách nhiệm về mọi hoạt động giao dịch được thực hiện thông qua tài khoản của bạn
      6.3. Chúng tôi có quyền từ chối dịch vụ cho bất kỳ người dùng nào vi phạm các điều khoản này`
    },
    {
      title: '7. Thay đổi điều khoản',
      content: `Chúng tôi có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay sau khi được đăng tải trên nền tảng. Việc tiếp tục sử dụng nền tảng sau khi có thay đổi được coi là chấp nhận các điều khoản mới.`
    },
    {
      title: '8. Luật áp dụng',
      content: `Các điều khoản này được điều chỉnh bởi luật pháp Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.`
    }
  ];

  return (
    <Layout className="terms-layout">
      <div className="terms-header">
        <Title level={1}>Điều khoản và Điều kiện</Title>
        <Text type="secondary">
          Cập nhật lần cuối: 01/01/2024
        </Text>
      </div>

      <Card className="terms-content">
        {sections.map((section, index) => (
          <div key={index}>
            <Title level={3}>{section.title}</Title>
            <Paragraph>{section.content}</Paragraph>
            {index < sections.length - 1 && <Divider />}
          </div>
        ))}
      </Card>
    </Layout>
  );
};

export default Terms; 