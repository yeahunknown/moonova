import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import moonovaLogo from "@/assets/moonova-logo.png";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer transition-all hover:scale-105"
            onClick={() => navigate("/")}
          >
            <img src={moonovaLogo} alt="Moonova" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Moonova LLC
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
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
            <Button 
              variant="ghost" 
              onClick={() => navigate("/portfolio")}
              className="hover:text-primary transition-colors"
            >
              Portfolio
            </Button>
          </div>

          <Button 
            onClick={() => navigate("/create")}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
          >
            Launch Token
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;