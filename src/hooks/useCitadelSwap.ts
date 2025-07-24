import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, Address } from 'viem';
import { CITADEL_MULTI_LP_POOL_ABI, ERC20_ABI, CitadelPool, isMintOperation } from '@/config/citadel-contracts';
import { Token } from '@/config/tokens';

export function useCitadelSwap() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, isError: isTransactionError, error: transactionError } = useWaitForTransactionReceipt({
    hash,
  });

  const executeSwap = async (
    pool: CitadelPool,
    fromToken: Token,
    toToken: Token,
    inputAmount: string,
    minOutputAmount: string,
    slippagePercent: number = 0.5
  ) => {
    try {
      if (!address) {
        throw new Error('Please connect your wallet to continue.');
      }
      
      const amountIn = parseUnits(inputAmount, fromToken.decimals);
      const minAmountOut = parseUnits(minOutputAmount, toToken.decimals);
      
      // Calculate slippage-adjusted minimum
      const slippageMultiplier = (100 - slippagePercent) / 100;
      const adjustedMinOut = BigInt(Math.floor(Number(minAmountOut) * slippageMultiplier));
      
      // Set expiration to 20 minutes from now
      const expiration = Math.floor(Date.now() / 1000) + 1200;
      
      if (isMintOperation(fromToken.address, toToken.address, pool)) {
        // Minting synthetic tokens from collateral
        writeContract({
          address: pool.address,
          abi: CITADEL_MULTI_LP_POOL_ABI,
          functionName: 'mint',
          args: [{
            minNumTokens: adjustedMinOut,
            collateralAmount: amountIn,
            expiration: BigInt(expiration),
            recipient: address,
          }],
        });
      } else {
        // Redeeming collateral from synthetic tokens
        writeContract({
          address: pool.address,
          abi: CITADEL_MULTI_LP_POOL_ABI,
          functionName: 'redeem',
          args: [{
            numTokens: amountIn,
            minCollateral: adjustedMinOut,
            expiration: BigInt(expiration),
            recipient: address,
          }],
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const approveToken = async (tokenAddress: Address, spenderAddress: Address, amount: string, decimals: number) => {
    try {
      if (!address) {
        throw new Error('Please connect your wallet to continue.');
      }

      const amountBigInt = parseUnits(amount, decimals);
      
      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, amountBigInt],
      });
    } catch (error) {
      throw error;
    }
  };

  return {
    executeSwap,
    approveToken,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isTransactionError,
    error,
    transactionError,
  };
}