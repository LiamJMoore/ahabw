
import React from 'react';
import { Star } from 'lucide-react';
import { formatCurrency } from '../../utils';

export const CalculatorTab: React.FC<{ calcAmount: string, setCalcAmount: (v: string) => void, metrics: { price: number } }> = ({ calcAmount, setCalcAmount, metrics }) => {
    const calculateWagieStats = () => {
        const tokens = parseFloat(calcAmount) || 0;
        const usdValue = tokens * metrics.price;
        const wagePerHour = 15;
        const hours = usdValue / wagePerHour;
        
        return {
            usdValue,
            hours,
            bigMacs: usdValue / 5.50,
            lambos: usdValue / 250000,
            status: usdValue < 100 ? "DECK HAND" : usdValue < 5000 ? "FIRST MATE" : usdValue < 50000 ? "CAPTAIN" : "LEVIATHAN"
        };
    };

    const stats = calculateWagieStats();

    return (
        <div className="bg-black/40 border border-cyan-900/30 p-6 text-center">
            <h3 className="text-cyan-400 font-tech text-lg mb-6 tracking-widest border-b border-cyan-900/30 pb-2">LOOT DISTRIBUTION ESTIMATOR</h3>
            
            <div className="flex justify-center gap-2 items-center mb-8">
                <span className="text-cyan-700">CURRENT HOLDINGS:</span>
                <input 
                    type="number" 
                    value={calcAmount} 
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="bg-black border border-cyan-700 p-1 w-32 text-center text-cyan-400 focus:border-cyan-400 outline-none"
                />
                <span className="text-cyan-700">$AHAB</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-cyan-950/20 border border-cyan-900/30 p-3">
                    <div className="text-[10px] text-cyan-800 mb-1">MARKET VALUE</div>
                    <div className="text-xl text-green-500 font-tech">{formatCurrency(stats.usdValue)}</div>
                </div>
                <div className="bg-cyan-950/20 border border-cyan-900/30 p-3">
                    <div className="text-[10px] text-cyan-800 mb-1">LABOR EQUIVALENT</div>
                    <div className="text-xl text-red-500 font-tech">{Math.floor(stats.hours)} HRS</div>
                </div>
                <div className="bg-cyan-950/20 border border-cyan-900/30 p-3">
                    <div className="text-[10px] text-cyan-800 mb-1">RATIONS (BIG MACS)</div>
                    <div className="text-xl text-orange-500 font-tech">{Math.floor(stats.bigMacs)}</div>
                </div>
                <div className="bg-cyan-950/20 border border-cyan-900/30 p-3">
                    <div className="text-[10px] text-cyan-800 mb-1">FRIGATES (LAMBOS)</div>
                    <div className="text-xl text-purple-500 font-tech">{stats.lambos.toFixed(4)}</div>
                </div>
            </div>

            <div className="border-t border-cyan-900/30 pt-4">
                <div className="text-xs text-cyan-800 mb-2 tracking-widest">RANK ASSIGNMENT:</div>
                <div className="text-3xl font-meme text-cyan-400 animate-pulse">{stats.status}</div>
            </div>
        </div>
    );
};

export const McDonaldsTab: React.FC = () => (
    <div className="bg-black/40 border border-cyan-900/30 p-6 text-center font-mono">
        <div className="mb-4 text-6xl opacity-50 grayscale hover:grayscale-0 transition-all">
            🍔
        </div>
        <h2 className="font-tech text-xl text-cyan-400 mb-1">GALLEY REASSIGNMENT FORM</h2>
        <p className="text-slate-600 mb-6 text-xs">"For those who abandon the hunt."</p>
        
        <form className="max-w-[400px] mx-auto text-left space-y-4 bg-cyan-950/10 p-6 border border-cyan-900/30" onSubmit={e => {e.preventDefault(); alert("Reassignment denied. You are here forever.");}}>
            <div>
                <label className="block text-[10px] text-cyan-700 mb-1">CREWMAN NAME</label>
                <input type="text" className="w-full bg-black border border-cyan-900/50 p-2 text-cyan-400 outline-none focus:border-cyan-600" placeholder="Wojak Smith" />
            </div>
            <div>
                <label className="block text-[10px] text-cyan-700 mb-1">REASON FOR COWARDICE</label>
                <input type="text" className="w-full bg-black border border-cyan-900/50 p-2 text-cyan-400 outline-none focus:border-cyan-600" placeholder="Scared of red candles" />
            </div>
            <div className="flex gap-4">
                <div className="w-1/2">
                    <label className="block text-[10px] text-cyan-700 mb-1">POTATO PEELING EXP?</label>
                    <select className="w-full bg-black border border-cyan-900/50 p-2 text-cyan-400 outline-none"><option>Yes</option><option>I can learn</option><option>No skills</option></select>
                </div>
                <div className="w-1/2">
                    <label className="block text-[10px] text-cyan-700 mb-1">CONTRACT DURATION</label>
                    <input type="text" className="w-full bg-black border border-cyan-900/50 p-2 text-red-500 text-center cursor-not-allowed" value="ETERNAL" readOnly />
                </div>
            </div>
            <button type="submit" className="w-full bg-red-900/20 text-red-500 font-bold py-3 mt-4 hover:bg-red-900/40 border border-red-900/50 transition-colors font-tech tracking-widest">
                SUBMIT RESIGNATION
            </button>
        </form>
    </div>
);

export const AstrologyTab: React.FC = () => (
    <div className="bg-[#050510] border border-cyan-900/30 p-6 text-center relative overflow-hidden">
        {/* Star Field Background */}
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />
        
        <div className="relative z-10">
            <div className="flex justify-center mb-6">
                <Star size={48} className="text-yellow-100/50 animate-pulse" />
            </div>
            <h3 className="text-xl font-tech text-cyan-200 mb-4 tracking-[0.3em] border-b border-cyan-900/30 pb-4 inline-block">CELESTIAL NAVIGATION</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-6 max-w-lg mx-auto">
                <div className="bg-cyan-950/30 p-4 border border-cyan-800">
                    <div className="text-[10px] text-cyan-500 mb-1">LUNAR PHASE</div>
                    <div className="font-bold text-white text-lg font-tech">WAXING GIBBOUS</div>
                    <div className="text-[10px] italic text-cyan-600 mt-2">"Tides favorable for pumps"</div>
                </div>
                <div className="bg-cyan-950/30 p-4 border border-cyan-800">
                    <div className="text-[10px] text-cyan-500 mb-1">MERCURY STATUS</div>
                    <div className="font-bold text-red-400 text-lg font-tech">RETROGRADE</div>
                    <div className="text-[10px] italic text-cyan-600 mt-2">"Comms may be disrupted"</div>
                </div>
            </div>
            
            <div className="p-4 border-t border-cyan-900/30 italic text-cyan-400/60 font-serif max-w-xl mx-auto">
                "The constellation of the Bull rises in the East. However, Saturn casts a shadow over the leveraged traders. Hold fast to the spot bags."
            </div>
        </div>
    </div>
);
