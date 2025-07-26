"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { TrendingUp, Shield, AlertTriangle, Plus, Minus } from "lucide-react"
import { formatUnits } from "viem"
import type { PoolVault } from "./pools-module"
import { useVaultDeposit, useVaultWithdraw, useCollateralApproval, useVaultBalances } from "@/hooks/useVaultOperations"

interface PoolVaultCardProps {
  pool: PoolVault
  onViewDetails: () => void
}

export function PoolVaultCard({ pool, onViewDetails }: PoolVaultCardProps) {
  const { address } = useAccount()
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit")

  const { deposit, isPending: isDepositPending, isConfirmed: isDepositConfirmed } = useVaultDeposit(pool.address as `0x${string}`)
  const { withdraw, isPending: isWithdrawPending, isConfirmed: isWithdrawConfirmed } = useVaultWithdraw(pool.address as `0x${string}`)
  const { approve, needsApproval, isPending: isApprovePending, isConfirmed: isApproveConfirmed } = useCollateralApproval(
    pool.address as `0x${string}`, 
    address as `0x${string}`
  )
  const { collateralBalance, lpTokenBalance } = useVaultBalances(
    pool.address as `0x${string}`, 
    address as `0x${string}`
  )

  const handleDeposit = async () => {
    if (!address || !depositAmount) return
    
    if (needsApproval && needsApproval(depositAmount)) {
      approve(depositAmount)
    } else {
      deposit(depositAmount, address)
    }
  }

  const handleWithdraw = () => {
    if (!address || !withdrawAmount) return
    withdraw(withdrawAmount, address)
  }

  const setMaxBalance = (type: "deposit" | "withdraw") => {
    if (type === "deposit" && collateralBalance) {
      setDepositAmount(formatUnits(collateralBalance, 18))
    } else if (type === "withdraw" && lpTokenBalance) {
      setWithdrawAmount(formatUnits(lpTokenBalance, 18))
    }
  }
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-400 bg-green-400/20"
      case "Medium":
        return "text-yellow-400 bg-yellow-400/20"
      case "High":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low":
        return <Shield className="w-4 h-4" />
      case "Medium":
        return <TrendingUp className="w-4 h-4" />
      case "High":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-2xl">{pool.baseIcon}</span>
            <span className="text-2xl -ml-2">{pool.synthIcon}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{pool.name}</h3>
            <p className="text-sm text-white/60">
              {pool.baseToken}/{pool.synthToken}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getRiskColor(pool.riskLevel)}`}>
          {getRiskIcon(pool.riskLevel)}
          <span className="text-xs font-medium">{pool.riskLevel}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-white/60 mb-1">TVL</div>
          <div className="text-lg font-bold text-white">${(pool.tvl / 1000000).toFixed(1)}M</div>
        </div>
        <div>
          <div className="text-sm text-white/60 mb-1">APY</div>
          <div className="text-lg font-bold text-green-400">{pool.apy}%</div>
        </div>
      </div>

      {/* Pool Health Indicators */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-white/80 mb-2">
          <span>Utilization</span>
          <span>{pool.lpInfo.utilization}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pool.lpInfo.utilization}%` }}
          />
        </div>
      </div>

      {/* User Position Indicator */}
      {pool.userPosition && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-300">Your Position</span>
            <span className="text-sm font-semibold text-blue-300">${pool.userPosition.value.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-white/60 mb-4">{pool.description}</p>

      {/* Liquidity Management */}
      {address ? (
        <div className="space-y-4">
          {/* Tab Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === "deposit"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Liquidity
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === "withdraw"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
              }`}
            >
              <Minus className="w-4 h-4" />
              Remove Liquidity
            </button>
          </div>

          {/* Input Section */}
          {activeTab === "deposit" ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Amount to deposit</span>
                <span className="text-white/60">
                  Balance: {collateralBalance ? Number(formatUnits(collateralBalance, 18)).toFixed(2) : "0"} FDUSD
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                />
                <button
                  onClick={() => setMaxBalance("deposit")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm hover:text-blue-300"
                >
                  MAX
                </button>
              </div>
              <input
                type="range"
                min="0"
                max={collateralBalance ? formatUnits(collateralBalance, 18) : "100"}
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
              <button
                onClick={handleDeposit}
                disabled={!depositAmount || isDepositPending || isApprovePending}
                className="w-full bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 text-green-400 font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApprovePending
                  ? "Approving..."
                  : isDepositPending
                  ? "Depositing..."
                  : needsApproval && needsApproval(depositAmount)
                  ? "Approve FDUSD"
                  : "Provide Liquidity"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">LP tokens to withdraw</span>
                <span className="text-white/60">
                  Balance: {lpTokenBalance ? Number(formatUnits(lpTokenBalance, 18)).toFixed(2) : "0"} LP
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:border-red-500/50 focus:outline-none"
                />
                <button
                  onClick={() => setMaxBalance("withdraw")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm hover:text-red-300"
                >
                  MAX
                </button>
              </div>
              <input
                type="range"
                min="0"
                max={lpTokenBalance ? formatUnits(lpTokenBalance, 18) : "100"}
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || isWithdrawPending}
                className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWithdrawPending ? "Withdrawing..." : "Remove Liquidity"}
              </button>
            </div>
          )}
          
          {/* View Details Button */}
          <button
            onClick={onViewDetails}
            className="w-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 hover:from-blue-500/20 hover:to-purple-600/20 border border-white/10 text-white/80 font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
          >
            View Detailed Analytics
          </button>
        </div>
      ) : (
        <button
          onClick={onViewDetails}
          className="w-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 group-hover:border-white/30"
        >
          Connect Wallet to Provide Liquidity
        </button>
      )}
    </div>
  )
}
