
export interface TokenStat {
  label: string;
  value: string;
  description: string;
}

export enum SectionId {
  HERO = 'hero',
  GAME = 'game',
  LORE = 'lore',
  TOKENOMICS = 'tokenomics',
  RADAR = 'radar',
  FLIPPENING = 'flippening',
  ORACLE = 'oracle'
}

export interface NavItem {
  label: string;
  id: SectionId;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
