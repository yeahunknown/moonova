import { motion } from "framer-motion"
import moonovaLogo from "@/assets/moonova-logo.png"

export function Footer() {
  return (
    <footer className="bg-gradient-subtle border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Side - Logo + About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={moonovaLogo} alt="Moonova" className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">Moonova</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Launch meme coins, SPL tokens, and viral assets on Solana in seconds. Built for degens, by degens.
            </p>
          </div>

          {/* Center Section - Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Resources</h3>
            <nav className="space-y-3">
              <a 
                href="/terms" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/privacy" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/security" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Security
              </a>
            </nav>
          </div>

          {/* Right Section - Community */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Community</h3>
            <nav className="space-y-3">
              <a 
                href="https://t.me/moonova" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Telegram
              </a>
              <a 
                href="https://twitter.com/moonova" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Moonova LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}