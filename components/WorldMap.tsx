import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, X, Crosshair, Anchor, Navigation, Compass, AlertCircle } from 'lucide-react';

interface Location {
  id: string;
  x: number; // Percentage
  y: number; // Percentage
  type: 'ship' | 'sighting' | 'poi';
  title: string;
  coords: string;
  lore: string;
}

const LOCATIONS: Location[] = [
  {
    id: 'nantucket',
    x: 25,
    y: 35,
    type: 'poi',
    title: 'NANTUCKET',
    coords: '41.2° N, 70.1° W',
    lore: "Where it began. The hearth is cold now. I told Starbuck we don't return until the hold is full or the ship is splinters. I do not miss the land."
  },
  {
    id: 'pequod',
    x: 65,
    y: 55,
    type: 'ship',
    title: 'THE PEQUOD',
    coords: '0.5° S, 160.0° W',
    lore: "CURRENT POSITION. The Pacific Equator. The heat melts the pitch in the deck seams. The crew is restless, checking charts like degens checking charts. We wait."
  },
  {
    id: 'cape',
    x: 52,
    y: 75,
    type: 'sighting',
    title: 'CAPE OF GOOD HOPE',
    coords: '34.5° S, 18.4° E',
    lore: "Sighting reported by a merchant vessel ($JEET). Likely FUD to manipulate the price of oil. We ignored it and held our course."
  },
  {
    id: 'japan',
    x: 85,
    y: 40,
    type: 'sighting',
    title: 'JAPAN GROUNDS',
    coords: '35.0° N, 140.0° E',
    lore: "Rich waters. Many whales here, but not The Whale. We liquidated a pod of Sperm Whales to fund the voyage, but my eye remains on the Prize."
  }
];

export const WorldMap: React.FC = () => {
  const [selected, setSelected] = useState<Location | null>(null);

  return (
    <section className="py-24 bg-[#0b1016] relative overflow-hidden border-t border-slate-900">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
               backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
           }} 
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0b1016_90%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-slate-800 pb-6">
            <div>
                <h2 className="font-display text-4xl text-slate-200 tracking-widest flex items-center gap-3">
                    <Compass className="text-cyan-500 animate-spin-slow" size={32} />
                    NAVIGATIONAL LOG
                </h2>
                <p className="font-mono text-cyan-700 mt-2 tracking-[0.2em]">
                    SECTOR: PACIFIC // STATUS: HUNTING
                </p>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-slate-500 font-tech text-xs">LAST UPDATE</div>
                <div className="text-cyan-500 font-mono">0800 HOURS</div>
            </div>
        </div>

        {/* The Map Container */}
        <div className="relative w-full aspect-[16/9] bg-[#0f161d] rounded-xl border border-slate-700 shadow-2xl overflow-hidden group">
            
            {/* World Map Silhouette (SVG) */}
            <div className="absolute inset-0 opacity-30 text-slate-600">
                 <svg viewBox="0 0 1000 500" className="w-full h-full fill-current">
                    {/* Very Abstract Continents for aesthetic */}
                    <path d="M150,150 Q200,100 250,150 T350,150 T400,200 L400,350 L300,400 L200,350 Z" /> {/* Americas-ish */}
                    <path d="M500,100 L600,100 L650,200 L600,350 L500,400 L450,250 Z" /> {/* Africa/Europe-ish */}
                    <path d="M700,100 L900,100 L950,200 L850,300 L750,250 Z" /> {/* Asia-ish */}
                    <path d="M800,350 Circle 30" /> {/* Australia-ish */}
                 </svg>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5" />

            {/* Markers */}
            {LOCATIONS.map((loc) => (
                <motion.button
                    key={loc.id}
                    className="absolute z-20 group/marker"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelected(loc)}
                >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                        {/* Ping Animation for Ship */}
                        {loc.type === 'ship' && (
                            <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-50" />
                        )}
                        
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors
                            ${selected?.id === loc.id 
                                ? 'bg-white border-white text-black' 
                                : loc.type === 'ship' 
                                    ? 'bg-cyan-900/80 border-cyan-400 text-cyan-400' 
                                    : loc.type === 'sighting'
                                        ? 'bg-red-900/80 border-red-500 text-red-500'
                                        : 'bg-slate-800 border-slate-500 text-slate-400'
                            }
                        `}>
                            {loc.type === 'ship' ? <Navigation size={16} className={selected?.id === loc.id ? '' : 'rotate-45'} /> : 
                             loc.type === 'sighting' ? <AlertCircle size={16} /> :
                             <Anchor size={16} />}
                        </div>

                        {/* Label on Hover */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-[10px] font-tech text-white opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                            {loc.title}
                        </div>
                    </div>
                </motion.button>
            ))}

            {/* Scanline Sweep */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[10%] w-full animate-scan pointer-events-none" />
        </div>

        {/* Interaction Panel (Lore Modal) */}
        <AnimatePresence mode="wait">
            {selected && (
                <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-8 bg-slate-900 border-l-4 border-cyan-500 p-6 md:p-8 rounded-r-xl shadow-2xl relative"
                >
                    <button 
                        onClick={() => setSelected(null)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="p-4 bg-black rounded-lg border border-slate-700 shrink-0">
                             {selected.type === 'ship' ? <Navigation size={48} className="text-cyan-500" /> :
                              selected.type === 'sighting' ? <Crosshair size={48} className="text-red-500" /> :
                              <MapIcon size={48} className="text-slate-400" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-display text-2xl text-white">{selected.title}</h3>
                                <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded text-cyan-400 border border-slate-700">
                                    {selected.coords}
                                </span>
                            </div>
                            <p className="font-special text-lg text-slate-300 leading-relaxed border-t border-slate-800 pt-4 mt-2">
                                "{selected.lore}"
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
            {!selected && (
                <div className="mt-8 text-center text-slate-600 font-mono text-sm animate-pulse">
                    [ SELECT A COORDINATE TO DECRYPT LOG ]
                </div>
            )}
        </AnimatePresence>

      </div>
    </section>
  );
};