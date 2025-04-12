import React from 'react';
import { Card, Typography, Divider, List } from 'antd';
import { LockOutlined, SafetyOutlined, TeamOutlined, GlobalOutlined } from '@ant-design/icons';
import './PrivacyPolicy.css';

const { Title, Text, Paragraph } = Typography;

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-policy">
      <Card className="privacy-policy-card">
        <Title level={2}>Chính sách bảo mật</Title>
        <Text type="secondary" className="last-updated">
          Cập nhật lần cuối: 01/01/2024
        </Text>

        <Divider />

        <section className="privacy-section">
          <Title level={3}>
            <LockOutlined /> Thông tin chúng tôi thu thập
          </Title>
          <Paragraph>
            Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản,
            sử dụng dịch vụ của chúng tôi hoặc liên hệ với chúng tôi. Thông tin này bao gồm:
          </Paragraph>
          <List>
            <List.Item>Thông tin đăng ký (tên, email, số điện thoại)</List.Item>
            <List.Item>Thông tin giao dịch và lịch sử hoạt động</List.Item>
            <List.Item>Thông tin thiết bị và địa chỉ IP</List.Item>
            <List.Item>Cookie và dữ liệu theo dõi</List.Item>
          </List>
        </section>

        <Divider />

        <section className="privacy-section">
          <Title level={3}>
            <SafetyOutlined /> Cách chúng tôi sử dụng thông tin
          </Title>
          <Paragraph>
            Chúng tôi sử dụng thông tin thu thập được để:
          </Paragraph>
          <List>
            <List.Item>Cung cấp và duy trì dịch vụ của chúng tôi</List.Item>
            <List.Item>Cải thiện trải nghiệm người dùng</List.Item>
            <List.Item>Phát hiện và ngăn chặn gian lận</List.Item>
            <List.Item>Tuân thủ các yêu cầu pháp lý</List.Item>
          </List>
        </section>

        <Divider />

        <section className="privacy-section">
          <Title level={3}>
            <TeamOutlined /> Chia sẻ thông tin
          </Title>
          <Paragraph>
            Chúng tôi có thể chia sẻ thông tin của bạn với:
          </Paragraph>
          <List>
            <List.Item>Các nhà cung cấp dịch vụ bên thứ ba</List.Item>
            <List.Item>Đối tác kinh doanh</List.Item>
            <List.Item>Cơ quan thực thi pháp luật khi cần thiết</List.Item>
          </List>
        </section>

        <Divider />

        <section className="privacy-section">
          <Title level={3}>
            <GlobalOutlined /> Bảo mật dữ liệu
          </Title>
          <Paragraph>
            Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin của bạn,
            bao gồm:
          </Paragraph>
          <List>
            <List.Item>Mã hóa dữ liệu nhạy cảm</List.Item>
            <List.Item>Xác thực hai yếu tố</List.Item>
            <List.Item>Giám sát và kiểm tra bảo mật thường xuyên</List.Item>
            <List.Item>Đào tạo nhân viên về bảo mật</List.Item>
          </List>
        </section>

        <Divider />

        <section className="privacy-section">
          <Title level={3}>Quyền của bạn</Title>
          <Paragraph>
            Bạn có quyền:
          </Paragraph>
          <List>
            <List.Item>Truy cập thông tin cá nhân của bạn</List.Item>
            <List.Item>Yêu cầu sửa đổi hoặc xóa thông tin</List.Item>
            <List.Item>Rút lại sự đồng ý</List.Item>
            <List.Item>Khiếu nại với cơ quan bảo vệ dữ liệu</List.Item>
          </List>
        </section>

        <Divider />

        <section className="privacy-section">
          <Title level={3}>Liên hệ</Title>
          <Paragraph>
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi,
            vui lòng liên hệ:
          </Paragraph>
          <List>
            <List.Item>Email: privacy@cryptotradeai.com</List.Item>
            <List.Item>Điện thoại: +84 123 456 789</List.Item>
            <List.Item>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</List.Item>
          </List>
        </section>
      </Card>
    </div>
  );
};

export default PrivacyPolicy; 