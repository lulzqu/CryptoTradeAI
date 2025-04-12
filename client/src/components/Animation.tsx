import React from 'react';
import { motion } from 'framer-motion';

interface AnimationProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale';
  duration?: number;
  delay?: number;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  }
};

const Animation: React.FC<AnimationProps> = ({
  children,
  type = 'fade',
  duration = 0.3,
  delay = 0
}) => {
  return (
    <motion.div
      initial={animations[type].initial}
      animate={animations[type].animate}
      exit={animations[type].exit}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

export default Animation; 