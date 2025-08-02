import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogPortal } from "./ui/dialog";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContactModal, setShowContactModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/create", label: "Create" },
    { path: "/liquidity", label: "Liquidity" }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <img 
                  src="https://i.ibb.co/Nn3Jmzk8/Moonova.png" 
                  alt="Moonova" 
                  className="w-8 h-8 transition-transform group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Moonova
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className={`
                    relative px-4 py-2 font-medium transition-all duration-200
                    ${isActive(item.path) 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Contact Button */}
              <Button 
                onClick={() => setShowContactModal(true)}
                className="bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 text-white font-medium px-4 py-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Contact</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-border/50">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      justify-start font-medium transition-all duration-200
                      ${isActive(item.path) 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogPortal>
          <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-primary/20 rounded-xl p-8 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Need Support?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Having trouble with your token creation or have questions? Join our Telegram group for instant support and community assistance.
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      window.open('https://t.me/moonovapp', '_blank');
                      setShowContactModal(false);
                    }}
                    className="w-full bg-gradient-primary hover:opacity-90 shadow-glow text-white font-medium"
                  >
                    Join Telegram Support
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowContactModal(false)}
                    className="w-full mt-3 text-gray-400 hover:text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default Navigation;