"use client"

import { useState } from "react"
import { ChevronDown, Search, X } from "lucide-react"

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  price: number
}

interface TokenSelectorProps {
  selectedToken: Token
  tokens: Token[]
  onSelect: (token: Token) => void
}

export function TokenSelector({ selectedToken, tokens, onSelect }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (token: Token) => {
    onSelect(token)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2 transition-colors"
      >
        <span className="text-lg">{selectedToken.icon}</span>
        <span className="font-semibold text-white">{selectedToken.symbol}</span>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Select Token</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Token List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleSelect(token)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-2xl">{token.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">{token.symbol}</div>
                    <div className="text-sm text-white/60">{token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{token.balance}</div>
                    <div className="text-sm text-white/60">${token.price.toLocaleString()}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
