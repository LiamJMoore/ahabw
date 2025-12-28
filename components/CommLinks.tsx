import React, { useState } from 'react';
import { Copy, Check, Twitter, BarChart3, ExternalLink, Radio } from 'lucide-react';
import { AHAB_CA } from '../constants';

export const CommLinks: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(AHAB_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-30 bg-slate-950 border-y-4 border-slate-800 shadow-2xl">
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* CONTRACT ADDRESS - CONTROL PANEL STYLE */}
        <div className="flex-1 w-full max-w-3xl">
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                    <span className="text-[10px] font-tech text-green-500 tracking-[0.2em]">SECURE FREQUENCY // CA</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600">ENCRYPTED</span>
            </div>
            
            <button 
                onClick={handleCopy}
                className="w-full bg-[#050505] hover:bg-black border-2 border-slate-700 hover:border-cyan-500 rounded-xl p-2 flex items-center justify-between group transition-all duration-300 relative overflow-hidden shadow-inner"
            >
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

                <div className="bg-slate-800 px-4 py-3 rounded-lg text-slate-400 font-mono text-xs border border-slate-600 group-hover:bg-cyan-900/20 group-hover:text-cyan-400 group-hover:border-cyan-800 transition-colors">
                    SOL
                </div>
                
                <code className="font-mono text-slate-300 text-sm md:text-lg truncate px-4 flex-1 text-center md:text-left tracking-wider group-hover:text-cyan-200 transition-colors">
                    {AHAB_CA}
                </code>
                
                <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 group-hover:border-cyan-900/50">
                    <span className="text-[10px] font-tech text-slate-500 group-hover:text-cyan-400 hidden md:block uppercase tracking-wider">
                        {copied ? 'COPIED' : 'COPY_ADDR'}
                    </span>
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-slate-400 group-hover:text-cyan-400" />}
                </div>
            </button>
        </div>

        {/* COMMS LINKS */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full lg:w-auto">
             
             {/* DEXSCREENER */}
             <a 
                href="#" 
                onClick={(e) => e.preventDefault()} // Placeholder behavior
                className="flex-1 lg:flex-none min-w-[160px] flex items-center justify-center gap-3 bg-[#1a1d21] hover:bg-[#202429] text-white px-6 py-4 rounded-xl border border-slate-700 hover:border-slate-500 font-tech transition-all hover:-translate-y-1 group relative overflow-hidden shadow-lg"
             >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5" />
                <BarChart3 size={20} className="text-cyan-500 group-hover:text-white transition-colors" />
                <span className="relative z-10 text-slate-300 group-hover:text-white">CHART</span>
                
                {/* Live Indicator */}
                <div className="absolute top-2 right-2 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                </div>
             </a>

             {/* X / TWITTER */}
             <a 
                href="https://x.com/CaptAhabCrypto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 lg:flex-none min-w-[160px] flex items-center justify-center gap-3 bg-black hover:bg-slate-950 text-white px-6 py-4 rounded-xl border border-slate-700 hover:border-slate-500 font-tech transition-all hover:-translate-y-1 group shadow-lg"
             >
                <Twitter size={20} className="text-[#1DA1F2] group-hover:rotate-12 transition-transform" />
                <span className="text-slate-300 group-hover:text-white">@AHAB</span>
                <Radio size={16} className="text-slate-600 group-hover:text-green-500 animate-pulse ml-auto" />
             </a>
        </div>
      </div>
    </section>
  );
};
