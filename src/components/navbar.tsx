import Link from "next/link"
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-xl">DeFiFlow</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/swap" className="text-white/80 hover:text-white transition-colors">
            Swap
          </Link>
          <Link href="/pool" className="text-white/80 hover:text-white transition-colors">
            Pool
          </Link>
          <Link href="/stake" className="text-white/80 hover:text-white transition-colors">
            Stake
          </Link>
          <ConnectButton />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
