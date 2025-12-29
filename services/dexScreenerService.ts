
export interface DexScreenerData {
    price: number;
    marketCap: number;
    pairAddress: string;
    priceChange24h: number;
}

export const fetchTokenMarketData = async (ca: string): Promise<DexScreenerData | null> => {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
            // Sort by liquidity to get the main pair
            const sortedPairs = data.pairs.sort((a: any, b: any) => b.liquidity?.usd - a.liquidity?.usd);
            const pair = sortedPairs[0];
            
            return {
                price: parseFloat(pair.priceUsd),
                marketCap: pair.fdv || pair.marketCap, // FDV is usually more accurate for fully diluted
                pairAddress: pair.pairAddress,
                priceChange24h: pair.priceChange.h24
            };
        }
        return null;
    } catch (error) {
        console.error("DexScreener Fetch Error:", error);
        return null;
    }
};
