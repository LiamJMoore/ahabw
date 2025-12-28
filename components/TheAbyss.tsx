import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpCircle, AlertOctagon } from 'lucide-react';

export const TheAbyss: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // We map the scroll progress of this specific section to depth
    const depth = useTransform(scrollYProgress, [0, 1], [0, 11000]); // Meters
    const darkness = useTransform(scrollYProgress, [0, 0.5], [0, 1]); // Opacity of overlay
    
    // Creature Visibility
    const creatureOpacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

    const [isCracked, setIsCracked] = useState(false);

    // Monitor depth for "The Crack"
    scrollYProgress.on("change", (latest) => {
        if (latest > 0.98 && !isCracked) {
            setIsCracked(true);
            // Play crack sound logic would go here
        }
    });

    const emergencyBlow = () => {
        setIsCracked(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section ref={containerRef} className="relative h-[3000px] w-full bg-black overflow-hidden">
            
            {/* 1. DEPTH MARKERS (Sticky HUD) */}
            <div className="sticky top-0 h-screen w-full pointer-events-none z-20 flex flex-col items-center justify-center">
                <motion.div 
                    style={{ opacity: darkness }}
                    className="text-center"
                >
                    <div className="font-tech text-cyan-900 text-6xl md:text-9xl font-bold opacity-30">
                        -<motion.span>{useSpring(depth, { stiffness: 100, damping: 30 }).get().toFixed(0)}</motion.span>m
                    </div>
                    <div className="text-cyan-900/50 font-mono tracking-[1em] text-xs mt-4">
                        ABYSSAL ZONE
                    </div>
                </motion.div>
            </div>

            {/* 2. CREATURES LAYER (Parallax) */}
            <motion.div style={{ opacity: creatureOpacity }} className="absolute inset-0 pointer-events-none z-10">
                {/* Angler Fish */}
                <div className="sticky top-1/2 left-[10%] w-32 h-32 animate-pulse text-6xl opacity-20">🐡</div>
                <div className="sticky top-1/3 left-[80%] w-32 h-32 animate-bounce text-6xl opacity-10 delay-1000">🦑</div>
                <div className="sticky top-2/3 left-[40%] w-32 h-32 animate-pulse text-6xl opacity-15 delay-500">🦈</div>
            </motion.div>

            {/* 3. THE CRACK (Overlay) */}
            {isCracked && (
                <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center bg-red-900/40 backdrop-blur-[2px] animate-pulse-fast">
                    {/* Cracked Glass Visual (CSS Lines) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-white/50 -rotate-45 -translate-x-1/2" />
                        <div className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-white/50 rotate-12 -translate-x-1/2" />
                        <div className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-white/50 rotate-[80deg] -translate-x-1/2" />
                    </div>

                    <div className="bg-black/90 border-4 border-red-600 p-8 rounded-2xl text-center shadow-[0_0_100px_red] max-w-md mx-4 relative z-50">
                        <AlertOctagon size={64} className="text-red-500 mx-auto mb-4 animate-spin-slow" />
                        <h2 className="font-meme text-6xl text-red-500 mb-2">HULL FAILURE</h2>
                        <p className="font-tech text-white mb-8">PRESSURE CRITICAL. STRUCTURAL INTEGRITY 0%.</p>
                        
                        <button 
                            onClick={emergencyBlow}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-black font-meme text-3xl py-4 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-bounce"
                        >
                            EMERGENCY BLOW
                        </button>
                    </div>
                </div>
            )}

            {/* Gradient Overlay for Fade to Black */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />
            
        </section>
    );
};