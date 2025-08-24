import * as React from "react";
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Twitter, MessageCircle, Hash, Loader2, Check } from "lucide-react";
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

      if (data?.tokens) {
        setTokens(data.tokens);
        toast({
          title: "Success",
          description: `Imported ${data.tokens.length} trending tokens (6h)`,
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
        <DialogContent className="p-0 gap-0 bg-[#0F0F23] border border-[#2A2D47] max-w-2xl rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="p-6 relative">
            {/* Header */}
            <div className="border-b border-[#2A2D47] pb-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
                  </div>
                  <span className="ml-3 text-xl font-bold text-white">Trending Tokens</span>
                </div>
                <div className="flex items-center gap-2 bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#22C55E] font-semibold">LIVE DATA</span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Copy Trending Tokens (6h)</h2>
                <p className="text-[#9CA3AF] text-sm">Select tokens to import into your creation form</p>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-[#8B5CF6] animate-spin mb-6" />
                <div className="text-center">
                  <p className="text-white font-semibold text-lg mb-2">Loading trending tokens...</p>
                  <p className="text-[#9CA3AF] text-sm">Fetching live data from DexScreener</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-[#EF4444]/20 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-[#EF4444] text-2xl">⚠</span>
                </div>
                <div className="text-center">
                  <p className="text-[#EF4444] font-semibold text-lg mb-2">Failed to load tokens</p>
                  <p className="text-[#9CA3AF] text-sm mb-4">{error}</p>
                  <Button 
                    onClick={fetchTrendingTokens}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] hover:from-[#7C3AED] hover:to-[#0891B2] text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {tokens.length} tokens
                  </Badge>
                  <Button 
                    onClick={handleUseAll}
                    size="sm"
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] hover:from-[#7C3AED] hover:to-[#0891B2] text-white shadow-lg"
                    disabled={tokens.length === 0}
                  >
                    Use All
                  </Button>
                </div>

                {/* Token List */}
                <div className="bg-[#1A1A3A] border border-[#2A2D47] rounded-xl p-4 shadow-lg max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {tokens.map((token, index) => (
                      <div 
                        key={token.tokenAddress}
                        className="flex items-center gap-4 p-3 rounded-lg border border-[#2A2D47] bg-[#0F0F23] hover:bg-[#1A1A3A] transition-all duration-200"
                      >
                        {/* Token Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={token.image} 
                            alt={token.name}
                            className="w-10 h-10 rounded-full object-cover bg-[#2A2D47]"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-token.png';
                            }}
                          />
                        </div>
                        
                        {/* Token Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-white truncate">{token.name}</h4>
                            <Badge variant="outline" className="text-xs px-2 py-0 border-[#8B5CF6] text-[#8B5CF6]">
                              ${token.symbol}
                            </Badge>
                            <span className="text-xs text-[#9CA3AF]">#{index + 1}</span>
                          </div>
                          
                          <p className="text-xs text-[#9CA3AF] mb-2 line-clamp-1">
                            {truncateText(token.description, 60)}
                          </p>
                          
                          {/* Metadata Links */}
                          <div className="flex items-center gap-2">
                            {token.metadata.website && (
                              <Globe className="w-3 h-3 text-[#9CA3AF]" />
                            )}
                            {token.metadata.twitter && (
                              <Twitter className="w-3 h-3 text-[#9CA3AF]" />
                            )}
                            {token.metadata.telegram && (
                              <MessageCircle className="w-3 h-3 text-[#9CA3AF]" />
                            )}
                            {token.metadata.discord && (
                              <Hash className="w-3 h-3 text-[#9CA3AF]" />
                            )}
                            {!token.metadata.website && !token.metadata.twitter && !token.metadata.telegram && !token.metadata.discord && (
                              <span className="text-xs text-[#9CA3AF]">No socials</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Use Button */}
                        <Button 
                          onClick={() => handleUseToken(token)}
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
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
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}