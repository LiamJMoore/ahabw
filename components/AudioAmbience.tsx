
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio, Zap, Anchor, Waves, Music } from 'lucide-react';
import { WeatherState } from '../services/heliusService';

interface AudioAmbienceProps {
    weather: WeatherState;
}

type RadioStation = 'OFF' | 'SHANTY' | 'PHONK';

export const AudioAmbience: React.FC<AudioAmbienceProps> = ({ weather }) => {
    const [muted, setMuted] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [station, setStation] = useState<RadioStation>('OFF');
    const [hasInteracted, setHasInteracted] = useState(false);

    // Audio Refs
    const droneRef = useRef<HTMLAudioElement | null>(null);
    const sonarRef = useRef<HTMLAudioElement | null>(null);
    const thunderRef = useRef<HTMLAudioElement | null>(null);
    const creakRef = useRef<HTMLAudioElement | null>(null);
    const radioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio Objects
    useEffect(() => {
        droneRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/119/119.wav'); // Underwater Hum
        droneRef.current.loop = true;
        
        creakRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/370/370.wav'); // Wood Creak
        creakRef.current.volume = 0.3;

        sonarRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1046/1046.wav'); // Sonar
        sonarRef.current.volume = 0.2;

        thunderRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1273/1273.wav'); // Thunder
        
        radioRef.current = new Audio();
        radioRef.current.loop = true;

        return () => {
            droneRef.current?.pause();
            radioRef.current?.pause();
        };
    }, []);

    // Handle Volume & Mute Changes
    useEffect(() => {
        const refs = [droneRef, radioRef, creakRef, sonarRef, thunderRef];
        refs.forEach(ref => {
            if (ref.current) {
                ref.current.muted = muted;
                // Specific volume adjustments relative to master volume
                if (ref === droneRef) ref.current.volume = volume * 0.4;
                if (ref === radioRef) ref.current.volume = volume * 0.8;
                if (ref === thunderRef) ref.current.volume = volume;
            }
        });

        // Start drone if unmuted and interacted
        if (!muted && hasInteracted && droneRef.current?.paused) {
            droneRef.current.play().catch(e => console.log("Autoplay blocked", e));
        } else if (muted) {
            droneRef.current?.pause();
            radioRef.current?.pause();
        }
    }, [muted, volume, hasInteracted]);

    // Handle Weather Effects (Storm)
    useEffect(() => {
        if (weather === 'STORM' && !muted && hasInteracted) {
            const thunderInterval = setInterval(() => {
                if (Math.random() > 0.6) { // 40% chance every 10s
                    thunderRef.current?.play().catch(() => {});
                }
            }, 10000);
            return () => clearInterval(thunderInterval);
        }
    }, [weather, muted, hasInteracted]);

    // Random Ambience (Sonar & Creaks)
    useEffect(() => {
        if (muted || !hasInteracted) return;

        const ambientInterval = setInterval(() => {
            const rand = Math.random();
            if (rand > 0.7) creakRef.current?.play().catch(() => {});
            if (rand < 0.2) sonarRef.current?.play().catch(() => {});
        }, 8000);

        return () => clearInterval(ambientInterval);
    }, [muted, hasInteracted]);

    // Handle Radio Switching
    useEffect(() => {
        if (!radioRef.current) return;

        if (station === 'OFF') {
            radioRef.current.pause();
        } else {
            // Using placeholder URLs for demo purposes. 
            // In a real app, these would be hosted MP3s of actual tracks.
            // Using generic loops found in public domain archives or Mixkit for now.
            const src = station === 'SHANTY' 
                ? 'https://assets.mixkit.co/active_storage/sfx/255/255.wav' // Placeholder (Drums/Rhythm)
                : 'https://assets.mixkit.co/active_storage/sfx/131/131.wav'; // Placeholder (Techno/Phonk beat)
            
            radioRef.current.src = src;
            if (!muted && hasInteracted) {
                radioRef.current.play().catch(e => console.log("Radio play failed", e));
            }
        }
    }, [station, muted, hasInteracted]);

    // Initial Interaction Handler
    const handleInteract = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            setMuted(false);
        } else {
            setMuted(!muted);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            
            {/* The Radio Widget */}
            <div className={`pointer-events-auto bg-[#0f172a] border-2 border-slate-600 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-500 w-64 ${muted ? 'opacity-70 grayscale' : 'opacity-100'}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
                    <div className="flex items-center gap-2 text-cyan-500">
                        <Radio size={16} className={!muted && station !== 'OFF' ? 'animate-pulse' : ''} />
                        <span className="font-tech text-xs tracking-widest">SUB-COMMS</span>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className={`w-1 h-3 rounded-full ${!muted && station !== 'OFF' ? 'animate-bounce bg-green-500' : 'bg-slate-700'}`} style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                </div>

                {/* Station Selector */}
                <div className="grid grid-cols-3 gap-1 mb-4">
                    {(['OFF', 'SHANTY', 'PHONK'] as RadioStation[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStation(s); if(!hasInteracted) handleInteract(); }}
                            className={`text-[10px] font-mono py-1 rounded border transition-colors
                                ${station === s 
                                    ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                                }
                            `}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Volume & Mute Controls */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleInteract}
                        className={`p-2 rounded-full border ${muted ? 'bg-red-900/20 border-red-800 text-red-500' : 'bg-green-900/20 border-green-800 text-green-500 hover:bg-green-900/40'}`}
                    >
                        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        disabled={muted}
                    />
                </div>

                {/* Status Display */}
                <div className="mt-3 text-[10px] font-tech text-center">
                    {muted ? (
                        <span className="text-red-500">SYSTEM SILENCED</span>
                    ) : (
                        <div className="flex justify-between text-slate-400">
                            <span>AMBIENCE: {Math.round(volume * 100)}%</span>
                            <span className={weather === 'STORM' ? 'text-red-400 animate-pulse' : 'text-cyan-400'}>
                                ENV: {weather}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Visualizer (Fake) */}
            {!muted && station !== 'OFF' && (
                <div className="flex items-end gap-[2px] h-8 pointer-events-none">
                    {Array.from({length: 8}).map((_, i) => (
                        <div 
                            key={i} 
                            className="w-1 bg-cyan-500/50" 
                            style={{ 
                                height: '100%',
                                animation: `equalizer 0.5s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.05}s`
                            }} 
                        />
                    ))}
                    <style>{`
                        @keyframes equalizer {
                            0% { height: 10%; }
                            100% { height: 100%; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};
