import { Address } from 'viem';
import { CONTRACT_ADDRESSES } from './contracts';

export interface Token {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// FDUSD token only
export const BSC_TOKENS: Token[] = [
  {
    address: CONTRACT_ADDRESSES.collateral,
    name: 'First Digital USD',
    symbol: 'FDUSD',
    decimals: 18,
  },
];

// cEUR token only
export const CITADEL_SYNTHETIC_TOKENS: Token[] = [
  {
    address: '0x0B5e46027B856E6109E9817C37ddaB1796331E56',
    name: 'Citadel EUR',
    symbol: 'cEUR',
    decimals: 18,
  },
];

export const ALL_TOKENS = [...BSC_TOKENS, ...CITADEL_SYNTHETIC_TOKENS];