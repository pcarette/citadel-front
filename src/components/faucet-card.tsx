"use client"

import { useState, useEffect } from "react"
import { Droplets, Clock, AlertCircle } from "lucide-react"
import { useWriteContract, useReadContract, useAccount } from "wagmi"
import { parseEther, formatEther } from "viem"
import { CONTRACT_ADDRESSES } from "@/config/contracts"
import { Alert } from "./ui/alert"

const FAUCET_LIMITER_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "claimFDUSD",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getRemainingDailyLimit",
    outputs: [{ name: "remaining", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getTimeUntilReset",
    outputs: [{ name: "timeUntilReset", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DAILY_LIMIT",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "constant",
  },
] as const

export function FaucetCard() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [timeUntilReset, setTimeUntilReset] = useState<number>(0)

  // Get remaining daily limit
  const { data: remainingLimit, refetch: refetchLimit } = useReadContract({
    address: CONTRACT_ADDRESSES.faucetLimiter,
    abi: FAUCET_LIMITER_ABI,
    functionName: "getRemainingDailyLimit",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  })

  // Get time until reset
  const { data: resetTime, refetch: refetchResetTime } = useReadContract({
    address: CONTRACT_ADDRESSES.faucetLimiter,
    abi: FAUCET_LIMITER_ABI,
    functionName: "getTimeUntilReset",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  })

  // Write contract for claiming FDUSD
  const { writeContract, isPending, isSuccess, isError, error: contractError } = useWriteContract()

  // Update time until reset
  useEffect(() => {
    if (resetTime) {
      setTimeUntilReset(Number(resetTime))
      
      // Update countdown every second
      const interval = setInterval(() => {
        setTimeUntilReset((prev) => {
          if (prev <= 1) {
            refetchLimit()
            refetchResetTime()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [resetTime, refetchLimit, refetchResetTime])

  // Handle contract responses
  useEffect(() => {
    if (isSuccess) {
      setSuccess("Successfully claimed 500 FDUSD!")
      setError(null)
      // Refetch limits after successful claim
      setTimeout(() => {
        refetchLimit()
        refetchResetTime()
      }, 2000)
    }
  }, [isSuccess, refetchLimit, refetchResetTime])

  useEffect(() => {
    if (isError && contractError) {
      setError(contractError.message)
      setSuccess(null)
    }
  }, [isError, contractError])

  const handleClaimFDUSD = async () => {
    if (!address || !isConnected) {
      setError("Please connect your wallet")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.faucetLimiter,
        abi: FAUCET_LIMITER_ABI,
        functionName: "claimFDUSD",
        args: [parseEther("500")], // 500 FDUSD
      })
    } catch (err: any) {
      setError(err.message || "Failed to claim FDUSD")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const remainingFDUSD = remainingLimit ? formatEther(remainingLimit) : "0"
  const canClaim = Number(remainingFDUSD) >= 500
  const hasUsedFaucet = Number(remainingFDUSD) < 500

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-blue-500/20">
          <Droplets className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">FDUSD Faucet</h3>
          <p className="text-sm text-white/60">Get 500 FDUSD daily for testing</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          <Droplets className="h-4 w-4" />
          {success}
        </Alert>
      )}

      {/* Status Info */}
      {isConnected && (
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
            <span className="text-white/80">Daily Limit Remaining</span>
            <span className="text-white font-medium">
              {Number(remainingFDUSD).toFixed(0)} FDUSD
            </span>
          </div>
          
          {hasUsedFaucet && timeUntilReset > 0 && (
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/60" />
                <span className="text-white/80">Reset In</span>
              </div>
              <span className="text-white font-medium font-mono">
                {formatTime(timeUntilReset)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Claim Button */}
      <button
        onClick={handleClaimFDUSD}
        disabled={!isConnected || !canClaim || isLoading || isPending}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 cursor-pointer disabled:cursor-not-allowed"
      >
        {!isConnected 
          ? "Connect Wallet" 
          : isLoading || isPending
          ? "Claiming..."
          : !canClaim && hasUsedFaucet
          ? "Daily Limit Reached"
          : "Claim 500 FDUSD"
        }
      </button>

      {/* Info Text */}
      <div className="mt-4 text-xs text-white/60 text-center">
        <p>• Maximum 500 FDUSD per address per day</p>
        <p>• Resets every 24 hours from first claim</p>
        <p>• For testnet use only</p>
      </div>
    </div>
  )
}