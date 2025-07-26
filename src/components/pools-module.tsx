"use client"

import { useState } from "react"
import { PoolVaultCard } from "./pool-vault-card"
import { PoolDetailsModal } from "./pool-details-modal"
import { UserPositions } from "./user-positions"
import { usePoolsData } from "@/hooks/usePoolsData"

export interface LPInfo {
  actualCollateralAmount: number
  tokensCollateralized: number
  overCollateralization: number
  capacity: number
  utilization: number
  coverage: number
  mintShares: number
  redeemShares: number
  interestShares: number
  isOvercollateralized: boolean
}

export interface PoolVault {
  id: string
  name: string
  baseToken: string
  synthToken: string
  baseIcon: string
  synthIcon: string
  tvl: number
  apy: number
  address: string
  userPosition?: {
    amount: number
    value: number
    lpInfo: LPInfo
  }
  lpInfo: LPInfo
  riskLevel: "Low" | "Medium" | "High"
  description: string
}


export function PoolsModule() {
  const [selectedPool, setSelectedPool] = useState<PoolVault | null>(null)
  const [activeTab, setActiveTab] = useState<"pools" | "positions">("pools")
  
  const pools = usePoolsData()
  const userPools = pools.filter((pool) => pool.userPosition)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Liquidity Pools</h1>
        <p className="text-xl text-white/80">Provide liquidity to earn yield from trading fees and protocol rewards</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("pools")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === "pools"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          All Pools
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === "positions"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          My Positions ({userPools.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "pools" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <PoolVaultCard key={pool.id} pool={pool} onViewDetails={() => setSelectedPool(pool)} />
          ))}
        </div>
      ) : (
        <UserPositions pools={userPools} onViewDetails={setSelectedPool} />
      )}

      {/* Pool Details Modal */}
      {selectedPool && <PoolDetailsModal pool={selectedPool} onClose={() => setSelectedPool(null)} />}
    </div>
  )
}
