"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowUpDown, Settings, Info } from "lucide-react"
import { TokenSelector } from "./token-selector"
import { SwapButton } from "./swap-button"
import { Token } from '@/config/tokens'
import { ALL_TOKENS } from '@/config/tokens'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useCitadelPricing } from '@/hooks/useCitadelPricing'
import { useCitadelSwap } from '@/hooks/useCitadelSwap'
import { useTransactionHistory } from '@/hooks/useTransactionHistory'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { findCitadelPoolByTokens, isMintOperation } from '@/config/citadel-contracts'
import { Alert } from './ui/alert'

function TokenBalanceDisplay({ token, onMaxClick }: { token: Token; onMaxClick?: (balance: string) => void }) {
  const { formattedBalance, isLoading } = useTokenBalance(token);
  
  if (isLoading) {
    return <span className="text-sm text-white/60">Loading...</span>;
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white/60">
        Balance: {parseFloat(formattedBalance).toFixed(4)} {token.symbol}
      </span>
      {onMaxClick && (
        <button
          onClick={() => onMaxClick(formattedBalance)}
          className="px-2 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded border border-blue-500/20 hover:border-blue-500/30 transition-colors cursor-pointer"
        >
          Max
        </button>
      )}
    </div>
  );
}

export function SwapModule() {
  const [fromToken, setFromToken] = useState<Token>(ALL_TOKENS[0])
  const [toToken, setToToken] = useState<Token>(ALL_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  // Find the Citadel pool for the selected token pair
  const citadelPool = useMemo(() => 
    findCitadelPoolByTokens(fromToken.address, toToken.address), 
    [fromToken.address, toToken.address]
  );

  // Get real pricing from Citadel pool
  const { 
    outputAmount, 
    feeAmount, 
    exchangeRate, 
    isLoading: isPricingLoading,
    isMintOperation: isMinting,
    isRedeemOperation: isRedeeming 
  } = useCitadelPricing(citadelPool, fromToken, toToken, fromAmount);

  // Error handling
  const { errors, removeError, addError, addSuccess } = useErrorHandler();
  
  // Swap execution hooks
  const { executeSwap, approveToken, isPending, isConfirming, isSuccess, isTransactionError, error, transactionError, hash } = useCitadelSwap();
  
  // Check allowance for both mint (FDUSD) and redeem (cEUR) operations
  const needsAllowanceCheck = citadelPool && fromAmount && (
    isMintOperation(fromToken.address, toToken.address, citadelPool) || // FDUSD -> cEUR (mint)
    !isMintOperation(fromToken.address, toToken.address, citadelPool)   // cEUR -> FDUSD (redeem)
  );
  const { 
    allowance,
    isLoading: allowanceLoading, 
    checkSufficientAllowance, 
    getMissingAllowance,
    refetch: refetchAllowance 
  } = useTokenAllowance(
    needsAllowanceCheck ? fromToken.address : undefined,
    needsAllowanceCheck ? citadelPool.address : undefined,
    needsAllowanceCheck
  );

  const hasSufficientAllowance = needsAllowanceCheck ? checkSufficientAllowance(fromAmount, fromToken.decimals) : true;
  const missingAllowance = needsAllowanceCheck ? getMissingAllowance(fromAmount, fromToken.decimals) : '0';
  
  // Transaction history
  const { transactions, isLoading: historyLoading } = useTransactionHistory(5);

  // Handle transaction states
  useEffect(() => {
    if (error) {
      addError(error, 'Transaction Preparation');
    }
  }, [error, addError]);

  useEffect(() => {
    if (isTransactionError && transactionError) {
      addError(transactionError, 'Transaction');
    }
  }, [isTransactionError, transactionError, addError]);

  useEffect(() => {
    if (isSuccess && hash) {
      addSuccess(
        `Transaction completed successfully. Hash: ${hash.slice(0, 10)}...`,
        'Transaction Successful'
      );
      
      // Refetch allowance after successful transaction
      if (needsAllowanceCheck) {
        setTimeout(() => {
          refetchAllowance();
        }, 2000);
      }
    }
  }, [isSuccess, hash, addSuccess, needsAllowanceCheck, refetchAllowance]);

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount("")
  }

  const handleMaxClick = (balance: string) => {
    setFromAmount(balance);
  }

  const handleApproval = async () => {
    if (!citadelPool || !fromAmount || !needsAllowanceCheck) return;
    
    try {
      await approveToken(
        fromToken.address,
        citadelPool.address,
        fromAmount,
        fromToken.decimals
      );
      
      // Refetch allowance after approval
      setTimeout(() => {
        refetchAllowance();
      }, 2000);
      
    } catch (error) {
      addError(error, 'Token Approval');
    }
  };

  const handleSwap = async () => {
    if (!citadelPool || !fromAmount || !outputAmount) return;
    
    // Check allowance before swap for both mint and redeem operations
    if (needsAllowanceCheck && !hasSufficientAllowance) {
      addError(
        new Error(`Insufficient allowance. You need to approve ${missingAllowance} more ${fromToken.symbol}`),
        'Insufficient Allowance'
      );
      return;
    }
    
    try {
      await executeSwap(
        citadelPool,
        fromToken,
        toToken,
        fromAmount,
        outputAmount,
        parseFloat(slippage)
      );
    } catch (error) {
      addError(error, 'Swap Execution');
    }
  };

  return (
    <div>
      {/* Error/Success Alerts */}
      {errors.length > 0 && (
        <div className="space-y-3 mb-6">
          {errors.map((error) => (
            <Alert
              key={error.id}
              variant={error.variant === 'info' ? 'success' : error.variant}
              title={error.title}
              dismissible={error.dismissible}
              autoClose={error.autoClose}
              duration={error.duration}
              onClose={() => removeError(error.id)}
            >
              {error.message}
            </Alert>
          ))}
        </div>
      )}

      {/* Main Swap Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Swap</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-white/80" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Info className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        {/* From Token Section */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">From</span>
              <TokenBalanceDisplay token={fromToken} onMaxClick={handleMaxClick} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-semibold text-white placeholder-white/40 outline-none min-w-0"
              />
              <TokenSelector
                selectedToken={fromToken}
                tokens={ALL_TOKENS.filter((t) => t.symbol !== toToken.symbol)}
                onSelect={setFromToken}
              />
            </div>
            {fromAmount && citadelPool && (
              <div className="mt-2 text-sm text-white/60">
                {isMinting ? 'Minting' : 'Redeeming'} via {citadelPool.name}
              </div>
            )}
            {fromAmount && !citadelPool && (
              <div className="mt-2 text-sm text-red-400">
                No Citadel pool available for this pair
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <SwapButton onClick={handleSwapTokens} />
          </div>

          {/* To Token Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">To</span>
              <TokenBalanceDisplay token={toToken} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                placeholder="0.0"
                value={isPricingLoading ? 'Loading...' : outputAmount}
                readOnly
                className="flex-1 bg-transparent text-2xl font-semibold text-white placeholder-white/40 outline-none min-w-0"
              />
              <TokenSelector
                selectedToken={toToken}
                tokens={ALL_TOKENS.filter((t) => t.symbol !== fromToken.symbol)}
                onSelect={setToToken}
              />
            </div>
            {outputAmount && Number(outputAmount) > 0 && (
              <div className="mt-2 text-sm text-white/60">
                {outputAmount} {toToken.symbol}
              </div>
            )}
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && outputAmount && citadelPool && (
          <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Exchange Rate</span>
              <span>
                1 {fromToken.symbol} = {exchangeRate || '0'} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Protocol Fee</span>
              <span>
                {Number(feeAmount).toFixed(6)} {fromToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Operation</span>
              <span>{isMinting ? 'Mint Synthetic' : 'Redeem Collateral'}</span>
            </div>
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
            {needsAllowanceCheck && (
              <div className="flex justify-between text-sm text-white/80">
                <span>Allowance Status</span>
                <span className={hasSufficientAllowance ? 'text-green-400' : 'text-orange-400'}>
                  {allowanceLoading ? 'Checking...' : hasSufficientAllowance ? 'Sufficient' : `Need ${missingAllowance} more`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Approval/Swap Action Buttons */}
        {needsAllowanceCheck && !hasSufficientAllowance && fromAmount && outputAmount && citadelPool ? (
          <button
            onClick={handleApproval}
            disabled={isPending || isConfirming || allowanceLoading}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending || isConfirming 
              ? (isPending ? 'Confirming...' : 'Processing...') 
              : `Approve ${fromToken.symbol}`
            }
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={!fromAmount || !outputAmount || !citadelPool || isPending || isConfirming || isPricingLoading || allowanceLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending || isConfirming 
              ? (isPending ? 'Confirming...' : 'Processing...') 
              : !fromAmount || !outputAmount
              ? "Enter an amount"
              : !citadelPool
              ? "Pool not available"
              : allowanceLoading
              ? "Checking allowance..."
              : `${isMinting ? 'Mint' : 'Redeem'} ${toToken.symbol}`
            }
          </button>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
        {historyLoading ? (
          <div className="text-center py-4 text-white/60">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.hash} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'mint' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    <ArrowUpDown className={`w-4 h-4 ${
                      tx.type === 'mint' ? 'text-green-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {tx.type === 'mint' ? 'Minted' : 'Redeemed'} {tx.poolSymbol}
                    </div>
                    <div className="text-white/60 text-sm">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white">
                    {tx.type === 'mint' ? tx.syntheticAmount : tx.collateralAmount} {tx.type === 'mint' ? tx.poolSymbol : tx.collateralSymbol}
                  </div>
                  <div className="text-white/60 text-sm">
                    Fee: {Number(tx.feeAmount).toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-white/60">No recent transactions</div>
        )}
      </div>
    </div>
  )
}
