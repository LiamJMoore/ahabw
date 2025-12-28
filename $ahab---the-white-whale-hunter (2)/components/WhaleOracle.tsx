import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId, ChatMessage } from '../types';
import { generateAhabWisdom } from '../services/geminiService';
import { Send, MessageSquareWarning } from 'lucide-react';

export const WhaleOracle: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'OI! YOU THERE! ARE YOU BUYING OR CRYING? ASK ME ANYTHING!' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query;
    setQuery('');
    setLoading(true);
    setHistory(prev => [...prev, { role: 'user', text: userText }]);

    const response = await generateAhabWisdom(userText);
    
    setHistory(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <section id={SectionId.ORACLE} className="py-24 bg-gradient-to-b from-slate-900 to-black flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
            <MessageSquareWarning className="text-yellow-400 w-10 h-10 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-meme text-white">ASK <span className="text-yellow-400">THE CAPTAIN</span></h2>
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
                    <div className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-bold border border-black">
                        CPT. AHAB 🐋
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
