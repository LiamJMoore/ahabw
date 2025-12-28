import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRecentBounties, BountyTx } from '../services/heliusService';
import { Skull, Anchor } from 'lucide-react';

export const BountyBoard: React.FC = () => {
    const [bounties, setBounties] = useState<BountyTx[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await fetchRecentBounties();
            setBounties(data);
        };
        load();
        const interval = setInterval(load, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-[#1a1614] relative overflow-hidden">
             {/* Wood Texture */}
             <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />

             <div className="max-w-6xl mx-auto px-4 relative z-10">
                 <div className="text-center mb-16">
                     <h2 className="font-display text-5xl text-[#d4c5a3] drop-shadow-[0_2px_0_#000]">THE BOUNTY BOARD</h2>
                     <p className="font-special text-[#a89f81] mt-2">Latest Hunters to Strike the Whale</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <AnimatePresence>
                         {bounties.map((tx, i) => (
                             <motion.div
                                key={tx.signature}
                                initial={{ scale: 0.8, opacity: 0, rotate: (Math.random() * 10) - 5 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                                className="bg-[#f0e6d2] p-6 shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative transform transition-transform duration-300"
                                style={{ 
                                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
                                    rotate: `${(Math.random() * 6) - 3}deg`
                                }}
                             >
                                 {/* Pin */}
                                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-sm border border-black z-20" />
                                 
                                 <div className="border-4 border-double border-[#5c4033] p-4 h-full flex flex-col items-center text-center">
                                     <div className="w-16 h-16 mb-4 border-2 border-black rounded-full flex items-center justify-center bg-[#d4c5a3]">
                                         <Anchor className="text-[#5c4033]" size={32} />
                                     </div>
                                     
                                     <h3 className="font-display text-2xl font-bold text-black mb-2">WANTED</h3>
                                     <p className="font-tech text-xs text-slate-800 mb-4 break-all">{tx.buyer}</p>
                                     
                                     <div className="mt-auto w-full bg-[#5c4033] text-[#f0e6d2] font-meme text-xl py-2 rounded skew-x-[-10deg]">
                                         REWARD: {tx.amount.toLocaleString()} $AHAB
                                     </div>

                                     <div className="absolute bottom-2 right-2 opacity-50">
                                         <Skull size={24} className="text-red-900" />
                                     </div>
                                 </div>
                             </motion.div>
                         ))}
                     </AnimatePresence>
                 </div>
             </div>
        </section>
    );
};