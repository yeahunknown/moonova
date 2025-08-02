import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { HeroAnimation } from "@/components/HeroAnimation";
import { Rocket, Zap, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Create Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Dream Token
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Launch your cryptocurrency in minutes with Moonova's powerful, 
                no-code token creation platform on Solana.
              </p>
              
              <Button 
                size="lg"
                onClick={() => navigate("/create")}
                className="bg-gradient-primary hover:opacity-90 transition-all hover:scale-105 shadow-glow text-lg px-8 py-6"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Create Token Now
              </Button>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-card border border-border shadow-card">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Deploy your token in under 5 minutes with our streamlined creation process.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border shadow-card">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Audited</h3>
              <p className="text-muted-foreground">
                Built with security-first principles and audited smart contracts.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border shadow-card">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Full Control</h3>
              <p className="text-muted-foreground">
                Complete ownership and control over your token's future and settings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;