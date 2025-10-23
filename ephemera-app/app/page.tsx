'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadingMessage from '@/components/FadingMessage';
import DecayingCanvas from '@/components/DecayingCanvas';
import TemporaryRoom from '@/components/TemporaryRoom';
import MemoryFragment from '@/components/MemoryFragment';

type ExperienceType = 'intro' | 'fading' | 'canvas' | 'room' | 'memory';

export default function Home() {
  const [currentExperience, setCurrentExperience] = useState<ExperienceType>('intro');
  const [showIntro, setShowIntro] = useState(true);

  const experiences = [
    { id: 'fading' as ExperienceType, name: 'Fading Messages', description: 'Words that dissolve as you read' },
    { id: 'canvas' as ExperienceType, name: 'Decaying Canvas', description: 'Drawings that pixelate into dust' },
    { id: 'room' as ExperienceType, name: 'Temporary Room', description: 'Conversations that expire' },
    { id: 'memory' as ExperienceType, name: 'Memory Fragments', description: 'Thoughts that drift apart' },
  ];

  const startExperience = (type: ExperienceType) => {
    setShowIntro(false);
    setTimeout(() => setCurrentExperience(type), 300);
  };

  const resetToIntro = () => {
    setCurrentExperience('intro');
    setShowIntro(true);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-6xl font-light mb-4 glow cursor-pointer hover:scale-105 transition-transform"
            onClick={resetToIntro}
          >
            Ephemera
          </h1>
          <p className="text-gray-400 text-lg">
            Where nothing lasts forever
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {showIntro && currentExperience === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Philosophy Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16 text-center"
              >
                <p className="text-2xl font-light text-gray-300 mb-6 leading-relaxed">
                  In a world obsessed with permanence,
                  <br />
                  we create space for the temporary.
                </p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Digital content that evolves, transforms, and eventually disappears.
                  No archives. No screenshots. Just pure, ephemeral experiences
                  that honor the beauty of impermanence.
                </p>
              </motion.div>

              {/* Experience Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => startExperience(exp.id)}
                    className="p-6 bg-black/40 border border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500/60 transition-all glow-box group"
                  >
                    <h3 className="text-2xl font-light text-purple-300 mb-2 group-hover:text-purple-200 transition-colors">
                      {exp.name}
                    </h3>
                    <p className="text-gray-400">{exp.description}</p>
                    <div className="mt-4 text-purple-400 text-sm">
                      Click to experience →
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Manifesto */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center py-12 border-t border-purple-500/20"
              >
                <h2 className="text-3xl font-light text-purple-300 mb-6">
                  The Ephemeral Manifesto
                </h2>
                <div className="max-w-2xl mx-auto text-gray-400 space-y-4 text-left">
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 text-2xl">∞</span>
                    <span>Nothing you create here can be saved or archived. When it's gone, it's truly gone.</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 text-2xl">⧗</span>
                    <span>All content has a lifespan. It evolves, decays, and transforms as time passes.</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 text-2xl">◈</span>
                    <span>Embrace impermanence. The fleeting nature makes each moment more precious.</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 text-2xl">∿</span>
                    <span>Be present. These experiences exist only in the now.</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentExperience === 'fading' && !showIntro && (
            <motion.div
              key="fading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <FadingMessage
                text="This message is fading away, character by character. There's something profound about words that disappear—they remind us that all communication is temporary, all thoughts fleeting. Read carefully, for you won't get a second chance."
                duration={45000}
              />
              <div className="text-center mt-8">
                <button
                  onClick={resetToIntro}
                  className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg transition-colors"
                >
                  ← Back to Experiences
                </button>
              </div>
            </motion.div>
          )}

          {currentExperience === 'canvas' && !showIntro && (
            <motion.div
              key="canvas"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DecayingCanvas duration={60000} />
              <div className="text-center mt-8">
                <button
                  onClick={resetToIntro}
                  className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg transition-colors"
                >
                  ← Back to Experiences
                </button>
              </div>
            </motion.div>
          )}

          {currentExperience === 'room' && !showIntro && (
            <motion.div
              key="room"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <TemporaryRoom roomDuration={300000} messageDuration={45000} />
              <div className="text-center mt-8">
                <button
                  onClick={resetToIntro}
                  className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg transition-colors"
                >
                  ← Back to Experiences
                </button>
              </div>
            </motion.div>
          )}

          {currentExperience === 'memory' && !showIntro && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <MemoryFragment
                text="Memories don't stay crisp and clear. They blur at the edges. Details drift away. What remains becomes more feeling than fact, more impression than image."
                duration={45000}
              />
              <div className="text-center mt-8">
                <button
                  onClick={resetToIntro}
                  className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg transition-colors"
                >
                  ← Back to Experiences
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20 pb-8 text-gray-500 text-sm"
        >
          <p>Everything here is temporary. Nothing is stored.</p>
          <p className="mt-2">Embrace the moment. It won't last.</p>
        </motion.footer>
      </div>
    </main>
  );
}
