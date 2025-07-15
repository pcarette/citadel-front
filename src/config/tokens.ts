import { Address } from 'viem';

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
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    name: 'PancakeSwap Token',
    symbol: 'CAKE',
    decimals: 18,
  },
  {
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    name: 'Ethereum Token',
    symbol: 'ETH',
    decimals: 18,
  },
  {
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    name: 'Bitcoin Token',
    symbol: 'BTCB',
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

export const ALL_TOKENS = [BNB_TOKEN, ...BSC_TOKENS];