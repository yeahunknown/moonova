import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TRENDING_URL = "https://cupuoqzponoclqjsmaoq.functions.supabase.co/trending";

interface TrendingToken {
  name: string;
  symbol: string;
  imageUrl?: string;
  logo?: string;
  address: string;
  description?: string;
  info?: {
    imageUrl?: string;
    description?: string;
  };
  price: number;
  liquidity: number;
  volume24h: number;
}

interface TrendingTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrendingTokensModal = ({ isOpen, onClose }: TrendingTokensModalProps) => {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrendingTokens = async () => {
    if (tokens.length > 0) return; // Don't fetch if already loaded
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(TRENDING_URL);
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setTokens(data.slice(0, 10)); // Ensure max 10 items
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error fetching trending tokens:', error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToForm = async (token: TrendingToken) => {
    const imageUrl = token.info?.imageUrl || token.imageUrl || token.logo || '';
    const description = token.info?.description || token.description || '';
    
    const tokenData = {
      name: token.name,
      symbol: token.symbol,
      imageUrl,
      description,
      address: token.address,
    };

    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(JSON.stringify(tokenData, null, 2));
      
      // Dispatch browser event for form auto-fill
      window.dispatchEvent(new CustomEvent('moonova:prefill', { 
        detail: tokenData 
      }));

      toast({
        title: "Copied to form!",
        description: `${token.name} details copied and ready for token creation.`,
      });

      onClose();
    } catch (error) {
      console.error('Error copying token data:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy token details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Fetch data when modal opens
  if (isOpen && !loading && tokens.length === 0) {
    fetchTrendingTokens();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <TrendingUp className="h-6 w-6 text-moonova" />
            Top 10 Trending Solana Tokens
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moonova"></div>
              <span className="ml-3 text-muted-foreground">Loading trending tokens…</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive font-semibold mb-2">Error loading trending tokens</p>
                <p className="text-muted-foreground text-sm">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTokens([]);
                    fetchTrendingTokens();
                  }}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token, index) => (
                <Card key={token.address || index} className="border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Token Logo */}
                      <div className="flex-shrink-0">
                        <img 
                          src={token.info?.imageUrl || token.imageUrl || token.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(token.symbol)}`} 
                          alt={`${token.name} logo`}
                          className="w-12 h-12 rounded-full border border-border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(token.symbol)}`;
                          }}
                        />
                      </div>

                      {/* Token Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground truncate">{token.name}</h3>
                          <span className="text-muted-foreground text-sm">({token.symbol})</span>
                        </div>
                        
                        {token.address && (
                          <p className="text-xs text-muted-foreground mb-2 font-mono">
                            {truncateAddress(token.address)}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {token.info?.description || token.description || 'No description available'}
                        </p>

                        {/* Token Metrics */}
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <div className="font-semibold text-foreground">
                              {token.price ? formatCurrency(token.price) : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Liquidity:</span>
                            <div className="font-semibold text-foreground">
                              {token.liquidity ? formatCurrency(token.liquidity) : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">24h Volume:</span>
                            <div className="font-semibold text-foreground">
                              {token.volume24h ? formatCurrency(token.volume24h) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Copy Button */}
                      <div className="flex-shrink-0">
                        <Button
                          onClick={() => handleCopyToForm(token)}
                          className="bg-moonova hover:bg-moonova/90 text-moonova-foreground font-semibold px-4 py-2 transition-all duration-200 hover:scale-105"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Form
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};