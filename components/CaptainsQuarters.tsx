import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { Wine, Disc, Crosshair, Music2, Skull } from 'lucide-react';

interface CaptainsQuartersProps {
    onDrunkMode: (isDrunk: boolean) => void;
}

export const CaptainsQuarters: React.FC<CaptainsQuartersProps> = ({ onDrunkMode }) => {
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const [isDrunk, setIsDrunk] = useState(false);
    const [bulletResult, setBulletResult] = useState<'IDLE' | 'CLICK' | 'BANG'>('IDLE');

    const toggleDrunk = () => {
        const newState = !isDrunk;
        setIsDrunk(newState);
        onDrunkMode(newState);
    };

    const playRoulette = () => {
        if (bulletResult === 'BANG') return;
        
        // 1 in 6 chance
        const dead = Math.random() < 0.166;
        
        if (dead) {
            setBulletResult('BANG');
            setTimeout(() => setBulletResult('IDLE'), 3000);
        } else {
            setBulletResult('CLICK');
            setTimeout(() => setBulletResult('IDLE'), 1000);
        }
    };

    return (
        <section className="relative py-32 bg-[#1a0f0a] border-y-8 border-[#2a1b12] overflow-hidden">
            
            {/* Background Image: Ship Cabin */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")' }} />
            
            {/* Swinging Lantern Shadow Effect */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,165,0,0.15)_0%,rgba(0,0,0,0.8)_80%)] animate-sway-slow origin-top" />

            {/* BLACKOUT OVERLAY FOR ROULETTE */}
            {bulletResult === 'BANG' && (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-pulse">
                    <div className="text-center">
                        <Skull size={100} className="text-red-600 mx-auto mb-4" />
                        <h2 className="font-meme text-6xl text-red-600">YOU DIED</h2>
                        <p className="font-tech text-slate-500">LIQUIDATED BY FATE</p>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 relative z-20">
                <div className="text-center mb-12">
                    <h2 className="font-display text-4xl text-[#c4b5fd]/80 tracking-widest uppercase">The Captain's Quarters</h2>
                    <p className="font-special text-[#a8a29e] italic mt-2">"There is wisdom in madness."</p>
                </div>

                {/* THE DESK */}
                <div className="relative h-[400px] w-full bg-[#3f2e22] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-t border-[#5e4635] flex items-end justify-center perspective-[1000px]">
                    
                    {/* Desk Surface Texture */}
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />
                    
                    <div className="grid grid-cols-3 w-full max-w-3xl mb-12 px-8 gap-8 items-end relative z-10">
                        
                        {/* ITEM 1: THE RUM (Drunk Mode) */}
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleDrunk}
                            className="flex flex-col items-center cursor-pointer group"
                        >
                            <div className={`relative w-24 h-40 bg-amber-900/80 rounded-t-xl border-2 border-amber-700 backdrop-blur-sm flex items-center justify-center shadow-lg ${isDrunk ? 'animate-pulse' : ''}`}>
                                <Wine className="text-amber-200 opacity-80" size={40} />
                                <div className="absolute bottom-4 w-full text-center font-display text-amber-200 text-xs bg-black/50 py-1">XXX</div>
                            </div>
                            <span className="font-tech text-amber-500 mt-4 text-sm group-hover:text-amber-300">
                                {isDrunk ? 'SOBER UP' : 'DARK RUM'}
                            </span>
                        </motion.div>

                        {/* ITEM 2: THE REVOLVER (Mini Game) */}
                        <motion.div 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95, rotate: -10 }}
                            onClick={playRoulette}
                            className="flex flex-col items-center cursor-pointer group pb-4"
                        >
                            <div className="relative">
                                <Crosshair size={80} className="text-slate-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]" />
                                {bulletResult === 'CLICK' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 0 }} 
                                        animate={{ opacity: 1, y: -50 }}
                                        className="absolute -top-10 left-1/2 -translate-x-1/2 text-white font-black font-meme"
                                    >
                                        *CLICK*
                                    </motion.div>
                                )}
                            </div>
                            <span className="font-tech text-slate-500 mt-4 text-sm group-hover:text-red-500 transition-colors">
                                RUSSIAN ROULETTE
                            </span>
                        </motion.div>

                        {/* ITEM 3: THE RADIO (Music) */}
                        <motion.div 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                            className="flex flex-col items-center cursor-pointer group"
                        >
                            <div className="relative w-32 h-24 bg-zinc-800 rounded-lg border-4 border-zinc-600 shadow-xl flex items-center justify-center overflow-hidden">
                                {/* Speaker Mesh */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:4px_4px] opacity-50" />
                                <Music2 className={`text-cyan-500 z-10 ${isPlayingMusic ? 'animate-bounce' : 'opacity-50'}`} size={32} />
                                {isPlayingMusic && (
                                    <div className="absolute bottom-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                                )}
                            </div>
                            <span className="font-tech text-zinc-500 mt-4 text-sm group-hover:text-cyan-400">
                                {isPlayingMusic ? 'SEA SHANTY [ON]' : 'RADIO [OFF]'}
                            </span>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
};