import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Citadel Front',
  projectId: 'temp-project-id', // Temporary ID for development
  chains: [bsc],
  ssr: true,
});