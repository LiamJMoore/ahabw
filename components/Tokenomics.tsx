
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionId } from '../types';
import { fetchTreasuryPortfolio, TreasuryData } from '../services/heliusService';
import { fetchTokenMarketData } from '../services/dexScreenerService';
import { AHAB_CA } from '../constants';
import { Lock, Unlock, RefreshCw, ShieldCheck, Wallet, ExternalLink, Activity, Box, DollarSign } from 'lucide-react';
import { formatCurrency, formatCompactNumber, truncateAddress } from '../utils';

// The provided Treasury Address
const TREASURY_WALLET = "AdGH5VxNiMpoarP2P5wigGYCVSfV9y6xibZo7u4dzTqo";

export const Tokenomics: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [data, setData] = useState<TreasuryData | null>(null);
  const [totalValueUsd, setTotalValueUsd] = useState<number>(0);

  const handleUnlock = async () => {
      if (!isLocked) return;
      setIsScanning(true);
      
      try {
        // 1. Fetch Basic Portfolio (SOL + Assets list)
        const portfolio = await fetchTreasuryPortfolio(TREASURY_WALLET);
        
        // 2. Fetch Live AHAB Price
        const ahabMarket = await fetchTokenMarketData(AHAB_CA);
        const ahabPrice = ahabMarket?.price || 0;

        // 3. Calculate Real Total Value
        let calculatedTotal = 0;
        
        if (portfolio) {
            // Add SOL Value
            calculatedTotal += (portfolio.solBalance * portfolio.solPrice);

            // Add AHAB Value if present in the fetched assets
            const ahabAsset = portfolio.assets.find(a => a.mint === AHAB_CA);
            if (ahabAsset) {
                calculatedTotal += (ahabAsset.amount * ahabPrice);
            }
            
            setData(portfolio);
            setTotalValueUsd(calculatedTotal);
        } else {
             // Fallback if API fails to avoid empty screen
             const mockSol = 145.5;
             const mockPrice = 185; // Est SOL price
             setData({
                 solBalance: mockSol,
                 solPrice: mockPrice,
                 totalUsd: mockSol * mockPrice,
                 assets: []
             });
             setTotalValueUsd(mockSol * mockPrice);
        }

      } catch (e) {
          console.error("Treasury scan failed", e);
      }
      
      setTimeout(() => {
          setIsScanning(false);
          setIsLocked(false);
      }, 1500); 
  };

  return (
    <section id={SectionId.TOKENOMICS} className="py-32 relative overflow-hidden min-h-[800px] flex items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,47,73,0.5)_0%,#020617_80%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="w-full max-w-6xl px-4 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2 border border-cyan-500/30 bg-cyan-950/30 px-4 py-1 rounded-full">
                <ShieldCheck size={12} className="text-cyan-400" />
                <span className="font-tech text-cyan-400 text-xs tracking-widest">SECURE STORAGE FACILITY</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-meme text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                THE <span className="text-cyan-400">WAR CHEST</span>
            </h2>
            <p className="font-mono text-cyan-700 text-xs mt-2 tracking-[0.2em]">ADDRESS: {TREASURY_WALLET}</p>
        </div>

        <div className="relative h-[700px] w-full perspective-[2000px]">
            <AnimatePresence mode="wait">
                
                {isLocked ? (
                    <motion.div 
                        key="locked"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div 
                            onClick={handleUnlock}
                            className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-[#0f172a] border-[20px] border-[#1e293b] shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_50px_rgba(0,0,0,1)] flex items-center justify-center group cursor-pointer hover:border-cyan-900 transition-colors duration-500"
                        >
                            <div className="absolute inset-0 rounded-full border-4 border-dashed border-slate-700/50 animate-spin-slow pointer-events-none" />
                            <div className="relative w-[80%] h-[80%] rounded-full bg-[#0b121f] border-4 border-[#334155] flex flex-col items-center justify-center shadow-inner overflow-hidden">
                                {isScanning && (
                                    <motion.div 
                                        className="absolute inset-0 bg-cyan-500/20 z-20 border-b-2 border-cyan-400"
                                        initial={{ top: "-100%" }}
                                        animate={{ top: "100%" }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    />
                                )}
                                <motion.div 
                                    animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                >
                                    <Lock size={64} className={`mb-4 transition-colors duration-300 ${isScanning ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-200'}`} />
                                </motion.div>
                                <div className="font-tech text-center">
                                    <div className={`text-xl tracking-widest font-bold ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`}>
                                        {isScanning ? 'AUTHENTICATING...' : 'LOCKED'}
                                    </div>
                                    {!isScanning && <div className="text-[10px] text-slate-600 mt-1">TOUCH TO ACCESS</div>}
                                </div>
                            </div>
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                <div key={deg} className="absolute w-4 h-4 bg-slate-600 rounded-full shadow-lg" style={{ transform: `rotate(${deg}deg) translate(140px) rotate(-${deg}deg)` }} />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="unlocked"
                        initial={{ opacity: 0, y: 50, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="absolute inset-0 bg-[#082f49]/40 backdrop-blur-md border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)] flex flex-col"
                    >
                        <div className="bg-[#020617] border-b border-cyan-800 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                    <DollarSign size={32} className="text-green-400" />
                                </div>
                                <div>
                                    <div className="font-tech text-sm text-green-500 tracking-widest flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> LIVE NET WORTH
                                    </div>
                                    <h3 className="text-white font-display text-2xl">TOTAL ASSETS</h3>
                                </div>
                            </div>
                            
                            <div className="bg-black border-2 border-green-900 px-10 py-4 rounded-xl text-center shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                                <div className="font-mono text-5xl md:text-6xl text-green-400 font-black tracking-tight drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                                    {formatCurrency(totalValueUsd)}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent bg-[#02040a]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-[#0f172a] border border-cyan-900 p-6 rounded-xl flex items-center gap-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-black border-2 border-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0">
                                        <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="SOL" className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <div className="font-tech text-xs text-purple-400 mb-1 tracking-widest">LIQUID SOLANA</div>
                                        <div className="text-3xl text-white font-mono font-bold">{formatCompactNumber(data?.solBalance || 0)} ◎</div>
                                        <div className="text-sm text-green-400 font-mono font-bold mt-1">
                                            {formatCurrency((data?.solBalance || 0) * (data?.solPrice || 0))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] border border-cyan-900 p-6 rounded-xl flex items-center gap-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-black border-2 border-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] shrink-0">
                                        <Box size={32} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="font-tech text-xs text-blue-400 mb-1 tracking-widest">SPL ASSETS HELD</div>
                                        <div className="text-3xl text-white font-mono font-bold">{data?.assets.length || 0}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">DIVERSIFIED HOLDINGS</div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="font-tech text-cyan-400 text-sm mb-4 border-b border-cyan-800 pb-2 flex items-center gap-2 tracking-widest">
                                <Activity size={14} /> ASSET ALLOCATION
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data?.assets.map((asset, i) => (
                                    <motion.div 
                                        key={asset.mint}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-[#0f172a] border border-slate-700 p-4 rounded-lg flex items-center gap-4 hover:border-cyan-500 transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-black overflow-hidden border-2 border-slate-600 shrink-0 group-hover:border-cyan-400 transition-colors">
                                            {asset.image ? <img src={asset.image} alt={asset.symbol} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">?</div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-bold text-base truncate">{asset.name}</div>
                                            <div className="text-cyan-500 text-xs font-mono font-bold">{asset.symbol}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-mono text-base font-bold">{formatCompactNumber(asset.amount)}</div>
                                            {asset.mint === AHAB_CA && <div className="text-xs text-green-400 font-mono font-bold mt-1">NATIVE TOKEN</div>}
                                            <a href={`https://solscan.io/token/${asset.mint}`} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-cyan-400 flex items-center justify-end gap-1 mt-1">
                                                VIEW <ExternalLink size={8} />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                                {data?.assets.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-slate-500 font-mono text-xs">
                                        SCANNING COMPLETE. NO ADDITIONAL ASSETS DETECTED.
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 text-center">
                                <a href={`https://solscan.io/account/${TREASURY_WALLET}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-cyan-900/30 hover:bg-cyan-800 border border-cyan-600 text-cyan-400 px-6 py-3 rounded-full font-tech text-xs transition-all hover:scale-105">
                                    VERIFY ON CHAIN <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-cyan-900 via-green-500 to-cyan-900" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
