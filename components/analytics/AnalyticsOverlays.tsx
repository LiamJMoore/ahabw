
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface OverlaysProps {
    panicMode: boolean;
    sandwichAlert: string | null;
}

export const AnalyticsOverlays: React.FC<OverlaysProps> = ({ 
    panicMode, sandwichAlert 
}) => {
    
    const victimAddress = (addr: string) => addr || "Unknown";

    return (
        <>
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
