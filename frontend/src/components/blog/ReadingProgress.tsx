'use client';
import { motion, useSpring } from 'framer-motion';
import { useReadingProgress } from '@/hooks/useReadingProgress';

export default function ReadingProgress() {
  const progress = useReadingProgress();
  const scaleX = useSpring(progress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="reading-progress-bar"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
