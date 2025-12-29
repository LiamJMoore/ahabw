
export type Tab = 'holders' | 'whales' | 'memos' | 'calculator' | 'mcdonalds' | 'astrology';

export interface Holder {
  rank: number;
  address: string;
  amount: number;
  percentage: number;
  value: number;
  tag?: string;
  heldSince: string;
  isOldfag: boolean;
}

export interface WhaleTx {
  id: string;
  hash: string;
  type: 'buy' | 'sell' | 'burn';
  amount: number;
  value: number;
  time: string;
  maker: string;
  label?: string;
}

export interface Memo {
    signature: string;
    message: string;
    sender: string;
    time: string;
}

export interface WalletProfile {
  address: string;
  solBalance: number;
  tokenCount: number;
  grade: string;
  archetype: string;
  topOtherTokens: string[]; 
  isWhale: boolean;
  botProbability: string; 
  walletAge: string;
  nftPfp?: string;
}

export interface TokenSecurity {
    mutable: boolean;
    mintAuthority: boolean; 
    freezeAuthority: boolean; 
    supply: number;
}

export interface NetworkStats {
    tps: number;
    priorityFee: string; 
}

export interface Sentiment {
    buyVol: number;
    sellVol: number;
    ratio: number;
}
