
import React, { useState, useRef, useEffect } from 'react';
import { SectionId } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Edit, Image as ImageIcon, RefreshCcw, Type } from 'lucide-react';

const MEME_URLS = [
    "https://i.ibb.co/VW0dKSZj/1.jpg",
    "https://i.ibb.co/pjRdP1nX/2006145531945353658-0.jpg",
    "https://i.ibb.co/kVcnJgwS/2006168352809796018-0.jpg",
    "https://i.ibb.co/9kq0J9h6/2006237698693161402-0.jpg",
    "https://i.ibb.co/m5yL4gqk/2006243524589900210-0.jpg",
    "https://i.ibb.co/B2d3nCbb/2006531570795176425-0.jpg",
    "https://i.ibb.co/dwp2vy9y/2006864002987733185-0.jpg",
    "https://i.ibb.co/bMMMMQV0/2007158833261752704-0.jpg",
    "https://i.ibb.co/TxjsCvBd/2007176350332080590-0.jpg",
    "https://i.ibb.co/kVXwsYKN/2007185845745529128-0.jpg",
    "https://i.ibb.co/Zz2bjQRg/2007329118669680865-0.jpg",
    "https://i.ibb.co/xVrxN4Y/2007339430055686603-0.png",
    "https://i.ibb.co/nsSDnwXB/2007475172333240680-0.jpg",
    "https://i.ibb.co/LD8wr5J6/2007961765251104937-0.jpg",
    "https://i.ibb.co/sJFxk3vx/2007969028950925536-0.jpg",
    "https://i.ibb.co/XfsF3SSv/2007993907775418832-0.jpg",
    "https://i.ibb.co/Hf2KW6S7/2008087147568631908-0.jpg",
    "https://i.ibb.co/Q72RJqPC/2008191666809946579-0.png",
    "https://i.ibb.co/TD8ZKX3G/2008218792103706897-0.jpg",
    "https://i.ibb.co/5xcYgbh5/G9fh-JRa4-AA4-E0u.jpg",
    "https://i.ibb.co/m5HFzf4Q/G9i-UWERa-MAM0uc-W.jpg",
    "https://i.ibb.co/S7sShz5w/G9r00-MOag-AAw-LGd.jpg",
    "https://i.ibb.co/sJWvfWrT/G9rs-NZXas-AA44v.jpg",
    "https://i.ibb.co/1GQ08Mp0/G9s-JNE4as-AQC0-AV.jpg",
    "https://i.ibb.co/whvhPPkd/G9v-g-Xuas-AAJ1-BF.jpg",
    "https://i.ibb.co/V1yDbW6/G9w-V73f-W8-AEC-ZJ.png",
    "https://i.ibb.co/qYVzj92M/G9x-Vd-Was-AIMza-T.jpg",
    "https://i.ibb.co/p6BdYwZF/G90a-J6-Hbw-AAnhb-O.jpg",
    "https://i.ibb.co/MxSfsgzW/G90-G2st-Xk-AAZx-Bd.jpg",
    "https://i.ibb.co/6cKTVqwP/G94-OFk5-W0-AA-z2.jpg",
    "https://i.ibb.co/Q3p0TszC/G94r-Czz-Xk-AAUclj.jpg",
    "https://i.ibb.co/DH7s7SG0/G94-TGyea-UAAVwg-V.jpg",
    "https://i.ibb.co/j9BfscCm/G95-Ike7a-IAEMFiq.jpg",
    "https://i.ibb.co/Cs2RwjrF/G95iv-RYXg-AAEMa-K.jpg",
    "https://i.ibb.co/FLbN7wYs/G95s-G4a-Wc-AA-Z3-S.jpg",
    "https://i.ibb.co/206L7P4m/G96cdb-DXEAAne-JZ.jpg",
    "https://i.ibb.co/DfYVdsqG/G96f-Bt-VXw-AM77-Hv.jpg",
    "https://i.ibb.co/84sfw5gY/G96f-BUkbc-AAe-GLh.jpg",
    "https://i.ibb.co/8gLkkSzB/G96k3-M4-Xw-AEz-Jh2.jpg",
    "https://i.ibb.co/ccf7hJXt/G96-Qh-ACa-MAA-SBK.jpg",
    "https://i.ibb.co/BHcrT3HN/G96qy-B3-Wo-AAj-Ut-R.jpg"
];

