import React from 'react';
import { Skeleton, Card } from 'antd';

interface LoadingProps {
  rows?: number;
  active?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ rows = 3, active = true }) => {
  return (
    <Card>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          active={active}
          paragraph={{ rows: 1 }}
          style={{ marginBottom: 16 }}
        />
      ))}
    </Card>
  );
};

export default Loading; 