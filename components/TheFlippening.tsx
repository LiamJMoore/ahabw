
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { fetchTokenMarketData } from '../services/dexScreenerService';
import { AHAB_CA, WHITE_WHALE_CA } from '../constants';
import { Activity, Skull, Shield, ArrowRight, Anchor, TrendingUp } from 'lucide-react';

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
    <section id={SectionId.FLIPPENING} className="py-24 bg-[#050505] relative border-t border-slate-900 overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-meme text-5xl md:text-6xl text-white tracking-widest mb-4">
                THE <span className="text-cyan-400">FLIPPERNING</span>
            </h2>
            <div className="bg-slate-900/50 border border-slate-700 px-6 py-2 rounded-full flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                <span className="font-tech text-cyan-400 text-xs tracking-[0.2em]">LIVE MARKET DATA FEED</span>
            </div>
        </div>

        {/* COMPARISON DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* LEFT PANEL: AHAB (THE HUNTER) */}
            <div className="lg:col-span-5 relative group">
                {/* Panel BG */}
                <div className="absolute inset-0 bg-red-950/20 blur-xl group-hover:bg-red-900/30 transition-colors duration-500 rounded-3xl" />
                
                <div className="bg-[#0f0505] border border-red-900/50 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-[0_0_30px_rgba(127,29,29,0.2)]">
                    <div className="absolute top-0 left-0 bg-red-900/80 text-white font-bold px-4 py-1 text-[10px] font-tech tracking-widest rounded-br-xl">
                        CHALLENGER
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 bg-red-900/20 rounded-full border-2 border-red-800 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <Skull size={40} className="text-red-500" />
                        </div>
                        <h3 className="font-meme text-4xl text-red-500 tracking-wider">$AHAB</h3>
                        <p className="font-mono text-red-300/50 text-xs mt-1">THE HUNTER</p>
                    </div>

                    <div className="space-y-4 font-tech">
                        <div className="flex justify-between items-end border-b border-red-900/30 pb-2">
                            <span className="text-red-800 text-xs">MARKET CAP</span>
                            <span className="text-2xl text-white">
                                ${ahabStats.mcap.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-end border-b border-red-900/30 pb-2">
                            <span className="text-red-800 text-xs">PRICE</span>
                            <span className="text-xl text-red-400">
                                ${ahabStats.price.toFixed(6)}
                            </span>
                        </div>
                        <div className="pt-2">
                             <div className="text-[10px] text-red-900 mb-1">CONTRACT ADDRESS</div>
                             <div className="bg-black/40 border border-red-900/30 p-2 rounded text-[10px] font-mono text-red-400 break-all text-center">
                                 {AHAB_CA}
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER: VS / PROGRESS */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center gap-4 relative">
                <div className="font-meme text-6xl text-slate-700 italic opacity-50">VS</div>
                <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
            </div>

            {/* RIGHT PANEL: WHITE WHALE (THE TARGET) */}
            <div className="lg:col-span-5 relative group">
                {/* Panel BG */}
                <div className="absolute inset-0 bg-cyan-950/20 blur-xl group-hover:bg-cyan-900/30 transition-colors duration-500 rounded-3xl" />
                
                <div className="bg-[#020617] border border-cyan-500/50 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <div className="absolute top-0 right-0 bg-cyan-600 text-black font-bold px-4 py-1 text-[10px] font-tech tracking-widest rounded-bl-xl">
                        THE TARGET
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 bg-cyan-900/20 rounded-full border-2 border-cyan-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                            <div className="text-4xl filter drop-shadow-[0_0_10px_#22d3ee]">🐋</div>
                        </div>
                        <h3 className="font-meme text-4xl text-cyan-400 tracking-wider">$WHITEWHALE</h3>
                        <p className="font-mono text-cyan-300/50 text-xs mt-1">THE GUARDIAN</p>
                    </div>

                    <div className="space-y-4 font-tech">
                        <div className="flex justify-between items-end border-b border-cyan-900/30 pb-2">
                            <span className="text-cyan-800 text-xs">MARKET CAP</span>
                            <span className="text-2xl text-white">
                                ${whaleStats.mcap.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-end border-b border-cyan-900/30 pb-2">
                            <span className="text-cyan-800 text-xs">PRICE</span>
                            <span className="text-xl text-cyan-400">
                                ${whaleStats.price.toFixed(6)}
                            </span>
                        </div>
                         <div className="pt-2">
                             <div className="text-[10px] text-cyan-900 mb-1">CONTRACT ADDRESS</div>
                             <div className="bg-black/40 border border-cyan-900/30 p-2 rounded text-[10px] font-mono text-cyan-400 break-all text-center">
                                 {WHITE_WHALE_CA}
                             </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* PROGRESS BAR */}
        <div className="mt-16 max-w-4xl mx-auto">
             <div className="flex justify-between text-xs font-tech text-slate-400 mb-2">
                 <span>FLIP PROGRESS</span>
                 <span>{progress.toFixed(4)}%</span>
             </div>
             <div className="h-6 bg-slate-900 rounded-full border border-slate-700 overflow-hidden relative">
                 {/* Progress Fill */}
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(progress, 1)}%` }} // Ensure at least a sliver is visible
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-red-600 to-cyan-400 relative"
                 >
                     <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white blur-[2px]" />
                 </motion.div>
                 
                 {/* Ticks */}
                 <div className="absolute inset-0 flex justify-between px-2">
                     {[25, 50, 75].map(tick => (
                         <div key={tick} className="h-full w-[1px] bg-slate-800" />
                     ))}
                 </div>
             </div>
             <div className="mt-4 text-center font-mono text-[10px] text-slate-500">
                 DATA UPDATES EVERY 15 SECONDS
             </div>
        </div>

      </div>
    </section>
  );
};
