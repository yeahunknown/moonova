import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { HeroAnimation } from "@/components/HeroAnimation";
import { StatsBar } from "@/components/StatsBar";
import { LiveStats } from "@/components/LiveStats";
import { Rocket } from "lucide-react";

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

      {/* Stats Section */}
      <StatsBar />
      
      {/* Live Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <LiveStats />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;