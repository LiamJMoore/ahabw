import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionId } from '../types';
import { Skull, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { fetchTokenAsset } from '../services/heliusService';
import { TARGET_WHALE_CA } from '../constants';

const LOG_ENTRIES = [
    {
        day: "Day 0: THE REKTENING",
        text: "It wasn't just a trade. It was a slaughter. The White Whale ($1B MCAP) didn't just dump... he devoured. One massive red candle that took my leg, my liquidity, and my sanity. I stared at the liquidation email and laughed. They think I'm broke. I'm just liberated.",
        signature: "Ahab (Pre-Voyage)"
    },
    {
        day: "Day 42: THE OATH",
        text: "I gathered the crew today. Not Harvard grads or VCs. Degens. Bagholders. The unwanted. I nailed a gold doubloon (1 SOL) to the mast. 'Whosoever spots the White Whale first,' I screamed, 'shall have this gold.' Starbuck asked about a roadmap. I threw his hardware wallet overboard.",
        signature: "Capt. Ahab"
    },
    {
        day: "Day 150: THE HUNT",
        text: "We track him across the chain. Every pump he orchestrates, we are there shorting. Every dump he triggers, we are there buying. He grows fat on the hopes of jeets, but the Pequod was built for pressure. We don't need utility. We have hate.",
        signature: "Capt. Ahab"
    },
    {
        day: "Day 341: CURRENT POSITION",
        text: "The crew asks about 'Utility'. Fools! THERE IS NO UTILITY IN REVENGE. We are not building a DEX. We are not launching a Layer 2. We are simply fueling the ship with our own conviction until we catch Him. Every green candle is our spear piercing his hide.",
        signature: "Capt. Ahab"
    }
];

export const Lore: React.FC = () => {
  const [whaleMcap, setWhaleMcap] = useState<string>('SCANNING...');
  const [currentEntry, setCurrentEntry] = useState(LOG_ENTRIES.length - 1);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTokenAsset(TARGET_WHALE_CA);
      const mcap = data?.result?.token_info?.price_info?.total_price;
      
      if (mcap) {
        setWhaleMcap(`$${mcap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      } else {
        setWhaleMcap('$1B'); // Fallback visual
      }
    };
    loadData();
  }, []);

  const nextEntry = () => setCurrentEntry(prev => (prev + 1) % LOG_ENTRIES.length);
  const prevEntry = () => setCurrentEntry(prev => (prev - 1 + LOG_ENTRIES.length) % LOG_ENTRIES.length);

  return (
    <section id={SectionId.LORE} className="max-w-7xl mx-auto px-4 relative">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: THE INTERACTIVE LOG BOOK */}
        <motion.div 
            initial={{ rotate: -1, x: -50, opacity: 0 }}
            whileInView={{ rotate: 1, x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
        >
            {/* Book Binding Visuals */}
            <div className="absolute inset-0 bg-[#3f2e22] rounded-r-2xl transform translate-x-4 translate-y-4 shadow-2xl -z-10" />
            
            <div 
                className="bg-[#d4c5a3] text-black p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative min-h-[500px] flex flex-col rounded-r-lg border-l-8 border-[#2a1b12]"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
                    <h2 className="font-display text-3xl font-black uppercase">
                        Captain's Log
                    </h2>
                    <BookOpen className="text-[#8b4513]" />
                </div>

                {/* Content Area */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEntry}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="font-tech text-red-900 font-bold text-xl mb-4 bg-red-900/10 inline-block px-2 py-1 rounded">
                                {LOG_ENTRIES[currentEntry].day}
                            </h3>
                            <p className="font-special text-xl leading-relaxed mb-8">
                                "{LOG_ENTRIES[currentEntry].text}"
                            </p>
                            <div className="font-handwriting text-slate-800 italic text-right mt-4 transform -rotate-2">
                                - {LOG_ENTRIES[currentEntry].signature}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="mt-8 flex justify-between items-center border-t-2 border-[#8b4513]/30 pt-4">
                    <button 
                        onClick={prevEntry}
                        className="flex items-center gap-2 font-display hover:text-red-900 transition-colors"
                    >
                        <ChevronLeft /> PREV ENTRY
                    </button>
                    <span className="font-mono text-sm text-[#8b4513]">
                        PAGE {currentEntry + 1} OF {LOG_ENTRIES.length}
                    </span>
                    <button 
                        onClick={nextEntry}
                        className="flex items-center gap-2 font-display hover:text-red-900 transition-colors"
                    >
                        NEXT ENTRY <ChevronRight />
                    </button>
                </div>
                
                {/* Stamp */}
                <div className="absolute top-10 right-10 opacity-20 pointer-events-none rotate-[-15deg]">
                    <div className="w-32 h-32 border-8 border-red-900 rounded-full flex items-center justify-center">
                        <span className="font-meme text-4xl text-red-900">CONFIDENTIAL</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* RIGHT: THE THESIS (Styled as modern warnings) */}
        <div className="space-y-8">
            <div className="mb-8">
                <h2 className="font-meme text-5xl text-white mb-2">
                    THE <span className="text-red-600">HISTORY</span>
                </h2>
                <p className="font-mono text-slate-400">
                    Why we hunt the White Whale.
                </p>
            </div>

            {[
                { 
                    icon: <Skull className="text-red-500" size={32} />, 
                    title: "THE ORIGIN: THE RUG PULL", 
                    text: "Years ago, a wallet known as 'Moby' drained a liquidity pool worth millions. Ahab was the largest provider. He didn't lose funds; he lost his purpose. $AHAB is the reincarnation of that lost liquidity, forged into a weapon." 
                },
                { 
                    icon: <AlertTriangle className="text-yellow-400" size={32} />, 
                    title: "THE ENEMY: $WHALE", 
                    text: `The White Whale token sits at ${whaleMcap}. It is bloated, centralized, and arrogant. It moves slow. It thinks it is too big to fail. We are the harpoon that will pop the bubble.` 
                },
                { 
                    icon: <TrendingUp className="text-green-400" size={32} />, 
                    title: "THE GOAL: THE FLIPPENING", 
                    text: "We do not rest until $AHAB market cap exceeds $WHALE. It is a mathematical certainty driven by sheer willpower. We trade with violent intent." 
                }
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-slate-900/50 border-l-4 border-red-600 p-8 backdrop-blur-md hover:bg-slate-800 transition-colors group"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-black rounded-lg border border-slate-700 group-hover:border-red-500 transition-colors">
                            {item.icon}
                        </div>
                        <h3 className="font-display text-2xl text-white group-hover:text-red-400 transition-colors">{item.title}</h3>
                    </div>
                    <p className="font-special text-slate-300 text-lg leading-relaxed">
                        {item.text}
                    </p>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};