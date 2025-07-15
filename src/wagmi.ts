import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define your local BSC fork
const localBscFork = defineChain({
  id: 56, // Keep BSC chain ID for compatibility
  name: 'Local BSC Fork',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BSC_FORK_RPC_URL || 'http://127.0.0.1:46500'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Local Explorer',
      url: process.env.NEXT_PUBLIC_BSC_FORK_RPC_URL || 'http://127.0.0.1:46500',
    },
  },
});

export const config = getDefaultConfig({
  appName: 'Citadel Front',
  projectId: 'temp-project-id', // Temporary ID for development
  chains: [localBscFork],
  ssr: true,
});