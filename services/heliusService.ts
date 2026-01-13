import { HELIUS_API_KEY } from '../constants';

// Helius Endpoints
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const API_BASE = `https://api.helius.xyz/v0`;
const JUP_PRICE_API = "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112";

export interface HeliusAssetResponse {
  result: {
    content: {
      metadata: {
        name: string;
        symbol: string;
      };
      links: {
        image?: string;
      };
    };
    token_info: {
      supply: number;
      decimals: number;
      price_info?: {
        price_per_token: number;
        total_price: number;
      }
    };
  };
}

export interface TreasuryAsset {
    name: string;
    symbol: string;
    amount: number;
    image: string;
    mint: string;
}

export interface TreasuryData {
    solBalance: number;
    solPrice: number;
    totalUsd: number;
    assets: TreasuryAsset[];
}

export interface BountyTx {
    signature: string;
    amount: number;
    buyer: string;
    timestamp: number;
}

export interface HolderDuration {
    address: string;
    firstTxTimestamp: number;
    firstTxSignature: string;
    daysHeld: number;
    firstTxType: 'BUY' | 'TRANSFER_IN' | 'UNKNOWN';
    isOG: boolean; // Held since very early
}

// Fallback data to ensure the UI never breaks
const FALLBACK_WHALE_DATA: HeliusAssetResponse = {
  result: {
    content: {
      metadata: { name: "White Whale", symbol: "WHALE" },
      links: { image: "" },
    },
    token_info: {
      supply: 1000000000000000,
      decimals: 6,
      price_info: { price_per_token: 0.001, total_price: 1000000 }
    }
  }
};

export const fetchTokenAsset = async (mintAddress: string): Promise<HeliusAssetResponse | null> => {
  if (!HELIUS_API_KEY || (HELIUS_API_KEY as string) === 'YOUR_API_KEY') {
      console.warn("Helius API Key missing, using fallback data.");
      return FALLBACK_WHALE_DATA;
  }

  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 'ahab-scanner', method: 'getAsset', params: { id: mintAddress },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
        console.warn("Helius API Error:", JSON.stringify(data.error, null, 2));
        return FALLBACK_WHALE_DATA;
    }
    
    return data as HeliusAssetResponse;
  } catch (error) {
    console.error("Failed to fetch asset from Helius (Network Error):", error);
    return FALLBACK_WHALE_DATA;
  }
};

/**
 * Fetches the first transaction where a wallet received a specific token
 * This tells us how long they've been holding
 */
export const fetchHolderFirstAcquisition = async (
    walletAddress: string, 
    tokenMint: string
): Promise<HolderDuration | null> => {
    if (!HELIUS_API_KEY) return null;

    try {
        // Use Enhanced Transactions API to get wallet's transaction history
        // We'll paginate backwards to find the earliest token interaction
        const response = await fetch(
            `${API_BASE}/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=100`
        );
        
        const transactions = await response.json();
        
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return null;
        }

        // Find all transactions involving this specific token
        const tokenTxs = transactions.filter((tx: any) => {
            // Check tokenTransfers for the mint
            const hasTokenTransfer = tx.tokenTransfers?.some(
                (transfer: any) => transfer.mint === tokenMint
            );
            return hasTokenTransfer;
        });

        if (tokenTxs.length === 0) {
            return null;
        }

        // Get the OLDEST transaction (last in array after sorting by timestamp)
        const sortedTxs = tokenTxs.sort((a: any, b: any) => a.timestamp - b.timestamp);
        const firstTx = sortedTxs[0];

        // Determine if it was a buy or transfer
        let firstTxType: 'BUY' | 'TRANSFER_IN' | 'UNKNOWN' = 'UNKNOWN';
        if (firstTx.type === 'SWAP') {
            firstTxType = 'BUY';
        } else if (firstTx.type === 'TRANSFER') {
            // Check if tokens were received (not sent)
            const transfer = firstTx.tokenTransfers?.find(
                (t: any) => t.mint === tokenMint && t.toUserAccount === walletAddress
            );
            if (transfer) {
                firstTxType = 'TRANSFER_IN';
            }
        }

        const firstTxTimestamp = firstTx.timestamp * 1000; // Convert to milliseconds
        const now = Date.now();
        const daysHeld = Math.floor((now - firstTxTimestamp) / (1000 * 60 * 60 * 24));

        return {
            address: walletAddress,
            firstTxTimestamp,
            firstTxSignature: firstTx.signature,
            daysHeld,
            firstTxType,
            isOG: daysHeld > 30 // Consider OG if held for 30+ days
        };
    } catch (error) {
        console.error(`Failed to fetch holder duration for ${walletAddress}:`, error);
        return null;
    }
};

/**
 * Batch fetch holder durations for multiple addresses
 * Returns a map of address -> HolderDuration
 */
