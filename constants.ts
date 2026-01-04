
import { NavItem, SectionId, TokenStat } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Ascension', id: SectionId.HERO },
  { label: 'The Blueprint', id: SectionId.LORE },
  { label: 'Treasury', id: SectionId.TOKENOMICS },
  { label: 'Sonar', id: SectionId.RADAR },
  { label: 'The Flipperning', id: SectionId.FLIPPENING },
  { label: 'Defend', id: SectionId.GAME },
  { label: 'Oracle', id: SectionId.ORACLE },
];

export const TOKEN_STATS: TokenStat[] = [
  { label: 'Total Supply', value: '1B', description: 'Immutable Ocean' },
  { label: 'Authority', value: 'NULL', description: 'Power to the Pod' },
  { label: 'Liquidity', value: 'LOCKED', description: 'Eternal Stewardship' },
];

// --- CONFIG ---
export const HELIUS_API_KEY = 'f7d6a830-5ce4-436e-bd8d-73f75b0f0c52';

// CAs for The Flipperning
export const AHAB_CA = '6Wv4Li6toFybiJajVN3ZBTi7hF8DGbujmewqc86tpump'; // The Hunter
export const WHITE_WHALE_CA = 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump'; // The Target

export const AHAB_PLACEHOLDER_STATS = {
  price: 0.00042,
  mcap: 420000,
  holders: 312
};
