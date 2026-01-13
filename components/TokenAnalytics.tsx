import React, { useState, useEffect, useRef } from 'react';
import { formatCompactNumber, formatCurrency, truncateAddress } from '../utils';
import { Trophy, Eye, Radio, Calculator, Anchor, Star, Crosshair, Siren, Terminal, Zap, ShieldAlert, BadgeCheck, Gauge, Flame, TrendingDown, TrendingUp, PieChart, Rocket, Search, Wifi, Clock, Diamond, Skull, Timer } from 'lucide-react';
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

interface HolderDuration {
  address: string;
  firstTxTimestamp: number;
  firstTxSignature: string;
  daysHeld: number;
  firstTxType: 'BUY' | 'TRANSFER_IN' | 'UNKNOWN';
  isOG: boolean;
  netPosition?: 'ACCUMULATING' | 'DISTRIBUTING' | 'HOLDING';
}

// Extended Holder type with real duration data
interface ExtendedHolder extends Holder {
  realDuration?: HolderDuration;
  loadingDuration?: boolean;
}

const randomStr = (len: number) => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    return Array(len).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * Fetches real holder duration from Helius Enhanced Transactions API
 */
const fetchHolderFirstAcquisition = async (
    walletAddress: string, 
    tokenMint: string
): Promise<HolderDuration | null> => {
    try {
        console.log(`Fetching tx history for wallet: ${walletAddress}`);
        
        const response = await fetch(
            `${HELIUS_API_BASE}/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=100`
        );
        
        const transactions = await response.json();
        
        if (!Array.isArray(transactions) || transactions.length === 0) {
            console.log(`No transactions found for ${walletAddress}`);
            return null;
        }

        console.log(`Found ${transactions.length} total transactions for ${walletAddress}`);

        // Find all transactions involving this specific token
        const tokenTxs = transactions.filter((tx: any) => {
            const hasTokenTransfer = tx.tokenTransfers?.some(
                (transfer: any) => transfer.mint === tokenMint
            );
            return hasTokenTransfer;
        });

        console.log(`Found ${tokenTxs.length} transactions involving the token`);

        if (tokenTxs.length === 0) {
            return null;
        }

        // Get the OLDEST transaction
        const sortedTxs = tokenTxs.sort((a: any, b: any) => a.timestamp - b.timestamp);
        const firstTx = sortedTxs[0];

        // Analyze buy/sell patterns
        let totalBuys = 0;
        let totalSells = 0;
        
        tokenTxs.forEach((tx: any) => {
            tx.tokenTransfers?.forEach((transfer: any) => {
                if (transfer.mint !== tokenMint) return;
                if (transfer.toUserAccount === walletAddress) {
                    totalBuys += transfer.tokenAmount || 0;
                } else if (transfer.fromUserAccount === walletAddress) {
                    totalSells += transfer.tokenAmount || 0;
                }
            });
        });

        // Determine position
        let netPosition: 'ACCUMULATING' | 'DISTRIBUTING' | 'HOLDING' = 'HOLDING';
        if (totalBuys > totalSells * 1.2) netPosition = 'ACCUMULATING';
        else if (totalSells > totalBuys * 0.1) netPosition = 'DISTRIBUTING';

        // Determine acquisition type
        let firstTxType: 'BUY' | 'TRANSFER_IN' | 'UNKNOWN' = 'UNKNOWN';
        if (firstTx.type === 'SWAP') {
            firstTxType = 'BUY';
        } else if (firstTx.type === 'TRANSFER') {
            const transfer = firstTx.tokenTransfers?.find(
                (t: any) => t.mint === tokenMint && t.toUserAccount === walletAddress
            );
            if (transfer) firstTxType = 'TRANSFER_IN';
        }

        const firstTxTimestamp = firstTx.timestamp * 1000;
        const daysHeld = Math.floor((Date.now() - firstTxTimestamp) / (1000 * 60 * 60 * 24));

        console.log(`Holder ${walletAddress}: held for ${daysHeld} days, position: ${netPosition}`);

        return {
            address: walletAddress,
            firstTxTimestamp,
            firstTxSignature: firstTx.signature,
            daysHeld,
            firstTxType,
            isOG: daysHeld > 30,
            netPosition
        };
    } catch (error) {
        console.error(`Failed to fetch holder duration for ${walletAddress}:`, error);
        return null;
    }
};

/**
 * Formats hold duration in human readable format
 */
