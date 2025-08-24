import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Globe, Twitter, MessageCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrendingToken {
  name: string;
  symbol: string;
  image: string;
  description: string;
  metadata: {
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
  };
  tokenAddress: string;
  chain: string;
  price?: number;
  liquidity?: number;
  volume24h?: number;
}

interface TrendingTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTokenSelect: (token: TrendingToken) => void;
  onTokensSelect: (tokens: TrendingToken[]) => void;
}

export const TrendingTokensModal = ({ 
  open, 
  onOpenChange, 
  onTokenSelect, 
  onTokensSelect 
}: TrendingTokensModalProps) => {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrendingTokens = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching trending tokens from Birdeye via edge function...');
      
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://cupuoqzponoclqjsmaoq.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cHVvcXpwb25vY2xxanNtYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5OTUxMjUsImV4cCI6MjA3MTU3MTEyNX0.q5VU33UtcunKsuVFDIy0vPGweMQNJSMSMpC2hf1ueuk'
      );
      
      const { data, error } = await supabase.functions.invoke('birdeye-trending', {
        body: { 
          chain: 'solana',
          limit: 10
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid response from function:', data);
        throw new Error('Invalid response format from server');
      }
      
      console.log(`Received ${data.length} tokens from edge function`);
      
      // Filter out any invalid tokens and ensure we have the required fields
      const validTokens = data.filter(token => 
        token.symbol && 
        token.tokenAddress && 
        token.name
      );
      
      setTokens(validTokens);
      
      if (validTokens.length > 0) {
        toast({
          title: "Success",
          description: `Loaded ${validTokens.length} trending tokens from Birdeye`,
        });
      } else {
        toast({
          title: "No tokens found",
          description: "No valid trending tokens were found",
          variant: "destructive",
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trending tokens";
      console.error('Error fetching trending tokens:', err);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Couldn't load trending tokens. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && tokens.length === 0) {
      fetchTrendingTokens();
    }
  }, [open]);

  const handleCopyToken = (token: TrendingToken) => {
    onTokenSelect(token);
    onOpenChange(false);
  };

  const handleCopyAll = () => {
    onTokensSelect(tokens);
    onOpenChange(false);
  };

  const formatAddress = (address: string) => {
    if (!address || address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    if (price < 0.01) return `$${price.toFixed(6)}`;
    return `$${price.toFixed(4)}`;
  };

  const formatLiquidity = (liquidity?: number) => {
    if (!liquidity) return "N/A";
    if (liquidity >= 1000000) return `$${(liquidity / 1000000).toFixed(1)}M`;
    if (liquidity >= 1000) return `$${(liquidity / 1000).toFixed(1)}K`;
    return `$${liquidity.toFixed(0)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Trending Tokens (Solana, Live)
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Real-time trending tokens from Apify API
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            {tokens.length > 0 && (
              <Button
                onClick={handleCopyAll}
                variant="outline"
                size="sm"
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-primary/20"
              >
                Copy All {tokens.length}
              </Button>
            )}
            <Button
              onClick={fetchTrendingTokens}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading && tokens.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading trending tokens from Birdeye...</p>
              </div>
            </div>
          ) : error && tokens.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchTrendingTokens} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : tokens.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No trending tokens found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.length < 10 && (
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {tokens.length} token{tokens.length !== 1 ? 's' : ''}
                </div>
              )}
              
              {tokens.map((token, index) => (
                <div
                  key={`${token.tokenAddress}-${index}`}
                  className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Token Logo and Basic Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                          {token.image ? (
                            <img 
                              src={token.image} 
                              alt={token.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`text-white text-sm font-bold ${token.image ? 'hidden' : ''}`}>
                            {token.symbol.slice(0, 2)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>${token.symbol}</span>
                            <span>•</span>
                            <span>{formatAddress(token.tokenAddress)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Liquidity */}
                      <div className="hidden md:flex items-center space-x-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Price</div>
                          <div>{formatPrice(token.price)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Liquidity</div>
                          <div>{formatLiquidity(token.liquidity)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Links */}
                    <div className="flex items-center space-x-2">
                      {token.metadata.website && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={token.metadata.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {token.metadata.twitter && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={token.metadata.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {token.metadata.telegram && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={token.metadata.telegram} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleCopyToken(token)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {token.description && (
                    <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {token.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};