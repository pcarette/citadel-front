"use client"

import { useState } from "react"
import { PoolVaultCard } from "./pool-vault-card"
import { PoolDetailsModal } from "./pool-details-modal"
import { UserPositions } from "./user-positions"

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
  userPosition?: {
    amount: number
    value: number
    lpInfo: LPInfo
  }
  lpInfo: LPInfo
  riskLevel: "Low" | "Medium" | "High"
  description: string
}

const mockPools: PoolVault[] = [
  {
    id: "eth-susd",
    name: "ETH/sUSD Pool",
    baseToken: "ETH",
    synthToken: "sUSD",
    baseIcon: "⟠",
    synthIcon: "💵",
    tvl: 12500000,
    apy: 8.5,
    riskLevel: "Low",
    description: "Stable ETH liquidity pool with synthetic USD exposure",
    userPosition: {
      amount: 2.5,
      value: 5850,
      lpInfo: {
        actualCollateralAmount: 5850,
        tokensCollateralized: 2.5,
        overCollateralization: 150,
        capacity: 3900,
        utilization: 65,
        coverage: 165,
        mintShares: 12.5,
        redeemShares: 8.3,
        interestShares: 15.2,
        isOvercollateralized: true,
      },
    },
    lpInfo: {
      actualCollateralAmount: 12500000,
      tokensCollateralized: 5342.5,
      overCollateralization: 145,
      capacity: 8620000,
      utilization: 72,
      coverage: 145,
      mintShares: 35.2,
      redeemShares: 28.7,
      interestShares: 36.1,
      isOvercollateralized: true,
    },
  },
  {
    id: "btc-sbtc",
    name: "WBTC/sBTC Pool",
    baseToken: "WBTC",
    synthToken: "sBTC",
    baseIcon: "₿",
    synthIcon: "🟠",
    tvl: 8750000,
    apy: 12.3,
    riskLevel: "Medium",
    description: "Bitcoin liquidity pool with synthetic BTC exposure",
    lpInfo: {
      actualCollateralAmount: 8750000,
      tokensCollateralized: 202.5,
      overCollateralization: 160,
      capacity: 5468750,
      utilization: 58,
      coverage: 160,
      mintShares: 28.4,
      redeemShares: 22.1,
      interestShares: 49.5,
      isOvercollateralized: true,
    },
  },
  {
    id: "link-slink",
    name: "LINK/sLINK Pool",
    baseToken: "LINK",
    synthToken: "sLINK",
    baseIcon: "🔗",
    synthIcon: "⛓️",
    tvl: 3200000,
    apy: 15.7,
    riskLevel: "High",
    description: "Chainlink liquidity pool with higher yield potential",
    lpInfo: {
      actualCollateralAmount: 3200000,
      tokensCollateralized: 213333,
      overCollateralization: 180,
      capacity: 1777778,
      utilization: 45,
      coverage: 180,
      mintShares: 18.9,
      redeemShares: 15.2,
      interestShares: 65.9,
      isOvercollateralized: true,
    },
  },
]

export function PoolsModule() {
  const [selectedPool, setSelectedPool] = useState<PoolVault | null>(null)
  const [activeTab, setActiveTab] = useState<"pools" | "positions">("pools")

  const userPools = mockPools.filter((pool) => pool.userPosition)

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
          {mockPools.map((pool) => (
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
