
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { WeatherState } from '../services/heliusService';
import { AHAB_CA } from '../constants';
import { Copy, Check, Rocket, Anchor, Ship } from 'lucide-react';

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
        // Added negative margin top to pull content upwards
        className="relative z-20 text-center px-4 flex flex-col items-center w-full max-w-6xl -mt-24 md:-mt-32"
      >
        {/* Cinematic Status Line */}
        <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-400" />
            <div className="font-tech text-xs tracking-[0.5em] text-cyan-300 uppercase animate-pulse drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                TARGET: {weather === 'STORM' ? 'RED_CANDLE_STORM' : 'CLEAR_WATERS'}
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>

        {/* LIQUID TITLE */}
        {/* Tightened margin bottom */}
        <div className="relative mb-2">
            <h1 className="font-meme text-[8rem] sm:text-[10rem] md:text-[14rem] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-cyan-100 via-white to-cyan-50 drop-shadow-[0_0_50px_rgba(6,182,212,0.4)] liquid-text p-4 pr-12">
              $AHAB
            </h1>
            {/* Outline duplicate for depth */}
            <h1 className="absolute inset-0 font-meme text-[8rem] sm:text-[10rem] md:text-[14rem] leading-[0.8] text-transparent stroke-cyan-200 stroke-2 opacity-30 pointer-events-none p-4 pr-12" style={{ WebkitTextStroke: '2px rgba(34,211,238,0.3)' }}>
              $AHAB
            </h1>
        </div>
        
        {/* Tightened margin bottom */}
        <h2 className="font-display text-xl md:text-3xl tracking-[0.3em] uppercase text-cyan-200/90 mb-6 border-y border-cyan-500/30 py-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            The Whale Must Die
        </h2>

        {/* Tightened margin bottom */}
        <p className="max-w-xl mx-auto font-special text-cyan-100/80 text-lg leading-relaxed text-shadow-sm mb-10">
            "I see in him outrageous strength, with an inscrutable malice sinewing it. That is what I hate."
        </p>

        {/* ACTION MODULE */}
        <div className="flex flex-col md:flex-row items-end gap-6 w-full max-w-2xl justify-center">
            
            {/* CA Card */}
            <button 
                onClick={handleCopy}
                className="w-full md:w-1/2 bg-[#020617]/60 backdrop-blur-md border border-cyan-800 hover:border-cyan-400 transition-all duration-300 rounded-xl p-1 group relative overflow-hidden h-16 self-center"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <div className="flex items-center justify-between bg-[#0f172a]/50 rounded-lg p-3 h-full">
                    <div className="flex flex-col items-start">
                        <span className="text-[9px] font-tech text-cyan-300 uppercase tracking-wider">CONTRACT ADDRESS</span>
                        <code className="font-mono text-cyan-100 text-xs sm:text-sm drop-shadow-md">{AHAB_CA.slice(0, 6)}...{AHAB_CA.slice(-6)}</code>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 bg-cyan-400/80 px-3 py-2 rounded uppercase shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        {copied ? 'COPIED' : 'COPY'} {copied ? <Check size={14}/> : <Copy size={14}/>}
                    </div>
                </div>
            </button>

            {/* Main CTA - Ship Themed */}
            <a 
                href="https://pump.fun/coin/6Wv4Li6toFybiJajVN3ZBTi7hF8DGbujmewqc86tpump"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-block cursor-pointer w-full md:w-auto text-center"
            >
                <div className="absolute -inset-2 bg-red-600/30 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
                
                <div className="relative flex flex-col items-center">
                    
                    {/* Mast/Sail Visual (Decorative) */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-red-400/50 z-0"></div>
                    <div className="absolute -top-8 left-1/2 w-0 h-0 border-l-[0px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-600/80 skew-x-[-10deg] origin-bottom transition-transform group-hover:skew-x-[0deg]"></div>

                    {/* The Button Body (Hull) */}
                    <div className="relative bg-gradient-to-b from-red-700 via-red-800 to-red-950 px-10 py-4 rounded-b-[3rem] rounded-t-lg border-t-2 border-red-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 z-10 min-w-[220px]">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Ship className="text-white group-hover:animate-bounce" size={24} />
                            <span className="font-meme text-3xl text-white tracking-widest drop-shadow-[0_2px_0_rgba(0,0,0,1)]">BOARD</span>
                        </div>
                        <div className="h-[1px] w-full bg-red-900/50 my-1" />
                        <span className="font-tech text-[10px] text-red-200 tracking-[0.3em] uppercase block">LAUNCH VOYAGE</span>
                    </div>

                    {/* Water Splash */}
                    <div className="absolute -bottom-2 w-full h-4 bg-cyan-400/20 blur-md rounded-[100%] group-hover:w-[120%] transition-all" />
                </div>
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
