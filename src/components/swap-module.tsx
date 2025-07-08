"use client"

import { useState } from "react"
import { ArrowUpDown, Settings, Info } from "lucide-react"
import { TokenSelector } from "./token-selector"
import { SwapButton } from "./swap-button"

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  price: number
}

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠", balance: "2.5431", price: 2340.5 },
  { symbol: "USDC", name: "USD Coin", icon: "💵", balance: "1,250.00", price: 1.0 },
  { symbol: "USDT", name: "Tether", icon: "₮", balance: "500.00", price: 0.999 },
  { symbol: "DAI", name: "Dai Stablecoin", icon: "◈", balance: "750.25", price: 1.001 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", icon: "₿", balance: "0.1234", price: 43250.0 },
  { symbol: "UNI", name: "Uniswap", icon: "🦄", balance: "125.50", price: 6.75 },
]

export function SwapModule() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0])
  const [toToken, setToToken] = useState<Token>(tokens[1])
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
    const fromValue = Number(amount) * fromToken.price
    const toValue = fromValue / toToken.price
    return (toValue * 0.997).toFixed(6) // 0.3% fee simulation
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
              <span className="text-sm text-white/60">
                Balance: {fromToken.balance} {fromToken.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-semibold text-white placeholder-white/40 outline-none"
              />
              <TokenSelector
                selectedToken={fromToken}
                tokens={tokens.filter((t) => t.symbol !== toToken.symbol)}
                onSelect={setFromToken}
              />
            </div>
            {fromAmount && (
              <div className="mt-2 text-sm text-white/60">
                ≈ ${(Number(fromAmount) * fromToken.price).toLocaleString()}
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
              <span className="text-sm text-white/60">
                Balance: {toToken.balance} {toToken.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="flex-1 bg-transparent text-2xl font-semibold text-white placeholder-white/40 outline-none"
              />
              <TokenSelector
                selectedToken={toToken}
                tokens={tokens.filter((t) => t.symbol !== fromToken.symbol)}
                onSelect={setToToken}
              />
            </div>
            {toAmount && (
              <div className="mt-2 text-sm text-white/60">≈ ${(Number(toAmount) * toToken.price).toLocaleString()}</div>
            )}
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && (
          <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>Rate</span>
              <span>
                1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(4)} {toToken.symbol}
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
