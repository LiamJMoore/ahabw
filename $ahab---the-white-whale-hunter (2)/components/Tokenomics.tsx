import React from 'react';
import { motion } from 'framer-motion';
import { TOKEN_STATS } from '../constants';
import { SectionId } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Liquidity Pool', value: 90 },
  { name: 'Whale Bait', value: 10 },
];

const COLORS = ['#22c55e', '#0ea5e9']; // Green & Cyan

export const Tokenomics: React.FC = () => {
  return (
    <section id={SectionId.TOKENOMICS} className="py-24 relative overflow-hidden bg-slate-950">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-meme text-center mb-20 text-white drop-shadow-[0_4px_0_#0f172a]"
        >
          THE <span className="text-cyan-400">LOOT</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Chart - Looks like a steering wheel */}
          <motion.div 
            initial={{ rotate: -180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            className="h-[400px] w-full relative"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
               <div className="w-[300px] h-[300px] rounded-full border-[20px] border-slate-800 opacity-50" />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={160}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #22d3ee', borderRadius: '10px', color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <span className="text-4xl">🏴‍☠️</span>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="space-y-6">
            {TOKEN_STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="group relative bg-slate-900 border-2 border-slate-800 p-6 rounded-2xl hover:-translate-y-2 hover:border-green-500 transition-all shadow-[8px_8px_0_#1e293b] hover:shadow-[8px_8px_0_#22c55e]"
              >
                <h3 className="text-slate-400 font-bold font-mono text-sm uppercase tracking-widest mb-1">{stat.label}</h3>
                <div className="text-4xl font-meme text-white mb-2 group-hover:text-green-400 transition-colors">{stat.value}</div>
                <p className="text-slate-500 font-medium">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
