
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sword, Activity, Flame, Skull } from 'lucide-react';
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
    const [ultCharge, setUltCharge] = useState(0);

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
            spawnFloater(`-${dmg}`, 70, 40, 'text-red-400');
            setUltCharge(prev => Math.min(prev + 15, 100));

        } else if (action === 'leverage') {
            // High Risk High Reward
            if (Math.random() > 0.4) {
                dmg = Math.floor(Math.random() * 300) + 100;
                addLog(`CRITICAL 100x LONG!`);
                spawnFloater(`CRIT -${dmg}`, 70, 30, 'text-yellow-300');
                setShake(20);
                setUltCharge(prev => Math.min(prev + 25, 100));
            } else {
                selfDmg = 40;
                addLog(`LIQUIDATED! Wicks hurt.`);
                spawnFloater(`-${selfDmg}`, 20, 60, 'text-red-500');
                setShake(10);
            }

        } else if (action === 'heal') {
            heal = 50;
            addLog(`Grog consumed. +${heal} HP`);
            spawnFloater(`+${heal}`, 20, 50, 'text-green-400');
            setUltCharge(prev => Math.min(prev + 10, 100));
        
        } else if (action === 'ult') {
            dmg = 800;
            addLog(`CALL THE PEQUOD! ALL HANDS!`);
            spawnFloater(`-${dmg}!!!`, 70, 50, 'text-cyan-300 text-4xl font-black');
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
        <section className="py-24 bg-[#020617] flex justify-center px-4 relative">
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-[#0c4a6e]" />

            <div className="max-w-4xl w-full bg-[#082f49]/30 border-2 border-cyan-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] relative z-10 backdrop-blur-sm">
                
                {/* Battle Stage */}
                <motion.div 
                    animate={{ x: [0, -shake, shake, -shake, shake, 0] }}
                    className="relative h-96 bg-[#020617] p-8 flex justify-between items-end overflow-hidden"
                >
                    {/* Water Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-[#020617] z-0" />
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/underwater.png')] animate-pulse" />

                    {/* PLAYER SIDE */}
                    <div className="relative z-10 flex flex-col items-center w-1/3">
                         {/* HP BAR */}
                         <div className="w-full bg-slate-900 h-2 rounded border border-slate-700 mb-2 overflow-hidden">
                             <div className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_10px_#22d3ee]" style={{ width: `${playerHp}%` }} />
                         </div>
                         <div className={`text-8xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform ${playerHp <= 0 ? 'rotate-90 opacity-50 grayscale' : ''}`}>
                            ⛵️
                         </div>
                         <div className="mt-4 font-tech text-cyan-200 tracking-widest text-sm bg-black/40 px-3 py-1 rounded border border-cyan-900">THE PEQUOD</div>
                    </div>

                    {/* BOSS SIDE */}
                    <div className="relative z-10 flex flex-col items-center w-1/3">
                         <div className="w-full bg-slate-900 h-2 rounded border border-slate-700 mb-2 overflow-hidden">
                             <div className="h-full bg-red-500 transition-all duration-300 shadow-[0_0_10px_red]" style={{ width: `${(whaleHp/2000)*100}%` }} />
                         </div>
                         <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            className={`text-[8rem] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] ${whaleHp <= 0 ? 'opacity-0 scale-0' : ''}`}
                         >
                            🐋
                         </motion.div>
                         <div className="mt-4 font-tech text-red-400 tracking-widest text-sm bg-black/40 px-3 py-1 rounded border border-red-900">MOBY DICK</div>
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
                <div className="bg-[#050b14] p-6 border-t border-cyan-900 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Action Log */}
                    <div className="bg-cyan-950/10 p-4 rounded border border-cyan-900/50 font-mono text-sm h-40 overflow-hidden flex flex-col justify-end shadow-inner">
                        {log.map((l, i) => (
                            <div key={i} className={`mb-1 border-l-2 pl-2 ${i===0 ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-slate-800 text-slate-600'}`}>
                                {l}
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-2 gap-3 relative content-center">
                        {playerHp <= 0 ? (
                            <button 
                                onClick={() => { setPlayerHp(100); setWhaleHp(2000); setLog(["NEW GAME STARTED"]); setTurn('player'); setUltCharge(0); }}
                                className="col-span-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 font-meme text-2xl rounded flex items-center justify-center gap-2 py-4"
                            >
                                <Skull /> RESPAWN
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={() => playerAction('attack')}
                                    disabled={turn !== 'player'}
                                    className="bg-slate-800 hover:bg-slate-700 text-cyan-100 font-tech border border-slate-600 hover:border-cyan-500 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-all py-3 shadow-lg"
                                >
                                    <Sword size={16} /> HARPOON
                                </button>
                                <button 
                                    onClick={() => playerAction('heal')}
                                    disabled={turn !== 'player'}
                                    className="bg-green-900/20 hover:bg-green-900/40 text-green-400 font-tech border border-green-800/50 hover:border-green-500 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-all py-3"
                                >
                                    <Heart size={16} /> REPAIR
                                </button>
                                <button 
                                    onClick={() => playerAction('leverage')}
                                    disabled={turn !== 'player'}
                                    className="bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-400 font-tech border border-yellow-800/50 hover:border-yellow-500 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-all py-3"
                                >
                                    <Activity size={16} /> 100x LONG
                                </button>
                                
                                {/* ULT BUTTON */}
                                <button 
                                    onClick={() => playerAction('ult')}
                                    disabled={turn !== 'player' || ultCharge < 100}
                                    className={`relative overflow-hidden font-black font-meme text-xl rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-all border
                                        ${ultCharge >= 100 ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 animate-pulse shadow-[0_0_20px_#22d3ee]' : 'bg-slate-800 text-slate-500 border-slate-900'}
                                    `}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Flame size={18} /> LIMIT BREAK
                                    </span>
                                    {/* Charge Bar Background */}
                                    <div className="absolute left-0 bottom-0 top-0 bg-cyan-400/30 z-0 transition-all duration-300" style={{ width: `${ultCharge}%` }} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};
