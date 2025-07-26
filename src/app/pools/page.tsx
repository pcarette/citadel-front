import { WebGLBackground } from "@/components/webgl-background"
import { Navbar } from "@/components/navbar"
import { PoolsModule } from "@/components/pools-module"

export default function PoolsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* WebGL Animated Background */}
      <WebGLBackground />

      {/* Semi-transparent overlay for readability */}
      <div className="fixed inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20">
        <Navbar />
        <main className="min-h-screen px-4 py-20">
          <PoolsModule />
        </main>
      </div>
    </div>
  )
}
