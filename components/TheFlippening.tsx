import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { fetchTokenAsset, HeliusAssetResponse } from '../services/heliusService';
import { TARGET_WHALE_CA, AHAB_CA, AHAB_PLACEHOLDER_STATS } from '../constants';
import { Activity, Zap, Users, Crosshair } from 'lucide-react';

export const TheFlippening: React.FC = () => {
  const [whaleData, setWhaleData] = useState<HeliusAssetResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Mocking Live Data for the "Chase" effect
  // In a real scenario, you'd fetch both prices.
  const targetMcap = whaleData?.result?.token_info?.price_info?.total_price || 1000000; 
  const currentAhabMcap = AHAB_PLACEHOLDER_STATS.mcap;
  
  const progress = Math.min((currentAhabMcap / targetMcap) * 100, 100);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTokenAsset(TARGET_WHALE_CA);
      setWhaleData(data);
      setLoading(false);
    };
    loadData();
    
    // Refresh every 30s
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const whaleSymbol = whaleData?.result?.content?.metadata?.symbol || 'WHALE';
  const whaleSupplyRaw = whaleData?.result?.token_info?.supply || 1000000000;
  const whaleDecimals = whaleData?.result?.token_info?.decimals || 0;
  const whaleSupply = whaleSupplyRaw / Math.pow(10, whaleDecimals);
  const whaleImage = whaleData?.result?.content?.links?.image;

  return (
    <section id={SectionId.FLIPPENING} className="py-24 bg-[#050505] relative border-t border-slate-900">
      
      {/* Background Texture - Metal Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header - Industrial Plate Style */}
        <div className="flex flex-col items-center mb-16">
            <div className="border-4 border-slate-700 bg-slate-800 px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] transform -skew-x-12">
                <h2 className="font-meme text-4xl md:text-5xl text-white tracking-widest skew-x-12">
                    THE <span className="text-red-600">FLIPPENING</span>
                </h2>
            </div>
            <p className="font-tech text-slate-500 mt-4 tracking-[0.3em] uppercase animate-pulse">
                ENGINE ROOM // TARGET INTERCEPT COURSE
            </p>
        </div>

        {/* MAIN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
            
            {/* PANEL 1: AHAB (PLAYER) */}
            <div className="lg:col-span-4 bg-black border-2 border-cyan-900 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 bg-cyan-600 text-black font-bold px-3 py-1 text-xs font-tech">
                    US // THE HUNTER
                </div>
                
                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-mono text-sm">TOKEN</span>
                        <span className="font-meme text-2xl text-cyan-400">$AHAB</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-mono text-sm flex items-center gap-2"><Activity size={14}/> MCAP</span>
                        <span className="font-tech text-xl text-white">${AHAB_PLACEHOLDER_STATS.mcap.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-mono text-sm flex items-center gap-2"><Users size={14}/> HOLDERS</span>
                        <span className="font-tech text-xl text-white">{AHAB_PLACEHOLDER_STATS.holders}</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-slate-500 text-xs uppercase font-bold">Contract Address (Pending)</span>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-xs text-slate-400 truncate mt-1">
                            {AHAB_CA}
                        </div>
                    </div>
                </div>

                {/* Rotating Fan/Gear visual for "Engine" */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 border-4 border-dashed border-cyan-900/30 rounded-full animate-spin-slow pointer-events-none" />
            </div>

            {/* PANEL 2: THE CHASE (CENTER) */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center px-4 relative">
                 {/* Visualizer */}
                 <div className="w-full h-64 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex flex-col justify-end p-4">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-20" 
                        style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}
                    />
                    
                    {/* The Target (Top) */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                            🐋
                        </div>
                        <div className="h-full w-[2px] bg-gradient-to-b from-white to-transparent absolute top-12 left-1/2 -translate-x-1/2 h-32 opacity-20" />
                    </div>

                    {/* The Hunter (Bottom - Moves based on Progress) */}
                    <motion.div 
                        initial={{ bottom: '-10%' }}
                        animate={{ bottom: `${progress}%` }}
                        transition={{ duration: 2, type: 'spring' }}
                        className="absolute left-1/2 -translate-x-1/2 w-full flex flex-col items-center"
                    >
                         <div className="text-cyan-400 font-tech text-xs mb-1 bg-black px-2 border border-cyan-500 rounded">
                            {(100 - progress).toFixed(1)}% TO INTERCEPT
                         </div>
                         <div className="text-4xl filter drop-shadow-[0_0_10px_#22d3ee]">
                            ⚓️
                         </div>
                    </motion.div>
                 </div>

                 <div className="w-full mt-4">
                    <div className="flex justify-between text-xs font-tech text-slate-500 mb-1">
                        <span>DISTANCE</span>
                        <span>IMMINENT</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            transition={{ duration: 2 }}
                            className="h-full bg-gradient-to-r from-cyan-600 to-green-500 shadow-[0_0_10px_#22d3ee]"
                        />
                    </div>
                 </div>
            </div>

            {/* PANEL 3: THE WHALE (TARGET) */}
            <div className="lg:col-span-4 bg-black border-2 border-red-900 rounded-xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-red-600 text-black font-bold px-3 py-1 text-xs font-tech">
                    TARGET // THE WHALE
                </div>

                {loading ? (
                    <div className="h-full flex items-center justify-center font-tech text-red-500 animate-pulse">
                        SCANNING HORIZON...
                    </div>
                ) : (
                    <div className="mt-8 flex flex-col gap-4">
                        <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                            <span className="text-slate-400 font-mono text-sm">TOKEN</span>
                            <div className="text-right">
                                <span className="font-meme text-2xl text-red-400">{whaleSymbol}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                            <span className="text-slate-400 font-mono text-sm flex items-center gap-2"><Crosshair size={14}/> MCAP</span>
                            <span className="font-tech text-xl text-white">
                                ${targetMcap.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                            <span className="text-slate-400 font-mono text-sm flex items-center gap-2"><Zap size={14}/> SUPPLY</span>
                            <span className="font-tech text-xl text-white">
                                {whaleSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div className="mt-4">
                            <span className="text-slate-500 text-xs uppercase font-bold">Target Address</span>
                            <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-xs text-slate-400 truncate mt-1">
                                {TARGET_WHALE_CA}
                            </div>
                        </div>
                    </div>
                )}
                 
                 {/* Image from Helius Metadata */}
                 {whaleImage && (
                     <img 
                        src={whaleImage} 
                        alt="Target" 
                        className="absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-20 grayscale"
                     />
                 )}
            </div>

        </div>

      </div>
    </section>
  );
};
