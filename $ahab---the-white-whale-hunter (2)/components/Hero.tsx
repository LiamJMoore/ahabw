import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const yAhab = useTransform(scrollY, [0, 1000], [0, 400]);
  const textScale = useTransform(scrollY, [0, 300], [1, 1.2]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div id="hero" className="absolute inset-0 h-[120vh] w-full overflow-hidden flex items-center justify-center">
      
      {/* 1. DYNAMIC OCEAN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
         {/* Static Sky */}
         <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#1e293b] to-[#0f172a]" />
         
         {/* Moving Wave Layer 1 (Far) */}
         <div className="absolute bottom-0 left-0 right-0 h-[60%] opacity-40" 
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                backgroundSize: '100px',
                animation: 'wave 20s linear infinite'
              }}
         />

         {/* Moving Wave Layer 2 (Mid) */}
         <div className="absolute -bottom-20 left-[-20%] right-[-20%] h-[50%] bg-[#1e293b] opacity-60 rounded-[50%]"
              style={{ animation: 'swell 8s ease-in-out infinite alternate' }} 
         >
            <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
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

      {/* 2. ATMOSPHERICS (Lightened for better visibility) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      
      {/* 3. MAIN TITLE CONTENT */}
      <motion.div 
        style={{ y: yAhab, scale: textScale, opacity: textOpacity }}
        className="relative z-20 text-center px-4 flex flex-col items-center w-full"
      >
        <div className="inline-block border border-red-500/50 bg-black/40 backdrop-blur-md px-4 py-1 mb-6 rounded text-red-500 font-tech text-xs tracking-[0.5em] animate-pulse">
            STORM LEVEL: CRITICAL
        </div>

        <h1 className="font-meme text-[9rem] md:text-[15rem] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-slate-100 to-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter blur-[0.5px] py-4 px-8">
          $AHAB
        </h1>
        
        <h2 className="font-display text-2xl md:text-4xl text-slate-300 mt-4 tracking-widest uppercase blood-text">
            The Whale Must Die
        </h2>

        <p className="max-w-xl mx-auto mt-6 font-mono text-slate-300 text-sm md:text-base bg-black/40 p-4 border-l-2 border-red-600 backdrop-blur-sm">
            "There is no utility. There is no roadmap. Only the hunt. 
            We are the Pequod. The chart is broken. The compass spins."
        </p>

        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('lore')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-12 group relative overflow-hidden bg-red-700 hover:bg-red-600 text-white font-black font-meme text-3xl px-16 py-6 border-4 border-double border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.4)] clip-path-polygon"
        >
            <span className="relative z-10 flex items-center gap-2">
               DEPLOY SONAR
            </span>
            <div className="absolute inset-0 bg-red-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
        </motion.button>

        <div className="mt-8 animate-bounce text-slate-400 font-tech text-xs">
            DIVE INTO THE ABYSS
            <div className="text-center">↓</div>
        </div>
      </motion.div>

    </div>
  );
};