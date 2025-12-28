import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionId } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, Crosshair } from 'lucide-react';

interface Harpoon {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export const WhaleHuntGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [whalePos, setWhalePos] = useState({ top: '50%', left: '50%' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hits, setHits] = useState<{id: number, x: number, y: number, val: string}[]>([]);
  const [harpoons, setHarpoons] = useState<Harpoon[]>([]);
  const [isStriking, setIsStriking] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const moveWhale = () => {
    if (!gameAreaRef.current) return;
    const x = Math.random() * 80 + 10; 
    const y = Math.random() * 80 + 10;
    setWhalePos({ top: `${y}%`, left: `${x}%` });
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setHits([]);
    setHarpoons([]);
    moveWhale();
  };

  const handleWhaleClick = (e: React.MouseEvent) => {
    if (!isPlaying) return;
    
    // Trigger visual strike
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 100);

    // Add score
    const points = Math.floor(Math.random() * 100) + 50;
    setScore(prev => prev + points);

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotation = Math.random() * 60 - 30; // Random angle variance
        
        // Add hit text
        const newHit = { id: Date.now(), x, y, val: `+${points}` };
        setHits(prev => [...prev, newHit]);
        setTimeout(() => setHits(prev => prev.filter(h => h.id !== newHit.id)), 1000);

        // Add harpoon graphic
        const newHarpoon = { id: Date.now() + Math.random(), x, y, rotation };
        setHarpoons(prev => [...prev, newHarpoon]);
        // Keep harpoon visible for a moment
        setTimeout(() => setHarpoons(prev => prev.filter(h => h.id !== newHarpoon.id)), 2000);
    }

    moveWhale();

    if (Math.random() > 0.7) {
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            colors: ['#ef4444', '#ffffff'] // Red and White for blood/foam
        });
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [isPlaying, timeLeft]);

  return (
    <section id={SectionId.GAME} className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-meme text-5xl md:text-6xl text-cyan-400 mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          HARPOON THE BEAST
        </h2>
        <p className="text-slate-400 font-mono mb-8">Strike with violent intent.</p>

        <div className="relative w-full aspect-video bg-slate-950 rounded-3xl border-4 border-cyan-800 overflow-hidden shadow-2xl cursor-crosshair select-none" ref={gameAreaRef}>
           {/* HUD */}
           <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur border border-cyan-500 text-cyan-400 px-6 py-2 rounded-xl font-meme text-2xl flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                 <Trophy size={24} className="text-yellow-400" /> {score} <span className="text-xs font-mono pt-1 text-slate-400">BAGS</span>
              </div>
              <div className="bg-slate-900/90 backdrop-blur border border-red-500 text-red-500 px-6 py-2 rounded-xl font-meme text-2xl shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                 {timeLeft}s
              </div>
           </div>

           {/* Game Start/End Overlay */}
           {!isPlaying && (
             <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                {timeLeft === 0 ? (
                    <div className="text-center mb-6 animate-pulse">
                        <h3 className="font-meme text-6xl text-yellow-400 mb-2 drop-shadow-lg">HUNT OVER</h3>
                        <p className="text-white font-display text-2xl">Loot Secured: {score} $AHAB</p>
                    </div>
                ) : null}
                <button 
                    onClick={startGame}
                    className="bg-red-600 hover:bg-red-500 text-white font-black font-meme text-4xl px-12 py-6 rounded-2xl border-b-[8px] border-red-900 active:border-b-0 active:translate-y-2 transition-all shadow-[0_0_50px_rgba(220,38,38,0.6)]"
                >
                    {timeLeft === 0 ? 'RELOAD HARPOON' : 'START HUNT'}
                </button>
             </div>
           )}

           {/* Harpoons (Stuck in whale or missed) */}
           <AnimatePresence>
             {harpoons.map(harpoon => (
                <motion.div
                  key={harpoon.id}
                  initial={{ opacity: 0, scale: 2, x: 20, y: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute pointer-events-none z-10 w-16 h-16"
                  style={{ 
                      left: harpoon.x - 32, 
                      top: harpoon.y - 32, 
                      rotate: `${harpoon.rotation + 45}deg` 
                  }}
                >
                    {/* SVG Harpoon Graphic */}
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md filter brightness-110">
                        <line x1="10" y1="90" x2="80" y2="20" stroke="#94a3b8" strokeWidth="4" />
                        <path d="M80 20 L95 5 L85 25 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
                        <circle cx="80" cy="20" r="3" fill="#7f1d1d" />
                    </svg>
                </motion.div>
             ))}
           </AnimatePresence>

           {/* The White Whale */}
           <AnimatePresence>
            {isPlaying && (
                <motion.button
                    layout
                    // Breathing & Swimming Animation
                    animate={{ 
                        scale: isStriking ? 0.9 : [1, 1.05, 1], // Breathing / Flinch on hit
                        rotate: [0, -3, 3, 0], // Gentle rocking
                        y: [0, -10, 0], // Floating up and down
                    }}
                    transition={{ 
                        scale: { duration: isStriking ? 0.1 : 2, repeat: isStriking ? 0 : Infinity, ease: "easeInOut" },
                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        layout: { duration: 0.2 } // Smooth movement between random positions
                    }}
                    style={{ top: whalePos.top, left: whalePos.left }}
                    className="absolute w-32 h-32 -ml-16 -mt-16 z-10 cursor-none" // Hide default cursor over whale
                    onClick={handleWhaleClick}
                >
                    {/* Custom Harpoon Cursor on Hover would be ideal, but using Emoji for Whale */}
                    <div className={`w-full h-full text-8xl drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] transition-all ${isStriking ? 'brightness-150 grayscale-0' : 'grayscale-[20%]'}`}>
                       🐋
                    </div>
                </motion.button>
            )}
           </AnimatePresence>

           {/* Hit Numbers */}
           {hits.map(hit => (
               <motion.div
                 key={hit.id}
                 initial={{ opacity: 1, y: 0, scale: 0.5, rotate: Math.random() * 20 - 10 }}
                 animate={{ opacity: 0, y: -100, scale: 2 }}
                 transition={{ duration: 0.8 }}
                 className="absolute text-yellow-400 font-black font-meme text-5xl pointer-events-none z-20"
                 style={{ 
                     left: hit.x, 
                     top: hit.y, 
                     textShadow: '3px 3px 0 #000, -1px -1px 0 #000' 
                 }}
               >
                   {hit.val}
               </motion.div>
           ))}
           
           {/* Ocean Grid / Radar Lines */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} 
            />
        </div>
      </div>
    </section>
  );
};
