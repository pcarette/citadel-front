"use client"

import { useState } from "react"
import { ArrowUpDown, Settings, Info } from "lucide-react"
import { TokenSelector } from "./token-selector"
import { SwapButton } from "./swap-button"
import { Token } from '@/config/tokens'
import { ALL_TOKENS } from '@/config/tokens'
import { useTokenBalance } from '@/hooks/useTokenBalance'

function TokenBalanceDisplay({ token }: { token: Token }) {
  const { formattedBalance, isLoading } = useTokenBalance(token);
  
  if (isLoading) {
    return <span className="text-sm text-white/60">Loading...</span>;
  }
  
  return (
    <span className="text-sm text-white/60">
      Balance: {parseFloat(formattedBalance).toFixed(4)} {token.symbol}
    </span>
  );
}

export function SwapModule() {
  const [fromToken, setFromToken] = useState<Token>(ALL_TOKENS[0])
  const [toToken, setToToken] = useState<Token>(ALL_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const calculateToAmount = (amount: string) => {
    if (!amount || isNaN(Number(amount))) return ""
    // Simple 1:1 calculation for demo - in real app you'd use DEX pricing
    const toValue = Number(amount) * 0.997 // 0.3% fee simulation
    return toValue.toFixed(6)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    setToAmount(calculateToAmount(value))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Swap Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Swap hello victor</h2>
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
              <TokenBalanceDisplay token={fromToken} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-semibold text-white placeholder-white/40 outline-none min-w-0"
              />
              <TokenSelector
                selectedToken={fromToken}
                tokens={ALL_TOKENS.filter((t) => t.symbol !== toToken.symbol)}
                onSelect={setFromToken}
              />
            </div>
            {fromAmount && (
              <div className="mt-2 text-sm text-white/60">
                {fromAmount} {fromToken.symbol}
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
                value={toAmount}
                readOnly
                className="flex-1 bg-transparent text-2xl font-semibold text-white placeholder-white/40 outline-none min-w-0"
              />
              <TokenSelector
                selectedToken={toToken}
                tokens={ALL_TOKENS.filter((t) => t.symbol !== fromToken.symbol)}
                onSelect={setToToken}
              />
            </div>
            {toAmount && (
              <div className="mt-2 text-sm text-white/60">{toAmount} {toToken.symbol}</div>
            )}
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && (
          <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Rate</span>
              <span>
                1 {fromToken.symbol} = 1 {toToken.symbol} (Demo)
              </span>
            </div>
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Fee (0.3%)</span>
              <span>
                {(Number(fromAmount) * 0.003).toFixed(6)} {fromToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm text-white/80">
              <span>Slippage</span>
              <span>{slippage}%</span>
            </div>
          </div>
        )}

        {/* Swap Action Button */}
        <button
          disabled={!fromAmount || !toAmount}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          {!fromAmount || !toAmount ? "Enter an amount" : `Swap ${fromToken.symbol} for ${toToken.symbol}`}
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <ArrowUpDown className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-white font-medium">Swapped ETH → USDC</div>
                <div className="text-white/60 text-sm">2 minutes ago</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white">1.5 ETH</div>
              <div className="text-white/60 text-sm">$3,510.75</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
