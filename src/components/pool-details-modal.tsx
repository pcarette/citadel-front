"use client"

import { X, TrendingUp, Shield, AlertCircle, Info } from "lucide-react"
import type { PoolVault } from "./pools-module"

interface PoolDetailsModalProps {
  pool: PoolVault
  onClose: () => void
}

export function PoolDetailsModal({ pool, onClose }: PoolDetailsModalProps) {
  const lpInfo = pool.userPosition?.lpInfo || pool.lpInfo

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-3xl">{pool.baseIcon}</span>
              <span className="text-3xl -ml-2">{pool.synthIcon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{pool.name}</h2>
              <p className="text-white/60">{pool.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Pool Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/60 mb-2">Total Value Locked</div>
              <div className="text-2xl font-bold text-white">${(pool.tvl / 1000000).toFixed(1)}M</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/60 mb-2">APY</div>
              <div className="text-2xl font-bold text-green-400">{pool.apy}%</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/60 mb-2">Risk Level</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-white">{pool.riskLevel}</div>
                {pool.riskLevel === "Low" && <Shield className="w-5 h-5 text-green-400" />}
                {pool.riskLevel === "Medium" && <TrendingUp className="w-5 h-5 text-yellow-400" />}
                {pool.riskLevel === "High" && <AlertCircle className="w-5 h-5 text-red-400" />}
              </div>
            </div>
          </div>

          {/* LP Info Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Liquidity Provider Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Collateral Information */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-2">Actual Collateral</div>
                <div className="text-xl font-bold text-white mb-1">
                  ${lpInfo.actualCollateralAmount.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">{lpInfo.tokensCollateralized.toLocaleString()} tokens</div>
              </div>

              {/* Overcollateralization */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-2">Overcollateralization</div>
                <div className="text-xl font-bold text-white mb-1">{lpInfo.overCollateralization}%</div>
                <div className={`text-sm ${lpInfo.isOvercollateralized ? "text-green-400" : "text-red-400"}`}>
                  {lpInfo.isOvercollateralized ? "Healthy" : "At Risk"}
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-2">LP Capacity</div>
                <div className="text-xl font-bold text-white">${lpInfo.capacity.toLocaleString()}</div>
              </div>

              {/* Utilization */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-2">Utilization Ratio</div>
                <div className="text-xl font-bold text-white mb-2">{lpInfo.utilization}%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${lpInfo.utilization}%` }}
                  />
                </div>
              </div>

              {/* Coverage */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-2">Collateral Coverage</div>
                <div className="text-xl font-bold text-white mb-2">{lpInfo.coverage}%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(lpInfo.coverage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Shares Distribution */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-2">Shares Distribution</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Mint</span>
                    <span className="text-white">{lpInfo.mintShares}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Redeem</span>
                    <span className="text-white">{lpInfo.redeemShares}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Interest</span>
                    <span className="text-white">{lpInfo.interestShares}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Position (if exists) */}
          {pool.userPosition && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Your Position</h3>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-blue-300 mb-2">Position Value</div>
                    <div className="text-3xl font-bold text-white">${pool.userPosition.value.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-300 mb-2">Token Amount</div>
                    <div className="text-3xl font-bold text-white">
                      {pool.userPosition.amount} {pool.baseToken}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {pool.userPosition ? (
              <>
                <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                  Add Liquidity
                </button>
                <button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                  Remove Liquidity
                </button>
              </>
            ) : (
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                Provide Liquidity
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
