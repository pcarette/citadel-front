"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AlertProps {
  variant?: "default" | "success" | "error" | "warning" | "info"
  title?: string
  children: React.ReactNode
  dismissible?: boolean
  autoClose?: boolean
  duration?: number
  onClose?: () => void
  className?: string
}

const alertVariants = {
  default: {
    container: "bg-white/10 border-white/20 text-white",
    icon: Info,
    iconColor: "text-blue-400"
  },
  success: {
    container: "bg-green-500/10 border-green-500/20 text-white",
    icon: CheckCircle,
    iconColor: "text-green-400"
  },
  error: {
    container: "bg-red-500/10 border-red-500/20 text-white",
    icon: AlertCircle,
    iconColor: "text-red-400"
  },
  warning: {
    container: "bg-yellow-500/10 border-yellow-500/20 text-white",
    icon: AlertTriangle,
    iconColor: "text-yellow-400"
  },
  info: {
    container: "bg-blue-500/10 border-blue-500/20 text-white",
    icon: Info,
    iconColor: "text-blue-400"
  }
}

export function Alert({
  variant = "default",
  title,
  children,
  dismissible = true,
  autoClose = false,
  duration = 5000,
  onClose,
  className,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) {
    return null
  }

  const variantConfig = alertVariants[variant]
  const IconComponent = variantConfig.icon

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border p-4 backdrop-blur-sm transition-all duration-300",
        variantConfig.container,
        className
      )}
    >
      <div className="flex gap-3">
        <IconComponent className={cn("h-5 w-5 mt-0.5 flex-shrink-0", variantConfig.iconColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function AlertTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h4 className={cn("font-semibold text-sm mb-1", className)}>{children}</h4>
}

export function AlertDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm opacity-90", className)}>{children}</div>
}