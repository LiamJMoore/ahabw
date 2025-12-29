
import { HELIUS_API_KEY } from '../constants';

// Updated to the high-performance endpoint
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

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

export type WeatherState = 'STORM' | 'CALM' | 'FOG';

export const getMarketWeather = async (): Promise<WeatherState> => {
    const rand = Math.random();
    if (rand < 0.4) return 'STORM'; // Bearish/High Volatility
    if (rand < 0.7) return 'CALM';  // Bullish/Steady
    return 'FOG';                   // Low Volume
};
