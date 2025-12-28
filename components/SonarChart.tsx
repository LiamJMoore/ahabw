import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const data = Array.from({ length: 50 }, (_, i) => {
    const base = 100;
    const volatility = Math.sin(i * 0.2) * 20;
    const trend = i * 2;
    return {
        name: i,
        price: base + volatility + trend + (Math.random() * 10 - 5)
    };
});

export const SonarChart: React.FC = () => {
    return (
        <section id="sonar-chart" className="py-20 bg-black relative flex justify-center px-4 overflow-hidden">
            {/* CRT Bezel */}
            <div className="relative w-full max-w-5xl bg-[#111] border-[16px] border-[#222] rounded-[40px] shadow-[0_0_0_4px_#000,0_20px_50px_rgba(0,0,0,0.8)] p-8 md:p-12 overflow-hidden">
                
                {/* Screen Reflection/Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,rgba(0,0,0,0)_80%)] pointer-events-none z-10" />
                
                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none z-20 opacity-20" 
                     style={{ 
                         background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                         backgroundSize: '100% 2px, 3px 100%'
                     }} 
                />

                {/* Header */}
                <div className="flex justify-between items-end mb-6 relative z-30 font-tech text-green-500 border-b border-green-900/50 pb-2">
                    <div>
                        <h2 className="text-2xl tracking-[0.3em] animate-pulse">SONAR // CHART</h2>
                        <span className="text-xs text-green-700">FEED: LIVE_MARKET_V3</span>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">$0.00420</div>
                        <span className="text-xs bg-green-900/30 px-2 py-0.5 rounded text-green-400">+13.2% (24H)</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-[400px] w-full relative z-30 filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#14532d" vertical={false} />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #22c55e', color: '#22c55e', fontFamily: 'monospace' }}
                                itemStyle={{ color: '#22c55e' }}
                                cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#22c55e" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorPrice)" 
                                isAnimationActive={true}
                            />
                            {/* "The Whale" Mock Line */}
                            <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "TARGET: $1B MCAP", fill: '#ef4444', fontSize: 10, fontFamily: 'monospace' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                    
                    {/* Blip Animation on end of chart */}
                    <div className="absolute right-0 top-[20%] w-3 h-3 bg-green-400 rounded-full animate-ping shadow-[0_0_10px_#22c55e]" />
                </div>

                {/* Footer Decor */}
                <div className="flex gap-4 mt-4 relative z-30">
                    {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className={`h-2 flex-1 rounded-sm ${i < 4 ? 'bg-green-900/50' : 'bg-green-500/20'}`} />
                    ))}
                </div>
            </div>
        </section>
    );
};