interface SolanaIconProps {
  className?: string
  size?: number
  color?: string // hex or gradient
}

export function SolanaIcon({ className, size = 24, color }: SolanaIconProps) {
  if (color) {
    // Inline SVG for Solana logo with color
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: size, height: size }}
      >
        <defs>
          <linearGradient id="solana-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="8" fill="#181A20" />
        <path d="M10 13.5C10.2 13.2 10.5 13 10.9 13H32.1C32.7 13 33 13.7 32.6 14.1L29.1 18.5C28.9 18.8 28.6 19 28.2 19H7.9C7.3 19 7 18.3 7.4 17.9L10 13.5Z" fill="url(#solana-gradient)"/>
        <path d="M10 26.5C10.2 26.2 10.5 26 10.9 26H32.1C32.7 26 33 26.7 32.6 27.1L29.1 31.5C28.9 31.8 28.6 32 28.2 32H7.9C7.3 32 7 31.3 7.4 30.9L10 26.5Z" fill="url(#solana-gradient)"/>
        <path d="M30 20.5C29.8 20.2 29.5 20 29.1 20H7.9C7.3 20 7 20.7 7.4 21.1L10.9 25.5C11.1 25.8 11.4 26 11.8 26H32.1C32.7 26 33 25.3 32.6 24.9L30 20.5Z" fill="url(#solana-gradient)"/>
      </svg>
    )
  }
  // fallback: default image
  return (
    <img 
      src="https://i.ibb.co/nNdR4cQt/IMG-1357.png" 
      alt="Solana"
      className={className}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}