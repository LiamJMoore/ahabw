import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Hero } from './components/Hero';
import { WhaleHuntGame } from './components/WhaleHuntGame';
import { Lore } from './components/Lore';
import { Tokenomics } from './components/Tokenomics';
import { WhaleRadar } from './components/WhaleRadar';
import { WhaleOracle } from './components/WhaleOracle';
import { TheFlippening } from './components/TheFlippening';
import { WhaleAlarm } from './components/WhaleAlarm';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [depth, setDepth] = useState(0);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // Dynamic Backgrounds - slightly lighter base to fix darkness
  const waterColor = useTransform(scrollYProgress, 
    [0, 0.3, 0.8, 1], 
    ['#1e293b', '#0f172a', '#020617', '#000000'] 
  );

  useEffect(() => {
    const handleScroll = () => {
      const d = Math.floor(window.scrollY / 5);
      setDepth(d);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-1000 ${isAlarmActive ? 'alarm-active' : ''}`} style={{ backgroundColor: '#020617' }}>
      
      {/* GLOBAL BOAT SWAY CONTAINER */}
      <motion.div 
        animate={{ 
            rotate: [0.5, -0.5, 0.5],
            y: [0, 5, 0]
        }}
        transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
        }}
        className="origin-top"
      >
        <motion.div style={{ backgroundColor: waterColor }} className="min-h-screen text-slate-200">
            
            {/* --- ALARM OVERLAY --- */}
            <div className={`fixed inset-0 pointer-events-none z-50 mix-blend-overlay transition-opacity duration-300 ${isAlarmActive ? 'bg-red-600 opacity-30' : 'opacity-0'}`} />
            
            {/* --- ATMOSPHERIC LAYERS --- */}
            <motion.div 
                style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
                className="rain fixed inset-0 pointer-events-none"
            />
            
            {/* Cinematic Vignette (Fixed: Moved to z-5 to be BEHIND content, and made lighter) */}
            <div className="fixed inset-0 pointer-events-none z-5 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.1)_70%,rgba(0,0,0,0.5)_100%)]" />
            
            {/* Film Grain */}
            <div className="fixed inset-0 pointer-events-none z-30 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* --- HUD NAVIGATION --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto flex flex-col">
                    <h1 className="font-meme text-4xl text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] tracking-wider">
                    $AHAB
                    </h1>
                    <span className={`text-[10px] font-tech animate-pulse tracking-[0.3em] ${isAlarmActive ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                    {isAlarmActive ? '!!! COLLISION IMMINENT !!!' : 'TARGET LOCKED: MOBY DICK'}
                    </span>
                </div>

                <div className="flex flex-col items-end font-tech text-green-500 text-sm">
                    <div className={`border bg-black/50 px-3 py-1 rounded backdrop-blur-sm transition-colors ${isAlarmActive ? 'border-red-500 text-red-500 bg-red-900/20' : 'border-green-900'}`}>
                    DEPTH: -{depth}m
                    </div>
                    <div className="text-[10px] text-green-700 mt-1">
                    PRESSURE: {(1 + depth / 100).toFixed(2)} ATM
                    </div>
                </div>
            </nav>

            {/* ALARM SYSTEM COMPONENT */}
            <WhaleAlarm onAlarmStateChange={setIsAlarmActive} />

            {/* --- LEFT SIDE: HULL DEPTH METER --- */}
            <div className="fixed left-6 top-1/2 -translate-y-1/2 h-[60vh] w-[4px] bg-slate-900/80 z-40 hidden md:block rounded-full border border-slate-700">
                <motion.div 
                    style={{ height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
                    className={`w-full shadow-[0_0_10px] ${isAlarmActive ? 'bg-red-500 shadow-red-500' : 'bg-cyan-500 shadow-cyan-500'}`}
                />
            </div>

            {/* --- MAIN SCROLL CONTENT (Z-10 sits ABOVE vignette) --- */}
            <main className="relative z-10">
                <section className="relative min-h-screen flex flex-col justify-center items-center">
                    <Hero />
                </section>

                <section className="relative z-20 py-32">
                    <Lore />
                </section>

                <section className="relative z-20 py-20 bg-slate-950/80 backdrop-blur-sm border-y border-slate-900">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5" />
                    <WhaleHuntGame />
                </section>

                <section className="relative z-20 py-32 bg-black">
                    <WhaleRadar />
                </section>

                <section className="relative z-20 py-20">
                    <Tokenomics />
                </section>

                <TheFlippening />

                <section className="relative z-20 pb-32 pt-20">
                    <WhaleOracle />
                </section>
            </main>

            {/* FOOTER */}
            <footer className="relative z-20 bg-black text-center py-12 border-t border-slate-900 font-tech text-slate-600 text-xs">
                <p>TRANSMISSION ENDED. SIGNAL LOST.</p>
                <p className="mt-2">COPYRIGHT 1851 PEQUOD HOLDINGS LLC.</p>
            </footer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;