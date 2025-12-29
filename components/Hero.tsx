import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { WeatherState } from '../services/heliusService';
import { AHAB_CA } from '../constants';
import { Copy, Check, Twitter, BarChart3 } from 'lucide-react';

interface HeroProps {
    weather: WeatherState;
}

export const Hero: React.FC<HeroProps> = ({ weather }) => {
  const { scrollY } = useScroll();
  const yAhab = useTransform(scrollY, [0, 1000], [0, 400]);
  const textScale = useTransform(scrollY, [0, 300], [1, 1.2]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(AHAB_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Neutral Configurations - Dark/Slate aesthetic regardless of weather
  const weatherConfig = {
      skyGradient: 'from-[#0f172a] to-[#020617]', // Deep Slate to Black
      waveColor: '#1e293b', // Slate 800
      particleColor: '#94a3b8', // Slate 400
      message: weather === 'STORM' ? 'THE SEA IS ROUGH' : weather === 'CALM' ? 'THE HORIZON IS CLEAR' : 'VISIBILITY LOW',
      stormLevel: weather === 'STORM' ? 'HIGH' : weather === 'CALM' ? 'STABLE' : 'UNCERTAIN',
  };

  return (
    <div id="hero" className="absolute inset-0 h-[120vh] w-full overflow-hidden flex items-center justify-center transition-colors duration-1000">
      
      {/* 1. DYNAMIC OCEAN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden transition-colors duration-1000">
         {/* Static Sky */}
         <div className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${weatherConfig.skyGradient}`} />
         
         {/* Neutral Ambient Effects */}
         {weather === 'STORM' && (
             <div className="absolute inset-0 z-0 animate-pulse bg-slate-800/20" />
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
        className="relative z-20 text-center px-4 flex flex-col items-center w-full max-w-4xl"
      >
        <div className="inline-block border border-slate-700 bg-black/40 backdrop-blur-md px-4 py-1 mb-6 rounded font-tech text-xs tracking-[0.5em] text-slate-400">
            STORM LEVEL: {weatherConfig.stormLevel}
        </div>

        <h1 className="font-meme text-[9rem] md:text-[15rem] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-slate-100 to-slate-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter blur-[0.5px] py-4 px-8">
          $AHAB
        </h1>
        
        <h2 className="font-display text-2xl md:text-4xl mt-4 tracking-widest uppercase text-slate-300">
            {weatherConfig.message}
        </h2>

        <p className="max-w-xl mx-auto mt-6 font-mono text-slate-300 text-sm md:text-base bg-black/40 p-4 border-l-2 border-slate-500 backdrop-blur-sm mb-12">
            "There is no utility. There is no roadmap. Only the hunt. 
            We are the Pequod. The chart is broken. The compass spins."
        </p>

        {/* REPLACED BUTTON WITH COMMS LINKS */}
        <div className="w-full flex flex-col md:flex-row items-center gap-4 justify-center">
            
            {/* CONTRACT ADDRESS BAR */}
            <button 
                onClick={handleCopy}
                className="w-full md:w-auto md:min-w-[400px] bg-black/60 hover:bg-black/80 backdrop-blur-md border border-slate-600 hover:border-cyan-500 rounded-xl p-2 flex items-center justify-between group transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
            >
                <div className="bg-slate-800 px-3 py-2 rounded text-slate-400 font-mono text-xs border border-slate-700 group-hover:bg-cyan-900/20 group-hover:text-cyan-400 transition-colors">
                    CA
                </div>
                
                <code className="font-mono text-slate-300 text-xs md:text-sm truncate px-3 flex-1 text-center tracking-wider group-hover:text-cyan-200 transition-colors">
                    {AHAB_CA}
                </code>
                
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded border border-slate-800">
                    <span className="text-[10px] font-tech text-slate-500 group-hover:text-cyan-400 uppercase tracking-wider hidden sm:block">
                        {copied ? 'COPIED' : 'COPY'}
                    </span>
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400 group-hover:text-cyan-400" />}
                </div>
            </button>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 w-full md:w-auto">
                <a 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1a1d21]/80 hover:bg-[#202429] backdrop-blur-md text-white px-6 py-4 rounded-xl border border-slate-700 hover:border-white font-tech transition-all hover:-translate-y-1 shadow-lg min-w-[120px]"
                >
                    <BarChart3 size={18} className="text-cyan-500" />
                    <span>CHART</span>
                </a>

                <a 
                    href="https://x.com/CaptAhabCrypto" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black/60 hover:bg-black backdrop-blur-md text-white px-6 py-4 rounded-xl border border-slate-700 hover:border-white font-tech transition-all hover:-translate-y-1 shadow-lg min-w-[120px]"
                >
                    <Twitter size={18} className="text-[#1DA1F2]" />
                    <span>X</span>
                </a>
            </div>

        </div>

      </motion.div>

    </div>
  );
};