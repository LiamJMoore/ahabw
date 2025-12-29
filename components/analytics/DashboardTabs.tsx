
import React from 'react';
import { RefreshCw, Zap, Flame, Building2, Search, ExternalLink, Gem, Skull } from 'lucide-react';
import { formatCompactNumber, formatCurrency, truncateAddress } from '../../utils';
import { Holder, WhaleTx, Memo } from './AnalyticsTypes';

// --- HOLDERS TAB ---
export const HoldersTab: React.FC<{ holders: Holder[], loading: boolean, onInspect: (addr: string) => void }> = ({ holders, loading, onInspect }) => (
    <div className="overflow-x-auto">
        <div className="mb-2 text-[10px] text-cyan-800 italic flex justify-between">
        <span>* DATA STREAM: HELIUS_RPC_MAINNET</span>
        {loading && <span className="text-cyan-500 animate-pulse">REFRESHING...</span>}
        </div>
        <div className="max-h-[400px] overflow-y-scroll border border-cyan-900/30 scrollbar-thin">
            <table className="w-full text-xs text-left">
                <thead className="bg-cyan-950/30 text-cyan-300 sticky top-0 shadow-lg">
                    <tr>
                        <th className="p-2 w-12">#</th>
                        <th className="p-2">IDENTITY</th>
                        <th className="p-2">LOYALTY</th>
                        <th className="p-2">DURATION</th>
                        <th className="p-2 text-right">HOLDINGS</th>
                        <th className="p-2 text-right">VALUE (USD)</th>
                        <th className="p-2 text-right">SHARE</th>
                        <th className="p-2 pl-4">DESIGNATION</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/20">
                    {holders.map((h, i) => (
                        <tr key={i} className={`hover:bg-cyan-900/10 transition-colors ${h.diamondHands ? 'bg-cyan-950/10' : ''}`}>
                            <td className="p-2 text-cyan-700">{h.rank}</td>
                            <td className="p-2 flex items-center gap-2">
                                <a 
                                    href={`https://solscan.io/account/${h.address}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-cyan-400 hover:underline hover:text-cyan-200 font-mono flex items-center gap-1"
                                >
                                    {truncateAddress(h.address)} <ExternalLink size={10} className="opacity-50"/>
                                </a>
                                <button 
                                    onClick={() => onInspect(h.address)} 
                                    className="text-cyan-800 hover:text-cyan-400 p-1"
                                    title="Deep Scan Wallet"
                                >
                                    <Search size={12}/>
                                </button>
                            </td>
                            <td className="p-2">
                                {h.diamondHands ? (
                                    <span className="flex items-center gap-1 text-cyan-300 font-bold text-[10px] bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800">
                                        <Gem size={10} className="fill-cyan-400 text-cyan-200 animate-pulse"/> DIAMOND
                                    </span>
                                ) : h.hasSold ? (
                                    <span className="flex items-center gap-1 text-red-400 text-[10px] opacity-70">
                                        🧻 PAPER
                                    </span>
                                ) : (
                                    <span className="text-slate-500 text-[10px]">HODLING</span>
                                )}
                            </td>
                            <td className="p-2 text-slate-400 font-mono">
                                <div className="flex flex-col">
                                    <span className={h.daysHeld > 14 ? "text-green-500 font-bold" : ""}>{h.daysHeld} Days</span>
                                    <span className="text-[9px] opacity-50">{h.heldSince}</span>
                                </div>
                            </td>
                            <td className="p-2 text-right text-cyan-200">{formatCompactNumber(h.amount)}</td>
                            <td className="p-2 text-right text-green-500">{formatCompactNumber(h.value)}</td>
                            <td className="p-2 text-right text-slate-400">{h.percentage.toFixed(2)}%</td>
                            <td className="p-2 pl-4 text-cyan-700 italic">{h.tag || (h.diamondHands ? 'VETERAN' : 'SAILOR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- WHALE WATCH TAB ---
export const WhaleWatchTab: React.FC<{ whales: WhaleTx[], loading: boolean, onInspect: (addr: string) => void }> = ({ whales, loading, onInspect }) => (
    <div className="overflow-x-auto">
        <div className="flex justify-between mb-2 text-[10px] p-1 border border-cyan-900/30 bg-cyan-950/10">
                <span className="text-cyan-400 font-bold flex items-center gap-2">
                {loading ? <RefreshCw size={10} className="animate-spin"/> : <Zap size={10}/>}
                {loading ? "SCANNING SECTOR..." : "LIVE FEED ACTIVE"}
                </span>
                <span className="text-green-500 animate-pulse">● SIGNAL STRONG</span>
        </div>
        <div className="max-h-[400px] overflow-y-scroll border border-cyan-900/30 scrollbar-thin">
            <table className="w-full text-xs text-left">
                <thead className="bg-cyan-950/30 text-cyan-300 sticky top-0 shadow-lg">
                    <tr>
                        <th className="p-2">TIMESTAMP</th>
                        <th className="p-2">ACTION</th>
                        <th className="p-2 text-right">MAGNITUDE</th>
                        <th className="p-2 text-right">VALUE</th>
                        <th className="p-2 pl-4">ENTITY</th>
                        <th className="p-2">HASH</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/20">
                    {whales.map((w, i) => (
                        <tr key={i} className={`hover:bg-cyan-900/10 transition-colors ${w.type === 'buy' ? 'text-green-400' : w.type === 'burn' ? 'text-orange-400' : 'text-red-400'}`}>
                            <td className="p-2 text-slate-500">{w.time}</td>
                            <td className="p-2 font-bold flex items-center gap-1">
                                {w.type === 'burn' && <Flame size={10}/>} {w.type.toUpperCase()}
                            </td>
                            <td className="p-2 text-right">{formatCompactNumber(w.amount)}</td>
                            <td className="p-2 text-right opacity-80">{formatCurrency(w.value)}</td>
                            <td className="p-2 pl-4 flex items-center gap-2 text-cyan-200">
                                <div className="flex items-center gap-1">
                                    {w.value > 5000 && <span title="Leviathan">🐋</span>}
                                    {w.value > 1000 && w.value <= 5000 && <span title="Shark">🦈</span>}
                                    <a 
                                        href={`https://solscan.io/account/${w.maker}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="hover:underline hover:text-white cursor-pointer"
                                    >
                                        {w.maker.length > 20 ? truncateAddress(w.maker) : w.maker}
                                    </a>
                                </div>
                                
                                <button 
                                    onClick={() => onInspect(w.maker)} 
                                    className="text-cyan-700 hover:text-cyan-400 p-1"
                                    title="Deep Scan"
                                >
                                    <Search size={10}/>
                                </button>

                                {w.label && (
                                    <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-400 flex items-center gap-0.5">
                                        <Building2 size={8}/> {w.label}
                                    </span>
                                )}
                            </td>
                            <td className="p-2 text-cyan-700 hover:text-cyan-400">
                                <a href={`https://solscan.io/tx/${w.hash}`} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                    {truncateAddress(w.hash)} <ExternalLink size={8}/>
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
    <div className="overflow-x-auto">
        <div className="mb-2 text-[10px] text-cyan-800 italic flex justify-between">
        <span>* DECRYPTED COMMUNICATIONS</span>
        {loading && <span className="text-cyan-500 animate-pulse">DECODING...</span>}
        </div>
        <div className="max-h-[400px] overflow-y-scroll border border-cyan-900/30 p-2 flex flex-col gap-2 bg-black/20">
            {memos.map((memo, i) => (
                <div key={i} className="bg-cyan-950/10 border border-cyan-900/30 p-2">
                    <div className="text-cyan-800 text-[9px] mb-1 flex justify-between font-tech">
                        <span>
                        <span className="text-cyan-600">UNKNOWN_SENDER</span> 
                        <span className="ml-2">[{memo.time}]</span>
                        <span className="ml-2">ID: {parseInt(memo.signature.substring(0,6), 36)}</span>
                        </span>
                        <a href={`https://solscan.io/tx/${memo.signature}`} target="_blank" rel="noreferrer" className="hover:text-cyan-400">[TRACE]</a>
                    </div>
                    <div className="text-cyan-300 pl-2 font-mono text-sm tracking-wide">
                    "{memo.message}"
                    </div>
                </div>
            ))}
        </div>
    </div>
);
