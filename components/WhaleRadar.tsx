
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { Crosshair, Target } from 'lucide-react';

export const WhaleRadar: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 2) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id={SectionId.RADAR} className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center relative z-10">
      
      <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 border-b border-cyan-500/30 pb-2 mb-4 px-8">
            <Target className="text-red-500 animate-pulse" size={20} />
            <h2 className="font-tech text-cyan-400 text-xl tracking-[0.5em]">
                ACTIVE SONAR ARRAY
            </h2>
          </div>
          <h1 className="font-meme text-6xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              LOCATE THE TARGET
          </h1>
      </div>

      {/* The Physical Radar Device Container */}
      <div className="relative p-4 bg-[#0c4a6e] rounded-full shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_50px_rgba(0,0,0,0.5)] border-4 border-[#164e63]">
         
         {/* Screws */}
         <div className="absolute top-4 left-1/2 w-4 h-4 bg-[#083344] rounded-full border border-[#155e75] -translate-x-1/2 shadow-inner" />
         <div className="absolute bottom-4 left-1/2 w-4 h-4 bg-[#083344] rounded-full border border-[#155e75] -translate-x-1/2 shadow-inner" />
         <div className="absolute left-4 top-1/2 w-4 h-4 bg-[#083344] rounded-full border border-[#155e75] -translate-y-1/2 shadow-inner" />
         <div className="absolute right-4 top-1/2 w-4 h-4 bg-[#083344] rounded-full border border-[#155e75] -translate-y-1/2 shadow-inner" />

         {/* The Screen */}
         <div className="relative w-[300px] md:w-[500px] aspect-square bg-[#020617] rounded-full border-[8px] border-black shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] overflow-hidden">
            
            {/* Screen Glare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none z-40" />
            
            {/* CRT Lines */}
            <div className="absolute inset-0 z-30 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(6, 182, 212, 0.1) 50%)', backgroundSize: '100% 4px' }} />

            {/* Grid Lines */}
            <div className="absolute inset-0 z-0 opacity-30" 
                 style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
            />
            <div className="absolute inset-0 border border-cyan-500/30 rounded-full m-12" />
            <div className="absolute inset-0 border border-cyan-500/30 rounded-full m-28" />
            <div className="absolute inset-0 border border-cyan-500/30 rounded-full m-44" />
            
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-full h-[1px] bg-cyan-500" />
                <div className="h-full w-[1px] bg-cyan-500 absolute" />
            </div>

            {/* The Rotating Sweep */}
            <div 
               className="absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent to-cyan-400 origin-left z-10"
               style={{ transform: `translateY(-50%) rotate(${rotation}deg)`, boxShadow: '0 0 15px #22d3ee' }}
            />
            
            {/* Fade trail behind sweep */}
            <div 
                className="absolute inset-0 rounded-full z-10"
                style={{ 
                    background: `conic-gradient(from ${rotation}deg, transparent 0deg, transparent 270deg, rgba(6, 182, 212, 0.15) 360deg)`
                }}
            />

            {/* BLIPS */}
            {[
                { x: '30%', y: '40%', type: 'jeet', label: 'JEET' },
                { x: '70%', y: '20%', type: 'whale', label: 'MOBY DICK' },
                { x: '60%', y: '80%', type: 'shrimp', label: 'PLANKTON' }
            ].map((blip, i) => (
                <motion.div
                   key={i}
                   className={`absolute w-3 h-3 rounded-full z-20 flex items-center justify-center`}
                   style={{ top: blip.y, left: blip.x }}
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                >
                    <div className={`w-full h-full rounded-full animate-ping ${
                        blip.type === 'whale' ? 'bg-white shadow-[0_0_10px_white]' : blip.type === 'jeet' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500'
                    }`} />
                    <span className="absolute top-4 left-4 font-tech text-[10px] text-cyan-300 whitespace-nowrap bg-black/50 px-1 border border-cyan-900">
                       {blip.label}
                    </span>
                </motion.div>
            ))}

            {/* Center */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 shadow-[0_0_10px_#22d3ee]" />
         </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
          {['LAT: 41.2 N', 'LON: 70.1 W', 'DEPTH: 2000m', 'STATUS: HUNTING'].map((stat, i) => (
              <div key={i} className="bg-[#082f49]/50 border border-cyan-800 p-4 font-tech text-cyan-400 text-xs text-center uppercase shadow-lg backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-400/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative z-10">{stat}</span>
              </div>
          ))}
      </div>

    </div>
  );
};
