import * as React from "react";
import { Dialog, DialogContent, DialogPortal, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Twitter, MessageCircle, Hash, Loader2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrendingToken {
  symbol: string;
  name: string;
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
  randomized: {
    supply: string;
    decimals: number;
    burnable: boolean;
    mintable: boolean;
    transactionTax: number;
    revokeFreezeAuth: boolean;
    revokeMintAuth: boolean;
    revokeMetadataAuth: boolean;
  };
}

interface TrendingTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTokenSelect: (token: TrendingToken) => void;
  onUseAll: (tokens: TrendingToken[]) => void;
}

export function TrendingTokensModal({ 
  open, 
  onOpenChange, 
  onTokenSelect, 
  onUseAll 
}: TrendingTokensModalProps) {
  const [tokens, setTokens] = React.useState<TrendingToken[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrendingTokens = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('trending-tokens', {
        body: { 
          timeframe: '6h', 
          limit: 10, 
          chain: 'solana' 
        }
      });

      if (error) throw error;

      // Handle both { tokens: [...] } and [...] response formats
      const tokensArray = data?.tokens || data || [];
      setTokens(tokensArray);
      
      if (tokensArray.length > 0) {
        toast({
          title: "Success",
          description: `Loaded ${tokensArray.length} trending tokens`,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load trending tokens");
      toast({
        title: "Error",
        description: "Couldn't load trending tokens. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (open) {
      fetchTrendingTokens();
    }
  }, [open, fetchTrendingTokens]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleUseToken = (token: TrendingToken) => {
    // Set all revokes to true for advanced settings
    const tokenWithRevokes = {
      ...token,
      randomized: {
        ...token.randomized,
        revokeFreezeAuth: true,
        revokeMintAuth: true,
        revokeMetadataAuth: true,
      }
    };
    
    onTokenSelect(tokenWithRevokes);
    onOpenChange(false);
    toast({
      title: "Token imported",
      description: `${token.name} (${token.symbol}) has been imported to your form`,
    });
  };

  const handleUseAll = () => {
    // Set all revokes to true for all tokens
    const tokensWithRevokes = tokens.map(token => ({
      ...token,
      randomized: {
        ...token.randomized,
        revokeFreezeAuth: true,
        revokeMintAuth: true,
        revokeMetadataAuth: true,
      }
    }));
    
    onUseAll(tokensWithRevokes);
    onOpenChange(false);
    toast({
      title: "All tokens imported",
      description: `${tokens.length} trending tokens have been imported`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Copy Trending Tokens</DialogTitle>
          <DialogDescription className="sr-only">Select tokens to import into your creation form</DialogDescription>
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-primary/20 rounded-xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
            {/* Header with Icon */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Copy Trending Tokens</h2>
              <p className="text-gray-300 text-sm">Select tokens to import into your creation form</p>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-foreground font-medium mb-1">Loading trending tokens...</p>
                <p className="text-muted-foreground text-sm">Fetching live data from DexScreener</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-destructive text-xl">⚠</span>
                </div>
                <p className="text-destructive font-medium mb-1">Failed to load tokens</p>
                <p className="text-muted-foreground text-sm mb-4">{error}</p>
                <Button 
                  onClick={fetchTrendingTokens}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {tokens.length} tokens
                  </Badge>
                  <Button 
                    onClick={handleUseAll}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    disabled={tokens.length === 0}
                  >
                    Use All
                  </Button>
                </div>

                {/* Token List */}
                <div className="bg-muted/50 border border-border rounded-lg p-3 max-h-80 overflow-y-auto">
                  <div className="space-y-2">
                    {tokens.map((token, index) => (
                      <div 
                        key={token.tokenAddress}
                        className="flex items-center gap-3 p-2 rounded-lg border border-border bg-background/50 hover:bg-background/70 transition-all duration-200"
                      >
                        {/* Token Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={token.image} 
                            alt={token.name}
                            className="w-8 h-8 rounded-full object-cover bg-muted"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-token.png';
                            }}
                          />
                        </div>
                        
                        {/* Token Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-foreground truncate">{token.name}</h4>
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              ${token.symbol}
                            </Badge>
                            <span className="text-xs text-muted-foreground">#{index + 1}</span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                            {truncateText(token.description, 50)}
                          </p>
                          
                          {/* Metadata Links */}
                          <div className="flex items-center gap-1">
                            {token.metadata.website && (
                              <Globe className="w-3 h-3 text-muted-foreground" />
                            )}
                            {token.metadata.twitter && (
                              <Twitter className="w-3 h-3 text-muted-foreground" />
                            )}
                            {token.metadata.telegram && (
                              <MessageCircle className="w-3 h-3 text-muted-foreground" />
                            )}
                            {token.metadata.discord && (
                              <Hash className="w-3 h-3 text-muted-foreground" />
                            )}
                            {!token.metadata.website && !token.metadata.twitter && !token.metadata.telegram && !token.metadata.discord && (
                              <span className="text-xs text-muted-foreground">No socials</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Use Button */}
                        <Button 
                          onClick={() => handleUseToken(token)}
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0"
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}