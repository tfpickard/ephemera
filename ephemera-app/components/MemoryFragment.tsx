'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDecayProgress, getBlur, getFragmentDisplacement, seedFromString, formatRemainingTime } from '@/lib/decay';

interface MemoryFragmentProps {
  text: string;
  duration?: number;
}

export default function MemoryFragment({ text, duration = 45000 }: MemoryFragmentProps) {
  const [startTime] = useState(Date.now());
  const [blur, setBlur] = useState(0);
  const [remainingTime, setRemainingTime] = useState(duration);
  const words = text.split(' ');

  useEffect(() => {
    const interval = setInterval(() => {
      const progress = getDecayProgress({
        startTime,
        duration,
        mode: 'blur',
      });

      setBlur(getBlur(progress));

      const remaining = Math.max(0, duration - (Date.now() - startTime));
      setRemainingTime(remaining);
    }, 50);

    return () => clearInterval(interval);
  }, [startTime, duration]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-purple-300">Memory Fragment</span>
        <span className="text-sm text-purple-400">
          {formatRemainingTime(remainingTime)}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[200px] flex items-center justify-center"
      >
        <div className="text-3xl font-light leading-relaxed text-center">
          {words.map((word, index) => {
            const progress = getDecayProgress({ startTime, duration, mode: 'fragment' });
            const seed = seedFromString(word + index);
            const displacement = getFragmentDisplacement(progress, seed);
            const wordOpacity = Math.max(0, 1 - progress * 1.2);

            return (
              <motion.span
                key={index}
                animate={{
                  x: displacement.x,
                  y: displacement.y,
                  opacity: wordOpacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="inline-block mx-2 my-1"
                style={{
                  textShadow: `0 0 ${blur * 2}px rgba(147, 51, 234, ${0.5 * wordOpacity})`,
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </div>
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
        Like a fading memory, the words drift apart and blur into abstraction.
      </p>
    </div>
  );
}
