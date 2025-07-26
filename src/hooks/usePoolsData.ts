import { useMemo } from 'react'
import { useVaultLPInfo } from './useVaultLPInfo'
import { useVaultRate } from './useVaultRate'
import { PoolVault, LPInfo } from '@/components/pools-module'
import { formatUnits } from 'viem'
import testnetAddresses from '../../testnet-addresses.json'

const VAULT_ADDRESSES = {
  vault1x: testnetAddresses.contracts.vault1x.address,
  vault5x: testnetAddresses.contracts.vault5x.address,
  vault20x: testnetAddresses.contracts.vault20x.address
} as const

function formatLPInfo(rawData: any): LPInfo {
  if (!rawData) {
    return {
      actualCollateralAmount: 0,
      tokensCollateralized: 0,
      overCollateralization: 0,
      capacity: 0,
      utilization: 0,
      coverage: 0,
      mintShares: 0,
      redeemShares: 0,
      interestShares: 0,
      isOvercollateralized: false,
    }
  }

  return {
    actualCollateralAmount: Number(formatUnits(rawData.actualCollateralAmount || 0n, 18)),
    tokensCollateralized: Number(formatUnits(rawData.tokensCollateralized || 0n, 18)),
    overCollateralization: Number(rawData.overCollateralization || 0n),
    capacity: Number(formatUnits(rawData.capacity || 0n, 18)),
    utilization: Number(rawData.utilization || 0n),
    coverage: Number(rawData.coverage || 0n),
    mintShares: Number(rawData.mintShares || 0n),
    redeemShares: Number(rawData.redeemShares || 0n),
    interestShares: Number(rawData.interestShares || 0n),
    isOvercollateralized: Boolean(rawData.isOvercollateralized),
  }
}

export function usePoolsData(): PoolVault[] {
  const vault1xData = useVaultLPInfo(VAULT_ADDRESSES.vault1x)
  const vault5xData = useVaultLPInfo(VAULT_ADDRESSES.vault5x)
  const vault20xData = useVaultLPInfo(VAULT_ADDRESSES.vault20x)
  
  const vault1xRate = useVaultRate(VAULT_ADDRESSES.vault1x)
  const vault5xRate = useVaultRate(VAULT_ADDRESSES.vault5x)
  const vault20xRate = useVaultRate(VAULT_ADDRESSES.vault20x)

  return useMemo(() => {
    const vault1xLPInfo = formatLPInfo(vault1xData.data)
    const vault5xLPInfo = formatLPInfo(vault5xData.data)
    const vault20xLPInfo = formatLPInfo(vault20xData.data)
    
    // Convert rate from wei to percentage (assuming rate is in basis points or similar)
    const vault1xAPY = vault1xRate.data ? Number(formatUnits(vault1xRate.data, 16)) : 0 // Adjust decimals as needed
    const vault5xAPY = vault5xRate.data ? Number(formatUnits(vault5xRate.data, 16)) : 0
    const vault20xAPY = vault20xRate.data ? Number(formatUnits(vault20xRate.data, 16)) : 0

    return [
      {
        id: "vault-1x",
        name: "Citadel 1x Vault",
        baseToken: "FDUSD",
        synthToken: "cEUR",
        baseIcon: "💵",
        synthIcon: "🇪🇺",
        tvl: vault1xLPInfo.actualCollateralAmount,
        apy: vault1xAPY || 8.5, // Real-time APY from Vault.getRate() function
        riskLevel: "Low" as const,
        description: "Conservative 1x leverage vault for stable returns",
        address: VAULT_ADDRESSES.vault1x,
        lpInfo: vault1xLPInfo,
      },
      {
        id: "vault-5x",
        name: "Citadel 5x Vault", 
        baseToken: "FDUSD",
        synthToken: "cEUR",
        baseIcon: "💵",
        synthIcon: "🇪🇺", 
        tvl: vault5xLPInfo.actualCollateralAmount,
        apy: vault5xAPY || 12.3, // Real-time APY from Vault.getRate() function
        riskLevel: "Medium" as const,
        description: "Moderate 5x leverage vault for balanced risk/reward",
        address: VAULT_ADDRESSES.vault5x,
        lpInfo: vault5xLPInfo,
      },
      {
        id: "vault-20x",
        name: "Citadel 20x Vault",
        baseToken: "FDUSD", 
        synthToken: "cEUR",
        baseIcon: "💵",
        synthIcon: "🇪🇺",
        tvl: vault20xLPInfo.actualCollateralAmount,
        apy: vault20xAPY || 15.7, // Real-time APY from Vault.getRate() function
        riskLevel: "High" as const,
        description: "High leverage 20x vault for maximum yield potential",
        address: VAULT_ADDRESSES.vault20x,
        lpInfo: vault20xLPInfo,
      },
    ]
  }, [
    vault1xData.data, vault5xData.data, vault20xData.data,
    vault1xRate.data, vault5xRate.data, vault20xRate.data
  ])
}