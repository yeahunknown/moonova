import { cn } from "@/lib/utils"

interface SolanaIconProps {
  size?: number
  className?: string
}

export function SolanaIcon({ size = 24, className }: SolanaIconProps) {
  return (
    <img
      src="/src/assets/sol-logo.png"
      alt="Solana"
      width={size}
      height={size}
      className={cn("", className)}
    />
  )
}