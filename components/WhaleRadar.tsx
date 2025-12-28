import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';

export const WhaleRadar: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 2) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id={SectionId.RADAR} className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center">
      
      <div className="mb-8 text-center">
          <h2 className="font-tech text-cyan-500 text-xl tracking-[0.5em] animate-pulse">
              SONAR ROOM // DEEP SCAN
          </h2>
          <h1 className="font-meme text-6xl text-white mt-2">
              FIND THE WHALE
          </h1>
      </div>

      <div className="relative w-full max-w-2xl aspect-square bg-black rounded-full border-[20px] border-[#0f172a] shadow-[0_0_100px_#22c55e20] overflow-hidden crt">
         
         {/* Grid Lines */}
         <div className="absolute inset-0 z-0 opacity-20" 
              style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
         />
         <div className="absolute inset-0 border border-green-900/50 rounded-full m-12" />
         <div className="absolute inset-0 border border-green-900/50 rounded-full m-24" />
         <div className="absolute inset-0 border border-green-900/50 rounded-full m-48" />

         {/* The Rotating Sweep */}
         <div 
            className="absolute top-1/2 left-1/2 w-[50%] h-1 bg-gradient-to-r from-transparent to-green-500 origin-left z-10"
            style={{ transform: `translateY(-50%) rotate(${rotation}deg)`, boxShadow: '0 0 20px #22c55e' }}
         />
         
         {/* Fade trail behind sweep */}
         <div 
             className="absolute inset-0 rounded-full z-10"
             style={{ 
                 background: `conic-gradient(from ${rotation}deg, transparent 0deg, transparent 270deg, rgba(34, 197, 94, 0.2) 360deg)`
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
                     blip.type === 'whale' ? 'bg-white' : blip.type === 'jeet' ? 'bg-red-500' : 'bg-green-500'
                 }`} />
                 <span className="absolute top-4 left-4 font-tech text-[10px] text-green-400 whitespace-nowrap">
                    {blip.label}
                 </span>
             </motion.div>
         ))}

         {/* Center */}
         <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-30" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
          {['LAT: 41.2 N', 'LON: 70.1 W', 'DEPTH: 2000m', 'STATUS: HUNTING'].map((stat, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-4 font-tech text-green-500 text-xs text-center uppercase">
                  {stat}
              </div>
          ))}
      </div>

    </div>
  );
};
