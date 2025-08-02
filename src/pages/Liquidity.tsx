import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Plus, TrendingUp } from "lucide-react";

const Liquidity = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Liquidity <span className="bg-gradient-primary bg-clip-text text-transparent">Management</span>
              </h1>
              <p className="text-muted-foreground">Add liquidity to your tokens and earn rewards</p>
            </div>

            {/* Coming Soon Card */}
            <Card className="border-border bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-12">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Droplets className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Liquidity Pools Coming Soon</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We're building the next generation of liquidity management tools. 
                  Soon you'll be able to add liquidity, create pools, and earn rewards 
                  from your token holdings.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Add Liquidity</h3>
                    <p className="text-sm text-muted-foreground">Provide liquidity to trading pairs</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Earn Rewards</h3>
                    <p className="text-sm text-muted-foreground">Get rewards for providing liquidity</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Droplets className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Manage Pools</h3>
                    <p className="text-sm text-muted-foreground">Monitor and manage your liquidity</p>
                  </div>
                </div>

                <Button className="bg-gradient-primary hover:opacity-90">
                  Get Notified When Ready
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liquidity;