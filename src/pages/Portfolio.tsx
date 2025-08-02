import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, BarChart3, Eye } from "lucide-react";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Token <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
              </h1>
              <p className="text-muted-foreground">Track and manage all your created tokens</p>
            </div>

            {/* Coming Soon Card */}
            <Card className="border-border bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-12">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Portfolio Dashboard Coming Soon</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We're developing a comprehensive portfolio management system. 
                  Track your token performance, view analytics, and manage your 
                  entire token ecosystem from one dashboard.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Wallet className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Track Holdings</h3>
                    <p className="text-sm text-muted-foreground">View all your tokens in one place</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Performance Analytics</h3>
                    <p className="text-sm text-muted-foreground">Detailed charts and metrics</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Real-time Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Live updates on token activity</p>
                  </div>
                </div>

                <Button className="bg-gradient-primary hover:opacity-90">
                  Get Early Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;