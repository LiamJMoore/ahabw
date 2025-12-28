import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const WorldBoss: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hp, setHp] = useState(100);
    const [isDead, setIsDead] = useState(false);

    // Spawn Logic
    useEffect(() => {
        const scheduleSpawn = () => {
            // Random spawn between 30s and 90s
            const delay = Math.random() * 60000 + 30000;
            return setTimeout(() => {
                setHp(100);
                setIsDead(false);
                setIsVisible(true);
            }, delay);
        };

        // Initial spawn (fast for demo purposes)
        const initialTimer = setTimeout(() => setIsVisible(true), 15000);
        let loopTimer: ReturnType<typeof setTimeout>;

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(loopTimer);
        };
    }, []);

    // Despawn logic if missed
    useEffect(() => {
        if (isVisible && !isDead) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 20000); // 20s to kill it
            return () => clearTimeout(timer);
        }
    }, [isVisible, isDead]);

    const handleClick = () => {
        if (isDead) return;
        
        const dmg = 10;
        const newHp = hp - dmg;
        setHp(newHp);

        // Visual feedback (Screen shake handled via CSS classes ideally, but we'll do local anims)
        
        if (newHp <= 0) {
            setIsDead(true);
            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.6 },
                colors: ['#ef4444', '#ffffff']
            });
            setTimeout(() => setIsVisible(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden flex items-center">
                    <motion.div
                        initial={{ x: '120vw' }}
                        animate={{ 
                            x: isDead ? '120vw' : '-100vw',
                            y: isDead ? 500 : 0,
                            rotate: isDead ? 180 : 0
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                            duration: 25, 
                            ease: "linear",
                            rotate: { duration: 1 } 
                        }}
                        onClick={handleClick}
                        className="pointer-events-auto cursor-crosshair relative group"
                        style={{ width: '600px', height: '300px' }}
                    >
                        {/* HP Bar */}
                        {!isDead && (
                            <div className="absolute -top-10 left-0 right-0 h-4 bg-black border border-white">
                                <motion.div 
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${hp}%` }}
                                    className="h-full bg-red-600"
                                />
                                <div className="absolute top-0 w-full text-center text-xs font-mono text-white leading-4">
                                    WORLD BOSS: MOBY DICK
                                </div>
                            </div>
                        )}

                        {/* THE WHALE SPRITE */}
                        <div className={`w-full h-full text-[300px] leading-none select-none transition-transform active:scale-95 ${isDead ? 'grayscale' : ''}`}>
                            🐋
                        </div>
                        
                        {/* Hit Box Effect */}
                        <div className="absolute inset-0 bg-red-500/0 active:bg-red-500/30 rounded-full transition-colors" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};