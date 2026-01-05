
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Hero } from './components/Hero';
import { Lore } from './components/Lore';
import { Tokenomics } from './components/Tokenomics';
import { WhaleRadar } from './components/WhaleRadar';
import { WhaleRPG } from './components/WhaleRPG';
import { TheFlippening } from './components/TheFlippening';
import { TokenAnalytics } from './components/TokenAnalytics';
import { MemeGallery } from './components/MemeGallery';
import { AudioAmbience } from './components/AudioAmbience';
import { getMarketWeather, WeatherState } from './services/heliusService';
import { AHAB_CA, NAV_ITEMS } from './constants';
import { CommLinks } from './components/CommLinks';
import { Menu, X, Activity, Globe, Shield, Wifi, Terminal, Crosshair, AlertTriangle, Fingerprint, Search } from 'lucide-react';

// --- CINEMATIC INTRO COMPONENT ---
const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
    const [stage, setStage] = useState<'BOOT' | 'SCAN' | 'TARGET' | 'BREACH'>('BOOT');
    const [bootLines, setBootLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    // Boot Text Sequence
    useEffect(() => {
        const lines = [
            "INITIALIZING AHAB_OS v4.2...",
            "CONNECTING TO SOLANA MAINNET...",
            "BYPASSING SEC FIREWALLS...",
            "LOADING HARPOON PROTOCOLS...",
            "CALIBRATING SONAR ARRAY...",
            "SYNCING WITH ORACLE..."
        ];

        let delay = 0;
        lines.forEach((line, index) => {
            setTimeout(() => {
                setBootLines(prev => [...prev, line]);
                // Trigger next stage after lines are done
                if (index === lines.length - 1) {
                    setTimeout(() => setStage('SCAN'), 800);
                }
            }, delay);
            delay += Math.random() * 300 + 100;
        });
    }, []);

    // Progress Bar Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Random jumps in progress
                return prev + Math.floor(Math.random() * 5);
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Stage Transitions
    useEffect(() => {
        if (stage === 'SCAN') {
            setTimeout(() => setStage('TARGET'), 2500);
        }
        if (stage === 'TARGET') {
            setTimeout(() => setStage('BREACH'), 1500);
        }
        if (stage === 'BREACH') {
            setTimeout(onComplete, 2500);
        }
    }, [stage, onComplete]);

    return (
        <motion.div 
            className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden font-mono cursor-wait"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
        >
            {/* CRT Scanlines Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)] z-40" />

            {/* STAGE 1: BOOT TERMINAL */}
            <AnimatePresence>
                {stage === 'BOOT' && (
                    <div className="w-full max-w-2xl px-6 relative z-30">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0, y: -50 }}
                            className="font-tech text-cyan-500 text-sm md:text-base space-y-1 h-64 overflow-hidden border-l-2 border-cyan-800 pl-4"
                        >
                            {bootLines.map((line, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-cyan-800">{`>`}</span> {line}
                                    {i === bootLines.length - 1 && <span className="w-2 h-4 bg-cyan-500 animate-pulse inline-block"/>}
                                </motion.div>
                            ))}
                        </motion.div>
                        
                        <div className="mt-8">
                            <div className="flex justify-between text-xs text-cyan-600 mb-1 font-tech tracking-widest">
                                <span>SYSTEM INTEGRITY</span>
                                <span>{Math.min(progress, 100)}%</span>
                            </div>
                            <div className="h-1 w-full bg-cyan-950">
                                <motion.div 
                                    className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* STAGE 2: SONAR SCANNER */}
            <AnimatePresence>
                {stage === 'SCAN' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="relative flex flex-col items-center justify-center z-30"
                    >
                        {/* Radar Circle */}
                        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border border-cyan-800 bg-cyan-950/10 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                            {/* Grid */}
                            <div className="absolute inset-0 rounded-full border border-cyan-900/50 scale-50" />
                            <div className="absolute inset-0 rounded-full border border-cyan-900/50 scale-75" />
                            <div className="absolute w-full h-[1px] bg-cyan-900/50" />
                            <div className="absolute h-full w-[1px] bg-cyan-900/50" />
                            
                            {/* Sweep */}
                            <div className="absolute inset-0 rounded-full animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(34,211,238,0.3)_360deg)]" />
                            
                            {/* Blip */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                                className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_red]" 
                            />
                             <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 1.2 }}
                                className="absolute top-1/3 right-1/3 text-red-500 font-tech text-[10px] ml-4 mt-[-4px]" 
                            >
                                UNKNOWN SIGNAL
                            </motion.div>
                        </div>
                        
                        <div className="mt-8 font-tech text-cyan-400 tracking-[0.5em] animate-pulse">
                            SEARCHING SECTOR 7G...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STAGE 3: TARGET ACQUIRED (RED ALERT) */}
            <AnimatePresence>
                {stage === 'TARGET' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-30 text-center"
                    >
                        <div className="absolute inset-0 bg-red-900/20 animate-pulse z-0" />
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                            className="relative z-10"
                        >
                            <AlertTriangle size={80} className="text-red-500 mx-auto mb-4" />
                            <h2 className="font-meme text-6xl md:text-8xl text-red-600 tracking-widest border-y-4 border-red-600 py-2 mb-4 bg-black">
                                TARGET LOCKED
                            </h2>
                            <p className="font-tech text-red-400 tracking-[0.5em] text-lg">
                                MASSIVE SIGNATURE DETECTED
                            </p>
                        </motion.div>
                        
                        {/* Decoding Hash */}
                        <div className="mt-8 font-mono text-xs text-red-800 break-all max-w-lg mx-auto opacity-70">
                            {Array.from({length: 4}).map((_,i) => (
                                <div key={i}>{Array.from({length: 60}).map(() => Math.random() > 0.5 ? '1' : '0').join('')}</div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

             {/* STAGE 4: BREACH (THE REVEAL) */}
             <AnimatePresence>
                {stage === 'BREACH' && (
                    <div className="relative z-40 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <h1 className="font-meme text-8xl md:text-[12rem] text-transparent bg-clip-text bg-gradient-to-t from-cyan-100 to-white drop-shadow-[0_0_50px_rgba(6,182,212,0.8)] leading-[0.8] mb-4">
                                $AHAB
                            </h1>
                        </motion.div>
                        
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="h-[2px] bg-cyan-400 mx-auto mb-6 shadow-[0_0_20px_#22d3ee]"
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center justify-center gap-4 text-cyan-300 font-tech tracking-[0.3em] text-sm md:text-xl"
                        >
                            <Terminal size={16} />
                            <span>THE WHALE MUST DIE</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Corner Details */}
            <div className="absolute bottom-6 left-6 font-tech text-[10px] text-cyan-900 z-50">
                <div className="flex items-center gap-2">
                    <Activity size={12} className="animate-pulse"/> MEMORY: 64TB / 64TB
                </div>
            </div>
            <div className="absolute bottom-6 right-6 font-tech text-[10px] text-cyan-900 z-50 text-right">
                <div className="flex items-center gap-2 justify-end">
                    SECURE_CONNECTION <Shield size={12} />
                </div>
                <div>ENCRYPTION: 256-BIT</div>
            </div>
        </motion.div>
    );
};

// --- BREATHTAKING COMMAND NAV ---
const CommandNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-0' : 'py-4'}`}
        >
            {/* Main HUD Bar */}
            <div className={`relative bg-[#020617]/90 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${scrolled ? 'px-4 py-2' : 'mx-4 rounded-xl border border-cyan-500/30 px-6 py-4'}`}>
                
                {/* Scanning Light Line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-400 blur-[2px] animate-scan-fast" />
                </div>

                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    {/* Brand Identity */}
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-sm animate-pulse" />
                            <div className="absolute inset-0 border border-cyan-400 rounded-sm rotate-45 transition-transform group-hover:rotate-90 duration-500" />
                            <div className="absolute inset-0 border border-cyan-400 rounded-sm -rotate-45 transition-transform group-hover:-rotate-90 duration-500" />
                            <span className="relative font-meme text-2xl text-white z-10">A</span>
                        </div>
                        <div className="hidden md:flex flex-col">
                            <h1 className="font-meme text-2xl text-white tracking-widest leading-none group-hover:text-cyan-400 transition-colors drop-shadow-glow">
                                $AHAB
                            </h1>
                            <div className="flex items-center gap-2 text-[8px] font-tech text-cyan-600 tracking-[0.3em]">
                                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> SYSTEM ONLINE
                            </div>
                        </div>
                    </div>

                    {/* Status Ticker (Desktop) */}
                    <div className="hidden xl:flex items-center gap-6 px-6 py-1 bg-black/40 rounded border border-cyan-900/50">
                         <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                             <Globe size={10} /> PACIFIC_GRID: ACTIVE
                         </div>
                         <div className="w-[1px] h-3 bg-cyan-900" />
                         <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                             <Shield size={10} /> HULL: 100%
                         </div>
                         <div className="w-[1px] h-3 bg-cyan-900" />
                         <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                             <Wifi size={10} className="animate-pulse" /> UPLINK: STABLE
                         </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="relative px-5 py-2 group overflow-hidden"
                            >
                                <span className="relative z-10 font-tech text-xs font-bold tracking-widest text-slate-400 group-hover:text-cyan-300 transition-colors">
                                    {item.label}
                                </span>
                                {/* Tech Borders */}
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                                <span className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 delay-100" />
                                <span className="absolute bottom-0 right-0 w-[2px] h-2 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                        
                        <a 
                            href="https://pump.fun/coin/6Wv4Li6toFybiJajVN3ZBTi7hF8DGbujmewqc86tpump"
                            target="_blank"
                            rel="noreferrer"
                            className="ml-6 relative px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold font-tech text-xs tracking-widest skew-x-[-15deg] group transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                        >
                            <span className="skew-x-[15deg] block">ACQUIRE $AHAB</span>
                            <div className="absolute top-0 right-0 w-2 h-2 bg-white skew-x-[15deg] animate-ping" />
                        </a>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-cyan-400 p-2 hover:bg-cyan-900/20 rounded border border-transparent hover:border-cyan-500/50 transition-all"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden bg-[#020617]/95 backdrop-blur-xl border-b border-cyan-800 overflow-hidden absolute top-full left-0 right-0 shadow-2xl"
                    >
                        <div className="flex flex-col p-6 space-y-2">
                            {NAV_ITEMS.map((item, i) => (
                                <motion.button
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-left py-4 px-4 font-tech text-sm text-cyan-400 hover:bg-cyan-900/20 hover:text-white border-l-2 border-cyan-900 hover:border-cyan-400 transition-all flex items-center justify-between group"
                                >
                                    <span className="tracking-widest">{item.label}</span>
                                    <Activity size={14} className="opacity-0 group-hover:opacity-100 text-cyan-500 animate-pulse" />
                                </motion.button>
                            ))}
                            <a 
                                href="https://pump.fun/coin/6Wv4Li6toFybiJajVN3ZBTi7hF8DGbujmewqc86tpump"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 bg-red-600 text-center py-4 font-bold font-tech text-white tracking-widest hover:bg-red-500 transition-colors"
                            >
                                BUY TOKEN
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const [weather, setWeather] = useState<WeatherState>('CALM');

  // Modified Gradient: Starts deep slate, stays deep
  const waterColor = useTransform(scrollYProgress, 
    [0, 0.3, 0.8, 1], 
    ['#020617', '#0f172a', '#020617', '#000000'] 
  );

  useEffect(() => {
    const updateWeather = async () => {
        const w = await getMarketWeather();
        setWeather(w);
    };
    updateWeather();
    const weatherInterval = setInterval(updateWeather, 60000); 
    return () => clearInterval(weatherInterval);
  }, []);

  return (
    <>
        <AnimatePresence mode="wait">
            {loading && <CinematicIntro onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        {!loading && (
            <div className="relative min-h-screen overflow-hidden bg-[#020617]">
            
            {/* CINEMATIC GLOBAL OVERLAYS */}
            <div className="cinematic-overlay" />
            <div className="film-grain" />

            <motion.div 
                animate={{ 
                    rotate: [0.1, -0.1, 0.1],
                    y: [0, 2, 0]
                }}
                transition={{ 
                    duration: 12, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="origin-top"
            >
                <motion.div style={{ backgroundColor: waterColor }} className="min-h-screen text-slate-200 transition-colors duration-1000">
                    
                    <AudioAmbience weather={weather} />

                    <CommandNav />

                    <main className="relative z-10 pb-20 pt-20">
                        <Hero weather={weather} />
                        
                        <CommLinks />

                        <div className="relative z-20">
                            <Lore />
                        </div>

                        <div className="py-10 relative z-20">
                            <TokenAnalytics ca={AHAB_CA} />
                        </div>
                        
                        <WhaleRPG />

                        <TheFlippening />

                        <section className="relative z-20 py-20 bg-black/50">
                            <WhaleRadar />
                        </section>

                        <section className="relative z-20 py-20">
                            <Tokenomics />
                        </section>

                        {/* Explicitly at the bottom */}
                        <MemeGallery />

                    </main>

                </motion.div>
            </motion.div>
            </div>
        )}
    </>
  );
};

export default App;

