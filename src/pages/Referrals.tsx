import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, TrendingUp, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Referrals = () => {
  const [referralData, setReferralData] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReferralCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createReferralCode = async () => {
    setLoading(true);
    try {
      const newCode = generateReferralCode();
      const referrerId = `user_${Date.now()}`;
      
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referral_code: newCode,
        })
        .select()
        .single();

      if (error) throw error;

      setReferralData(data);
      setReferralCode(newCode);
      localStorage.setItem('referral_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error creating referral code:', error);
      toast({
        title: "Error",
        description: "Failed to create referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/ref?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const getLevelProgress = (tokens) => {
    const levels = [
      { level: 1, required: 0 },
      { level: 2, required: 5 },
      { level: 3, required: 15 },
      { level: 4, required: 30 },
      { level: 5, required: 50 },
      { level: 6, required: 100 },
    ];

    const currentLevel = levels.find(l => tokens >= l.required && 
      (levels[l.level] ? tokens < levels[l.level].required : true));
    
    const nextLevel = levels.find(l => l.level === (currentLevel?.level || 1) + 1);
    
    const progress = nextLevel 
      ? ((tokens - (currentLevel?.required || 0)) / (nextLevel.required - (currentLevel?.required || 0))) * 100
      : 100;

    return {
      currentLevel: currentLevel?.level || 1,
      nextLevel: nextLevel?.level,
      progress: Math.min(progress, 100),
      tokensForNext: nextLevel ? nextLevel.required - tokens : 0
    };
  };

  useEffect(() => {
    const loadReferralData = async () => {
      const savedData = localStorage.getItem('referral_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        setReferralCode(data.referral_code);
        
        // Fetch latest data from database to get updated counts
        try {
          const { data: latestData, error } = await supabase
            .from('referrals')
            .select('*')
            .eq('referral_code', data.referral_code)
            .single();
          
          if (latestData && !error) {
            setReferralData(latestData);
            // Update localStorage with latest data
            localStorage.setItem('referral_data', JSON.stringify(latestData));
          } else {
            setReferralData(data);
          }
        } catch (error) {
          console.error('Error fetching latest referral data:', error);
          setReferralData(data);
        }
      }
    };
    
    loadReferralData();
  }, []);

  const levelInfo = referralData ? getLevelProgress(referralData.tokens_created) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Referral Program
            </h1>
            <p className="text-muted-foreground text-lg">
              Share Moonova and earn rewards for every token created through your link
            </p>
          </div>

          {!referralData ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center">Get Started</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Create your unique referral code to start earning rewards
                </p>
                <Button 
                  onClick={createReferralCode}
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {loading ? "Creating..." : "Generate Referral Code"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{referralData.visits_count}</div>
                    <p className="text-xs text-muted-foreground">
                      People who clicked your link
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tokens Created</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{referralData.tokens_created}</div>
                    <p className="text-xs text-muted-foreground">
                      Successful conversions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Level {levelInfo?.currentLevel}</div>
                    <p className="text-xs text-muted-foreground">
                      {levelInfo?.tokensForNext > 0 
                        ? `${levelInfo.tokensForNext} tokens to level ${levelInfo.nextLevel}`
                        : "Max level reached!"
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Level Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-sm">
                        Level {levelInfo?.currentLevel}
                      </Badge>
                      {levelInfo?.nextLevel && (
                        <Badge variant="outline" className="text-sm">
                          Level {levelInfo.nextLevel}
                        </Badge>
                      )}
                    </div>
                    <Progress value={levelInfo?.progress || 0} className="h-3" />
                    <p className="text-sm text-muted-foreground text-center">
                      {levelInfo?.tokensForNext > 0 
                        ? `${levelInfo.tokensForNext} more tokens needed for next level`
                        : "Congratulations! You've reached the highest level!"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 p-4 bg-muted rounded-lg font-mono text-sm break-all">
                      {window.location.origin}/ref?ref={referralCode}
                    </div>
                    <Button onClick={copyReferralLink} size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Share this link with others. You'll earn rewards when they create tokens through your referral.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Referrals;