export const fetchBatchHolderDurations = async (
    walletAddresses: string[],
    tokenMint: string,
    maxConcurrent: number = 5
): Promise<Map<string, HolderDuration>> => {
    const results = new Map<string, HolderDuration>();
    
    // Process in batches to avoid rate limiting
    for (let i = 0; i < walletAddresses.length; i += maxConcurrent) {
        const batch = walletAddresses.slice(i, i + maxConcurrent);
        
        const batchResults = await Promise.all(
            batch.map(addr => fetchHolderFirstAcquisition(addr, tokenMint))
        );
        
        batchResults.forEach((result, index) => {
            if (result) {
                results.set(batch[index], result);
            }
        });
        
        // Small delay between batches to respect rate limits
        if (i + maxConcurrent < walletAddresses.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    
    return results;
};

/**
 * Alternative: Use getSignaturesForAsset for compressed NFTs or 
 * getTransactionsForAddress for more detailed history
 */
export const fetchDetailedHolderHistory = async (
    walletAddress: string,
    tokenMint: string
): Promise<{
    totalBuys: number;
    totalSells: number;
    netPosition: 'ACCUMULATING' | 'DISTRIBUTING' | 'HOLDING';
    avgHoldTime: number;
    firstAcquisition: number | null;
    lastActivity: number | null;
} | null> => {
    if (!HELIUS_API_KEY) return null;

    try {
        const response = await fetch(
            `${API_BASE}/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=100`
        );
        
        const transactions = await response.json();
        
        if (!Array.isArray(transactions)) return null;

        let totalBuys = 0;
        let totalSells = 0;
        let firstAcquisition: number | null = null;
        let lastActivity: number | null = null;

        transactions.forEach((tx: any) => {
            const tokenTransfers = tx.tokenTransfers?.filter(
                (t: any) => t.mint === tokenMint
            ) || [];

            tokenTransfers.forEach((transfer: any) => {
                const timestamp = tx.timestamp * 1000;
                
                // Track first and last activity
                if (!firstAcquisition || timestamp < firstAcquisition) {
                    firstAcquisition = timestamp;
                }
                if (!lastActivity || timestamp > lastActivity) {
                    lastActivity = timestamp;
                }

                // Determine buy vs sell
                if (transfer.toUserAccount === walletAddress) {
                    totalBuys += transfer.tokenAmount || 0;
                } else if (transfer.fromUserAccount === walletAddress) {
                    totalSells += transfer.tokenAmount || 0;
                }
            });
        });

        let netPosition: 'ACCUMULATING' | 'DISTRIBUTING' | 'HOLDING' = 'HOLDING';
        if (totalBuys > totalSells * 1.2) netPosition = 'ACCUMULATING';
        else if (totalSells > totalBuys * 1.2) netPosition = 'DISTRIBUTING';

        const avgHoldTime = firstAcquisition 
            ? Math.floor((Date.now() - firstAcquisition) / (1000 * 60 * 60 * 24))
            : 0;

        return {
            totalBuys,
            totalSells,
            netPosition,
            avgHoldTime,
            firstAcquisition,
            lastActivity
        };
    } catch (error) {
        console.error(`Failed to fetch detailed history for ${walletAddress}:`, error);
        return null;
    }
};

export const fetchRecentBounties = async (): Promise<BountyTx[]> => {
    // In production, this would use getSignaturesForAddress
    const now = Date.now();
    return Array.from({ length: 6 }).map((_, i) => ({
        signature: `sig${now}-${i}`,
        amount: Math.floor(Math.random() * 500000) + 10000,
        buyer: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        timestamp: now - (i * 100000)
    }));
};

export const fetchTreasuryPortfolio = async (address: string): Promise<TreasuryData | null> => {
    try {
        // 1. Get SOL Balance
        const solRes = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0', id: 'treasury-sol', method: 'getBalance', params: [address]
            })
        });
        const solData = await solRes.json();
        const solBalance = (solData.result?.value || 0) / 1000000000;

        // 2. Get SOL Price
        let solPrice = 0;
        try {
            const priceRes = await fetch(JUP_PRICE_API);
            const priceData = await priceRes.json();
            solPrice = parseFloat(priceData.data?.So11111111111111111111111111111111111111112?.price || "0");
        } catch (e) {
            console.warn("Price fetch failed");
        }

        // 3. Get SPL Assets
        const assetsRes = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'treasury-assets',
                method: 'getAssetsByOwner',
                params: {
                    ownerAddress: address,
                    page: 1,
                    limit: 20,
                    displayOptions: { showFungible: true }
                }
            })
        });
        const assetsData = await assetsRes.json();
        const items = assetsData.result?.items || [];
        
        const assets: TreasuryAsset[] = items
            .filter((item: any) => item.interface === 'FungibleToken' || item.interface === 'FungibleAsset')
            .map((item: any) => ({
                name: item.content?.metadata?.name || "Unknown Token",
                symbol: item.content?.metadata?.symbol || "UNK",
                amount: (item.token_info?.balance || 0) / Math.pow(10, item.token_info?.decimals || 0),
                image: item.content?.links?.image || "",
                mint: item.id
            }))
            .filter((a: TreasuryAsset) => a.amount > 0);

        return {
            solBalance,
            solPrice,
            totalUsd: (solBalance * solPrice),
            assets
        };

    } catch (e) {
        console.error("Treasury fetch failed", e);
        return null;
    }
};

export type WeatherState = 'STORM' | 'CALM' | 'FOG';

export const getMarketWeather = async (): Promise<WeatherState> => {
    const rand = Math.random();
    if (rand < 0.4) return 'STORM';
    if (rand < 0.7) return 'CALM';
    return 'FOG';
};
