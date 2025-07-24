import { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Address, Log, decodeEventLog, formatUnits } from 'viem';
import { CITADEL_POOLS } from '@/config/citadel-contracts';

export interface Transaction {
  hash: string;
  blockNumber: bigint;
  timestamp: number;
  type: 'mint' | 'redeem';
  poolAddress: Address;
  user: Address;
  collateralAmount: string;
  syntheticAmount: string;
  feeAmount: string;
  poolSymbol: string;
  collateralSymbol: string;
}

// Event signatures for Citadel pools
  const CITADEL_EVENTS = {
    // Minted event: when user mints synthetic tokens
    Minted: {
      inputs: [
        { indexed: true, name: 'user', type: 'address' },
        {
          indexed: false,
          name: 'mintvalues',
          type: 'tuple',
          components: [
            { name: 'totalCollateral', type: 'uint256' },
            { name: 'exchangeAmount', type: 'uint256' },
            { name: 'feeAmount', type: 'uint256' },
            { name: 'numTokens', type: 'uint256' }
          ]
        },
        { indexed: false, name: 'recipient', type: 'address' }
      ],
      name: 'Minted',
      type: 'event',
    },
    // Redeemed event: when user redeems collateral
    Redeemed: {
      inputs: [
        { indexed: true, name: 'user', type: 'address' },
        {
          indexed: false,
          name: 'redeemvalues',
          type: 'tuple',
          components: [
            { name: 'numTokens', type: 'uint256' },
            { name: 'exchangeAmount', type: 'uint256' },
            { name: 'feeAmount', type: 'uint256' },
            { name: 'collateralAmount', type: 'uint256' }
          ]
        },
        { indexed: false, name: 'recipient', type: 'address' }
      ],
      name: 'Redeemed',
      type: 'event',
    },
  } as const;


export function useTransactionHistory(limit: number = 10) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !publicClient) return;

    const fetchTransactionHistory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const allTransactions: Transaction[] = [];

        // Fetch events from all Citadel pools
        for (const pool of CITADEL_POOLS) {
          try {
            // Get the latest block number
            const latestBlock = await publicClient.getBlockNumber();
            const fromBlock = latestBlock - 10000n; // Look back ~10k blocks

            // Fetch Mint events
            const mintLogs = await publicClient.getLogs({
              address: pool.address,
              events: [CITADEL_EVENTS.Mint],
              args: {
                user: address,
              },
              fromBlock,
              toBlock: 'latest',
            });

            // Fetch Redeem events
            const redeemLogs = await publicClient.getLogs({
              address: pool.address,
              events: [CITADEL_EVENTS.Redeem],
              args: {
                user: address,
              },
              fromBlock,
              toBlock: 'latest',
            });

            // Process mint transactions
            for (const log of mintLogs) {
              try {
                const decoded = decodeEventLog({
                  abi: [CITADEL_EVENTS.Mint],
                  data: log.data,
                  topics: log.topics,
                });

                const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                
                allTransactions.push({
                  hash: log.transactionHash,
                  blockNumber: log.blockNumber,
                  timestamp: Number(block.timestamp) * 1000,
                  type: 'mint',
                  poolAddress: pool.address,
                  user: decoded.args.user,
                  collateralAmount: formatUnits(decoded.args.collateralAmount, 18),
                  syntheticAmount: formatUnits(decoded.args.syntheticAmount, 18),
                  feeAmount: formatUnits(decoded.args.feeAmount, 18),
                  poolSymbol: pool.symbol,
                  collateralSymbol: pool.collateralSymbol,
                });
              } catch (decodeError) {
                console.warn('Failed to decode mint log:', decodeError);
              }
            }

            // Process redeem transactions
            for (const log of redeemLogs) {
              try {
                const decoded = decodeEventLog({
                  abi: [CITADEL_EVENTS.Redeem],
                  data: log.data,
                  topics: log.topics,
                });

                const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                
                allTransactions.push({
                  hash: log.transactionHash,
                  blockNumber: log.blockNumber,
                  timestamp: Number(block.timestamp) * 1000,
                  type: 'redeem',
                  poolAddress: pool.address,
                  user: decoded.args.user,
                  collateralAmount: formatUnits(decoded.args.collateralAmount, 18),
                  syntheticAmount: formatUnits(decoded.args.syntheticAmount, 18),
                  feeAmount: formatUnits(decoded.args.feeAmount, 18),
                  poolSymbol: pool.symbol,
                  collateralSymbol: pool.collateralSymbol,
                });
              } catch (decodeError) {
                console.warn('Failed to decode redeem log:', decodeError);
              }
            }
          } catch (poolError) {
            console.warn(`Failed to fetch events for pool ${pool.address}:`, poolError);
          }
        }

        // Sort by timestamp (newest first) and limit
        const sortedTransactions = allTransactions
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);

        setTransactions(sortedTransactions);
      } catch (err) {
        setError('Failed to fetch transaction history');
        console.error('Transaction history error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [address, publicClient, limit]);

  // Function to manually refresh history
  const refresh = () => {
    if (address && publicClient) {
      setTransactions([]);
      // The useEffect will automatically refetch
    }
  };

  return {
    transactions,
    isLoading,
    error,
    refresh,
  };
}

// Hook for adding a new transaction to local state (for immediate UI updates)
export function useAddTransaction() {
  const addTransaction = (transaction: Omit<Transaction, 'timestamp'>) => {
    // This could store in localStorage or a global state
    // For now, we'll just trigger a refresh of the transaction history
    window.dispatchEvent(new CustomEvent('citadel-transaction-added', { detail: transaction }));
  };

  return { addTransaction };
}