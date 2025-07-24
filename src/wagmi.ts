import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bscTestnet } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'Citadel Front',
  projectId: 'temp-project-id', // Temporary ID for development
  chains: [bscTestnet],
  ssr: true,
});