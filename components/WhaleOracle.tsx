import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId, ChatMessage } from '../types';
import { generateAhabWisdom, generateAhabSpeech } from '../services/geminiService';
import { Send, MessageSquareWarning, Volume2 } from 'lucide-react';

export const WhaleOracle: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'OI! YOU THERE! ARE YOU BUYING OR CRYING? ASK ME ANYTHING!' }
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
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const audioStr = atob(base64Audio);
        const len = audioStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = audioStr.charCodeAt(i);
        }
        
        const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
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
    <section id={SectionId.ORACLE} className="py-24 bg-gradient-to-b from-slate-900 to-black flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
            <MessageSquareWarning className="text-yellow-400 w-10 h-10 animate-bounce" />
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-meme text-white">ASK <span className="text-yellow-400">THE CAPTAIN</span></h2>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 mt-1">
                    <Volume2 size={12} /> AUDIO ENABLED (GEMINI 2.5)
                </div>
            </div>
        </div>

        <div className="bg-[#111] border-4 border-slate-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="h-[450px] overflow-y-auto p-6 space-y-4 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" ref={scrollRef}>
            {history.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-2xl font-bold text-lg shadow-lg relative ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-tr-none' 
                    : 'bg-yellow-500 text-black rounded-tl-none font-meme text-xl tracking-wide'
                }`}>
                  {msg.role === 'model' && (
                    <div className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-bold border border-black flex items-center gap-1">
                        <span>CPT. AHAB 🐋</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                    <span className="animate-pulse text-cyan-400 font-mono">SCREAMING AT THE OCEAN...</span>
                 </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAsk} className="p-4 border-t-4 border-slate-800 bg-[#0a0a0a] flex gap-3">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where is the whale? When moon?"
              className="flex-1 bg-slate-900 border-2 border-slate-700 text-white px-6 py-4 rounded-xl focus:outline-none focus:border-cyan-500 font-bold text-lg placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 font-black shadow-[0_0_15px_#22d3ee]"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};