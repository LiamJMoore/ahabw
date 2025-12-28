import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Skull, Zap, Gem, TrendingUp, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

const SYMBOLS = [
  { id: 'whale', icon: <span className="text-4xl">🐋</span>, value: 50, color: 'text-white' },
  { id: 'anchor', icon: <Anchor size={40} />, value: 10, color: 'text-slate-400' },
  { id: 'skull', icon: <Skull size={40} />, value: 0, color: 'text-red-600' },
  { id: 'gem', icon: <Gem size={40} />, value: 25, color: 'text-cyan-400' },
  { id: 'zap', icon: <Zap size={40} />, value: 5, color: 'text-yellow-400' },
];

export const WhaleSlots: React.FC = () => {
  const [reels, setReels] = useState([0, 1, 2]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [credits, setCredits] = useState(1000);
  const [leverage, setLeverage] = useState(1); // 1x to 100x
  const [message, setMessage] = useState("SELECT LEVERAGE");
  const [isLiquidated, setIsLiquidated] = useState(false);

  const spin = () => {
    if (credits < 100 || isSpinning || isLiquidated) return;
    
    setCredits(prev => prev - 100);
    setIsSpinning(true);
    setMessage(`SPINNING ${leverage}x LEVERAGE...`);

    // Liquidation Chance: 1% chance per 10x leverage
    const liquidationChance = leverage / 200; 

    setTimeout(() => {
        // Did we get liquidated?
        if (Math.random() < liquidationChance && leverage > 1) {
            setIsSpinning(false);
            setIsLiquidated(true);
            setCredits(0);
            setMessage("LIQUIDATED! ACCOUNT WIPED.");
            return;
        }

        const r1 = Math.floor(Math.random() * SYMBOLS.length);
        const r2 = Math.floor(Math.random() * SYMBOLS.length);
        const r3 = Math.floor(Math.random() * SYMBOLS.length);
        
        setReels([r1, r2, r3]);
        setIsSpinning(false);
        checkWin(r1, r2, r3);
    }, 1000);
  };

  const checkWin = (r1: number, r2: number, r3: number) => {
      const s1 = SYMBOLS[r1];
      const s2 = SYMBOLS[r2];
      const s3 = SYMBOLS[r3];
      
      let baseWin = 0;
      let type = '';

      if (s1.id === s2.id && s2.id === s3.id) {
          baseWin = s1.value * 5;
          type = 'JACKPOT';
          confetti({ particleCount: 150, spread: 100 });
      } else if (s1.id === s2.id || s2.id === s3.id || s1.id === s3.id) {
          baseWin = 20;
          type = 'PAIR';
      }

      if (baseWin > 0) {
          const totalWin = Math.floor(baseWin * leverage);
          setCredits(prev => prev + totalWin);
          setMessage(`${type}! WON ${totalWin} (x${leverage})`);
      } else {
          setMessage("REKT. TRY AGAIN.");
      }
  };

  const reset = () => {
      setCredits(1000);
      setIsLiquidated(false);
      setLeverage(1);
      setMessage("NEW WALLET CONNECTED");
  };

  return (
    <section className="py-24 bg-[#050505] flex justify-center items-center relative overflow-hidden border-t border-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30" />
        
        <div className="relative z-10 bg-gradient-to-b from-slate-900 to-black p-8 rounded-3xl border-4 border-yellow-900 shadow-2xl max-w-lg w-full">
            
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="font-meme text-5xl text-yellow-500 drop-shadow-[2px_2px_0_#000]">DEGEN SLOTS</h2>
                <div className={`font-mono text-xl mt-2 ${credits > 0 ? 'text-green-400' : 'text-red-500'}`}>
                    BALANCE: {credits.toLocaleString()} $AHAB
                </div>
            </div>

            {/* Reels Window */}
            <div className="bg-black border-8 border-slate-800 rounded-xl p-2 flex gap-1 mb-6 relative overflow-hidden h-40">
                {isLiquidated && (
                    <div className="absolute inset-0 z-50 bg-red-600/90 flex flex-col items-center justify-center animate-pulse">
                        <Skull size={64} className="text-black mb-2" />
                        <span className="font-black font-meme text-4xl text-black rotate-[-10deg]">LIQUIDATED</span>
                    </div>
                )}
                
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex-1 bg-slate-900 border border-slate-700 rounded flex items-center justify-center relative overflow-hidden">
                        <motion.div
                            animate={isSpinning ? { y: [0, -150, 0] } : { y: 0 }}
                            transition={isSpinning ? { repeat: Infinity, duration: 0.1 } : {}}
                            className={`flex flex-col items-center justify-center ${SYMBOLS[reels[i]].color}`}
                        >
                           {SYMBOLS[reels[i]].icon}
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Leverage Control */}
            <div className="mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                        <TrendingUp size={14} /> LEVERAGE
                    </span>
                    <span className={`font-black font-tech text-xl ${leverage > 50 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                        {leverage}x
                    </span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={leverage} 
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    disabled={isSpinning || isLiquidated}
                    className="w-full h-3 bg-black rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400"
                />
                <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                    <span>SAFE(ish)</span>
                    <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={10} /> REKT ZONE</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4">
                <div className="font-display text-lg text-slate-300 min-h-[28px] text-center">
                    {message}
                </div>
                
                {isLiquidated ? (
                    <button
                        onClick={reset}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black font-meme text-2xl py-4 rounded-xl shadow-[0_5px_0_#1e293b] active:translate-y-1 transition-all"
                    >
                        DEPOSIT MORE
                    </button>
                ) : (
                    <button
                        onClick={spin}
                        disabled={isSpinning || credits < 100}
                        className={`w-full text-white font-black font-meme text-3xl py-4 rounded-xl shadow-[0_5px_0_rgba(0,0,0,0.5)] active:translate-y-1 transition-all flex items-center justify-center gap-2
                            ${leverage > 50 ? 'bg-red-600 hover:bg-red-500 border-2 border-red-400 shadow-red-900' : 'bg-yellow-600 hover:bg-yellow-500 border-2 border-yellow-400 shadow-yellow-900'}
                        `}
                    >
                        {isSpinning ? <Zap className="animate-spin" /> : `APE IN (100)`}
                    </button>
                )}
            </div>
        </div>
    </section>
  );
};
