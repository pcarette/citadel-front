"use client"

import { TrendingUp } from "lucide-react"
import type { PoolVault } from "./pools-module"

interface UserPositionsProps {
  pools: PoolVault[]
  onViewDetails: (pool: PoolVault) => void
}

export function UserPositions({ pools, onViewDetails }: UserPositionsProps) {
  const totalValue = pools.reduce((sum, pool) => sum + (pool.userPosition?.value || 0), 0)

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">${totalValue.toLocaleString()}</div>
            <div className="text-white/60">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">+12.5%</div>
            <div className="text-white/60">24h Change</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{pools.length}</div>
            <div className="text-white/60">Active Positions</div>
          </div>
        </div>
      </div>

      {/* Position Cards */}
      <div className="space-y-4">
        {pools.map((pool) => (
          <div key={pool.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <span className="text-2xl">{pool.baseIcon}</span>
                  <span className="text-2xl -ml-2">{pool.synthIcon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{pool.name}</h3>
                  <p className="text-sm text-white/60">
                    {pool.userPosition?.amount} {pool.baseToken}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">${pool.userPosition?.value.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+5.2%</span>
                </div>
              </div>
            </div>

            {/* Position Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-sm text-white/60 mb-1">Collateral</div>
                <div className="text-lg font-semibold text-white">
                  ${pool.userPosition?.lpInfo.actualCollateralAmount.toLocaleString()}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-sm text-white/60 mb-1">Utilization</div>
                <div className="text-lg font-semibold text-white">{pool.userPosition?.lpInfo.utilization}%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-sm text-white/60 mb-1">Coverage</div>
                <div className="text-lg font-semibold text-white">{pool.userPosition?.lpInfo.coverage}%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-sm text-white/60 mb-1">Capacity</div>
                <div className="text-lg font-semibold text-white">
                  ${pool.userPosition?.lpInfo.capacity.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewDetails(pool)}
              className="w-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
