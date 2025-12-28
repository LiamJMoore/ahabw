import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionId } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, Gauge, ShipWheel, Zap, Skull, ShieldAlert } from 'lucide-react';

interface GameEntity {
  id: number;
  x: number;
  y: number;
  type: 'harpoon' | 'iceberg' | 'coin';
  rotation?: number;
}

export const WhaleHuntGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [hull, setHull] = useState(100);
  const [whalePos, setWhalePos] = useState({ y: 50, x: 80 }); // % coordinates
  const [isPlaying, setIsPlaying] = useState(false);
  const [entities, setEntities] = useState<GameEntity[]>([]);
  const [throttle, setThrottle] = useState(0); // 0 to 100 speed
  const [helmAngle, setHelmAngle] = useState(0);
  
  // Use ReturnType<typeof setInterval> to be environment agnostic and avoid NodeJS namespace issues
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // --- GAME LOOP ---
  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(() => {
        setEntities(prev => {
          const next = prev.map(e => {
            // Harpoons move RIGHT
            if (e.type === 'harpoon') return { ...e, x: e.x + 2 };
            // Icebergs/Coins move LEFT based on throttle
            if (e.type === 'iceberg' || e.type === 'coin') return { ...e, x: e.x - (0.5 + throttle / 50) };
            return e;
          }).filter(e => e.x > -10 && e.x < 110); // Despawn out of bounds

          // Collision Logic
          // 1. Harpoon hits Whale
          next.forEach((e, idx) => {
             if (e.type === 'harpoon') {
                 // Simple box collision approximation
                 if (e.x > whalePos.x - 5 && e.x < whalePos.x + 5 && Math.abs(e.y - whalePos.y) < 10) {
                     setScore(s => s + 100);
                     // Remove harpoon
                     next.splice(idx, 1);
                     // Whale moves on hit
                     setWhalePos(p => ({ ...p, y: Math.max(10, Math.min(90, p.y + (Math.random() * 40 - 20))) }));
                 }
             }
          });

          return next;
        });

        // Move Whale Naturally
        setWhalePos(prev => ({
            ...prev,
            y: Math.max(10, Math.min(90, prev.y + Math.sin(Date.now() / 1000) * 0.5))
        }));

        // Spawn Obstacles logic
        if (Math.random() < (0.02 + throttle/2000)) {
            spawnEntity(Math.random() > 0.8 ? 'coin' : 'iceberg');
        }

        // Hull Damage / Score Passive
        if (throttle > 0) setScore(s => s + 1);

      }, 30);
    } else {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, throttle, whalePos]);

  const spawnEntity = (type: 'iceberg' | 'coin') => {
      setEntities(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: 100,
          y: Math.random() * 80 + 10,
          type
      }]);
  };

  const fireHarpoon = () => {
      if (!isPlaying || hull <= 0) return;
      setEntities(prev => [...prev, {
          id: Date.now(),
          x: 10,
          y: 50 + (Math.random() * 10 - 5), // Shoots from center-ish with spread
          type: 'harpoon',
          rotation: 0
      }]);
      setHelmAngle(prev => prev + 45);
  };

  const startGame = () => {
      setIsPlaying(true);
      setScore(0);
      setHull(100);
      setThrottle(50);
      setEntities([]);
  };

  const stopGame = () => {
      setIsPlaying(false);
      setThrottle(0);
      if (score > 0) confetti();
  };

  // Manual throttle adjustment
  const handleThrottle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setThrottle(parseInt(e.target.value));
  };

  useEffect(() => {
      if (hull <= 0 && isPlaying) {
          stopGame();
      }
  }, [hull]);

  return (
    <section id={SectionId.GAME} className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
            <h2 className="font-meme text-5xl md:text-6xl text-cyan-400 mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            HUNT THE WHALE
            </h2>
            <p className="text-slate-400 font-mono">Dodge JEET Icebergs. Harpoon the Whale. Speed Kills.</p>
        </div>

        {/* SHIP CONSOLE CONTAINER */}
        <div className="relative bg-slate-800 rounded-3xl border-4 border-slate-700 overflow-hidden shadow-2xl">
           
           {/* VIEWSCREEN */}
           <div className="relative w-full aspect-video bg-[#020617] overflow-hidden border-b-4 border-slate-700 cursor-crosshair select-none" ref={gameAreaRef}>
                
                {/* Moving Background (Parallax) */}
                <motion.div 
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
                    animate={{ backgroundPositionX: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20 - (throttle / 5), ease: "linear" }}
                />

                {/* GAME OVER OVERLAY */}
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        {hull <= 0 ? (
                            <div className="text-center">
                                <h3 className="font-meme text-6xl text-red-500 mb-2">HULL BREACHED</h3>
                                <p className="text-white font-mono mb-6">SCORE: {score}</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h3 className="font-tech text-cyan-500 mb-4 animate-pulse tracking-widest">SYSTEM STANDBY</h3>
                            </div>
                        )}
                        <button 
                            onClick={startGame}
                            className="bg-green-600 hover:bg-green-500 text-black font-black font-meme text-3xl px-8 py-4 rounded clip-path-polygon"
                        >
                            {score > 0 ? 'RE-DEPLOY' : 'START ENGINES'}
                        </button>
                    </div>
                )}

                {/* HUD */}
                <div className="absolute top-4 left-4 z-40 flex gap-4">
                    <div className="bg-black/50 border border-green-500 px-3 py-1 rounded text-green-500 font-mono text-xs">
                        SPEED: {throttle} KNOTS
                    </div>
                </div>

                {/* ENTITIES */}
                <AnimatePresence>
                    {entities.map(e => (
                        <motion.div
                            key={e.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, x: `${e.x}%`, y: `${e.y}%` }}
                            className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center text-2xl"
                        >
                            {e.type === 'harpoon' && '⇝'}
                            {e.type === 'iceberg' && '🧊'}
                            {e.type === 'coin' && '💰'}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* THE WHALE */}
                <motion.div
                    animate={{ top: `${whalePos.y}%`, left: `${whalePos.x}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                    className="absolute z-20 text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                    🐋
                </motion.div>

                {/* PLAYER SHIP CROSSHAIR */}
                <div className="absolute top-1/2 left-4 w-12 h-12 border-2 border-cyan-500 rounded-full flex items-center justify-center opacity-50">
                    <div className="w-1 h-1 bg-cyan-500 rounded-full" />
                </div>

           </div>

           {/* CONTROL DECK */}
           <div className="bg-[#0f172a] p-6 flex flex-col md:flex-row items-center justify-between gap-8 border-t-2 border-slate-600">
               
               {/* Left: HULL INTEGRITY */}
               <div className="flex items-center gap-4 w-1/3">
                   <div className="relative w-full h-12 bg-black rounded-lg border border-slate-600 overflow-hidden">
                       <div 
                         className={`absolute inset-0 ${hull < 30 ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`} 
                         style={{ width: `${hull}%` }}
                       />
                       <div className="absolute inset-0 flex items-center justify-center font-black font-tech text-white z-10 shadow-black drop-shadow-md">
                           HULL INTEGRITY {hull}%
                       </div>
                   </div>
               </div>

               {/* Center: FIRE BUTTON & WHEEL */}
               <div className="flex flex-col items-center justify-center relative w-1/3">
                   <motion.button 
                        whileTap={{ scale: 0.9 }}
                        animate={{ rotate: helmAngle }}
                        onClick={fireHarpoon}
                        className="w-24 h-24 bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-full border-4 border-yellow-500 shadow-xl flex items-center justify-center active:border-white"
                   >
                       <ShipWheel size={50} className="text-yellow-200" />
                   </motion.button>
                   <span className="text-xs text-slate-500 mt-2 font-mono">TAP TO FIRE</span>
               </div>

               {/* Right: THROTTLE SLIDER */}
               <div className="flex items-center gap-4 w-1/3 justify-end">
                   <div className="flex flex-col items-end w-full">
                       <label className="text-xs font-mono text-cyan-400 mb-1 flex items-center gap-2">
                           <Zap size={12} /> ENGINE THROTTLE
                       </label>
                       <input 
                           type="range" 
                           min="0" 
                           max="100" 
                           value={throttle} 
                           onChange={handleThrottle}
                           disabled={!isPlaying}
                           className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                       />
                       <div className="flex justify-between w-full text-[10px] text-slate-500 mt-1 font-mono">
                           <span>IDLE</span>
                           <span>FLANK SPEED</span>
                       </div>
                   </div>
               </div>

           </div>
        </div>
      </div>
    </section>
  );
};