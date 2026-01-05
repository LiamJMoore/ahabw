
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { WeatherState } from '../services/heliusService';
import { AHAB_CA } from '../constants';
import { Copy, Check, Rocket, Anchor, Ship, Crosshair, Map, Zap } from 'lucide-react';

interface HeroProps {
    weather: WeatherState;
}

export const Hero: React.FC<HeroProps> = ({ weather }) => {
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Transforms
  const yBack = useTransform(scrollY, [0, 1000], [0, 500]);
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  const yFore = useTransform(scrollY, [0, 1000], [0, -200]);
  
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ 
            x: (e.clientX / window.innerWidth) * 100, 
            y: (e.clientY / window.innerHeight) * 100 
        });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(AHAB_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={containerRef} id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#020617] pt-20">
      
      {/* 1. DYNAMIC LIGHTING */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000 mix-blend-screen"
        style={{
            background: `radial-gradient(circle 800px at ${mousePos.x}% ${mousePos.y}%, rgba(34,211,238,0.1), transparent 70%)`
        }}
      />

      {/* 2. BACKGROUND LAYERS */}
      <motion.div style={{ y: yBack }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#020617] to-black" />
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] animate-pulse mix-blend-overlay" />
          <div className="absolute inset-0 opacity-20 mix-blend-screen" 
             style={{ 
                 backgroundImage: 'url("https://www.transparenttextures.com/patterns/foggy-birds.png")',
                 animation: 'drift 60s linear infinite'
             }} 
          />
      </motion.div>

      {/* 3. HERO CONTENT WRAPPER - HUD STYLE */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4 flex flex-col items-center -mt-32 md:-mt-40"
      >
        
        {/* HUD FRAME */}
        <div className="absolute inset-0 pointer-events-none border-x border-cyan-900/20 max-w-5xl mx-auto hidden lg:block">
            <div className="absolute top-0 left-0 w-2 h-20 bg-cyan-500/50" />
            <div className="absolute top-0 right-0 w-2 h-20 bg-cyan-500/50" />
            <div className="absolute bottom-0 left-0 w-2 h-20 bg-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-2 h-20 bg-cyan-500/50" />
            
            <div className="absolute top-1/3 left-0 w-full h-[1px] border-t border-dashed border-cyan-900/30" />
            <div className="absolute bottom-1/3 left-0 w-full h-[1px] border-t border-dashed border-cyan-900/30" />
        </div>

        {/* TOP STATUS PILL */}
        <div className="bg-cyan-950/40 backdrop-blur-md border border-cyan-500/30 rounded-full px-6 py-2 mb-6 flex items-center gap-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${weather === 'STORM' ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                <span className="font-tech text-xs text-cyan-300 tracking-[0.2em] uppercase">
                    SECTOR CONDITION: {weather}
                </span>
            </div>
            <div className="w-[1px] h-4 bg-cyan-800" />
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-500">
                <Crosshair size={12} /> TARGET LOCKED
            </div>
        </div>

        {/* TITLE SECTION */}
        <div className="relative text-center mb-6">
            <h1 className="font-meme text-[8rem] sm:text-[11rem] md:text-[15rem] leading-[0.75] text-transparent bg-clip-text bg-gradient-to-t from-cyan-100 via-white to-cyan-50 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] liquid-text py-4 px-12 select-none">
              $AHAB
            </h1>
            <h1 className="absolute inset-0 font-meme text-[8rem] sm:text-[11rem] md:text-[15rem] leading-[0.75] text-transparent stroke-cyan-500 stroke-1 opacity-20 pointer-events-none blur-sm py-4 px-12" style={{ WebkitTextStroke: '2px rgba(34,211,238,0.2)' }}>
              $AHAB
            </h1>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-2xl md:text-3xl tracking-[0.4em] uppercase text-cyan-100/90 mb-4 border-b border-cyan-500/20 pb-4 inline-block">
                The Whale Must Die
            </h2>
            <p className="font-special text-cyan-200/60 text-lg">
                "To the last I grapple with thee; from hell's heart I stab at thee."
            </p>
        </div>

        {/* COMMAND DECK (Unified Action Area) */}
        <div className="w-full max-w-3xl bg-[#08101e]/80 backdrop-blur-xl border border-cyan-800 rounded-2xl p-3 flex flex-col gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            
            {/* Ambient Scanline for Console */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.05),transparent)] animate-scan-fast pointer-events-none" />

            {/* CA DISPLAY (Top - Full Width) */}
            <div className="w-full bg-[#020617] rounded-xl border border-cyan-900/50 p-4 flex flex-col items-center justify-center relative overflow-hidden group/copy cursor-pointer transition-all hover:border-cyan-500/30 hover:bg-cyan-950/20" onClick={handleCopy}>
                <div className="flex items-center justify-between w-full mb-2">
                     <div className="flex items-center gap-2">
                        <Map size={12} className="text-cyan-600" />
                        <span className="text-[10px] font-tech text-cyan-600 tracking-widest uppercase">Target Coordinates</span>
                     </div>
                     <span className="text-[10px] font-tech text-cyan-800 tracking-widest uppercase">{copied ? 'COPIED' : 'CLICK_TO_COPY'}</span>
                </div>

                <div className="flex items-center gap-3 w-full">
                    <code className="font-mono text-cyan-200 text-xs sm:text-sm md:text-lg tracking-wide break-all text-center flex-1 transition-colors group-hover/copy:text-white group-hover/copy:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                        {AHAB_CA}
                    </code>
                    <div className="bg-cyan-900/30 p-2 rounded-lg border border-cyan-800/50 text-cyan-500 group-hover/copy:text-white group-hover/copy:bg-cyan-500 group-hover/copy:border-cyan-400 transition-all shrink-0">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </div>
                </div>
                
                {/* Tech Deco */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-cyan-500/50 w-0 group-hover/copy:w-full transition-all duration-500" />
            </div>

            {/* ACTION BUTTON (Bottom - Full Width) */}
            <a 
                href="https://pump.fun/coin/6Wv4Li6toFybiJajVN3ZBTi7hF8DGbujmewqc86tpump"
                target="_blank"
                rel="noreferrer"
                className="w-full relative group/btn overflow-hidden rounded-xl bg-gradient-to-r from-red-700 to-red-900 flex items-center justify-between px-6 py-5 border border-red-500/50 hover:border-red-400 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]"
            >
                <div className="relative z-10 flex flex-col">
                    <span className="font-meme text-3xl text-white tracking-widest leading-none drop-shadow-md">BOARD THE SHIP</span>
                    <span className="font-tech text-[10px] text-red-200 tracking-[0.3em] uppercase group-hover/btn:text-white transition-colors">Launch Sequence Ready</span>
                </div>
                
                {/* Animated Ship Icon */}
                <div className="relative z-10 bg-red-950/50 p-3 rounded-lg border border-red-500/30 group-hover/btn:scale-110 transition-transform duration-300">
                    <Ship className="text-white w-8 h-8 group-hover/btn:animate-pulse" />
                </div>

                {/* Hover Slide Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 z-0" />
                
                {/* Particle/Speed Lines */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-30 transition-opacity z-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] animate-pulse" />
            </a>
        </div>

      </motion.div>

      {/* 4. FOREGROUND ELEMENT (Depth) */}
      <motion.div style={{ y: yFore }} className="absolute bottom-0 w-full pointer-events-none z-30 flex justify-center opacity-80">
          <div className="w-[1px] h-32 bg-gradient-to-t from-cyan-500/50 to-transparent" />
      </motion.div>

      <style>{`
        @keyframes drift { 0% { background-position: 0 0; } 100% { background-position: 1000px 0; } }
      `}</style>

    </div>
  );
};