export const MemeGallery: React.FC = () => {
    const [view, setView] = useState<'GALLERY' | 'FACTORY'>('GALLERY');
    const [selectedTemplate, setSelectedTemplate] = useState<string>(MEME_URLS[0]);
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [fontSize, setFontSize] = useState(40);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Canvas Rendering Logic
    useEffect(() => {
        if (view === 'FACTORY' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = selectedTemplate;
            
            img.onload = () => {
                // Resize logic to fit canvas while maintaining aspect ratio
                const maxWidth = 800;
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;

                if (ctx) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Text Styles
                    ctx.font = `900 ${fontSize}px Impact`;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = fontSize / 15;
                    ctx.textAlign = 'center';

                    // Top Text
                    if (topText) {
                        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, fontSize + 20);
                        ctx.fillText(topText.toUpperCase(), canvas.width / 2, fontSize + 20);
                    }

                    // Bottom Text
                    if (bottomText) {
                        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
                        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
                    }

                    // Watermark
                    ctx.font = '20px monospace';
                    ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'; // Cyan
                    ctx.textAlign = 'right';
                    ctx.fillText('$AHAB', canvas.width - 20, canvas.height - 10);
                }
            };
        }
    }, [selectedTemplate, topText, bottomText, fontSize, view]);

    const handleDownload = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `ahab-meme-${Date.now()}.png`;
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    return (
        <section id={SectionId.MEMES} className="py-24 bg-[#0a0a0a] relative border-t border-slate-900">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="font-meme text-5xl text-white tracking-widest">
                            PROPAGANDA <span className="text-cyan-500">FACTORY</span>
                        </h2>
                        <p className="font-mono text-slate-400 mt-2 tracking-wider">
                            WEAPONIZED AUTISM // SPREAD THE MESSAGE
                        </p>
                    </div>
                    
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <button 
                            onClick={() => setView('GALLERY')}
                            className={`px-6 py-2 rounded-lg font-tech border transition-all flex items-center gap-2 ${view === 'GALLERY' ? 'bg-cyan-900/50 border-cyan-400 text-white' : 'bg-transparent border-slate-700 text-slate-500 hover:text-white'}`}
                        >
                            <ImageIcon size={16} /> GALLERY
                        </button>
                        <button 
                            onClick={() => setView('FACTORY')}
                            className={`px-6 py-2 rounded-lg font-tech border transition-all flex items-center gap-2 ${view === 'FACTORY' ? 'bg-cyan-900/50 border-cyan-400 text-white' : 'bg-transparent border-slate-700 text-slate-500 hover:text-white'}`}
                        >
                            <Edit size={16} /> MEME MAKER
                        </button>
                    </div>
                </div>

                {view === 'GALLERY' ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        <AnimatePresence>
                            {MEME_URLS.map((url, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="break-inside-avoid relative group rounded-xl overflow-hidden border-2 border-slate-800 hover:border-cyan-500 transition-colors"
                                >
                                    <img 
                                        src={url} 
                                        alt={`Meme ${i}`} 
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                        <button 
                                            onClick={() => { setSelectedTemplate(url); setView('FACTORY'); window.scrollTo({top: document.getElementById(SectionId.MEMES)?.offsetTop, behavior: 'smooth'}); }}
                                            className="bg-cyan-500 text-black px-4 py-2 rounded font-bold font-tech hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Edit size={14} /> REMIX
                                        </button>
                                        <a 
                                            href={url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="bg-white text-black px-4 py-2 rounded font-bold font-tech hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Download size={14} /> SAVE
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* EDITOR CONTROLS */}
                        <div className="lg:col-span-1 space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <div>
                                <h3 className="text-cyan-400 font-tech mb-4 flex items-center gap-2"><Type size={18}/> TEXT CONTROLS</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 font-mono">TOP TEXT</label>
                                        <input 
                                            type="text" 
                                            value={topText}
                                            onChange={(e) => setTopText(e.target.value)}
                                            className="w-full bg-black border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none font-bold"
                                            placeholder="POV: YOU SOLD"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-mono">BOTTOM TEXT</label>
                                        <input 
                                            type="text" 
                                            value={bottomText}
                                            onChange={(e) => setBottomText(e.target.value)}
                                            className="w-full bg-black border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none font-bold"
                                            placeholder="AT THE BOTTOM"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-mono mb-2 block">FONT SIZE</label>
                                        <input 
                                            type="range" 
                                            min="20" 
                                            max="100" 
                                            value={fontSize}
                                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                                            className="w-full accent-cyan-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <h3 className="text-cyan-400 font-tech mb-4 flex items-center gap-2"><ImageIcon size={18}/> TEMPLATES</h3>
                                <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
                                    {MEME_URLS.map((url, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setSelectedTemplate(url)}
                                            className={`border-2 rounded overflow-hidden aspect-square relative ${selectedTemplate === url ? 'border-cyan-500' : 'border-slate-800 hover:border-slate-500'}`}
                                        >
                                            <img src={url} className="w-full h-full object-cover" loading="lazy" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => { setTopText(''); setBottomText(''); }}
                                    className="flex-1 bg-slate-800 text-slate-300 py-3 rounded font-bold hover:bg-slate-700 flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw size={18}/> RESET
                                </button>
                                <button 
                                    onClick={handleDownload}
                                    className="flex-1 bg-cyan-600 text-black py-3 rounded font-bold hover:bg-cyan-500 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                >
                                    <Download size={18}/> DOWNLOAD
                                </button>
                            </div>
                        </div>

                        {/* PREVIEW */}
                        <div className="lg:col-span-2 bg-[#050505] rounded-xl border border-slate-800 flex items-center justify-center p-4 min-h-[500px]">
                            <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl" />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
