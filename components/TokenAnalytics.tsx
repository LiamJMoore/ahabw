
import React, { useState, useEffect, useRef } from 'react';
import { formatCompactNumber, formatCurrency, truncateAddress } from '../utils';
import { Trophy, Eye, Radio, Calculator, Anchor, Star, Crosshair, Siren, Terminal, Zap, ShieldAlert, BadgeCheck, Gauge, Flame, TrendingDown, TrendingUp, PieChart, Rocket, Search, Wifi } from 'lucide-react';
import { TokenMetrics } from '../types';
import { HoldersTab, WhaleWatchTab, MemoWallTab } from './analytics/DashboardTabs';
import { CalculatorTab, McDonaldsTab, AstrologyTab } from './analytics/UtilityTabs';
import { AnalyticsOverlays } from './analytics/AnalyticsOverlays';
import { WalletInspector } from './analytics/WalletInspector';
import { fetchTokenMarketData } from '../services/dexScreenerService';
import { Holder, WhaleTx, Memo, WalletProfile, TokenSecurity, NetworkStats, Sentiment, Tab } from './analytics/AnalyticsTypes';

const HELIUS_API_KEY = "f7d6a830-5ce4-436e-bd8d-73f75b0f0c52";
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const HELIUS_API_BASE = "https://api.helius.xyz/v0";

interface TokenAnalyticsProps {
  ca: string;
  initialMetrics?: TokenMetrics | null;
}

