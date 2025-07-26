import { useReadContract } from 'wagmi'
import { Address } from 'viem'

const POOL_ADDRESS = "0x1FC13b6A5bdc73Ec6e987c10444f5E016eBc2717" as Address

const POOL_ABI = [
  {
    name: "positionLPInfo",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        name: "_lp",
        type: "address"
      }
    ],
    outputs: [
      {
        name: "info",
        type: "tuple",
        components: [
          {
            name: "actualCollateralAmount",
            type: "uint256"
          },
          {
            name: "tokensCollateralized", 
            type: "uint256"
          },
          {
            name: "overCollateralization",
            type: "uint256" 
          },
          {
            name: "capacity",
            type: "uint256"
          },
          {
            name: "utilization",
            type: "uint256"
          },
          {
            name: "coverage",
            type: "uint256"
          },
          {
            name: "mintShares",
            type: "uint256"
          },
          {
            name: "redeemShares",
            type: "uint256"
          },
          {
            name: "interestShares",
            type: "uint256"
          },
          {
            name: "isOvercollateralized",
            type: "bool"
          }
        ]
      }
    ]
  }
] as const

export function useVaultLPInfo(vaultAddress: Address) {
  return useReadContract({
    address: POOL_ADDRESS,
    abi: POOL_ABI,
    functionName: 'positionLPInfo',
    args: [vaultAddress],
  })
}