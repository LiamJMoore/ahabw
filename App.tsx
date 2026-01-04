
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero } from './components/Hero';
import { Lore } from './components/Lore';
import { Tokenomics } from './components/Tokenomics';
import { WhaleRadar } from './components/WhaleRadar';
import { WhaleOracle } from './components/WhaleOracle';
import { WhaleRPG } from './components/WhaleRPG';
import { TheFlippening } from './components/TheFlippening';
import { TokenAnalytics } from './components/TokenAnalytics';
import { getMarketWeather, WeatherState } from './services/heliusService';
import { AHAB_CA } from './constants';
import { CommLinks } from './components/CommLinks';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [weather, setWeather] = useState<WeatherState>('CALM');

  // Dynamic Backgrounds - Deep Ocean Vibe
  const waterColor = useTransform(scrollYProgress, 
    [0, 0.3, 0.8, 1], 
    ['#020617', '#082f49', '#0c4a6e', '#000000'] 
  );

  useEffect(() => {
    // Weather Logic
    const updateWeather = async () => {
        const w = await getMarketWeather();
        setWeather(w);
    };
    updateWeather();
    const weatherInterval = setInterval(updateWeather, 60000); 

    return () => {
        clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#020617' }}>
      
      {/* GLOBAL BOAT SWAY CONTAINER - Gentle */}
      <motion.div 
        animate={{ 
            rotate: [0.2, -0.2, 0.2],
            y: [0, 5, 0]
        }}
        transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
        }}
        className="origin-top"
      >
        <motion.div style={{ backgroundColor: waterColor }} className="min-h-screen text-slate-200 transition-colors duration-1000">
            
            {/* --- ATMOSPHERIC LAYERS --- */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.1)_0%,rgba(0,0,0,0)_60%)]" />
            
            {/* --- HUD NAVIGATION --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto flex flex-col">
                    <h1 className="font-meme text-4xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] tracking-wider">
                    $WHITE<span className="text-cyan-400">WHALE</span>
                    </h1>
                    <span className="text-[10px] font-tech tracking-[0.3em] text-cyan-300">
                    ETHICAL STEWARDSHIP PROTOCOL
                    </span>
                </div>
            </nav>

            {/* --- MAIN SCROLL CONTENT --- */}
            <main className="relative z-10 pb-20">
                <section className="relative min-h-screen flex flex-col justify-center items-center">
                    <Hero weather={weather} />
                </section>
                
                <CommLinks />

                <section className="relative z-20 py-10">
                    <Lore />
                </section>

                <div className="py-10">
                    <div className="text-center mb-8">
                        <h2 className="font-meme text-4xl text-white">TREASURY & ECOSYSTEM MONITOR</h2>
                        <p className="font-tech text-cyan-500">RADICAL TRANSPARENCY</p>
                    </div>
                    <TokenAnalytics ca={AHAB_CA} />
                </div>

                <WhaleRPG />

                <TheFlippening />

                <section className="relative z-20 py-20 bg-black">
                    <WhaleRadar />
                </section>

                <section className="relative z-20 py-20">
                    <Tokenomics />
                </section>

                <section className="relative z-20 py-32">
                    <WhaleOracle />
                </section>

            </main>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;
