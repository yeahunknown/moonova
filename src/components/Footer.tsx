import { motion } from "framer-motion"
import moonovaLogo from "@/assets/moonova-logo.png"

export function Footer() {
  return (
    <footer className="bg-gradient-subtle border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Side - Logo + About */}
          <div className="space-y-4 text-center sm:text-left lg:col-span-1">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <img src={moonovaLogo} alt="Moonova" className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Moonova</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Launch meme coins, SPL tokens, and viral assets on Solana in seconds. Built for degens, by degens.
            </p>
          </div>

          {/* Center Section - Resources */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Resources</h3>
            <nav className="space-y-2 sm:space-y-3">
              <a 
                href="/terms" 
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Terms of Service
              </a>
              <a 
                href="/privacy" 
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a 
                href="/security" 
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Security
              </a>
            </nav>
          </div>

          {/* Right Section - Community */}
          <div className="space-y-4 text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Community</h3>
            <nav className="space-y-2 sm:space-y-3">
              <a 
                href="https://t.me/moonova" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Telegram
              </a>
              <a 
                href="https://twitter.com/moonova" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Twitter
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © 2025 Moonova LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}