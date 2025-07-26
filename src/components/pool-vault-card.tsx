"use client"

import { TrendingUp, Shield, AlertTriangle } from "lucide-react"
import type { PoolVault } from "./pools-module"

interface PoolVaultCardProps {
  pool: PoolVault
  onViewDetails: () => void
}

export function PoolVaultCard({ pool, onViewDetails }: PoolVaultCardProps) {
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

      {/* Action Button */}
      <button
        onClick={onViewDetails}
        className="w-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 group-hover:border-white/30"
      >
        {pool.userPosition ? "Manage Position" : "View Details"}
      </button>
    </div>
  )
}
