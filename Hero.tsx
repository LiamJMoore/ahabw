
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { WeatherState } from '../services/heliusService';
import { AHAB_CA } from '../constants';
import { Copy, Check, Rocket, Anchor } from 'lucide-react';

interface HeroProps {
    weather: WeatherState;
}

export const Hero: React.FC<HeroProps> = ({ weather }) => {
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Transforms
  const yBack = useTransform(scrollY, [0, 1000], [0, 500]); // Background moves slow
  const yText = useTransform(scrollY, [0, 500], [0, 200]);  // Text moves medium
  const yFore = useTransform(scrollY, [0, 1000], [0, -200]); // Foreground moves up (depth)
  
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);
  const blurText = useTransform(scrollY, [0, 300], ["0px", "20px"]);

  const [copied, setCopied] = useState(false);

  // Mouse Spotlight Effect
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
    <div ref={containerRef} id="hero" className="relative h-[130vh] w-full overflow-hidden flex items-center justify-center bg-[#020617]">
      
      {/* 1. DYNAMIC LIGHTING / SPOTLIGHT (Cyan Tint) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000 mix-blend-screen"
        style={{
            background: `radial-gradient(circle 800px at ${mousePos.x}% ${mousePos.y}%, rgba(34,211,238,0.1), transparent 70%)`
        }}
      />

      {/* 2. DEEP OCEAN LAYERS (Parallax) - PRESERVING BLUE */}
      <motion.div style={{ y: yBack }} className="absolute inset-0 z-0">
          {/* Base Layer: Rich Deep Blue Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#020617] to-black" />
          
          {/* Caustics (Light rays) */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] animate-pulse mix-blend-overlay" />
          
          {/* Moving Fog (Cyan tinted) */}
          <div className="absolute inset-0 opacity-20 mix-blend-screen" 
             style={{ 
                 backgroundImage: 'url("https://www.transparenttextures.com/patterns/foggy-birds.png")',
                 animation: 'drift 60s linear infinite'
             }} 
          />
      </motion.div>

      {/* 3. HERO CONTENT */}
      <motion.div 
        style={{ y: yText, opacity: opacityText, filter: `blur(${blurText})` }}
        className="relative z-20 text-center px-4 flex flex-col items-center w-full max-w-6xl"
      >
        {/* Cinematic Status Line */}
        <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-400" />
            <div className="font-tech text-xs tracking-[0.5em] text-cyan-300 uppercase animate-pulse drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                TARGET: {weather === 'STORM' ? 'RED_CANDLE_STORM' : 'CLEAR_WATERS'}
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>

        {/* LIQUID TITLE */}
        {/* Adjusted padding to fix 'B' fill clipping */}
        <div className="relative mb-6">
            <h1 className="font-meme text-[8rem] sm:text-[10rem] md:text-[14rem] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-cyan-100 via-white to-cyan-50 drop-shadow-[0_0_50px_rgba(6,182,212,0.4)] liquid-text p-4 pr-12">
              $AHAB
            </h1>
            {/* Outline duplicate for depth */}
            <h1 className="absolute inset-0 font-meme text-[8rem] sm:text-[10rem] md:text-[14rem] leading-[0.8] text-transparent stroke-cyan-200 stroke-2 opacity-30 pointer-events-none p-4 pr-12" style={{ WebkitTextStroke: '2px rgba(34,211,238,0.3)' }}>
              $AHAB
            </h1>
        </div>
        
        <h2 className="font-display text-xl md:text-3xl tracking-[0.3em] uppercase text-cyan-200/90 mb-8 border-y border-cyan-500/30 py-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            The Whale Must Die
        </h2>

        <p className="max-w-xl mx-auto font-special text-cyan-100/80 text-lg leading-relaxed text-shadow-sm mb-12">
            "I see in him outrageous strength, with an inscrutable malice sinewing it. That is what I hate."
        </p>

        {/* ACTION MODULE */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl">
            
            {/* CA Card */}
            <button 
                onClick={handleCopy}
                className="w-full bg-[#020617]/60 backdrop-blur-md border border-cyan-800 hover:border-cyan-400 transition-all duration-300 rounded-xl p-1 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <div className="flex items-center justify-between bg-[#0f172a]/50 rounded-lg p-3">
                    <div className="flex flex-col items-start">
                        <span className="text-[9px] font-tech text-cyan-300 uppercase tracking-wider">CONTRACT ADDRESS</span>
                        <code className="font-mono text-cyan-100 text-xs sm:text-sm drop-shadow-md">{AHAB_CA.slice(0, 6)}...{AHAB_CA.slice(-6)}</code>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 bg-cyan-400/80 px-3 py-2 rounded uppercase shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        {copied ? 'COPIED' : 'COPY'} {copied ? <Check size={14}/> : <Copy size={14}/>}
                    </div>
                </div>
            </button>

            {/* Main CTA */}
            <a 
                href="https://pump.fun/coin/6Wv4Li6toFybiJajVN3ZBTi7hF8DGbujmewqc86tpump"
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto px-8 py-4 bg-red-800 hover:bg-red-700 text-white font-meme text-2xl tracking-widest rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-3 border-b-4 border-red-950 active:border-b-0 active:translate-y-1"
            >
                <Rocket className="animate-bounce" /> BUY NOW
            </a>
        </div>

      </motion.div>

      {/* 4. FOREGROUND PARALLAX ELEMENTS */}
      <motion.div style={{ y: yFore }} className="absolute inset-0 pointer-events-none z-30">
          {/* Left Chains */}
          <img src="https://www.transparenttextures.com/patterns/dark-matter.png" className="absolute -left-20 top-[40%] w-64 h-full opacity-30 mix-blend-multiply" />
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-80">
            <span className="font-tech text-[10px] tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">DIVE DEEPER</span>
            <Anchor size={24} className="text-cyan-400" />
          </div>
      </motion.div>

      <style>{`
        @keyframes drift { 0% { background-position: 0 0; } 100% { background-position: 1000px 0; } }
      `}</style>

    </div>
  );
};
