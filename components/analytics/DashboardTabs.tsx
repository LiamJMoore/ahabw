
import React from 'react';
import { RefreshCw, Zap, Flame, Building2, Search, ExternalLink, Gem, Skull } from 'lucide-react';
import { formatCompactNumber, formatCurrency, truncateAddress } from '../../utils';
import { Holder, WhaleTx, Memo } from './AnalyticsTypes';

// --- HOLDERS TAB ---
export const HoldersTab: React.FC<{ holders: Holder[], loading: boolean, onInspect: (addr: string) => void }> = ({ holders, loading, onInspect }) => (
    <div className="overflow-x-auto bg-[#02040a]">
        <div className="mb-2 text-[10px] text-cyan-400 italic flex justify-between px-2">
        <span>* DATA STREAM: HELIUS_RPC_MAINNET</span>
        {loading && <span className="text-cyan-300 animate-pulse">REFRESHING...</span>}
        </div>
        <div className="max-h-[500px] overflow-y-scroll border border-cyan-800 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-900">
            <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-cyan-300 sticky top-0 shadow-lg z-10">
                    <tr>
                        <th className="p-3 w-12 text-cyan-400 font-bold border-b border-cyan-700">#</th>
                        <th className="p-3 text-cyan-400 font-bold border-b border-cyan-700">IDENTITY</th>
                        <th className="p-3 text-cyan-400 font-bold border-b border-cyan-700">LOYALTY</th>
                        <th className="p-3 text-cyan-400 font-bold border-b border-cyan-700">DURATION</th>
                        <th className="p-3 text-right text-cyan-400 font-bold border-b border-cyan-700">HOLDINGS</th>
                        <th className="p-3 text-right text-cyan-400 font-bold border-b border-cyan-700">VALUE (USD)</th>
                        <th className="p-3 text-right text-cyan-400 font-bold border-b border-cyan-700">SHARE</th>
                        <th className="p-3 pl-4 text-cyan-400 font-bold border-b border-cyan-700">DESIGNATION</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {holders.map((h, i) => (
                        <tr key={i} className={`hover:bg-slate-800 transition-colors ${h.diamondHands ? 'bg-cyan-900/10' : 'bg-[#02040a]'}`}>
                            <td className="p-3 text-white font-bold">{h.rank}</td>
                            <td className="p-3 flex items-center gap-2">
                                <a 
                                    href={`https://solscan.io/account/${h.address}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-cyan-300 hover:text-white font-mono flex items-center gap-1 font-bold underline decoration-cyan-700/50"
                                >
                                    {truncateAddress(h.address)} <ExternalLink size={10} className="opacity-70"/>
                                </a>
                                <button onClick={() => onInspect(h.address)} className="text-cyan-500 hover:text-cyan-200 p-1" title="Deep Scan Wallet">
                                    <Search size={14}/>
                                </button>
                            </td>
                            <td className="p-3">
                                {h.diamondHands ? (
                                    <span className="flex items-center gap-1 text-cyan-200 font-bold text-[10px] bg-cyan-900/50 px-2 py-1 rounded border border-cyan-600">
                                        <Gem size={10} className="fill-cyan-400 text-cyan-200 animate-pulse"/> DIAMOND
                                    </span>
                                ) : h.hasSold ? (
                                    <span className="flex items-center gap-1 text-red-400 text-[10px] font-bold bg-red-950/30 px-2 py-1 rounded border border-red-900">
                                        🧻 PAPER
                                    </span>
                                ) : (
                                    <span className="text-slate-400 text-[10px]">HODLING</span>
                                )}
                            </td>
                            <td className="p-3 text-slate-200 font-mono">
                                <div className="flex flex-col">
                                    <span className={h.daysHeld > 14 ? "text-green-400 font-bold" : "text-white"}>{h.daysHeld} Days</span>
                                    <span className="text-[9px] opacity-70 text-slate-400">{h.heldSince}</span>
                                </div>
                            </td>
                            <td className="p-3 text-right text-white font-bold">{formatCompactNumber(h.amount)}</td>
                            <td className="p-3 text-right text-green-400 font-bold">{formatCompactNumber(h.value)}</td>
                            <td className="p-3 text-right text-white font-mono">{h.percentage.toFixed(2)}%</td>
                            <td className="p-3 pl-4 text-cyan-400 font-bold italic">{h.tag || (h.diamondHands ? 'VETERAN' : 'SAILOR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- WHALE WATCH TAB ---
export const WhaleWatchTab: React.FC<{ whales: WhaleTx[], loading: boolean, onInspect: (addr: string) => void }> = ({ whales, loading, onInspect }) => (
    <div className="overflow-x-auto bg-[#02040a]">
        <div className="flex justify-between mb-2 text-[10px] p-2 border border-cyan-800 bg-cyan-950/30">
                <span className="text-cyan-300 font-bold flex items-center gap-2">
                {loading ? <RefreshCw size={12} className="animate-spin text-cyan-400"/> : <Zap size={12} className="text-yellow-400"/>}
                {loading ? "SCANNING SECTOR..." : "LIVE FEED ACTIVE"}
                </span>
                <span className="text-green-400 animate-pulse font-bold">● SIGNAL STRONG</span>
        </div>
        <div className="max-h-[500px] overflow-y-scroll border border-cyan-800 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-900">
            <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-cyan-300 sticky top-0 shadow-lg z-10">
                    <tr>
                        <th className="p-3 text-cyan-400 font-bold border-b border-cyan-700">TIMESTAMP</th>
                        <th className="p-3 text-cyan-400 font-bold border-b border-cyan-700">ACTION</th>
                        <th className="p-3 text-right text-cyan-400 font-bold border-b border-cyan-700">MAGNITUDE</th>
                        <th className="p-3 text-right text-cyan-400 font-bold border-b border-cyan-700">VALUE</th>
                        <th className="p-3 pl-4 text-cyan-400 font-bold border-b border-cyan-700">ENTITY</th>
                        <th className="p-3 text-cyan-400 font-bold border-b border-cyan-700">HASH</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {whales.map((w, i) => (
                        <tr key={i} className={`hover:bg-slate-800 transition-colors bg-[#02040a]`}>
                            <td className="p-3 text-slate-300 font-mono">{w.time}</td>
                            <td className={`p-3 font-bold flex items-center gap-1 ${w.type === 'buy' ? 'text-green-400' : w.type === 'burn' ? 'text-orange-400' : 'text-red-400'}`}>
                                {w.type === 'burn' && <Flame size={12}/>} {w.type.toUpperCase()}
                            </td>
                            <td className="p-3 text-right font-bold text-white text-sm">{formatCompactNumber(w.amount)}</td>
                            <td className="p-3 text-right text-green-300 font-mono font-bold">{formatCurrency(w.value)}</td>
                            <td className="p-3 pl-4 flex items-center gap-2 text-cyan-200">
                                <div className="flex items-center gap-1">
                                    {w.value > 5000 && <span title="Leviathan" className="text-lg">🐋</span>}
                                    {w.value > 1000 && w.value <= 5000 && <span title="Shark" className="text-lg">🦈</span>}
                                    <a 
                                        href={`https://solscan.io/account/${w.maker}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="hover:text-white cursor-pointer font-bold underline decoration-slate-600"
                                    >
                                        {w.maker.length > 20 ? truncateAddress(w.maker) : w.maker}
                                    </a>
                                </div>
                                <button onClick={() => onInspect(w.maker)} className="text-cyan-500 hover:text-cyan-200 p-1" title="Deep Scan">
                                    <Search size={12}/>
                                </button>
                                {w.label && <span className="text-[9px] bg-slate-700 px-2 py-0.5 rounded text-white flex items-center gap-0.5 border border-slate-500"><Building2 size={8}/> {w.label}</span>}
                            </td>
                            <td className="p-3 text-cyan-500 hover:text-white">
                                <a href={`https://solscan.io/tx/${w.hash}`} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                    {truncateAddress(w.hash)} <ExternalLink size={10}/>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- MEMO WALL TAB ---
export const MemoWallTab: React.FC<{ memos: Memo[], loading: boolean }> = ({ memos, loading }) => (
    <div className="overflow-x-auto bg-[#02040a]">
        <div className="mb-2 text-[10px] text-cyan-400 italic flex justify-between px-2">
        <span>* DECRYPTED COMMUNICATIONS</span>
        {loading && <span className="text-cyan-300 animate-pulse">DECODING...</span>}
        </div>
        <div className="max-h-[500px] overflow-y-scroll border border-cyan-800 p-2 flex flex-col gap-2 bg-[#02040a] scrollbar-thin scrollbar-thumb-cyan-700">
            {memos.map((memo, i) => (
                <div key={i} className="bg-[#0f172a] border border-slate-700 p-3 hover:bg-slate-800 transition-colors shadow-sm">
                    <div className="text-cyan-400 text-[10px] mb-2 flex justify-between font-tech">
                        <span>
                        <span className="text-white font-bold">UNKNOWN_SENDER</span> 
                        <span className="ml-2 text-slate-400">[{memo.time}]</span>
                        <span className="ml-2 text-slate-400">ID: {parseInt(memo.signature.substring(0,6), 36)}</span>
                        </span>
                        <a href={`https://solscan.io/tx/${memo.signature}`} target="_blank" rel="noreferrer" className="hover:text-white text-cyan-600 font-bold">[TRACE]</a>
                    </div>
                    <div className="text-white pl-2 font-mono text-sm tracking-wide border-l-2 border-cyan-700">
                    "{memo.message}"
                    </div>
                </div>
            ))}
        </div>
    </div>
);
