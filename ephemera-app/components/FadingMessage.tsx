'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDecayProgress, getCharacterDecay, formatRemainingTime } from '@/lib/decay';

interface FadingMessageProps {
  text: string;
  duration?: number; // in milliseconds
  onExpire?: () => void;
}

export default function FadingMessage({ text, duration = 30000, onExpire }: FadingMessageProps) {
  const [startTime] = useState(Date.now());
  const [charOpacities, setCharOpacities] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const progress = getDecayProgress({
        startTime,
        duration,
        mode: 'fade',
      });

      const opacities = getCharacterDecay(text, progress);
      setCharOpacities(opacities);

      const remaining = Math.max(0, duration - (Date.now() - startTime));
      setRemainingTime(remaining);

      if (progress >= 1 && onExpire) {
        onExpire();
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, duration, startTime, onExpire]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-purple-300">Fading Message</span>
        <span className="text-sm text-purple-400">
          {formatRemainingTime(remainingTime)}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl leading-relaxed font-light"
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            style={{
              opacity: charOpacities[index] || 1,
              display: 'inline-block',
              transition: 'opacity 0.3s ease-out',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>

      <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </div>

      <p className="mt-4 text-sm text-gray-400 italic">
        This message will fade away, character by character. Once it's gone, it's gone forever.
      </p>
    </div>
  );
}
