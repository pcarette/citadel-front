import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { Address, parseUnits } from 'viem'

const COLLATERAL_ADDRESS = "0xcF27439fA231af9931ee40c4f27Bb77B83826F3C" as Address

const VAULT_ABI = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "collateralAmount", type: "uint256" },
      { name: "recipient", type: "address" }
    ],
    outputs: [
      { name: "lpTokensOut", type: "uint256" }
    ]
  },
  {
    name: "withdraw",
    type: "function", 
    stateMutability: "nonpayable",
    inputs: [
      { name: "lpTokensAmount", type: "uint256" },
      { name: "recipient", type: "address" }
    ],
    outputs: [
      { name: "collateralOut", type: "uint256" }
    ]
  },
  {
    name: "getRate",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "rate", type: "uint256" }
    ]
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view", 
    inputs: [],
    outputs: [
      { name: "", type: "uint256" }
    ]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" }
    ],
    outputs: [
      { name: "", type: "uint256" }
    ]
  }
] as const

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable", 
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [
      { name: "", type: "bool" }
    ]
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [
      { name: "", type: "uint256" }
    ]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" }
    ],
    outputs: [
      { name: "", type: "uint256" }
    ]
  }
] as const

export function useVaultDeposit(vaultAddress: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const deposit = (amount: string, recipient: Address) => {
    const collateralAmount = parseUnits(amount, 18) // Assuming 18 decimals for FDUSD
    writeContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [collateralAmount, recipient],
    })
  }

  return {
    deposit,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useVaultWithdraw(vaultAddress: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdraw = (lpTokenAmount: string, recipient: Address) => {
    const lpTokens = parseUnits(lpTokenAmount, 18) // Assuming 18 decimals for LP tokens
    writeContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [lpTokens, recipient],
    })
  }

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useCollateralApproval(vaultAddress: Address, userAddress: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const { data: allowance } = useReadContract({
    address: COLLATERAL_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress, vaultAddress],
  })

  const approve = (amount: string) => {
    const approvalAmount = parseUnits(amount, 18)
    writeContract({
      address: COLLATERAL_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [vaultAddress, approvalAmount],
    })
  }

  const needsApproval = (amount: string) => {
    if (!allowance) return true
    const requiredAmount = parseUnits(amount, 18)
    return allowance < requiredAmount
  }

  return {
    approve,
    needsApproval,
    allowance,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useVaultBalances(vaultAddress: Address, userAddress: Address) {
  const { data: collateralBalance } = useReadContract({
    address: COLLATERAL_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const { data: lpTokenBalance } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const { data: totalSupply } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'totalSupply',
  })

  return {
    collateralBalance,
    lpTokenBalance,
    totalSupply,
  }
}