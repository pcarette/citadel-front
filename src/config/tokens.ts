import { Address } from 'viem';
import { CONTRACT_ADDRESSES } from './contracts';

export interface Token {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// Common BSC tokens - addresses are the same on your fork
export const BSC_TOKENS: Token[] = [
  {
    address: '0x55d398326f99059fF775485246999027B3197955',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 18,
  },
  {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 18,
  },
  {
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  },
  {
    address: CONTRACT_ADDRESSES.collateral,
    name: 'First Digital USD',
    symbol: 'FDUSD',
    decimals: 18,
  },
];

// Citadel synthetic tokens - update with your actual deployed addresses
export const CITADEL_SYNTHETIC_TOKENS: Token[] = [
  {
    address: '0x0B5e46027B856E6109E9817C37ddaB1796331E56',
    name: 'Citadel EUR',
    symbol: 'cEUR',
    decimals: 18,
  },
  {
    address: '0x0000000000000000000000000000000000000004',
    name: 'Citadel USD',
    symbol: 'cUSD',
    decimals: 18,
  },
  {
    address: '0x0000000000000000000000000000000000000006',
    name: 'Citadel Gold',
    symbol: 'cGOLD',
    decimals: 18,
  },
];

// Native BNB token
export const BNB_TOKEN: Token = {
  address: '0x0000000000000000000000000000000000000000' as Address,
  name: 'Binance Coin',
  symbol: 'BNB',
  decimals: 18,
};

export const ALL_TOKENS = [BNB_TOKEN, ...BSC_TOKENS, ...CITADEL_SYNTHETIC_TOKENS];