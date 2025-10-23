'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRemainingTime } from '@/lib/decay';

interface Message {
  id: string;
  text: string;
  timestamp: number;
  decayDuration: number;
}

interface TemporaryRoomProps {
  roomDuration?: number;
  messageDuration?: number;
}

export default function TemporaryRoom({
  roomDuration = 300000, // 5 minutes
  messageDuration = 45000, // 45 seconds
}: TemporaryRoomProps) {
  const [roomStartTime] = useState(Date.now());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [remainingTime, setRemainingTime] = useState(roomDuration);
  const [roomExpired, setRoomExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, roomDuration - (now - roomStartTime));
      setRemainingTime(remaining);

      if (remaining === 0) {
        setRoomExpired(true);
        setMessages([]);
      }

      // Remove expired messages
      setMessages(prev =>
        prev.filter(msg => now - msg.timestamp < msg.decayDuration)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [roomStartTime, roomDuration]);

  const addMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || roomExpired) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText,
      timestamp: Date.now(),
      decayDuration: messageDuration,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const getMessageOpacity = (message: Message): number => {
    const elapsed = Date.now() - message.timestamp;
    const progress = elapsed / message.decayDuration;
    return Math.max(0, 1 - progress);
  };

  if (roomExpired) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <h2 className="text-3xl font-light text-purple-300 mb-4">
            This room has expired
          </h2>
          <p className="text-gray-400">
            All messages have dissolved into the void.
            <br />
            Refresh to create a new temporary space.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-light text-purple-300">Temporary Room</h2>
          <span className="text-sm text-purple-400">
            Room expires in {formatRemainingTime(remainingTime)}
          </span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: roomDuration / 1000, ease: 'linear' }}
          />
        </div>
      </div>

      <div className="bg-black/40 border border-purple-500/30 rounded-lg p-6 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto glow-box">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 text-center py-10 italic"
            >
              No messages yet. Say something before time runs out...
            </motion.p>
          ) : (
            messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: getMessageOpacity(message),
                  y: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20"
              >
                <p className="text-gray-200">{message.text}</p>
                <div className="mt-2 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500/50"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{
                      duration: message.decayDuration / 1000,
                      ease: 'linear',
                    }}
                  />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={addMessage} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Share a fleeting thought..."
          className="flex-1 px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500/60 text-white placeholder-gray-500 transition-colors"
          maxLength={200}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-purple-600/50 hover:bg-purple-600/70 border border-purple-500/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputText.trim()}
        >
          Send
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400 italic">
        Messages fade after {messageDuration / 1000}s. This room expires in {Math.floor(remainingTime / 60000)} minutes.
      </p>
    </div>
  );
}
