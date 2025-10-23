'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDecayProgress, getPixelation, formatRemainingTime } from '@/lib/decay';

interface DecayingCanvasProps {
  duration?: number;
  width?: number;
  height?: number;
}

export default function DecayingCanvas({
  duration = 60000,
  width = 600,
  height = 400
}: DecayingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startTime] = useState(Date.now());
  const [remainingTime, setRemainingTime] = useState(duration);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Handle drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Apply decay effect
  useEffect(() => {
    if (!hasDrawn) return;

    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      const displayCanvas = displayCanvasRef.current;
      if (!canvas || !displayCanvas) return;

      const ctx = canvas.getContext('2d');
      const displayCtx = displayCanvas.getContext('2d');
      if (!ctx || !displayCtx) return;

      const progress = getDecayProgress({
        startTime,
        duration,
        mode: 'pixelate',
      });

      const pixelSize = Math.max(1, getPixelation(progress));

      // Clear display canvas
      displayCtx.clearRect(0, 0, width, height);

      // Apply pixelation effect
      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const pixelData = ctx.getImageData(x, y, 1, 1).data;

          if (pixelData[3] > 0) {
            displayCtx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
            displayCtx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }

      const remaining = Math.max(0, duration - (Date.now() - startTime));
      setRemainingTime(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, duration, width, height, hasDrawn]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-purple-300">Decaying Canvas</span>
        <span className="text-sm text-purple-400">
          {formatRemainingTime(remainingTime)}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative border border-purple-500/30 rounded-lg overflow-hidden glow-box"
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 opacity-0"
        />
        <canvas
          ref={displayCanvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair bg-black/40"
          style={{ width: '100%', height: 'auto' }}
        />
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
        Draw something. Watch it slowly pixelate and dissolve into digital dust.
      </p>
    </div>
  );
}
