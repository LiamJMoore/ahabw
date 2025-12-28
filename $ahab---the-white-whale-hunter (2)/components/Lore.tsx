import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { Skull, AlertTriangle, TrendingUp } from 'lucide-react';
import { fetchTokenAsset } from '../services/heliusService';
import { TARGET_WHALE_CA } from '../constants';

export const Lore: React.FC = () => {
  const [whaleMcap, setWhaleMcap] = useState<string>('SCANNING...');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTokenAsset(TARGET_WHALE_CA);
      const mcap = data?.result?.token_info?.price_info?.total_price;
      
      if (mcap) {
        // Format to currency (e.g., $1,234,567)
        setWhaleMcap(`$${mcap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      } else {
        setWhaleMcap('$1B'); // Fallback visual
      }
    };
    loadData();
  }, []);

  return (
    <section id={SectionId.LORE} className="max-w-6xl mx-auto px-4 relative">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* LEFT: THE MANIFESTO (Styled as old paper) */}
        <motion.div 
            initial={{ rotate: -2, x: -50, opacity: 0 }}
            whileInView={{ rotate: -1, x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#d4c5a3] text-black p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform rotate-[-1deg] relative"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}
        >
            {/* Tape/Nail visual */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/40 backdrop-blur-sm rotate-1 skew-x-12 opacity-80" />

            <h2 className="font-display text-4xl font-black mb-6 uppercase border-b-4 border-black pb-2">
                Captain's Log: Day 341
            </h2>
            
            <p className="font-special text-lg leading-relaxed mb-4">
                The crew asks about "Utility". Fools! <span className="text-red-700 font-bold bg-red-200 px-1">THERE IS NO UTILITY IN REVENGE.</span>
            </p>
            <p className="font-special text-lg leading-relaxed mb-4">
                We are not building a DEX. We are not launching a Layer 2. We are simply fueling the ship with our own conviction until we catch Him.
            </p>
            <p className="font-special text-lg leading-relaxed">
                White Whale ({whaleMcap} Market Cap) mocks us from the deep. Every red candle is his tail striking the hull. Every green candle is our spear piercing his hide.
            </p>

            <div className="mt-8 flex gap-4 items-center">
                <div className="w-24 h-24 border-4 border-red-800 rounded-full flex items-center justify-center font-meme text-3xl text-red-800 rotate-12 mask-stamp opacity-70 border-double">
                    REKT
                </div>
                <div className="font-handwriting text-sm text-slate-800 italic">
                    - Signed in blood,<br/>Captain Ahab
                </div>
            </div>
        </motion.div>

        {/* RIGHT: THE THESIS (Styled as modern warnings) */}
        <div className="space-y-6 pt-12">
            {[
                { 
                    icon: <TrendingUp className="text-green-400" />, 
                    title: "THE MOONSHOT", 
                    text: "Traditional whaling is boring yield. We pivot to high-leverage speculation. The White Whale is the only asset that matters." 
                },
                { 
                    icon: <AlertTriangle className="text-yellow-400" />, 
                    title: "MAXIMUM LEVERAGE", 
                    text: "We ignore the liquidation price. Sunk cost fallacy is our fuel. We risk the ship, the crew, and the soul for the 1000x." 
                },
                { 
                    icon: <Skull className="text-red-500" />, 
                    title: "THE MAIN CHARACTER", 
                    text: "We destroyed the charts (the quadrant). We trade on gut and obsession. Starbuck's risk management is FUD." 
                }
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-black/80 border-l-4 border-red-600 p-6 backdrop-blur-md"
                >
                    <div className="flex items-center gap-4 mb-2">
                        {item.icon}
                        <h3 className="font-display text-xl text-white">{item.title}</h3>
                    </div>
                    <p className="font-mono text-slate-400 text-sm">
                        {item.text}
                    </p>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};
