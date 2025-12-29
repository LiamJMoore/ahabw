
import React from 'react';
import { Phone, X, Radio, AlertCircle } from 'lucide-react';

interface OverlaysProps {
    bogIncoming: boolean;
    setBogIncoming: (val: boolean) => void;
    answerBog: () => void;
    bogAction: "dump" | "pump" | null;
    panicMode: boolean;
    sandwichAlert: string | null;
}

export const AnalyticsOverlays: React.FC<OverlaysProps> = ({ 
    bogIncoming, setBogIncoming, answerBog, bogAction, panicMode, sandwichAlert 
}) => {
    
    const victimAddress = (addr: string) => addr || "Unknown";

    return (
        <>
            {/* Bogdanoff Call */}
            {bogIncoming && (
                <div className="absolute top-10 right-4 z-[60] w-64 bg-black border-2 border-red-900 shadow-[0_0_20px_red] rounded overflow-hidden animate-bounce">
                    <div className="bg-red-900/50 text-red-500 p-2 text-center font-bold animate-pulse flex justify-between items-center border-b border-red-800">
                        <span className="font-tech tracking-widest">SIGNAL DETECTED</span>
                        <Radio size={16} className="animate-ping"/>
                    </div>
                    <div className="p-4 bg-black flex flex-col items-center">
                        <div className="text-[50px] filter grayscale contrast-200">🗿</div>
                        <div className="text-red-600 font-mono mb-4 text-center text-xs">UNKNOWN CALLER<br/><span className="text-[9px] text-red-800">SOURCE: [REDACTED]</span></div>
                        <div className="flex gap-4">
                            <button onClick={answerBog} className="bg-green-900/20 border border-green-600 hover:bg-green-900/50 text-green-500 p-2 rounded w-12 h-12 flex items-center justify-center">
                                <Phone size={24}/>
                            </button>
                            <button onClick={() => setBogIncoming(false)} className="bg-red-900/20 border border-red-600 hover:bg-red-900/50 text-red-500 p-2 rounded w-12 h-12 flex items-center justify-center">
                                <X size={24}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bogdanoff Action Fullscreen */}
            {bogAction && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 pointer-events-none">
                    <div className="text-center animate-ping border-4 border-current p-8 rounded-xl">
                        <div className="text-[100px] mb-4">🗿</div>
                        <h1 className={`text-6xl font-bold font-tech tracking-widest ${bogAction === 'dump' ? 'text-red-500' : 'text-green-500'}`}>
                            {bogAction === 'dump' ? 'DUMP IT.' : 'PUMP IT.'}
                        </h1>
                    </div>
                </div>
            )}

            {/* Panic Overlay */}
            {panicMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/50 backdrop-blur-sm pointer-events-none">
                    <div className="text-center animate-ping border-[10px] border-red-600 p-12 bg-black">
                        <div className="text-[100px]">📉</div>
                        <h1 className="text-8xl font-black text-red-600 font-meme border-4 border-red-600 p-4 mb-4">ABANDON SHIP</h1>
                        <p className="text-red-500 text-2xl font-tech tracking-[0.5em] animate-pulse">PAPER HANDS DETECTED</p>
                    </div>
                </div>
            )}

            {/* Sandwich Alert */}
            {sandwichAlert && (
                <div className="absolute top-24 left-0 right-0 z-50 flex justify-center pointer-events-none">
                    <div className="bg-black/80 border border-yellow-500 text-yellow-500 px-6 py-3 font-tech shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center gap-4 animate-bounce">
                        <AlertCircle size={24} className="animate-spin-slow" />
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-yellow-700">MEV BOT INTERCEPT</div>
                            <div className="text-sm">Sandwich Attack on {victimAddress(sandwichAlert)}!</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
