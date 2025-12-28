import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sword, Shield, Activity, Flame, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FloatingText {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
}

export const WhaleRPG: React.FC = () => {
    const [playerHp, setPlayerHp] = useState(100);
    const [whaleHp, setWhaleHp] = useState(2000);
    const [log, setLog] = useState<string[]>(["THE WHITE WHALE EMERGES..."]);
    const [turn, setTurn] = useState<'player' | 'whale'>('player');
    const [shake, setShake] = useState(0);
    const [floaters, setFloaters] = useState<FloatingText[]>([]);
    const [ultCharge, setUltCharge] = useState(0); // 0 to 100

    const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 3));

    const spawnFloater = (text: string, x: number, y: number, color: string) => {
        const id = Date.now();
        setFloaters(prev => [...prev, { id, text, x, y, color }]);
        setTimeout(() => setFloaters(prev => prev.filter(f => f.id !== id)), 1000);
    };

    const playerAction = (action: 'attack' | 'leverage' | 'heal' | 'ult') => {
        if (turn !== 'player' || playerHp <= 0 || whaleHp <= 0) return;

        let dmg = 0;
        let selfDmg = 0;
        let heal = 0;

        // Mechanics
        if (action === 'attack') {
            dmg = Math.floor(Math.random() * 50) + 30;
            addLog(`Harpoon Strike!`);
            spawnFloater(`-${dmg}`, 70, 40, 'text-red-500');
            setUltCharge(prev => Math.min(prev + 15, 100));

        } else if (action === 'leverage') {
            // High Risk High Reward
            if (Math.random() > 0.4) {
                dmg = Math.floor(Math.random() * 300) + 100;
                addLog(`CRITICAL 100x LONG!`);
                spawnFloater(`CRIT -${dmg}`, 70, 30, 'text-yellow-400');
                setShake(20);
                setUltCharge(prev => Math.min(prev + 25, 100));
            } else {
                selfDmg = 40;
                addLog(`LIQUIDATED! Wicks hurt.`);
                spawnFloater(`-${selfDmg}`, 20, 60, 'text-red-600');
                setShake(10);
            }

        } else if (action === 'heal') {
            heal = 50;
            addLog(`Grog consumed. +${heal} HP`);
            spawnFloater(`+${heal}`, 20, 50, 'text-green-500');
            setUltCharge(prev => Math.min(prev + 10, 100));
        
        } else if (action === 'ult') {
            dmg = 800;
            addLog(`CALL THE PEQUOD! ALL HANDS!`);
            spawnFloater(`-${dmg}!!!`, 70, 50, 'text-cyan-400 text-4xl font-black');
            setShake(40);
            setUltCharge(0);
            confetti({ colors: ['#22d3ee', '#ffffff'] });
        }

        // Apply Stats
        if (dmg > 0) setWhaleHp(prev => Math.max(prev - dmg, 0));
        if (selfDmg > 0) setPlayerHp(prev => Math.max(prev - selfDmg, 0));
        if (heal > 0) setPlayerHp(prev => Math.min(prev + heal, 100));

        // Turn Logic
        if (whaleHp - dmg <= 0) {
            addLog("VICTORY! THE WHALE IS YOURS!");
            spawnFloater("WINNER", 50, 50, 'text-yellow-400 text-6xl');
            confetti();
        } else {
            setTurn('whale');
        }
    };

    // Whale AI
    useEffect(() => {
        if (turn === 'whale' && whaleHp > 0 && playerHp > 0) {
            setTimeout(() => {
                const moves = ['tail', 'dump', 'fud', 'breach'];
                const move = moves[Math.floor(Math.random() * moves.length)];
                let dmg = 0;

                if (move === 'tail') {
                    dmg = 15;
                    addLog("Whale Tail Whip!");
                } else if (move === 'dump') {
                    dmg = 25;
                    addLog("Whale DUMPED on you!");
                } else if (move === 'breach') {
                    dmg = 40;
                    addLog("MASSIVE BREACH! It hurts!");
                    setShake(15);
                } else {
                    dmg = 5;
                    addLog("Whale spreads FUD. Ignore it.");
                }

                setPlayerHp(prev => Math.max(prev - dmg, 0));
                if (dmg > 0) spawnFloater(`-${dmg}`, 20, 60, 'text-red-500');
                
                setTurn('player');
            }, 1200);
        }
    }, [turn, whaleHp, playerHp]);

    // Shake reset
    useEffect(() => {
        if (shake > 0) setTimeout(() => setShake(0), 300);
    }, [shake]);

    return (
        <section className="py-24 bg-slate-950 flex justify-center px-4">
            <div className="max-w-4xl w-full bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl relative">
                
                {/* Battle Stage */}
                <motion.div 
                    animate={{ x: [0, -shake, shake, -shake, shake, 0] }}
                    className="relative h-80 bg-gradient-to-b from-[#1e1b4b] to-black p-8 flex justify-between items-end overflow-hidden"
                >
                    {/* Retro Grid Floor */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ 
                        backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', 
                        backgroundSize: '40px 40px', 
                        transform: 'perspective(300px) rotateX(40deg) translateY(100px)' 
                    }} />

                    {/* PLAYER SIDE */}
                    <div className="relative z-10 flex flex-col items-center w-1/3">
                         {/* HP BAR */}
                         <div className="w-full bg-slate-800 h-4 rounded border border-slate-600 mb-2 overflow-hidden">
                             <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${playerHp}%` }} />
                         </div>
                         <div className={`text-7xl filter drop-shadow-lg transition-transform ${playerHp <= 0 ? 'rotate-90 opacity-50 grayscale' : ''}`}>
                            ⛵️
                         </div>
                         <div className="mt-2 font-meme text-white tracking-widest text-lg">THE PEQUOD</div>
                    </div>

                    {/* BOSS SIDE */}
                    <div className="relative z-10 flex flex-col items-center w-1/3">
                         <div className="w-full bg-slate-800 h-4 rounded border border-slate-600 mb-2 overflow-hidden">
                             <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(whaleHp/2000)*100}%` }} />
                         </div>
                         <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            className={`text-9xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] ${whaleHp <= 0 ? 'opacity-0 scale-0' : ''}`}
                         >
                            🐋
                         </motion.div>
                         <div className="mt-2 font-meme text-red-500 tracking-widest text-lg">MOBY DICK</div>
                    </div>

                    {/* Floating Damage Text Overlay */}
                    <AnimatePresence>
                        {floaters.map(f => (
                            <motion.div
                                key={f.id}
                                initial={{ opacity: 1, y: f.y + '%', x: f.x + '%', scale: 0.5 }}
                                animate={{ opacity: 0, y: (f.y - 20) + '%', scale: 1.5 }}
                                exit={{ opacity: 0 }}
                                className={`absolute font-meme text-3xl font-black z-50 pointer-events-none ${f.color}`}
                                style={{ left: 0, top: 0, width: '100%', height: '100%' }}
                            >
                                <span style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%` }}>{f.text}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* UI Panel */}
                <div className="bg-[#0f172a] p-6 border-t-4 border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Action Log */}
                    <div className="bg-black/50 p-4 rounded border border-slate-800 font-mono text-sm h-40 overflow-hidden flex flex-col justify-end shadow-inner">
                        {log.map((l, i) => (
                            <div key={i} className={`mb-1 border-l-2 pl-2 ${i===0 ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-slate-700 text-slate-500'}`}>
                                {l}
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-2 gap-3 relative">
                        {playerHp <= 0 ? (
                            <button 
                                onClick={() => { setPlayerHp(100); setWhaleHp(2000); setLog(["NEW GAME STARTED"]); setTurn('player'); setUltCharge(0); }}
                                className="col-span-2 bg-slate-700 hover:bg-slate-600 text-white font-meme text-2xl rounded flex items-center justify-center gap-2"
                            >
                                <Skull /> RESPAWN
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={() => playerAction('attack')}
                                    disabled={turn !== 'player'}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-tech border-b-4 border-slate-950 hover:border-cyan-500 rounded flex items-center justify-center gap-2 disabled:opacity-50 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    <Sword size={16} /> HARPOON
                                </button>
                                <button 
                                    onClick={() => playerAction('heal')}
                                    disabled={turn !== 'player'}
                                    className="bg-green-900/30 hover:bg-green-900/50 text-green-400 font-tech border-b-4 border-green-900 hover:border-green-500 rounded flex items-center justify-center gap-2 disabled:opacity-50 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    <Heart size={16} /> REPAIR
                                </button>
                                <button 
                                    onClick={() => playerAction('leverage')}
                                    disabled={turn !== 'player'}
                                    className="bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 font-tech border-b-4 border-yellow-900 hover:border-yellow-500 rounded flex items-center justify-center gap-2 disabled:opacity-50 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    <Activity size={16} /> 100x LONG
                                </button>
                                
                                {/* ULT BUTTON */}
                                <button 
                                    onClick={() => playerAction('ult')}
                                    disabled={turn !== 'player' || ultCharge < 100}
                                    className={`relative overflow-hidden font-black font-meme text-xl rounded flex items-center justify-center gap-2 disabled:opacity-50 active:border-b-0 active:translate-y-1 transition-all border-b-4
                                        ${ultCharge >= 100 ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-800 animate-pulse shadow-[0_0_20px_#22d3ee]' : 'bg-slate-800 text-slate-500 border-slate-900'}
                                    `}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Flame size={18} /> LIMIT BREAK
                                    </span>
                                    {/* Charge Bar Background */}
                                    <div className="absolute left-0 bottom-0 top-0 bg-cyan-900/50 z-0 transition-all duration-300" style={{ width: `${ultCharge}%` }} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};
