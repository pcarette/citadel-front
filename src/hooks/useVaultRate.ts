import { useReadContract } from 'wagmi'
import { Address } from 'viem'

const VAULT_ABI = [
  {
    name: "getRate",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "rate",
        type: "uint256"
      }
    ]
  }
] as const

export function useVaultRate(vaultAddress: Address) {
  return useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'getRate',
  })
}