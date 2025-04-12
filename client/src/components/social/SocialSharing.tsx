import React from 'react';
import { Button, Space, Typography, Card } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  RedditOutlined,
  TelegramOutlined,
  CopyOutlined
} from '@ant-design/icons';
import './SocialSharing.css';

const { Text } = Typography;

interface SocialSharingProps {
  title?: string;
  url?: string;
  description?: string;
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  title = 'CryptoTradeAI - Nền tảng giao dịch tiền điện tử thông minh',
  url = window.location.href,
  description = 'Khám phá nền tảng giao dịch tiền điện tử thông minh với AI'
}) => {
  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    window.open(shareUrl, '_blank');
  };

  const shareOnReddit = () => {
    const shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank');
  };

  const shareOnTelegram = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      // TODO: Hiển thị thông báo đã copy
    });
  };

  return (
    <Card className="social-sharing">
      <Text strong>Chia sẻ:</Text>
      <Space size="middle" style={{ marginLeft: 16 }}>
        <Button
          type="text"
          icon={<FacebookOutlined />}
          onClick={shareOnFacebook}
          className="social-button facebook"
        />
        <Button
          type="text"
          icon={<TwitterOutlined />}
          onClick={shareOnTwitter}
          className="social-button twitter"
        />
        <Button
          type="text"
          icon={<LinkedinOutlined />}
          onClick={shareOnLinkedIn}
          className="social-button linkedin"
        />
        <Button
          type="text"
          icon={<RedditOutlined />}
          onClick={shareOnReddit}
          className="social-button reddit"
        />
        <Button
          type="text"
          icon={<TelegramOutlined />}
          onClick={shareOnTelegram}
          className="social-button telegram"
        />
        <Button
          type="text"
          icon={<CopyOutlined />}
          onClick={copyToClipboard}
          className="social-button copy"
        />
      </Space>
    </Card>
  );
};

export default SocialSharing; 