
import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export const FadeIn: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

interface SlideInProps extends HTMLMotionProps<"div"> {
  direction?: 'left' | 'right';
}

export const SlideIn: React.FC<SlideInProps> = ({ children, direction = 'left', ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    {...props}
  >
    {children}
  </motion.div>
);
