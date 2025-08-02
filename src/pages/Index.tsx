import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { HeroAnimation } from "@/components/HeroAnimation";
import { StatsBar } from "@/components/StatsBar";
import { Rocket, Shield, TrendingUp } from "lucide-react";

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

      {/* Hype Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">Moonova</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The fastest, most reliable way to launch your next viral token on Solana
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-border bg-card/30 backdrop-blur-lg hover:scale-105 transition-all duration-300 shadow-elegant">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Deploy your token in under 30 seconds. No coding required, just pure speed and efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/30 backdrop-blur-lg hover:scale-105 transition-all duration-300 shadow-elegant">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Battle Tested</h3>
                <p className="text-muted-foreground">
                  Trusted by thousands of degens. Our smart contracts are audited and proven in the wild.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/30 backdrop-blur-lg hover:scale-105 transition-all duration-300 shadow-elegant">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Moon Ready</h3>
                <p className="text-muted-foreground">
                  Built for viral success. Advanced tokenomics and marketing tools to help your token moon.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-gradient-subtle shadow-2xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-6">
                Ready to Launch Your <span className="bg-gradient-primary bg-clip-text text-transparent">Next Big Token</span>?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the thousands of successful token creators who've made their mark on Solana. Your memecoin empire starts here.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-8 py-4 transition-all duration-200 hover:scale-105"
                onClick={() => navigate("/create")}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Creating Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;