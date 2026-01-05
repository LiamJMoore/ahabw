
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId, ChatMessage } from '../types';
import { generateAhabWisdom, generateAhabSpeech } from '../services/geminiService';
import { Send, Terminal, Volume2, Mic, Activity } from 'lucide-react';
import { decodeBase64, pcmToAudioBuffer } from '../utils';

export const WhaleOracle: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'CAPTAIN ON DECK. SPEAK YOUR MIND, SAILOR, OR GET OFF MY BRIDGE.' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const playAudio = async (base64Audio: string) => {
      try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const bytes = decodeBase64(base64Audio);
        const audioBuffer = pcmToAudioBuffer(bytes, ctx, 24000);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch (e) {
          console.error("Audio playback failed", e);
      }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query;
    setQuery('');
    setLoading(true);
    setHistory(prev => [...prev, { role: 'user', text: userText }]);

    // Get Text Response
    const textResponse = await generateAhabWisdom(userText);
    setHistory(prev => [...prev, { role: 'model', text: textResponse }]);
    
    // Get Audio Response (fire and forget to not block UI)
    generateAhabSpeech(textResponse).then(audioData => {
        if (audioData) playAudio(audioData);
    });

    setLoading(false);
  };

  return (
    <section id={SectionId.ORACLE} className="py-32 bg-[#020617] flex justify-center px-4 relative overflow-hidden">
      
      {/* Background Tech Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-900 to-transparent" />

      <div className="w-full max-w-4xl relative z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-8 border-b-2 border-cyan-900 pb-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-950 rounded flex items-center justify-center border border-cyan-700 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Terminal className="text-cyan-400" size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-meme text-white tracking-widest">AHAB.<span className="text-cyan-500">AI</span></h2>
                    <div className="flex items-center gap-2 text-[10px] font-tech text-cyan-600">
                        <Activity size={10} className="animate-pulse" /> NEURAL LINK ESTABLISHED
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-800 bg-cyan-950/20 px-3 py-1 rounded border border-cyan-900/50">
                 <Volume2 size={12} className="text-cyan-500"/> AUDIO SYNTHESIS: ON
            </div>
        </div>

        {/* Terminal Window */}
        <div className="bg-[#050b14] border border-cyan-800 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
          
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 opacity-10" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

          <div className="h-[500px] overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-black" ref={scrollRef}>
            {history.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] relative group`}>
                    {/* Speaker Label */}
                    <div className={`text-[9px] font-tech mb-1 ${msg.role === 'user' ? 'text-right text-cyan-600' : 'text-left text-yellow-600'}`}>
                        {msg.role === 'user' ? 'YOU' : 'CPT. AHAB'}
                    </div>
                    
                    {/* Bubble */}
                    <div className={`p-4 rounded-sm border font-mono text-sm md:text-base shadow-lg backdrop-blur-sm ${
                        msg.role === 'user' 
                        ? 'bg-cyan-950/40 border-cyan-700 text-cyan-100 rounded-tr-none' 
                        : 'bg-[#1a1405]/80 border-yellow-800/60 text-yellow-100 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>

                    {/* Decor Corner */}
                    <div className={`absolute top-0 w-2 h-2 border-t border-l ${msg.role === 'user' ? 'right-0 border-cyan-500' : 'left-0 border-yellow-500'}`} />
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-cyan-950/20 p-3 rounded-sm border border-cyan-900 flex items-center gap-3">
                    <div className="flex gap-1 h-3 items-end">
                        <div className="w-1 bg-cyan-500 animate-music-bar" style={{height:'40%'}}/>
                        <div className="w-1 bg-cyan-500 animate-music-bar" style={{height:'80%', animationDelay:'0.1s'}}/>
                        <div className="w-1 bg-cyan-500 animate-music-bar" style={{height:'60%', animationDelay:'0.2s'}}/>
                    </div>
                    <span className="text-cyan-500 font-tech text-xs animate-pulse">THINKING...</span>
                 </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleAsk} className="p-4 bg-[#020617] border-t border-cyan-800 flex gap-0 relative z-30">
            <div className="flex items-center justify-center bg-cyan-950/30 border-y border-l border-cyan-800 px-4 text-cyan-600">
                <span className="font-mono">{'>'}</span>
            </div>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the Captain..."
              className="flex-1 bg-cyan-950/10 border border-cyan-800 text-white px-4 py-4 focus:outline-none focus:bg-cyan-950/20 font-mono text-sm placeholder:text-cyan-900"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-cyan-800 hover:bg-cyan-700 text-white px-8 py-4 font-tech tracking-widest transition-all disabled:opacity-50 border border-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              SEND
            </button>
          </form>
        </div>
        
        <div className="text-center mt-4">
             <p className="text-[10px] font-tech text-cyan-900">
                POWERED BY GEMINI 2.5 FLASH // LATENCY: 42ms // SECURE CHANNEL
             </p>
        </div>
      </div>
    </section>
  );
};