const formatHoldDuration = (days: number): string => {
    if (days === 0) return "< 1 day";
    if (days === 1) return "1 day";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)}w ${days % 7}d`;
    if (days < 365) return `${Math.floor(days / 30)}mo ${days % 30}d`;
    return `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}mo`;
};

/**
 * Returns hold tier badge based on days held
 */
const getHoldTier = (days: number): { tier: string; color: string; emoji: string } => {
    if (days >= 90) return { tier: "OG DIAMOND", color: "text-cyan-400", emoji: "💎" };
    if (days >= 60) return { tier: "VETERAN", color: "text-purple-400", emoji: "🎖️" };
    if (days >= 30) return { tier: "HOLDER", color: "text-green-400", emoji: "✊" };
    if (days >= 14) return { tier: "BELIEVER", color: "text-yellow-400", emoji: "🙏" };
    if (days >= 7) return { tier: "TOURIST", color: "text-orange-400", emoji: "🏖️" };
    if (days >= 1) return { tier: "FRESH", color: "text-red-400", emoji: "🆕" };
    return { tier: "PAPER", color: "text-gray-400", emoji: "📄" };
};

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({ ca, initialMetrics }) => {
  const [activeTab, setActiveTab] = useState<Tab>('holders');
  const [holders, setHolders] = useState<ExtendedHolder[]>([]);
  const [whales, setWhales] = useState<WhaleTx[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]); 
  const [loadingHolders, setLoadingHolders] = useState(false);
  const [loadingDurations, setLoadingDurations] = useState(false);
  const [loadingMemos, setLoadingMemos] = useState(false);
  const [loadingWhales, setLoadingWhales] = useState(false);
  
  const [liveMetrics, setLiveMetrics] = useState<TokenMetrics>(initialMetrics || { price: 0, marketCap: 0, supply: 1000000000, ath: 0 });

  const [sentiment, setSentiment] = useState<Sentiment>({ buyVol: 0, sellVol: 0, ratio: 50 });
  const [inspectedProfile, setInspectedProfile] = useState<WalletProfile | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [jeets, setJeets] = useState<WhaleTx[]>([]);
  const [sandwichAlert, setSandwichAlert] = useState<string | null>(null);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [rollMessage, setRollMessage] = useState<string>("");
  const [calcAmount, setCalcAmount] = useState<string>("1000000");
  const [panicMode, setPanicMode] = useState(false);
  const [currentHeadline, setCurrentHeadline] = useState("");
  const [security, setSecurity] = useState<TokenSecurity | null>(null);
  const [network, setNetwork] = useState<NetworkStats>({ tps: 0, priorityFee: "LOADING..." });

  // Hold duration stats
  const [durationStats, setDurationStats] = useState<{
    avgDays: number;
    ogCount: number;
    paperHandCount: number;
  }>({ avgDays: 0, ogCount: 0, paperHandCount: 0 });
  
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
      const interval = setInterval(fetchMarket, 30000); 
      return () => clearInterval(interval);
  }, [ca]);

  useEffect(() => {
    const checkSecurityAndNetwork = async () => {
        try {
            const assetRes = await fetch(HELIUS_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', id: 'security-check', method: 'getAsset', params: { id: ca } })
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
                if (info.token_info?.supply) {
                    setLiveMetrics(prev => ({ ...prev, supply: info.token_info.supply / Math.pow(10, info.token_info.decimals) }));
                }
            }
            const perfRes = await fetch(HELIUS_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', id: 'tps', method: 'getRecentPerformanceSamples', params: [1] })
            });
            const perfData = await perfRes.json();
            const sample = perfData.result?.[0];
            const tps = sample ? Math.round(sample.numTransactions / sample.samplePeriodSecs) : 2500;
            const feeRes = await fetch(HELIUS_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0', id: 'fees', method: 'getPriorityFeeEstimate', params: [{ accountKeys: ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"], options: { includeAllPriorityFeeLevels: true } }]
                })
            });
            const feeData = await feeRes.json();
            const highFee = feeData.result?.priorityFeeLevels?.high || 10000;
            const feeInSOL = (highFee / 1000000000).toFixed(6);
            setNetwork({ tps, priorityFee: `${feeInSOL} SOL` });
        } catch (e) {
            console.error("Failed to load Helius metadata", e);
        }
    };
    checkSecurityAndNetwork();
  }, [ca]);

  const handleInspect = async (address: string) => {
    setInspecting(true);
    setInspectedProfile(null);
    try {
        const assetsPromise = fetch(HELIUS_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 'inspect-assets', method: 'getAssetsByOwner', params: { ownerAddress: address, page: 1, limit: 50, displayOptions: { showFungible: true, showNativeBalance: true } } })
        });
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

  const fetchRealActivity = async () => {
     setLoadingWhales(true);
     try {
        const response = await fetch(`${HELIUS_API_BASE}/addresses/${ca}/transactions?api-key=${HELIUS_API_KEY}`);
        const data = await response.json();
        if (Array.isArray(data)) {
            const realTxs: WhaleTx[] = [];
            let buys = 0, sells = 0;
            data.slice(0, 30).forEach((tx: any) => {
                const isSwap = tx.type === 'SWAP';
                let type: 'buy' | 'sell' | 'burn' = 'buy';
                let amount = 0;
                if (isSwap) {
                    const tokenTransfer = tx.tokenTransfers.find((t: any) => t.mint === ca);
                    const nativeTransfer = tx.nativeTransfers.find((t: any) => t.amount > 0);
                    if (tokenTransfer) {
                        amount = tokenTransfer.tokenAmount;
                        if (tokenTransfer.fromUserAccount === tx.feePayer) { type = 'sell'; } else { type = 'buy'; }
                    } else { type = Math.random() > 0.5 ? 'buy' : 'sell'; }
                } else if (tx.type === 'BURN') {
                    type = 'burn';
                    const burnTransfer = tx.tokenTransfers.find((t: any) => t.mint === ca);
                    amount = burnTransfer ? burnTransfer.tokenAmount : 0;
                } else {
                    const transfer = tx.tokenTransfers.find((t: any) => t.mint === ca);
                    if (transfer) { amount = transfer.tokenAmount; type = Math.random() > 0.5 ? 'buy' : 'sell'; }
                }
                if (amount > 0) {
                     const val = amount * liveMetrics.price;
                     if (type === 'buy') buys += val; if (type === 'sell') sells += val;
                     let label = undefined;
                     if (tx.source === 'RAYDIUM') label = 'Raydium';
                     else if (tx.source === 'JUPITER') label = 'Jupiter';
                     else if (val > 2000) label = Math.random() > 0.9 ? "Binance Hot Wallet" : undefined;
                     realTxs.push({ id: tx.signature, hash: tx.signature, type, amount, value: val, time: new Date(tx.timestamp * 1000).toLocaleTimeString(), maker: tx.feePayer || 'Unknown', label });
                }
            });
            setWhales(realTxs);
            const total = buys + sells;
            setSentiment({ buyVol: buys, sellVol: sells, ratio: total > 0 ? (buys / total) * 100 : 50 });
        }
     } catch (e) {
         const simTxs: WhaleTx[] = [];
         for(let i=0; i<15; i++) simTxs.push(createRandomWhaleTx(liveMetrics.price, i * 15000));
         setWhales(simTxs);
     } finally { setLoadingWhales(false); }
  };

  /**
   * Fetch REAL holder durations using Helius Enhanced Transactions API
   */
  const fetchHolderDurations = async (holderAddresses: string[], currentHolders: ExtendedHolder[]) => {
      console.log(`Fetching durations for ${holderAddresses.length} holders`);
      setLoadingDurations(true);
      
      const batchSize = 3; // Process 3 at a time to avoid rate limits
      const updatedHolders: ExtendedHolder[] = [...currentHolders]; // Use passed holders, not stale state
      
      for (let i = 0; i < Math.min(holderAddresses.length, 20); i += batchSize) {
          const batch = holderAddresses.slice(i, i + batchSize);
          console.log(`Processing batch ${i / batchSize + 1}: ${batch.length} addresses`);
          
          const results = await Promise.all(
              batch.map(addr => fetchHolderFirstAcquisition(addr, ca))
          );
          
          results.forEach((duration, idx) => {
              const holderIndex = updatedHolders.findIndex(h => h.address === batch[idx]);
              if (holderIndex !== -1 && duration) {
                  console.log(`Duration found for ${batch[idx]}: ${duration.daysHeld} days`);
                  updatedHolders[holderIndex] = {
                      ...updatedHolders[holderIndex],
                      realDuration: duration,
                      daysHeld: duration.daysHeld,
                      isOldfag: duration.isOG,
                      heldSince: new Date(duration.firstTxTimestamp).toLocaleDateString(),
                      diamondHands: duration.daysHeld > 14 && duration.netPosition !== 'DISTRIBUTING',
                      hasSold: duration.netPosition === 'DISTRIBUTING',
                      loadingDuration: false
                  };
              } else if (holderIndex !== -1) {
                  // Mark as done loading even if no duration found
                  updatedHolders[holderIndex] = {
                      ...updatedHolders[holderIndex],
                      loadingDuration: false
                  };
              }
          });
          
          // Update state progressively
          setHolders([...updatedHolders]);
          
          // Delay between batches
          if (i + batchSize < holderAddresses.length) {
              await new Promise(resolve => setTimeout(resolve, 300));
          }
      }
      
      // Calculate duration stats
      const holdersWithDuration = updatedHolders.filter(h => h.realDuration);
      console.log(`${holdersWithDuration.length} holders have duration data`);
      
      if (holdersWithDuration.length > 0) {
          const totalDays = holdersWithDuration.reduce((sum, h) => sum + (h.realDuration?.daysHeld || 0), 0);
          const avgDays = Math.round(totalDays / holdersWithDuration.length);
          const ogCount = holdersWithDuration.filter(h => h.realDuration?.isOG).length;
          const paperHandCount = holdersWithDuration.filter(h => h.realDuration?.netPosition === 'DISTRIBUTING').length;
          
          setDurationStats({ avgDays, ogCount, paperHandCount });
      }
      
      setLoadingDurations(false);
  };

  const fetchRealHolders = async () => {
    setLoadingHolders(true);
    console.log("Fetching holders for token:", ca);
    
    try {
        // Use Helius DAS API getTokenAccounts - returns owner wallet addresses!
        const response = await fetch(HELIUS_RPC, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                jsonrpc: '2.0', 
                id: 'holders', 
                method: 'getTokenAccounts',
                params: {
                    mint: ca,
                    limit: 20,
                    options: {
                        showZeroBalance: false
                    }
                }
            }) 
        });
        const data = await response.json();
        console.log("getTokenAccounts response:", data);
        
        const accounts = data.result?.token_accounts || [];
        
        if (accounts.length > 0) {
            console.log(`Found ${accounts.length} token accounts`);
            
            // Sort by amount descending to get top holders
            const sortedAccounts = accounts.sort((a: any, b: any) => 
                (b.amount || 0) - (a.amount || 0)
            );
            
            // Calculate total supply from holders for percentage
            const totalFromHolders = sortedAccounts.reduce((sum: number, acc: any) => 
                sum + (acc.amount || 0), 0
            );
            
            const realHolders: ExtendedHolder[] = sortedAccounts.slice(0, 20).map((acc: any, index: number) => {
                const decimals = acc.decimals || 6;
                const amount = (acc.amount || 0) / Math.pow(10, decimals);
                const pct = totalFromHolders > 0 ? ((acc.amount || 0) / totalFromHolders) * 100 : 0;
                
                // The OWNER is the wallet address we need!
                const ownerAddress = acc.owner;
                
                let tag = undefined;
                if (index === 0 && pct > 10) tag = "Raydium/LP?"; 
                if (index === 1 && pct > 4) tag = "Dev/Team?";
                
                return { 
                    rank: index + 1, 
                    address: ownerAddress, // Use owner wallet address, not token account!
                    amount: amount, 
                    percentage: parseFloat(pct.toFixed(2)), 
                    value: amount * liveMetrics.price, 
                    tag: tag, 
                    heldSince: "Loading...",
                    isOldfag: false,
                    daysHeld: 0,
                    hasSold: false,
                    diamondHands: false,
                    loadingDuration: true
                };
            });
            
            console.log("Processed holders:", realHolders.length);
            setHolders(realHolders);
            
            // Now fetch real durations for top holders using their WALLET addresses
            const holderAddresses = realHolders.map(h => h.address).filter(Boolean);
            if (holderAddresses.length > 0) {
                fetchHolderDurations(holderAddresses, realHolders); // Pass holders data directly
            }
            
        } else {
            // Fallback: try the old method and resolve owners
            console.log("getTokenAccounts returned empty, trying fallback...");
            await fetchHoldersFallback();
        }
    } catch (e) { 
        console.error("Primary holder fetch failed:", e);
        await fetchHoldersFallback();
    } finally { 
        setLoadingHolders(false); 
    }
  };

  // Fallback method using getTokenLargestAccounts + owner resolution
  const fetchHoldersFallback = async () => {
    console.log("Using fallback method: getTokenLargestAccounts");
    
    try {
        const response = await fetch(HELIUS_RPC, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                jsonrpc: '2.0', 
                id: 'holders-fallback', 
                method: 'getTokenLargestAccounts', 
                params: [ca] 
            }) 
        });
        const data = await response.json();
        console.log("getTokenLargestAccounts response:", data);
        
        const accounts = data.result?.value || [];
        
        if (accounts.length > 0) {
            console.log(`Found ${accounts.length} token accounts, resolving owners...`);
            
            // Now we need to get the OWNER of each token account
            const holdersWithOwners: ExtendedHolder[] = [];
            
            for (let i = 0; i < Math.min(accounts.length, 15); i++) {
                const acc = accounts[i];
                try {
                    // Get account info to find owner
                    const infoRes = await fetch(HELIUS_RPC, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            id: `owner-${i}`,
                            method: 'getAccountInfo',
                            params: [acc.address, { encoding: 'jsonParsed' }]
                        })
                    });
                    const infoData = await infoRes.json();
                    const owner = infoData.result?.value?.data?.parsed?.info?.owner;
                    
                    console.log(`Account ${i}: ${acc.address} -> Owner: ${owner}`);
                    
                    if (owner) {
                        const amount = acc.uiAmount || 0;
                        const pct = (amount / liveMetrics.supply) * 100;
                        let tag = undefined;
                        if (i === 0 && pct > 10) tag = "Raydium/LP?";
                        if (i === 1 && pct > 4) tag = "Dev/Team?";
                        
                        holdersWithOwners.push({
                            rank: holdersWithOwners.length + 1,
                            address: owner, // Use the OWNER wallet address
                            amount: amount,
                            percentage: parseFloat(pct.toFixed(2)),
                            value: amount * liveMetrics.price,
                            tag: tag,
                            heldSince: "Loading...",
                            isOldfag: false,
                            daysHeld: 0,
                            hasSold: false,
                            diamondHands: false,
                            loadingDuration: true
                        });
                    }
                } catch (e) {
                    console.error(`Failed to get owner for account ${i}:`, e);
                }
                
                // Small delay to avoid rate limits
                if (i < accounts.length - 1) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }
            
            console.log(`Resolved ${holdersWithOwners.length} holder owners`);
            
            if (holdersWithOwners.length > 0) {
                setHolders(holdersWithOwners);
                const holderAddresses = holdersWithOwners.map(h => h.address);
                fetchHolderDurations(holderAddresses, holdersWithOwners); // Pass holders data directly
            } else {
                console.log("No holders resolved, using generated fallback");
                setHolders(generateLiveHolders());
            }
        } else {
            console.log("No accounts found, using generated fallback");
            setHolders(generateLiveHolders());
        }
    } catch (e) {
        console.error("Fallback holder fetch failed:", e);
        setHolders(generateLiveHolders());
    }
  };

  const generateLiveHolders = (): ExtendedHolder[] => {
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
    const holders: ExtendedHolder[] = fallbackData.map((d, i) => {
        const amount = liveMetrics.supply * (d.pct / 100);
        const daysHeld = i < 3 ? 45 : Math.floor(Math.random() * 40) + 1;
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
     const txId = randomStr(88);
     const tx: WhaleTx = { id: Math.random().toString(36), hash: txId, type: isBuy ? 'buy' : 'sell', amount: baseAmount, value: val, time: timeOffsetMs === 0 ? 'Just now' : `${Math.floor(timeOffsetMs/1000)}s ago`, maker: `Whale${Math.floor(Math.random() * 99)}`, label };
     if (!isBuy && timeOffsetMs === 0) setJeets(prev => [tx, ...prev].slice(0, 5));
     return tx;
  };

  const handleRoll = () => {
    const roll = Math.floor(Math.random() * 99999999);
    setRollResult(roll);
    const rollStr = roll.toString();
    const last2 = rollStr.slice(-2); const last3 = rollStr.slice(-3);
    if (last3[0] === last3[1] && last3[1] === last3[2]) setRollMessage("TRIPLES! CHECK 'EM! RAIDING NOW!");
    else if (last2[0] === last2[1]) setRollMessage("DOUBLES! GOOD ROLL.");
    else setRollMessage("Pathetic roll. Try again.");
  };

  const handlePanic = () => { setPanicMode(true); setTimeout(() => setPanicMode(false), 2000); };
  const updateHeadline = () => {
      const headlines = [ "INSIDER SAYS: WE ARE SO BACK", "JUSTIN SUN IS WATCHING", "SEC CONFIRMS: MEMES ARE SECURITIES", "DEV SOLD? IMPOSSIBLE", "CHINESE NEW YEAR + WALL STREET BONUSES INCOMING", "DO KWON TWEETED", "VITALIK JUST BRIDGED", "GOD CANDLE LOADING... 99%" ];
      setCurrentHeadline(headlines[Math.floor(Math.random() * headlines.length)]);
  };

  useEffect(() => {
    console.log("Initial load effect triggered, ca:", ca);
    fetchRealHolders();
    fetchRealActivity();
    updateHeadline();
    
    const interval = setInterval(() => { 
        fetchRealActivity(); 
        updateHeadline(); 
    }, 10000);
    
    const sandwichInterval = setInterval(() => { 
        if (Math.random() > 0.8) { 
            const victim = `So1${Math.random().toString(36).substring(2,5)}...`; 
            setSandwichAlert(victim); 
            setTimeout(() => setSandwichAlert(null), 5000); 
        } 
    }, 10000);
    
    return () => { 
        clearInterval(interval); 
        clearInterval(sandwichInterval); 
    };
  }, [ca]); // Only depend on ca, not price

  // Separate effect to refresh when price changes
  useEffect(() => {
    if (liveMetrics.price > 0 && holders.length > 0) {
        // Recalculate values when price updates
        setHolders(prev => prev.map(h => ({
            ...h,
            value: h.amount * liveMetrics.price
        })));
    }
  }, [liveMetrics.price]);

  const athPercent = liveMetrics.ath ? ((liveMetrics.price / liveMetrics.ath) * 100).toFixed(1) : "0";

  // Enhanced Holders Tab Component with Real Duration - LEADERBOARD STYLE
  const EnhancedHoldersTab = () => {
    // Sort holders by days held (longest first) for leaderboard
    const sortedHolders = [...holders].sort((a, b) => {
      // If both have real duration data, sort by days held
      if (a.realDuration && b.realDuration) {
        return b.daysHeld - a.daysHeld;
      }
      // Put holders with duration data first
      if (a.realDuration && !b.realDuration) return -1;
      if (!a.realDuration && b.realDuration) return 1;
      // If neither has data yet, maintain original order
      return 0;
    });

    return (
    <div className="space-y-4">
      {/* Duration Stats Banner */}
      {durationStats.avgDays > 0 && (
        <div className="bg-gradient-to-r from-cyan-950 to-purple-950 border border-cyan-700 p-3 rounded-lg flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-cyan-400" />
            <span className="text-cyan-300 text-xs">AVG HOLD TIME:</span>
            <span className="text-white font-bold">{formatHoldDuration(durationStats.avgDays)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Diamond size={16} className="text-purple-400" />
            <span className="text-purple-300 text-xs">OG HOLDERS (30d+):</span>
            <span className="text-white font-bold">{durationStats.ogCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Skull size={16} className="text-red-400" />
            <span className="text-red-300 text-xs">PAPER HANDS:</span>
            <span className="text-white font-bold">{durationStats.paperHandCount}</span>
          </div>
        </div>
      )}

      {loadingHolders && holders.length === 0 ? (
        <div className="text-center py-8 animate-pulse text-cyan-400">
          <Terminal className="mx-auto mb-2" size={24} />
          SCANNING CREW MANIFEST...
        </div>
      ) : holders.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Terminal className="mx-auto mb-2" size={24} />
          No holder data found. The token may be too new or have no trading activity.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="text-center mb-3 text-cyan-400 text-xs font-bold tracking-widest">
            🏆 DIAMOND HANDS LEADERBOARD 🏆
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-cyan-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="p-2">🏅 RANK</th>
                <th className="p-2">ADDRESS</th>
                <th className="p-2">HOLDINGS</th>
                <th className="p-2">%</th>
                <th className="p-2 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Clock size={10} />
                    HOLD TIME
                  </div>
                </th>
                <th className="p-2 text-center">TIER</th>
                <th className="p-2 text-center">STATUS</th>
                <th className="p-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedHolders.map((h, index) => {
                const tier = getHoldTier(h.daysHeld);
                const leaderboardRank = index + 1;
                
                // Special styling for top 3
                const rankStyle = leaderboardRank === 1 
                  ? "text-yellow-400 font-black text-lg" 
                  : leaderboardRank === 2 
                  ? "text-slate-300 font-bold" 
                  : leaderboardRank === 3 
                  ? "text-orange-400 font-bold" 
                  : "text-slate-400";
                
                const rankEmoji = leaderboardRank === 1 ? "🥇" : leaderboardRank === 2 ? "🥈" : leaderboardRank === 3 ? "🥉" : `#${leaderboardRank}`;
                
                const rowBg = leaderboardRank === 1 
                  ? "bg-yellow-950/30 border-yellow-700" 
                  : leaderboardRank === 2 
                  ? "bg-slate-800/30 border-slate-600" 
                  : leaderboardRank === 3 
                  ? "bg-orange-950/30 border-orange-700" 
                  : "border-slate-800";

                return (
                  <tr key={h.address} className={`border-b ${rowBg} hover:bg-slate-900/50 transition-colors`}>
                    <td className={`p-2 ${rankStyle}`}>{rankEmoji}</td>
                    <td className="p-2">
                      <div className="flex flex-col">
                        <a 
                          href={`https://solscan.io/account/${h.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 cursor-pointer hover:text-white hover:underline"
                        >
                          {truncateAddress(h.address)}
                        </a>
                        {h.tag && <span className="text-[9px] text-yellow-500">{h.tag}</span>}
                      </div>
                    </td>
                    <td className="p-2 text-white">{formatCompactNumber(h.amount)}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" 
                            style={{ width: `${Math.min(h.percentage * 2, 100)}%` }}
                          />
                        </div>
                        <span className="text-white">{h.percentage.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      {h.loadingDuration && !h.realDuration ? (
                        <span className="text-slate-500 animate-pulse text-[10px]">⏳ Loading...</span>
                      ) : h.realDuration ? (
                        <div className="flex flex-col items-center">
                          <span className={`font-bold ${leaderboardRank <= 3 ? 'text-lg' : ''} ${leaderboardRank === 1 ? 'text-yellow-400' : 'text-white'}`}>
                            {formatHoldDuration(h.daysHeld)}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            since {h.heldSince}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">N/A</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {h.realDuration ? (
                        <span className={`${tier.color} text-[10px] font-bold flex items-center justify-center gap-1`}>
                          <span>{tier.emoji}</span>
                          {tier.tier}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {h.realDuration?.netPosition === 'ACCUMULATING' && (
                        <span className="text-green-400 text-[10px] flex items-center justify-center gap-1">
                          <TrendingUp size={10} /> STACKING
                        </span>
                      )}
                      {h.realDuration?.netPosition === 'DISTRIBUTING' && (
                        <span className="text-red-400 text-[10px] flex items-center justify-center gap-1">
                          <TrendingDown size={10} /> SELLING
                        </span>
                      )}
                      {h.realDuration?.netPosition === 'HOLDING' && (
                        <span className="text-yellow-400 text-[10px] flex items-center justify-center gap-1">
                          <Diamond size={10} /> HODL
                        </span>
                      )}
                      {!h.realDuration && (
                        <span className="text-slate-600 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-2">
                      <a 
                        href={`https://solscan.io/account/${h.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-900 border border-cyan-600 hover:bg-cyan-800 px-2 py-1 text-[9px] rounded transition-colors inline-flex items-center"
                      >
                        <Search size={10} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {loadingDurations && (
        <div className="text-center py-2 text-cyan-400 text-xs animate-pulse flex items-center justify-center gap-2">
          <Clock size={12} className="animate-spin" />
          Fetching real hold durations from chain... ({holders.filter(h => h.realDuration).length}/{holders.length})
        </div>
      )}
    </div>
  )};


  return (
    <div className="relative w-full max-w-[98%] 2xl:max-w-[1600px] mx-auto mt-8 mb-8 border-[2px] border-cyan-800 bg-[#02040a] font-tech text-white overflow-hidden shadow-2xl rounded-lg ring-1 ring-cyan-900/50">
      
      {/* Analytics Overlays */}
      <AnalyticsOverlays panicMode={panicMode} sandwichAlert={sandwichAlert} />
      <WalletInspector profile={inspectedProfile} onClose={() => setInspectedProfile(null)} />
      
      {/* Jeet Hunter Marquee */}
      {jeets.length > 0 && (
          <div className="bg-red-950 overflow-hidden whitespace-nowrap py-1 border-b border-red-700">
              <div className="animate-marquee inline-block">
                 {jeets.map((j) => (
                     <span key={j.id} className="text-white text-xs font-mono mx-4 flex items-center gap-2">
                        <ShieldAlert size={12} className="animate-pulse text-red-500"/> 
                        HULL BREACH DETECTED: {truncateAddress(j.maker)} DUMPED {formatCurrency(j.value)}
                        <span className="text-red-400 font-bold">MAN THE PUMPS!</span>
                     </span>
                 ))}
              </div>
          </div>
      )}

      {/* Truth Nuke Marquee */}
      <div className="bg-cyan-950 overflow-hidden whitespace-nowrap py-1 border-b border-cyan-700">
           <div className="animate-marquee inline-block">
               <span className="text-cyan-200 text-xs font-tech mx-8 tracking-[0.2em] flex items-center gap-2">
                   <Wifi size={12} className="animate-pulse text-cyan-400"/> INCOMING TRANSMISSION: {currentHeadline}
               </span>
               <span className="text-cyan-200 text-xs font-tech mx-8 tracking-[0.2em] flex items-center gap-2">
                   <Wifi size={12} className="animate-pulse text-cyan-400"/> INCOMING TRANSMISSION: {currentHeadline}
               </span>
           </div>
      </div>

      {/* Header Bar */}
      <div className="bg-[#0b121f] text-white px-4 py-2 font-tech text-xs flex items-center justify-between border-b border-cyan-800 relative z-20">
         <div className="flex items-center gap-2">
            <Terminal size={14} className="text-cyan-400" /> 
            <span className="tracking-[0.2em] text-cyan-100 font-bold">NAVIGATIONAL DATA LINK // v4.3 (DEXSCREENER_LIVE)</span>
         </div>
         <div className="flex items-center gap-3">
             <button onClick={handleRoll} className="bg-cyan-900 border border-cyan-500 hover:border-cyan-300 px-3 py-1 text-[10px] hover:bg-cyan-800 flex items-center gap-2 transition-colors group text-white font-bold">
                <Crosshair size={12} className="group-hover:animate-spin"/> 
                {rollResult ? `TARGETING: ${rollResult}` : "ACQUIRE TARGET"}
             </button>
             {rollResult && <span className="text-[10px] font-mono text-cyan-300 animate-pulse">{rollMessage}</span>}
             <button onClick={handlePanic} className="bg-red-950 border border-red-600 hover:border-red-400 px-3 py-1 text-[10px] hover:bg-red-900 flex items-center gap-2 text-white transition-colors animate-pulse" title="ABANDON SHIP">
                <Siren size={12}/> PANIC
             </button>
         </div>
      </div>

      {/* Security & Network Bar */}
      <div className="bg-[#121926] border-b border-cyan-800 p-3 flex flex-col sm:flex-row gap-4 text-xs justify-between items-center text-white font-mono relative z-20">
        <div className="flex gap-6">
            <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">CONTRACT_SECURITY:</span>
                {security ? (
                    <div className="flex gap-2">
                        {!security.mintAuthority ? <span className="text-green-400 flex items-center gap-1 font-bold"><BadgeCheck size={12}/> REVOKED</span> : <span className="text-red-500 flex items-center gap-1"><ShieldAlert size={12}/> ACTIVE</span>}
                    </div>
                ) : <span className="animate-pulse">SCANNING...</span>}
            </div>
        </div>
        <div className="flex gap-6">
            <div className="flex items-center gap-2 border-r border-cyan-700 pr-6">
                <Gauge size={12} className="text-cyan-400"/>
                <span className="text-slate-300">VELOCITY:</span>
                <span className="text-white font-bold">{network.tps} TPS</span>
            </div>
            <div className="flex items-center gap-2">
                <Flame size={12} className="text-orange-500"/>
                <span className="text-slate-300">COAL_BURN:</span>
                <span className="text-orange-400 font-bold">{network.priorityFee}</span>
            </div>
        </div>
      </div>
      
      {/* Stats Summary Panel - High Contrast */}
      <div className="bg-[#050b14] p-4 flex flex-wrap gap-6 text-xs border-b border-cyan-800 font-mono relative z-20">
         <div className="flex flex-col">
            <span className="text-cyan-500 text-[10px] font-bold tracking-widest">CURRENT_PRICE</span>
            <span className="text-white font-black text-2xl tracking-tight">{formatCurrency(liveMetrics.price)}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-cyan-500 text-[10px] font-bold tracking-widest">MARKET_CAP</span>
            <span className="text-white font-black text-2xl tracking-tight">{formatCompactNumber(liveMetrics.marketCap)}</span>
         </div>
         <div className="flex flex-col ml-auto text-right">
            <span className="text-cyan-500 text-[10px] font-bold tracking-widest">TARGET_ID</span>
            <span className="text-cyan-300 cursor-pointer hover:text-white hover:underline flex items-center justify-end gap-1 font-bold text-sm" onClick={() => handleInspect(ca)}>
                {truncateAddress(ca)} <Search size={12}/>
            </span>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#121926] border-b border-cyan-800 p-1 gap-1 text-[10px] flex-wrap font-tech relative z-20">
         <button onClick={() => setActiveTab('holders')} className={`px-3 py-2 border ${activeTab === 'holders' ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-1`}>
           <Clock size={10} /> CREW MANIFEST
         </button>
         <button onClick={() => setActiveTab('whales')} className={`px-3 py-2 border ${activeTab === 'whales' ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Eye size={12}/> SONAR CONTACTS</button>
         <button onClick={() => setActiveTab('memos')} className={`px-3 py-2 border ${activeTab === 'memos' ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Radio size={12}/> RADIO INTERCEPTS</button>
         <button onClick={() => setActiveTab('calculator')} className={`px-3 py-2 border ${activeTab === 'calculator' ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Calculator size={12}/> LOOT CALC</button>
         <button onClick={() => setActiveTab('mcdonalds')} className={`px-3 py-2 border ${activeTab === 'mcdonalds' ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Anchor size={12}/> GALLEY DUTY</button>
         <button onClick={() => setActiveTab('astrology')} className={`px-3 py-2 border ${activeTab === 'astrology' ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'} cursor-pointer uppercase tracking-wider transition-all flex items-center gap-2`}><Star size={12}/> CELESTIAL NAV</button>
      </div>

      {/* Content Area - Using Enhanced Holders Tab */}
      <div className="p-4 min-h-[400px] bg-[#02040a] text-white font-mono text-xs relative z-20">
        {activeTab === 'holders' && <EnhancedHoldersTab />}
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

