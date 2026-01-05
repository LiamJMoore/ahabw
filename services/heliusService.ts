
import { HELIUS_API_KEY } from '../constants';

// Updated to the high-performance endpoint
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
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
            .filter((a: TreasuryAsset) => a.amount > 0); // Remove empty balances

        return {
            solBalance,
            solPrice,
            totalUsd: (solBalance * solPrice), // Simplified total for now
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
    if (rand < 0.4) return 'STORM'; // Bearish/High Volatility
    if (rand < 0.7) return 'CALM';  // Bullish/Steady
    return 'FOG';                   // Low Volume
};