// Helper to generate realistic looking base58 strings
const randomStr = (len: number) => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    return Array(len).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({ ca, initialMetrics }) => {
  const [activeTab, setActiveTab] = useState<Tab>('holders');
  const [holders, setHolders] = useState<Holder[]>([]);
  const [whales, setWhales] = useState<WhaleTx[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]); 
  const [loadingHolders, setLoadingHolders] = useState(false);
  const [loadingMemos, setLoadingMemos] = useState(false);
  const [loadingWhales, setLoadingWhales] = useState(false);
  
  // Real-time Metrics State (Initialized with props or defaults)
  const [liveMetrics, setLiveMetrics] = useState<TokenMetrics>(initialMetrics || { price: 0, marketCap: 0, supply: 1000000000, ath: 0 });

  // Feature: Wojak Index (Sentiment)
  const [sentiment, setSentiment] = useState<Sentiment>({ buyVol: 0, sellVol: 0, ratio: 50 });

  // Feature 1: Wallet Inspector State
  const [inspectedProfile, setInspectedProfile] = useState<WalletProfile | null>(null);
  const [inspecting, setInspecting] = useState(false);

  // Feature 2: Jeet Hunter State (Latest Sells)
  const [jeets, setJeets] = useState<WhaleTx[]>([]);

  // Feature 3: Sandwich Alert State
  const [sandwichAlert, setSandwichAlert] = useState<string | null>(null);

  // Feature: Raid / Roll
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [rollMessage, setRollMessage] = useState<string>("");

  // Feature: Calculator
  const [calcAmount, setCalcAmount] = useState<string>("1000000");

  // Feature: Bogdanoff Protocol
  const [bogIncoming, setBogIncoming] = useState(false);
  const [bogAction, setBogAction] = useState<"dump" | "pump" | null>(null);

  // Feature: Panic Button
  const [panicMode, setPanicMode] = useState(false);

  // Feature: Truth Nuke
  const [currentHeadline, setCurrentHeadline] = useState("");

  // Security & Network
  const [security, setSecurity] = useState<TokenSecurity | null>(null);
  const [network, setNetwork] = useState<NetworkStats>({ tps: 0, priorityFee: "LOADING..." });
  
  // --- Data Fetching: DexScreener (Real World Price/Mcap) ---
  useEffect(() => {
      const fetchMarket = async () => {
          const marketData = await fetchTokenMarketData(ca);
          if (marketData) {
              setLiveMetrics(prev => ({
                  ...prev,
                  price: marketData.price,
                  marketCap: marketData.marketCap,
              }));
          }
      };
      
      fetchMarket();
      const interval = setInterval(fetchMarket, 30000); // Update every 30s
      return () => clearInterval(interval);
  }, [ca]);

  // --- Initial Metadata & Network Checks (Helius) ---
  useEffect(() => {
    const checkSecurityAndNetwork = async () => {
        try {
            // 1. Rug Radar: Check CA Asset Metadata
            const assetRes = await fetch(HELIUS_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 'security-check',
                    method: 'getAsset',
                    params: { id: ca }
                })
            });
            const assetData = await assetRes.json();
            const info = assetData.result;
            if (info) {
                setSecurity({
                    mutable: info.mutable,
                    mintAuthority: !!info.authorities?.some((a: any) => a.scopes.includes('mint')),
                    freezeAuthority: !!info.authorities?.some((a: any) => a.scopes.includes('freeze')),
                    supply: info.token_info?.supply || 0
                });
                // Update supply in metrics if valid
                if (info.token_info?.supply) {
                    setLiveMetrics(prev => ({ ...prev, supply: info.token_info.supply / Math.pow(10, info.token_info.decimals) }));
                }
            }

            // 2. Meme Velocity (TPS)
            const perfRes = await fetch(HELIUS_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 'tps',
                    method: 'getRecentPerformanceSamples',
                    params: [1]
                })
            });
            const perfData = await perfRes.json();
            const sample = perfData.result?.[0];
            const tps = sample ? Math.round(sample.numTransactions / sample.samplePeriodSecs) : 2500;

            // 3. Wojak's Gas Station (Priority Fees)
            const feeRes = await fetch(HELIUS_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 'fees',
                    method: 'getPriorityFeeEstimate',
                    params: [{
                        accountKeys: ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"], // Check against Jupiter hot wallet
                        options: { includeAllPriorityFeeLevels: true }
                    }]
                })
            });
            const feeData = await feeRes.json();
            const highFee = feeData.result?.priorityFeeLevels?.high || 10000;
            const feeInSOL = (highFee / 1000000000).toFixed(6);

            setNetwork({
                tps,
                priorityFee: `${feeInSOL} SOL`
            });

        } catch (e) {
            console.error("Failed to load Helius metadata", e);
        }
    };
    
    checkSecurityAndNetwork();
  }, [ca]);


  // Feature 1, 6, 8, PFP: Real Wallet Inspector Logic
  const handleInspect = async (address: string) => {
    setInspecting(true);
    setInspectedProfile(null);
    try {
        const assetsPromise = fetch(HELIUS_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 'inspect-assets', method: 'getAssetsByOwner', params: { ownerAddress: address, page: 1, limit: 50, displayOptions: { showFungible: true, showNativeBalance: true } } })
        });
        // Use Enhanced Transactions API for history
        const historyPromise = fetch(`${HELIUS_API_BASE}/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}`);
        
        const [assetsRes, historyRes] = await Promise.all([assetsPromise, historyPromise]);
        const assetsData = await assetsRes.json();
        const historyData = await historyRes.json();

        const items = assetsData.result?.items || [];
        const nativeBalance = assetsData.result?.nativeBalance?.lamports || 0;
        const solBalance = nativeBalance / 1000000000;
        let tokenCount = 0;
        let otherTokens: string[] = [];
        let nftPfp = undefined;

        items.forEach((item: any) => {
            if (item.interface === "FungibleToken" || item.interface === "FungibleAsset") {
                tokenCount++;
                const symbol = item.content?.metadata?.symbol || "UNK";
                if (symbol !== "UNK" && symbol !== "$4CHAN" && otherTokens.length < 3) otherTokens.push(`$${symbol}`);
            }
            if (!nftPfp && (item.interface === "ProgrammableNFT" || item.grouping?.length > 0)) {
                 if (item.content?.links?.image) nftPfp = item.content.links.image;
            }
        });

        const txs = Array.isArray(historyData) ? historyData : [];
        const txCount = txs.length;
        let botProb = "Low";
        if (txCount > 50) botProb = "High (Sniper)";
        else if (txCount > 20) botProb = "Medium";

        let walletAge = "Unknown";
        if (txs.length > 0) {
            const lastTxTime = txs[txs.length - 1].timestamp;
            const hoursOld = (Date.now() - (lastTxTime * 1000)) / (1000 * 60 * 60);
            if (hoursOld < 24 && txs.length < 100) walletAge = "FRESH MEAT (<24h)";
            else walletAge = "Seasoned";
        }

        let grade = "C";
        let archetype = "Normie";
        if (botProb.startsWith("High")) { grade = "F-"; archetype = "MEV Bot / Sniper"; }
        else if (solBalance < 0.05 && tokenCount === 0) { grade = "F"; archetype = "NPC / Dust Wallet"; }
        else if (solBalance > 50) { grade = "S+"; archetype = "Giga Chad Whale"; }
        else if (tokenCount > 20) { grade = "D"; archetype = "Memecoin Gambler"; }
        else if (solBalance > 5 && tokenCount < 5) { grade = "A"; archetype = "Smart Money"; }

        setInspectedProfile({ address, solBalance, tokenCount, grade, archetype, topOtherTokens: otherTokens, isWhale: solBalance > 100, botProbability: botProb, walletAge, nftPfp });
    } catch (e) {
        console.error("Inspection failed", e);
        setInspectedProfile({ address, solBalance: Math.random() * 10, tokenCount: Math.floor(Math.random() * 10), grade: "C-", archetype: "Anon (API Limit)", topOtherTokens: ["$WIF", "$BONK"], isWhale: false, botProbability: "Unknown", walletAge: "Unknown" });
    } finally {
        setInspecting(false);
    }
  };

  const fetchMemos = async () => {
      setLoadingMemos(true);
      try {
          setMemos(generateFakeMemos());
      } finally { setLoadingMemos(false); }
  };

  const generateFakeMemos = (): Memo[] => {
      const phrases = ["dev is based", "top signal?", "wen binance", "holding since 4k mcap", "just aped 50 sol", "jeet checks out", "pump it pajeet", "looks rare"];
      return Array(10).fill(0).map((_, i) => ({ 
          signature: randomStr(88), // Realistic sig length
          message: phrases[Math.floor(Math.random() * phrases.length)], 
          sender: randomStr(44), // Realistic addr length
          time: new Date().toLocaleTimeString() 
      }));
  };

  // --- UPDATED: Use Helius Enhanced Transactions API ---
  const fetchRealActivity = async () => {
     setLoadingWhales(true);
     try {
        // Using Enhanced Transactions API (Address Parsed)
        const response = await fetch(`${HELIUS_API_BASE}/addresses/${ca}/transactions?api-key=${HELIUS_API_KEY}`);
        const data = await response.json();

        if (Array.isArray(data)) {
            const realTxs: WhaleTx[] = [];
            let buys = 0, sells = 0;

            data.slice(0, 30).forEach((tx: any) => {
                const isSwap = tx.type === 'SWAP';
                let type: 'buy' | 'sell' | 'burn' = 'buy';
                let amount = 0;
                
                // Logic to determine Buy vs Sell from Helius Parsed Data
                if (isSwap) {
                    const tokenTransfer = tx.tokenTransfers.find((t: any) => t.mint === ca);
                    const nativeTransfer = tx.nativeTransfers.find((t: any) => t.amount > 0);
                    
                    if (tokenTransfer) {
                        amount = tokenTransfer.tokenAmount;
                        // If token was sent FROM user (User -> Pool), it's a SELL
                        if (tokenTransfer.fromUserAccount === tx.feePayer) {
                            type = 'sell';
                        } else {
                            type = 'buy';
                        }
                    } else {
                        // Fallback logic if parsing fails
                        type = Math.random() > 0.5 ? 'buy' : 'sell';
                    }
                } else if (tx.type === 'BURN') {
                    type = 'burn';
                    const burnTransfer = tx.tokenTransfers.find((t: any) => t.mint === ca);
                    amount = burnTransfer ? burnTransfer.tokenAmount : 0;
                } else {
                    // Generic Transfer
                    const transfer = tx.tokenTransfers.find((t: any) => t.mint === ca);
                    if (transfer) {
                        amount = transfer.tokenAmount;
                        type = Math.random() > 0.5 ? 'buy' : 'sell';
                    }
                }

                if (amount > 0) {
                     const val = amount * liveMetrics.price;
                     if (type === 'buy') buys += val; if (type === 'sell') sells += val;
                     
                     // Enhance label based on Helius "source" if available
                     let label = undefined;
                     if (tx.source === 'RAYDIUM') label = 'Raydium';
                     else if (tx.source === 'JUPITER') label = 'Jupiter';
                     else if (val > 2000) label = Math.random() > 0.9 ? "Binance Hot Wallet" : undefined;

                     realTxs.push({ 
                         id: tx.signature, 
                         hash: tx.signature, 
                         type, 
                         amount, 
                         value: val, 
                         time: new Date(tx.timestamp * 1000).toLocaleTimeString(), 
                         maker: tx.feePayer || 'Unknown', 
                         label 
                     });
                }
            });

            setWhales(realTxs);
            const total = buys + sells;
            setSentiment({ buyVol: buys, sellVol: sells, ratio: total > 0 ? (buys / total) * 100 : 50 });
        }
     } catch (e) {
         console.error("Helius Enhanced API failed, using simulation", e);
         const simTxs: WhaleTx[] = [];
         for(let i=0; i<15; i++) simTxs.push(createRandomWhaleTx(liveMetrics.price, i * 15000));
         setWhales(simTxs);
     } finally { setLoadingWhales(false); }
  };

  const getHeldSince = (rank: number, seedStr: string): { date: string, isOldfag: boolean, daysHeld: number } => {
      // Logic for holding duration
      let daysHeld = 0;
      if (rank <= 5) {
          daysHeld = 45; // Dev/Early
      } else {
          // Generate realistic day counts between 1 and 40
          daysHeld = (seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 40) + 1;
      }

      const date = new Date(); 
      date.setDate(date.getDate() - daysHeld);
      const mm = String(date.getMonth() + 1).padStart(2, '0'); 
      const dd = String(date.getDate()).padStart(2, '0');
      
      return { 
          date: `${mm}/${dd}`, 
          isOldfag: daysHeld > 14,
          daysHeld
      };
  };

  const fetchRealHolders = async () => {
    setLoadingHolders(true);
    try {
        const response = await fetch(HELIUS_RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 'holders', method: 'getTokenLargestAccounts', params: [ca] }) });
        const data = await response.json();
        const accounts = data.result?.value || [];
        if (accounts.length > 0) {
            const realHolders: Holder[] = accounts.map((acc: any, index: number) => {
                const amount = acc.uiAmount;
                const pct = (amount / liveMetrics.supply) * 100;
                let tag = undefined;
                if (index === 0 && pct > 10) tag = "Raydium/LP?"; if (index === 1 && pct > 4) tag = "Dev/Team?";
                
                const { date, isOldfag, daysHeld } = getHeldSince(index + 1, acc.address);
                
                // Simulate "Has Sold" logic based on address hash (deterministic for consistency)
                // MODIFIED: Ensure top 5 wallets (Indices 0-4) are never marked as Sold
                const hasSold = index > 4 && (acc.address.charCodeAt(0) % 3 === 0); 
                const diamondHands = !hasSold && daysHeld > 7;

                return { 
                    rank: index + 1, 
                    address: acc.address, 
                    amount: amount, 
                    percentage: parseFloat(pct.toFixed(2)), 
                    value: amount * liveMetrics.price, 
                    tag: tag, 
                    heldSince: date, 
                    isOldfag,
                    daysHeld,
                    hasSold,
                    diamondHands
                };
            });
            setHolders(realHolders);
        } else setHolders(generateLiveHolders());
    } catch (e) { setHolders(generateLiveHolders()); } finally { setLoadingHolders(false); }
  };

  // UPDATED FALLBACK DATA MATCHING SCREENSHOT BUT WITH FULL ADDRESSES FOR LINKS
  const generateLiveHolders = () => {
    // We use full length placeholder addresses so Solscan links work (even if they 404, the format is valid and address bar is correct)
    const fallbackData = [
        { addr: "Cfq3R2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0bgZt", pct: 36.54, tag: "Raydium Pool" },
        { addr: "8Uh2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0TogC", pct: 8.00, tag: "Team Vesting" },
        { addr: "G8C2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0kqjm", pct: 5.75, tag: "Strategic Reserve" },
        { addr: "9pk2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0cXzv", pct: 3.50, tag: "Whale #1" },
        { addr: "9Wz2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0AWWM", pct: 3.20, tag: "Whale #2" },
        { addr: "85W2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v05ERS", pct: 3.00, tag: "Exchange Wallet?" },
        { addr: "BBv2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0vCfT", pct: 2.50, tag: undefined },
        { addr: "GTe2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v03MhB", pct: 2.50, tag: undefined },
        { addr: "Avq2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0TdT6", pct: 2.40, tag: undefined },
        { addr: "96H2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0VWM9", pct: 2.30, tag: undefined },
        { addr: "9Uc2bWq3e5h7Y8j9k1m2n3p4q5r6s7t8u9v0C2dN", pct: 2.00, tag: undefined }
    ];

    const holders: Holder[] = fallbackData.map((d, i) => {
        const amount = liveMetrics.supply * (d.pct / 100);
        const daysHeld = i < 3 ? 45 : Math.floor(Math.random() * 40) + 1;
        // Top 3 never sell. Others have 30% chance of being sellers.
        const hasSold = i > 3 && Math.random() > 0.7;
        const diamondHands = !hasSold && daysHeld > 7;

        return {
            rank: i + 1,
            address: d.addr, 
            amount: amount,
            percentage: d.pct,
            value: amount * liveMetrics.price,
            tag: d.tag,
            heldSince: i < 3 ? "Inception" : "Early Access",
            isOldfag: daysHeld > 14,
            daysHeld,
            hasSold,
            diamondHands
        };
    });

    return holders;
  };

  const createRandomWhaleTx = (price: number, timeOffsetMs = 0): WhaleTx => {
     const isBuy = Math.random() > 0.45;
     const baseAmount = Math.floor(Math.random() * 500000) + 50000;
     const val = baseAmount * price;
     let label: string | undefined = undefined;
     if (val > 5000 && !isBuy) { if (Math.random() > 0.7) label = "Binance Hot Wallet 2"; else if (Math.random() > 0.8) label = "Coinbase"; }
     
     // Generate realistic length ID/Hash/Maker
     const txId = randomStr(88);
     const maker = randomStr(44);

     const tx: WhaleTx = { 
         id: Math.random().toString(36), 
         hash: txId, 
         type: isBuy ? 'buy' : 'sell', 
         amount: baseAmount, 
         value: val, 
         time: timeOffsetMs === 0 ? 'Just now' : `${Math.floor(timeOffsetMs/1000)}s ago`, 
         maker: `Whale${Math.floor(Math.random() * 99)}`, 
         label 
     };

     if (!isBuy && timeOffsetMs === 0) setJeets(prev => [tx, ...prev].slice(0, 5));
     return tx;
  };

  // Interaction Handlers
  const handleRoll = () => {
    const roll = Math.floor(Math.random() * 99999999);
    setRollResult(roll);
    const rollStr = roll.toString();
    const last2 = rollStr.slice(-2); const last3 = rollStr.slice(-3);
    if (last3[0] === last3[1] && last3[1] === last3[2]) setRollMessage("TRIPLES! CHECK 'EM! RAIDING NOW!");
    else if (last2[0] === last2[1]) setRollMessage("DOUBLES! GOOD ROLL.");
    else setRollMessage("Pathetic roll. Try again.");
  };

  const triggerBog = () => setBogIncoming(true);
  const answerBog = () => { setBogIncoming(false); const action = Math.random() > 0.5 ? "dump" : "pump"; setBogAction(action); setTimeout(() => setBogAction(null), 4000); };
  const handlePanic = () => { setPanicMode(true); setTimeout(() => setPanicMode(false), 2000); };
  const updateHeadline = () => {
      const headlines = [ "INSIDER SAYS: WE ARE SO BACK", "JUSTIN SUN IS WATCHING", "SEC CONFIRMS: MEMES ARE SECURITIES", "DEV SOLD? IMPOSSIBLE", "CHINESE NEW YEAR + WALL STREET BONUSES INCOMING", "DO KWON TWEETED", "VITALIK JUST BRIDGED", "GOD CANDLE LOADING... 99%" ];
      setCurrentHeadline(headlines[Math.floor(Math.random() * headlines.length)]);
  };

  useEffect(() => {
    // Initial fetch
    fetchRealHolders();
    fetchRealActivity();
    
    // Polling
    const interval = setInterval(() => { fetchRealActivity(); updateHeadline(); }, 10000);
    const sandwichInterval = setInterval(() => { if (Math.random() > 0.8) { const victim = `So1${Math.random().toString(36).substring(2,5)}...`; setSandwichAlert(victim); setTimeout(() => setSandwichAlert(null), 5000); } }, 10000);
    const bogInterval = setInterval(() => { if (Math.random() > 0.7) triggerBog(); }, 45000);
    
    return () => { clearInterval(interval); clearInterval(sandwichInterval); clearInterval(bogInterval); };
  }, [liveMetrics.price]); // Re-run when price updates to ensure values are calculated correctly

  const athPercent = liveMetrics.ath ? ((liveMetrics.price / liveMetrics.ath) * 100).toFixed(1) : "0";

  return (
    <div className="relative w-full max-w-[98%] 2xl:max-w-[1600px] mx-auto mt-8 mb-8 border-[6px] border-[#0f172a] bg-[#020617] font-tech text-green-500 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-xl">
      
      {/* CRT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 crt opacity-50 mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,rgba(0,0,0,0)_80%)] pointer-events-none z-10" />

      {/* Extracted Overlays */}
      <AnalyticsOverlays 
        bogIncoming={bogIncoming} 
        setBogIncoming={setBogIncoming} 
        answerBog={answerBog} 
        bogAction={bogAction} 
        panicMode={panicMode} 
        sandwichAlert={sandwichAlert} 
      />

      {/* Extracted Wallet Inspector */}
      <WalletInspector profile={inspectedProfile} onClose={() => setInspectedProfile(null)} />
      
      {/* Jeet Hunter Marquee */}
      {jeets.length > 0 && (
          <div className="bg-red-950/80 overflow-hidden whitespace-nowrap py-1 border-b border-red-900">
              <div className="animate-marquee inline-block">
                 {jeets.map((j, i) => (
                     <span key={j.id} className="text-red-500 text-xs font-mono mx-4 flex items-center gap-2">
                        <ShieldAlert size={12} className="animate-pulse"/> 
                        HULL BREACH DETECTED: {truncateAddress(j.maker)} DUMPED {formatCurrency(j.value)}
                        <span className="text-red-400 font-bold">MAN THE PUMPS!</span>
                     </span>
                 ))}
              </div>
          </div>
      )}

      {/* Truth Nuke Marquee */}
      <div className="bg-cyan-950/30 overflow-hidden whitespace-nowrap py-1 border-b border-cyan-900/50">
           <div className="animate-marquee inline-block">
               <span className="text-cyan-400/80 text-xs font-tech mx-8 tracking-[0.2em] flex items-center gap-2">
                   <Wifi size={12} className="animate-pulse"/> INCOMING TRANSMISSION: {currentHeadline}
               </span>
               <span className="text-cyan-400/80 text-xs font-tech mx-8 tracking-[0.2em] flex items-center gap-2">
                   <Wifi size={12} className="animate-pulse"/> INCOMING TRANSMISSION: {currentHeadline}
               </span>
           </div>
      </div>

      {/* Header Bar */}
      <div className="bg-[#0f172a] text-cyan-400 px-4 py-2 font-tech text-xs flex items-center justify-between border-b border-cyan-900/30">
         <div className="flex items-center gap-2">
            <Terminal size={14} className="text-cyan-500" /> 
            <span className="tracking-[0.2em]">NAVIGATIONAL DATA LINK // v4.3 (DEXSCREENER_LIVE)</span>
         </div>
         
         <div className="flex items-center gap-3">
             <button onClick={handleRoll} className="bg-black border border-cyan-700 hover:border-cyan-400 px-3 py-1 text-[10px] hover:bg-cyan-900/20 flex items-center gap-2 transition-colors group">
                <Crosshair size={12} className="group-hover:animate-spin"/> 
                {rollResult ? `TARGETING: ${rollResult}` : "ACQUIRE TARGET"}
             </button>
             {rollResult && <span className="text-[10px] font-mono text-cyan-300 animate-pulse">{rollMessage}</span>}
             <button onClick={handlePanic} className="bg-red-900/20 border border-red-800 hover:border-red-500 px-3 py-1 text-[10px] hover:bg-red-900/40 flex items-center gap-2 text-red-500 transition-colors animate-pulse" title="ABANDON SHIP">
                <Siren size={12}/> PANIC
             </button>
         </div>

         <div className="flex items-center gap-2 text-[10px] text-cyan-700">
            <Zap size={10} className="fill-current" />
            <span>HELIUS_LINK: ACTIVE</span>
         </div>
      </div>

      {/* Security & Network Bar */}
      <div className="bg-[#020617] border-b border-cyan-900/30 p-3 flex flex-col sm:flex-row gap-4 text-xs justify-between items-center text-cyan-600 font-mono">
        <div className="flex gap-6">
            <div className="flex items-center gap-2">
                <span className="text-cyan-800">CONTRACT_SECURITY:</span>
                {security ? (
                    <div className="flex gap-2">
                        {!security.mintAuthority ? <span className="text-green-500 flex items-center gap-1"><BadgeCheck size={12}/> REVOKED</span> : <span className="text-red-500 flex items-center gap-1"><ShieldAlert size={12}/> ACTIVE</span>}
                    </div>
                ) : <span className="animate-pulse">SCANNING...</span>}
            </div>
        </div>
        <div className="flex gap-6">
            <div className="flex items-center gap-2 border-r border-cyan-900/50 pr-6">
                <Gauge size={12} className="text-cyan-700"/>
                <span>VELOCITY:</span>
                <span className="text-cyan-400">{network.tps} TPS</span>
            </div>
            <div className="flex items-center gap-2">
                <Flame size={12} className="text-orange-900"/>
                <span>COAL_BURN:</span>
                <span className="text-orange-700">{network.priorityFee}</span>
            </div>
        </div>
      </div>
      
      {/* Wojak Index (Sentiment) Bar */}
      <div className="bg-[#050b14] p-2 border-b border-cyan-900/30 flex items-center justify-between text-[10px] font-tech">
          <div className="flex items-center gap-2 w-24">
             <TrendingDown size={12} className="text-red-700"/>
             <span className="text-red-900 tracking-widest">MUTINY</span>
          </div>
          <div className="flex-grow mx-4 h-2 bg-red-900/20 rounded-full overflow-hidden relative border border-slate-800">
             <div className="h-full bg-gradient-to-r from-red-900 via-yellow-900 to-green-900 transition-all duration-1000" style={{ width: '100%' }}>
                <div className="h-full bg-black/80 absolute right-0 transition-all duration-1000" style={{ width: `${100 - sentiment.ratio}%` }} />
             </div>
             <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-500 tracking-[0.3em]">MORALE INDEX</div>
          </div>
          <div className="flex items-center gap-2 w-24 justify-end">
             <span className="text-green-900 tracking-widest">LOYALTY</span>
             <TrendingUp size={12} className="text-green-700"/>
          </div>
      </div>

      {/* Distribution Bar */}
      <div className="bg-[#020617] p-2 border-b border-cyan-900/30 flex items-center justify-between text-[10px] font-tech">
          <div className="flex items-center gap-2 w-24">
             <PieChart size={12} className="text-blue-900"/>
             <span className="text-blue-900 tracking-widest">ALLOTMENT</span>
          </div>
          <div className="flex-grow mx-4 h-2 flex rounded-sm overflow-hidden border border-slate-800 opacity-70">
             <div className="h-full bg-yellow-900" style={{ width: '15%' }}></div>
             <div className="h-full bg-blue-900" style={{ width: '10%' }}></div>
             <div className="h-full bg-green-900" style={{ width: '25%' }}></div>
             <div className="h-full bg-slate-800 flex-grow"></div>
          </div>
          <div className="flex items-center gap-2 w-24 justify-end">
             <span className="text-slate-600 tracking-widest">STABLE</span>
          </div>
      </div>

      {/* ATH Indicator Bar */}
      <div className="bg-[#050b14] p-2 border-b border-cyan-900/30 flex items-center justify-between text-[10px] font-tech">
          <div className="flex items-center gap-2 w-24">
             <Anchor size={12} className="text-slate-600"/>
             <span className="text-slate-600 tracking-widest">DEPTH</span>
          </div>
          <div className="flex-grow mx-4 h-2 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
             <div className="h-full bg-cyan-600/50 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(8,145,178,0.5)]" style={{ width: `${Math.min(parseFloat(athPercent), 100)}%` }}></div>
             <div className="absolute inset-0 flex items-center justify-center text-[9px] text-cyan-200/50 tracking-[0.2em] gap-2"><span>SURFACE DISTANCE ({athPercent}%)</span></div>
          </div>
          <div className="flex items-center gap-2 w-24 justify-end">
             <span className="text-cyan-600 tracking-widest">BREACH</span>
             <Rocket size={12} className="text-cyan-600 animate-pulse"/>
          </div>
      </div>
      
      {/* Stats Summary Panel */}
      <div className="bg-[#020617] p-3 flex flex-wrap gap-6 text-xs border-b border-cyan-900/30 font-mono">
         <div className="flex flex-col">
            <span className="text-cyan-800 text-[10px]">CURRENT_PRICE</span>
            <span className="text-cyan-400 font-bold">{formatCurrency(liveMetrics.price)}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-cyan-800 text-[10px]">MARKET_CAP</span>
            <span className="text-cyan-400 font-bold">{formatCompactNumber(liveMetrics.marketCap)}</span>
         </div>
         <div className="flex flex-col ml-auto text-right">
            <span className="text-cyan-800 text-[10px]">TARGET_ID</span>
            <span className="text-cyan-600 cursor-pointer hover:text-cyan-400 hover:underline flex items-center justify-end gap-1" onClick={() => handleInspect(ca)}>
                {truncateAddress(ca)} <Search size={10}/>
            </span>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0f172a] border-b border-cyan-900/30 p-1 gap-1 text-[10px] flex-wrap font-tech">
         <button onClick={() => setActiveTab('holders')} className={`px-3 py-2 border ${activeTab === 'holders' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-cyan-200'} cursor-pointer uppercase tracking-wider transition-all`}>CREW MANIFEST</button>
         <button onClick={() => setActiveTab('whales')} className={`px-3 py-2 border ${activeTab === 'whales' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-cyan-200'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Eye size={12}/> SONAR CONTACTS</button>
         <button onClick={() => setActiveTab('memos')} className={`px-3 py-2 border ${activeTab === 'memos' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-cyan-200'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Radio size={12}/> RADIO INTERCEPTS</button>
         <button onClick={() => setActiveTab('calculator')} className={`px-3 py-2 border ${activeTab === 'calculator' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-cyan-200'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Calculator size={12}/> LOOT CALC</button>
         <button onClick={() => setActiveTab('mcdonalds')} className={`px-3 py-2 border ${activeTab === 'mcdonalds' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-cyan-200'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Anchor size={12}/> GALLEY DUTY</button>
         <button onClick={() => setActiveTab('astrology')} className={`px-3 py-2 border ${activeTab === 'astrology' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-cyan-200'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Star size={12}/> CELESTIAL NAV</button>
      </div>

      {/* Content Area - Using Extracted Components */}
      <div className="p-2 min-h-[300px] bg-[#020617] text-cyan-500 font-mono text-xs">
        {activeTab === 'holders' && <HoldersTab holders={holders} loading={loadingHolders} onInspect={handleInspect} />}
        {activeTab === 'whales' && <WhaleWatchTab whales={whales} loading={loadingWhales} onInspect={handleInspect} />}
        {activeTab === 'memos' && <MemoWallTab memos={memos} loading={loadingMemos} />}
        {activeTab === 'calculator' && <CalculatorTab calcAmount={calcAmount} setCalcAmount={setCalcAmount} metrics={liveMetrics} />}
        {activeTab === 'mcdonalds' && <McDonaldsTab />}
        {activeTab === 'astrology' && <AstrologyTab />}
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        @keyframes scan-fast { 0% { top: 0% } 100% { top: 100% } }
        .animate-scan-fast { animation: scan-fast 2s linear infinite; }
      `}</style>
    </div>
  );
};
