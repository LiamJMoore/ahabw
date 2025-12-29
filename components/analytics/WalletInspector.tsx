
import React from 'react';
import { X } from 'lucide-react';
import { WalletProfile } from './AnalyticsTypes';
import { truncateAddress } from '../../utils';

interface WalletInspectorProps {
    profile: WalletProfile | null;
    onClose: () => void;
}

export const WalletInspector: React.FC<WalletInspectorProps> = ({ profile, onClose }) => {
    if (!profile) return null;

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('S') || grade.startsWith('A')) return 'text-green-500';
        if (grade.startsWith('F')) return 'text-red-500';
        return 'text-slate-500';
    };

    const getAvatar = (grade: string) => {
        if (grade.startsWith('S') || grade.startsWith('A')) return '👺'; 
        if (grade.startsWith('F')) return '😐'; 
        if (grade.startsWith('D')) return '😭'; 
        return '🐸'; 
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#020617] border border-cyan-500/50 p-1 shadow-[0_0_50px_rgba(6,182,212,0.2)] w-[350px] relative overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Hologram Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                <div className="bg-cyan-950/30 text-cyan-400 p-2 font-tech flex justify-between items-center text-xs border-b border-cyan-800">
                    <span className="animate-pulse">CREW MATE ANALYSIS v2.0</span>
                    <button onClick={onClose} className="hover:text-white"><X size={14}/></button>
                </div>
                <div className="p-6 text-center relative z-10">
                    <div className="relative mb-6 inline-block">
                    <div className="w-24 h-24 border-2 border-dashed border-cyan-500/50 rounded-full flex items-center justify-center text-6xl bg-black">
                            {getAvatar(profile.grade)}
                    </div>
                    {profile.nftPfp && (
                        <img src={profile.nftPfp} className="absolute bottom-0 right-0 w-10 h-10 rounded-md border border-cyan-400" alt="PFP" />
                    )}
                    {/* Scanning Effect */}
                    <div className="absolute inset-0 border-t-2 border-cyan-500 animate-scan-fast opacity-50" />
                    </div>
                    
                    <h2 className="font-tech text-2xl text-cyan-400 mb-1 tracking-wider">{profile.archetype}</h2>
                    <div className="text-xs text-cyan-700 font-mono mb-6">{truncateAddress(profile.address)}</div>
                    
                    <div className="grid grid-cols-2 gap-4 text-left text-xs mb-6 font-mono">
                        <div>
                            <div className="text-cyan-800 text-[10px]">RANKING</div>
                            <div className={`font-bold ${getGradeColor(profile.grade)} text-lg`}>{profile.grade}</div>
                        </div>
                        
                        <div>
                            <div className="text-cyan-800 text-[10px]">SOL BALANCE</div>
                            <div className="text-cyan-300">{profile.solBalance.toFixed(2)} ◎</div>
                        </div>

                        <div>
                            <div className="text-cyan-800 text-[10px]">THREAT LEVEL</div>
                            <div className={profile.botProbability.startsWith("High") ? "text-red-500 font-bold" : "text-green-500"}>
                                {profile.botProbability}
                            </div>
                        </div>

                        <div>
                            <div className="text-cyan-800 text-[10px]">TIME AT SEA</div>
                            <div className="text-cyan-300">{profile.walletAge}</div>
                        </div>
                    </div>

                    <div className="border-t border-cyan-900/50 pt-4 text-xs">
                        <span className="font-bold block mb-2 text-cyan-600 tracking-widest">CARGO HOLD (BAGS)</span>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {profile.topOtherTokens.length > 0 ? profile.topOtherTokens.map(t => (
                                <span key={t} className="bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900 text-cyan-400 font-mono">{t}</span>
                            )) : <span className="text-cyan-900 italic">Cargo Empty.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
