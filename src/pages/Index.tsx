import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { HeroAnimation } from "@/components/HeroAnimation";
import { StatsBar } from "@/components/StatsBar";
import { TrendingTokensModal } from "@/components/modals/TrendingTokensModal";
import { Rocket, Shield, TrendingUp, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        id="hero"
        ref={setSectionRef('hero')}
        className={`pt-20 pb-12 px-4 sm:px-6 transition-all duration-1000 ${
          visibleSections.has('hero') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
                Create Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Dream Token
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Launch your cryptocurrency in minutes with Moonova's powerful, 
                no-code token creation platform on Solana.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <Button 
                  size="lg"
                  onClick={() => navigate("/create")}
                  className="bg-gradient-primary hover:opacity-90 transition-all hover:scale-105 shadow-glow text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto min-h-[48px]"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Create Token Now
                </Button>
                
                <Button 
                  size="lg"
                  onClick={() => setShowTrendingModal(true)}
                  variant="outline"
                  className="border-moonova text-moonova hover:bg-moonova hover:text-moonova-foreground transition-all hover:scale-105 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto min-h-[48px]"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Trending Tokens
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div 
        id="stats"
        ref={setSectionRef('stats')}
        className={`transition-all duration-1000 delay-200 ${
          visibleSections.has('stats') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
        }`}
      >
        <StatsBar />
      </div>

      {/* Hype Section */}
      <div 
        id="features"
        ref={setSectionRef('features')}
        className={`container mx-auto px-4 sm:px-6 py-12 lg:py-20 transition-all duration-1000 delay-300 ${
          visibleSections.has('features') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">Moonova</span>?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              The fastest, most reliable way to launch your next viral token on Solana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
            <Card className={`border-border bg-card/30 backdrop-blur-lg hover:scale-105 transition-all duration-500 shadow-elegant delay-100 ${
              visibleSections.has('features') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
            }`}>
              <CardContent className="p-6 lg:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm lg:text-base">
                  Deploy your token in under 30 seconds. No coding required, just pure speed and efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className={`border-border bg-card/30 backdrop-blur-lg hover:scale-105 transition-all duration-500 shadow-elegant delay-200 ${
              visibleSections.has('features') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
            }`}>
              <CardContent className="p-6 lg:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4">Battle Tested</h3>
                <p className="text-muted-foreground text-sm lg:text-base">
                  Trusted by thousands of degens. Our smart contracts are audited and proven in the wild.
                </p>
              </CardContent>
            </Card>

            <Card className={`border-border bg-card/30 backdrop-blur-lg hover:scale-105 transition-all duration-500 shadow-elegant md:col-span-2 lg:col-span-1 delay-300 ${
              visibleSections.has('features') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
            }`}>
              <CardContent className="p-6 lg:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4">Moon Ready</h3>
                <p className="text-muted-foreground text-sm lg:text-base">
                  Built for viral success. Advanced tokenomics and marketing tools to help your token moon.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className={`border-border bg-gradient-subtle shadow-2xl transition-all duration-1000 delay-500 ${
            visibleSections.has('features') ? 'animate-fade-in' : 'opacity-0 translate-y-10'
          }`}>
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                Ready to Launch Your <span className="bg-gradient-primary bg-clip-text text-transparent">Next Big Token</span>?
              </h3>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the thousands of successful token creators who've made their mark on Solana. Your memecoin empire starts here.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 shadow-glow text-base sm:text-lg px-6 sm:px-8 py-4 transition-all duration-200 hover:scale-105 w-full sm:w-auto min-h-[48px]"
                onClick={() => navigate("/create")}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Creating Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trending Tokens Modal */}
      <TrendingTokensModal 
        isOpen={showTrendingModal} 
        onClose={() => setShowTrendingModal(false)} 
      />
    </div>
  );
};

export default Index;