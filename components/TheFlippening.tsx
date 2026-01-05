
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { fetchTokenMarketData } from '../services/dexScreenerService';
import { AHAB_CA, WHITE_WHALE_CA } from '../constants';
import { Skull } from 'lucide-react';

export const TheFlippening: React.FC = () => {
  // State for both tokens
  const [ahabStats, setAhabStats] = useState({ mcap: 0, price: 0 });
  const [whaleStats, setWhaleStats] = useState({ mcap: 0, price: 0 });
  
  // Progress Logic
  const progress = whaleStats.mcap > 0 
    ? (ahabStats.mcap / whaleStats.mcap) * 100 
    : 0;

  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch Ahab Data
      const ahabData = await fetchTokenMarketData(AHAB_CA);
      if (ahabData) {
          setAhabStats({ mcap: ahabData.marketCap, price: ahabData.price });
      }

      // 2. Fetch White Whale Data
      const whaleData = await fetchTokenMarketData(WHITE_WHALE_CA);
      if (whaleData) {
          setWhaleStats({ mcap: whaleData.marketCap, price: whaleData.price });
      }
    };
    loadData();
    
    // Refresh every 15s for live feel
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id={SectionId.FLIPPENING} className="py-24 bg-[#020617] relative border-t border-cyan-900/30 overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#0f172a] z-0" />
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-meme text-5xl md:text-7xl text-white tracking-widest mb-4 drop-shadow-lg">
                THE <span className="text-cyan-400">FLIPPERNING</span>
            </h2>
            <div className="bg-cyan-950/50 border border-cyan-500/30 px-6 py-2 rounded-full flex items-center gap-3 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"/>
                <span className="font-tech text-cyan-300 text-xs tracking-[0.2em]">LIVE MARKET DATA FEED</span>
            </div>
        </div>

        {/* COMPARISON DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* LEFT PANEL: AHAB (THE HUNTER) */}
            <div className="lg:col-span-5 relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-colors duration-500 rounded-3xl" />
                
                <div className="bg-[#0f172a]/40 border border-cyan-500/50 rounded-3xl p-8 relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                    <div className="absolute top-0 left-0 bg-cyan-600 text-white font-bold px-4 py-1 text-[10px] font-tech tracking-widest rounded-br-xl shadow-lg">
                        CHALLENGER
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 bg-cyan-900/40 rounded-full border-2 border-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                            <span className="text-5xl">⛵️</span>
                        </div>
                        <h3 className="font-meme text-5xl text-cyan-100 tracking-wider drop-shadow-md">$AHAB</h3>
                        <p className="font-mono text-cyan-300/60 text-xs mt-1">THE HUNTER</p>
                    </div>

                    <div className="space-y-4 font-tech">
                        <div className="flex justify-between items-end border-b border-cyan-500/20 pb-2">
                            <span className="text-cyan-200/70 text-xs">MARKET CAP</span>
                            <span className="text-3xl text-white drop-shadow-sm">
                                ${ahabStats.mcap.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-end border-b border-cyan-500/20 pb-2">
                            <span className="text-cyan-200/70 text-xs">PRICE</span>
                            <span className="text-xl text-cyan-400">
                                ${ahabStats.price.toFixed(6)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER: VS / PROGRESS */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center gap-4 relative">
                <div className="font-meme text-6xl text-slate-500 italic opacity-50 drop-shadow-lg">VS</div>
                <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
            </div>

            {/* RIGHT PANEL: WHITE WHALE (THE TARGET) */}
            <div className="lg:col-span-5 relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-slate-500/10 blur-2xl group-hover:bg-white/10 transition-colors duration-500 rounded-3xl" />
                
                <div className="bg-[#020617]/60 border border-slate-600/50 rounded-3xl p-8 relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <div className="absolute top-0 right-0 bg-slate-200 text-black font-bold px-4 py-1 text-[10px] font-tech tracking-widest rounded-bl-xl shadow-lg">
                        THE TARGET
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 bg-slate-900/40 rounded-full border-2 border-slate-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <div className="text-5xl filter drop-shadow-[0_0_10px_white]">🐋</div>
                        </div>
                        <h3 className="font-meme text-5xl text-white tracking-wider drop-shadow-md">$WHALE</h3>
                        <p className="font-mono text-slate-400 text-xs mt-1">THE BEAST</p>
                    </div>

                    <div className="space-y-4 font-tech">
                        <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
                            <span className="text-slate-400 text-xs">MARKET CAP</span>
                            <span className="text-3xl text-white">
                                ${whaleStats.mcap.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
                            <span className="text-slate-400 text-xs">PRICE</span>
                            <span className="text-xl text-slate-200">
                                ${whaleStats.price.toFixed(6)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* PROGRESS BAR */}
        <div className="mt-16 max-w-4xl mx-auto">
             <div className="flex justify-between text-xs font-tech text-cyan-300 mb-2">
                 <span>FLIP PROGRESS</span>
                 <span>{progress.toFixed(4)}%</span>
             </div>
             <div className="h-8 bg-[#020617] rounded-full border border-cyan-900 overflow-hidden relative shadow-inner">
                 {/* Progress Fill */}
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(progress, 1)}%` }} // Ensure at least a sliver is visible
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 relative"
                 >
                     <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-white blur-[4px]" />
                     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px]" />
                 </motion.div>
                 
                 {/* Ticks */}
                 <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
                     {[25, 50, 75].map(tick => (
                         <div key={tick} className="h-full w-[1px] bg-cyan-900/50" />
                     ))}
                 </div>
             </div>
             <div className="mt-4 text-center font-mono text-[10px] text-cyan-600">
                 DATA UPDATES EVERY 15 SECONDS // SOURCE: DEXSCREENER
             </div>
        </div>

      </div>
    </section>
  );
};
