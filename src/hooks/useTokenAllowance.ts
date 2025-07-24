import { useReadContract, useAccount } from 'wagmi';
import { Address, parseUnits } from 'viem';
import { ERC20_ABI } from '@/config/citadel-contracts';

export function useTokenAllowance(
  tokenAddress: Address | undefined,
  spenderAddress: Address | undefined,
  enabled: boolean = true
) {
  const { address: userAddress } = useAccount();

  const { data: allowance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress && spenderAddress ? [userAddress, spenderAddress] : undefined,
    query: {
      enabled: enabled && !!userAddress && !!tokenAddress && !!spenderAddress,
    },
  });

  const checkSufficientAllowance = (amount: string, decimals: number): boolean => {
    if (!allowance || !amount) return false;
    
    try {
      const requiredAmount = parseUnits(amount, decimals);
      return allowance >= requiredAmount;
    } catch {
      return false;
    }
  };

  const getMissingAllowance = (amount: string, decimals: number): string => {
    if (!allowance || !amount) return amount;
    
    try {
      const requiredAmount = parseUnits(amount, decimals);
      if (allowance >= requiredAmount) return '0';
      
      const missing = requiredAmount - allowance;
      return (Number(missing) / Math.pow(10, decimals)).toString();
    } catch {
      return amount;
    }
  };

  return {
    allowance,
    isLoading,
    refetch,
    checkSufficientAllowance,
    getMissingAllowance,
  };
}