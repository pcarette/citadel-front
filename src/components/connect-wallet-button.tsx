'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet } from 'lucide-react';

//! unused actually but keep in mind wanted button design

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
    }
  };

  return (
    <button 
      onClick={handleConnect}
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
    >
      <Wallet className="w-4 h-4" />
      <span>
        {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
      </span>
    </button>
  );
}