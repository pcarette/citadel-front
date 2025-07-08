"use client"

import { ArrowUpDown } from "lucide-react"

interface SwapButtonProps {
  onClick: () => void
}

export function SwapButton({ onClick }: SwapButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative z-10 p-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-full transition-all duration-300 hover:scale-110 group"
    >
      <ArrowUpDown className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
    </button>
  )
}
