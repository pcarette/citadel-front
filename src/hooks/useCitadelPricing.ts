import { useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CITADEL_MULTI_LP_POOL_ABI, CitadelPool, isMintOperation, isRedeemOperation } from '@/config/citadel-contracts';
import { Token } from '@/config/tokens';

export function useCitadelPricing(
  pool: CitadelPool | undefined,
  fromToken: Token,
  toToken: Token,
  amount: string
) {
  const amountBigInt = amount && !isNaN(Number(amount)) 
    ? parseUnits(amount, fromToken.decimals) 
    : 0n;

  // For mint operations (collateral -> synthetic)
  const {
    data: mintTradeInfo,
    isLoading: isMintLoading,
    isError: isMintError,
  } = useReadContract({
    address: pool?.address,
    abi: CITADEL_MULTI_LP_POOL_ABI,
    functionName: 'getMintTradeInfo',
    args: [amountBigInt],
    query: {
      enabled: !!pool && !!amount && isMintOperation(fromToken.address, toToken.address, pool),
    },
  });

  // For redeem operations (synthetic -> collateral)
  const {
    data: redeemTradeInfo,
    isLoading: isRedeemLoading,
    isError: isRedeemError,
  } = useReadContract({
    address: pool?.address,
    abi: CITADEL_MULTI_LP_POOL_ABI,
    functionName: 'getRedeemTradeInfo',
    args: [amountBigInt],
    query: {
      enabled: !!pool && !!amount && isRedeemOperation(fromToken.address, toToken.address, pool),
    },
  });

  const isLoading = isMintLoading || isRedeemLoading;
  const isError = isMintError || isRedeemError;

  // Calculate output amount and fees
  let outputAmount = '0';
  let feeAmount = '0';
  let exchangeRate = '0';

  if (mintTradeInfo && isMintOperation(fromToken.address, toToken.address, pool!)) {
    outputAmount = formatUnits(mintTradeInfo[0], toToken.decimals);
    feeAmount = formatUnits(mintTradeInfo[1], fromToken.decimals);
    if (Number(amount) > 0) {
      exchangeRate = (Number(outputAmount) / Number(amount)).toFixed(6);
    }
  } else if (redeemTradeInfo && isRedeemOperation(fromToken.address, toToken.address, pool!)) {
    outputAmount = formatUnits(redeemTradeInfo[0], toToken.decimals);
    feeAmount = formatUnits(redeemTradeInfo[1], toToken.decimals);
    if (Number(amount) > 0) {
      exchangeRate = (Number(outputAmount) / Number(amount)).toFixed(6);
    }
  }

  return {
    outputAmount,
    feeAmount,
    exchangeRate,
    isLoading,
    isError,
    isMintOperation: pool ? isMintOperation(fromToken.address, toToken.address, pool) : false,
    isRedeemOperation: pool ? isRedeemOperation(fromToken.address, toToken.address, pool) : false,
  };
}