import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero } from './components/Hero';
import { CommLinks } from './components/CommLinks';
import { WhaleHuntGame } from './components/WhaleHuntGame';
import { Lore } from './components/Lore';
import { Tokenomics } from './components/Tokenomics';
import { WhaleRadar } from './components/WhaleRadar';
import { WhaleOracle } from './components/WhaleOracle';
import { TheFlippening } from './components/TheFlippening';
import { WhaleAlarm } from './components/WhaleAlarm';
import { WhaleSlots } from './components/WhaleSlots';
import { WhaleRPG } from './components/WhaleRPG';
import { WorldBoss } from './components/WorldBoss';
import { CaptainsQuarters } from './components/CaptainsQuarters';
import { TheAbyss } from './components/TheAbyss';
import { getMarketWeather, WeatherState } from './services/heliusService';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [depth, setDepth] = useState(0);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [weather, setWeather] = useState<WeatherState>('STORM');
  const [isDrunk, setIsDrunk] = useState(false); // Global Drunk State

  // Dynamic Backgrounds - slightly lighter base to fix "too dark" issue
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

    // Weather Logic
    const updateWeather = async () => {
        const w = await getMarketWeather();
        setWeather(w);
    };
    updateWeather();
    const weatherInterval = setInterval(updateWeather, 60000); 

    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden transition-all duration-1000 ${isAlarmActive ? 'alarm-active' : ''} ${isDrunk ? 'blur-[2px] contrast-125 saturate-150' : ''}`} style={{ backgroundColor: '#020617' }}>
      
      {/* GLOBAL WORLD BOSS EVENT */}
      <WorldBoss />

      {/* GLOBAL BOAT SWAY CONTAINER */}
      <motion.div 
        animate={{ 
            rotate: isDrunk ? [1, -1, 1] : [0.5, -0.5, 0.5], // Extra sway when drunk
            y: [0, 5, 0]
        }}
        transition={{ 
            duration: isDrunk ? 4 : 8, 
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
            
            {/* Cinematic Vignette */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.2)_80%,rgba(0,0,0,0.6)_100%)]" />
            
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

            {/* --- MAIN SCROLL CONTENT --- */}
            <main className="relative z-10">
                <section className="relative min-h-screen flex flex-col justify-center items-center">
                    <Hero weather={weather} />
                </section>
                
                {/* NEW: COMMS LINKS (CA, TWITTER, DEXSCREENER) */}
                <CommLinks />

                <section className="relative z-20 py-32">
                    <Lore />
                </section>

                <section className="relative z-20 py-20 bg-slate-950/80 backdrop-blur-sm border-y border-slate-900">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5" />
                    <WhaleHuntGame />
                </section>

                <section className="relative z-20">
                     <div className="text-center py-10 bg-slate-950">
                        <h2 className="font-meme text-4xl text-red-600">THE FINAL SHOWDOWN</h2>
                        <p className="font-tech text-slate-500">TURN-BASED COMBAT SIMULATION</p>
                     </div>
                     <WhaleRPG />
                </section>

                <WhaleSlots />

                <section className="relative z-20 py-32 bg-black">
                    <WhaleRadar />
                </section>

                <section className="relative z-20 py-20">
                    <Tokenomics />
                </section>

                <TheFlippening />

                <section className="relative z-20 py-32">
                    <WhaleOracle />
                </section>

                {/* MOVED: CAPTAIN'S QUARTERS */}
                <CaptainsQuarters onDrunkMode={setIsDrunk} />
            </main>

            {/* THE ABYSS (REPLACES FOOTER) */}
            <TheAbyss />

        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;