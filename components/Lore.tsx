
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionId } from '../types';
import { Skull, TrendingUp, ChevronLeft, ChevronRight, Fingerprint } from 'lucide-react';

const LOG_ENTRIES = [
    {
        day: "Day 0",
        title: "THE REKTENING",
        text: "It wasn't just a trade. It was a slaughter. The $whitewhale ($69M MCAP) didn't just rise... he devoured. One massive green candle that took my leg, my liquidity, and my sanity.",
        signature: "Ahab (Pre-Voyage)"
    },
    {
        day: "Day 42",
        title: "THE BLOOD OATH",
        text: "I gathered the crew. Not Harvard grads. Degens. I nailed a gold doubloon (1 SOL) to the mast. 'Whosoever spots the White Whale first,' I screamed, 'shall have this gold.'",
        signature: "Capt. Ahab"
    },
    {
        day: "Day 341",
        title: "NO UTILITY",
        text: "The crew asks about 'Utility'. Fools! THERE IS NO UTILITY IN REVENGE. We are not building a DEX. We are not launching a Layer 2. We are simply fueling the ship with our own conviction.",
        signature: "Capt. Ahab"
    }
];

export const Lore: React.FC = () => {
  const [currentEntry, setCurrentEntry] = useState(0);

  const nextEntry = () => setCurrentEntry(prev => (prev + 1) % LOG_ENTRIES.length);
  const prevEntry = () => setCurrentEntry(prev => (prev - 1 + LOG_ENTRIES.length) % LOG_ENTRIES.length);

  return (
    <section id={SectionId.LORE} className="relative py-32 overflow-hidden">
      
      {/* Cinematic Background Scenery - Darker for readability but still tinted */}
      <div className="absolute inset-0 bg-[#020617] z-0">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-[2px] bg-red-600" />
                <span className="font-tech text-red-400 tracking-[0.4em] text-sm drop-shadow-[0_0_5px_red]">CLASSIFIED LOGS</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-cyan-50 uppercase leading-tight drop-shadow-xl">
                The <span className="text-red-500 italic font-serif">Obsession</span>
            </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT COL: THE CAPTAIN'S LOG (Interactive) */}
            <div className="lg:col-span-7">
                <div className="relative bg-[#020617]/80 border border-cyan-800/50 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm backdrop-blur-sm">
                    {/* Paper Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none" />
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-6 right-6 opacity-30 rotate-12">
                        <div className="border-4 border-red-500 rounded-full w-24 h-24 flex items-center justify-center font-black text-red-500 rotate-[-15deg] text-xs text-center p-2 mix-blend-screen">
                            VERIFIED<br/>MADNESS
                        </div>
                    </div>

                    {/* Content Switcher */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEntry}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(5px)" }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10"
                        >
                            <div className="font-tech text-cyan-400 mb-2 text-sm border-b border-cyan-500/30 inline-block pb-1">
                                ENTRY: {LOG_ENTRIES[currentEntry].day}
                            </div>
                            <h3 className="font-display text-3xl md:text-4xl text-white mb-6">
                                {LOG_ENTRIES[currentEntry].title}
                            </h3>
                            <p className="font-special text-xl md:text-2xl leading-relaxed text-cyan-100/80 mb-8">
                                "{LOG_ENTRIES[currentEntry].text}"
                            </p>
                            <div className="text-right">
                                <div className="font-handwriting text-2xl text-red-400 -rotate-2 inline-block">
                                    - {LOG_ENTRIES[currentEntry].signature}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-12 pt-6 border-t border-cyan-800/50">
                        <button onClick={prevEntry} className="text-cyan-600 hover:text-cyan-300 transition-colors flex items-center gap-2 font-tech text-sm uppercase">
                            <ChevronLeft /> PREV
                        </button>
                        <div className="flex gap-2">
                            {LOG_ENTRIES.map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i === currentEntry ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-cyan-900'}`} />
                            ))}
                        </div>
                        <button onClick={nextEntry} className="text-cyan-600 hover:text-cyan-300 transition-colors flex items-center gap-2 font-tech text-sm uppercase">
                            NEXT <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT COL: MISSION PARAMETERS (Staggered List) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
                {[
                    { 
                        icon: <Skull className="text-red-500" size={28} />, 
                        label: "THE TARGET", 
                        desc: "$WHITEWHALE is a mechanism of pure greed. It must be hunted not for profit, but for honor." 
                    },
                    { 
                        icon: <Fingerprint className="text-cyan-400" size={28} />, 
                        label: "THE CREW", 
                        desc: "We are the liquidators. The short-sellers. The ones who buy the top and refuse to sell." 
                    },
                    { 
                        icon: <TrendingUp className="text-green-500" size={28} />, 
                        label: "THE ENDGAME", 
                        desc: "Total market cap flippening. We do not rest until $AHAB > $WHALE." 
                    }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="group"
                    >
                        <div className="flex items-start gap-6">
                            <div className="bg-[#0f172a]/80 p-4 rounded-lg border border-cyan-900 group-hover:border-cyan-500 transition-colors shadow-lg backdrop-blur-sm">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-tech text-sm text-cyan-600 mb-1 tracking-widest">{item.label}</h4>
                                <p className="font-special text-lg text-slate-300 group-hover:text-cyan-200 transition-colors">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
      </div>
    </section>
  );
};
