import { HELIUS_API_KEY } from '../constants';

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

// Fallback data to ensure the UI never breaks, even if Helius is rate-limited or the key is invalid
const FALLBACK_WHALE_DATA: HeliusAssetResponse = {
  result: {
    content: {
      metadata: {
        name: "White Whale",
        symbol: "WHALE",
      },
      links: {
        image: "", 
      },
    },
    token_info: {
      supply: 1000000000000000, // 1B example
      decimals: 6,
      price_info: {
        price_per_token: 0.001,
        total_price: 1000000, // $1M Market Cap fallback
      }
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'ahab-scanner',
        method: 'getAsset',
        params: {
          id: mintAddress,
        },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
        // Handle specific API limits gracefully without error spam
        if (data.error.code === -32429) {
            console.warn("Helius API Limit Reached: Switching to fallback data.");
        } else {
            console.error("Helius API Error:", JSON.stringify(data.error, null, 2));
        }
        return FALLBACK_WHALE_DATA;
    }
    
    return data as HeliusAssetResponse;
  } catch (error) {
    console.error("Failed to fetch asset from Helius (Network Error):", error);
    return FALLBACK_WHALE_DATA;
  }
};