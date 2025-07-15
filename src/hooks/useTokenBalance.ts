import { useAccount, useBalance, useReadContract } from 'wagmi';
import { Address, formatUnits } from 'viem';
import { Token } from '@/config/tokens';

// ERC20 ABI for balanceOf function
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

export function useTokenBalance(token: Token) {
  const { address } = useAccount();
  
  // Use native balance hook for BNB (address 0x0)
  const {
    data: nativeBalance,
    isError: nativeError,
    isLoading: nativeLoading,
  } = useBalance({
    address,
    query: {
      enabled: token.address === '0x0000000000000000000000000000000000000000' && !!address,
    },
  });

  // Use contract read for ERC20 tokens
  const {
    data: erc20Balance,
    isError: erc20Error,
    isLoading: erc20Loading,
  } = useReadContract({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: token.address !== '0x0000000000000000000000000000000000000000' && !!address,
    },
  });

  const isNative = token.address === '0x0000000000000000000000000000000000000000';
  const balance = isNative ? nativeBalance?.value : erc20Balance;
  const isLoading = isNative ? nativeLoading : erc20Loading;
  const isError = isNative ? nativeError : erc20Error;

  const formattedBalance = balance 
    ? formatUnits(balance, token.decimals)
    : '0';

  return {
    balance,
    formattedBalance,
    isLoading,
    isError,
  };
}