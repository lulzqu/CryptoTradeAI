import React, { useState, useEffect } from 'react';
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './UserTour.css';

interface UserTourProps {
  steps: TourProps['steps'];
  onComplete?: () => void;
}

const UserTour: React.FC<UserTourProps> = ({ steps, onComplete }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng đã xem tour chưa
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setOpen(true);
    }
  }, []);

  const handleComplete = () => {
    setOpen(false);
    localStorage.setItem('hasSeenTour', 'true');
    onComplete?.();
  };

  return (
    <>
      <QuestionCircleOutlined 
        className="tour-trigger"
        onClick={() => setOpen(true)}
      />
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        onFinish={handleComplete}
        placement="bottom"
        mask={true}
        maskStyle={{
          color: 'rgba(0, 0, 0, 0.5)'
        }}
      />
    </>
  );
};

export default UserTour; 