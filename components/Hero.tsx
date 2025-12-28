import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { WeatherState } from '../services/heliusService';

interface HeroProps {
    weather: WeatherState;
}

export const Hero: React.FC<HeroProps> = ({ weather }) => {
  const { scrollY } = useScroll();
  const yAhab = useTransform(scrollY, [0, 1000], [0, 400]);
  const textScale = useTransform(scrollY, [0, 300], [1, 1.2]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Weather Configurations
  const weatherConfig = {
      STORM: {
          skyGradient: 'from-[#0f0000] to-[#2a0404]', // Deep Red
          waveColor: '#450a0a',
          stormLevel: 'CRITICAL',
          message: 'THE SEA IS BLEEDING',
          particleColor: '#ef4444',
      },
      CALM: {
          skyGradient: 'from-[#022c22] to-[#064e3b]', // Deep Teal/Green
          waveColor: '#115e59',
          stormLevel: 'CLEAR',
          message: 'GOD RAYS DETECTED',
          particleColor: '#2dd4bf',
      },
      FOG: {
          skyGradient: 'from-[#1e293b] to-[#0f172a]', // Grey/Slate
          waveColor: '#334155',
          stormLevel: 'UNCERTAIN',
          message: 'VISIBILITY ZERO',
          particleColor: '#94a3b8',
      }
  }[weather];

  return (
    <div id="hero" className="absolute inset-0 h-[120vh] w-full overflow-hidden flex items-center justify-center transition-colors duration-1000">
      
      {/* 1. DYNAMIC OCEAN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden transition-colors duration-1000">
         {/* Static Sky - Changes with Weather */}
         <div className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${weatherConfig.skyGradient} transition-colors duration-1000`} />
         
         {/* Weather Specific Effects */}
         {weather === 'STORM' && (
             <div className="absolute inset-0 z-0 animate-pulse bg-red-900/10" />
         )}
         {weather === 'CALM' && (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
         )}

         {/* Moving Wave Layer 1 (Far) */}
         <div className="absolute bottom-0 left-0 right-0 h-[60%] opacity-40 transition-colors duration-1000" 
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                backgroundColor: weatherConfig.waveColor,
                backgroundSize: '100px',
                animation: weather === 'STORM' ? 'wave 10s linear infinite' : 'wave 25s linear infinite'
              }}
         />

         {/* Moving Wave Layer 2 (Mid) */}
         <div className="absolute -bottom-20 left-[-20%] right-[-20%] h-[50%] opacity-60 rounded-[50%] transition-colors duration-1000"
              style={{ 
                  backgroundColor: weatherConfig.waveColor,
                  filter: 'brightness(0.7)',
                  animation: weather === 'STORM' ? 'swell 4s ease-in-out infinite alternate' : 'swell 10s ease-in-out infinite alternate'
              }} 
         >
            <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
         </div>

         {/* Moving Wave Layer 3 (Close/Fast) */}
         <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-black/80 to-transparent z-10" />
         
         {/* The Captain Image (Blended) */}
         <img 
            src="/ahab.png" 
            alt="Captain Ahab" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
         />
      </div>

      {/* 2. ATMOSPHERICS */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      
      {/* 3. MAIN TITLE CONTENT */}
      <motion.div 
        style={{ y: yAhab, scale: textScale, opacity: textOpacity }}
        className="relative z-20 text-center px-4 flex flex-col items-center w-full"
      >
        <div className={`inline-block border bg-black/40 backdrop-blur-md px-4 py-1 mb-6 rounded font-tech text-xs tracking-[0.5em] animate-pulse transition-colors duration-1000 ${weather === 'STORM' ? 'border-red-500/50 text-red-500' : weather === 'CALM' ? 'border-green-500/50 text-green-500' : 'border-slate-500/50 text-slate-400'}`}>
            STORM LEVEL: {weatherConfig.stormLevel}
        </div>

        <h1 className="font-meme text-[9rem] md:text-[15rem] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-slate-100 to-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter blur-[0.5px] py-4 px-8">
          $AHAB
        </h1>
        
        <h2 className={`font-display text-2xl md:text-4xl mt-4 tracking-widest uppercase blood-text transition-colors duration-1000 ${weather === 'CALM' ? 'text-green-100' : 'text-slate-300'}`}>
            {weatherConfig.message}
        </h2>

        <p className="max-w-xl mx-auto mt-6 font-mono text-slate-300 text-sm md:text-base bg-black/40 p-4 border-l-2 backdrop-blur-sm transition-colors duration-1000" style={{ borderColor: weatherConfig.particleColor }}>
            "There is no utility. There is no roadmap. Only the hunt. 
            We are the Pequod. The chart is broken. The compass spins."
        </p>

        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('sonar-chart')?.scrollIntoView({ behavior: 'smooth' })}
            className={`mt-12 group relative overflow-hidden text-white font-black font-meme text-3xl px-16 py-6 border-4 border-double shadow-[0_0_50px_rgba(0,0,0,0.4)] clip-path-polygon transition-colors duration-300
                ${weather === 'CALM' 
                    ? 'bg-green-700 hover:bg-green-600 border-green-900 shadow-green-900/40' 
                    : 'bg-red-700 hover:bg-red-600 border-red-900 shadow-red-900/40'}
            `}
        >
            <span className="relative z-10 flex items-center gap-2">
               DEPLOY SONAR
            </span>
            <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 ${weather === 'CALM' ? 'bg-green-900' : 'bg-red-900'}`} />
        </motion.button>
      </motion.div>

    </div>
  );
};