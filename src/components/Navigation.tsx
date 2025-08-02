import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogPortal } from "./ui/dialog";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer transition-all hover:scale-105"
              onClick={() => navigate("/")}
            >
              <img src="https://i.ibb.co/Nn3Jmzk8/Moonova.png" alt="Moonova" className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Moonova
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="hover:text-primary transition-colors"
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/create")}
                className="hover:text-primary transition-colors"
              >
                Create
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/liquidity")}
                className="hover:text-primary transition-colors"
              >
                Liquidity
              </Button>
            </div>

            <Button 
              onClick={() => setShowContactModal(true)}
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-sm sm:text-base px-3 sm:px-4 py-2 min-h-[40px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Contact</span>
              <span className="sm:hidden ml-1">Contact</span>
            </Button>
          </div>
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