
import { NavItem, SectionId, TokenStat } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'The Hunt', id: SectionId.HERO },
  { label: 'Harpoon', id: SectionId.GAME },
  { label: 'The Thesis', id: SectionId.LORE },
  { label: 'Loot', id: SectionId.TOKENOMICS },
  { label: 'Radar', id: SectionId.RADAR },
  { label: 'The Flippening', id: SectionId.FLIPPENING },
  { label: 'Oracle', id: SectionId.ORACLE },
];

export const TOKEN_STATS: TokenStat[] = [
  { label: 'Max Supply', value: '1B', description: 'One Billion Harpoons.' },
  { label: 'Tax', value: '0/0', description: 'No tax. Only gas and glory.' },
  { label: 'Liquidity', value: 'BURNT', description: 'The ship has no reverse gear.' },
];

export const MANIFESTO_PARAGRAPHS = [
  "Ahab is the original Degen.",
  "We do not trade with logic.",
  "We trade with violent intent."
];

// --- FLIPPENING CONFIG ---
export const HELIUS_API_KEY = 'f7d6a830-5ce4-436e-bd8d-73f75b0f0c52';
export const TARGET_WHALE_CA = 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump'; // $WhiteWhale
// Official CA
export const AHAB_CA = 'AHABxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; 

// Simulated Data for the "Live" feel until $AHAB is live
export const AHAB_PLACEHOLDER_STATS = {
  price: 0.00042,
  mcap: 420000,
  holders: 312
};
