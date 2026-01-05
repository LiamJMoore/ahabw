
import React, { useState, useEffect } from 'react';
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
import { Menu, X, Activity, Globe, Shield, Wifi } from 'lucide-react';

// --- CINEMATIC INTRO COMPONENT ---
const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[99999] bg-[#020617] flex items-center justify-center overflow-hidden"
        >
            <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,rgba(0,0,0,0)_60%)" />
            <div className="text-center relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="font-meme text-6xl md:text-8xl text-white mb-4 liquid-text drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                        $AHAB
                    </h1>
                </motion.div>
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "200px" }} 
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-1 bg-cyan-500 mx-auto mb-4 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="font-tech text-cyan-400 tracking-[0.5em] text-xs"
                >
                    INITIALIZING SEQUENCE...
                </motion.p>
            </div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onAnimationComplete={() => setTimeout(onComplete, 2500)}
                className="hidden"
            />
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
        <AnimatePresence>
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
