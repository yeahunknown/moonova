import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Globe, Twitter, MessageCircle, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface TrendingToken {
  name: string;
  symbol: string;
  image: string | null;
  description: string;
  address: string;
  website: string | null;
  twitter: string | null;
  telegram: string | null;
  dexUrl: string | null;
}

interface TrendingTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrendingTokensModal = ({ 
  open, 
  onOpenChange
}: TrendingTokensModalProps) => {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchTrendingTokens = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching top 10 trending tokens...');
      
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://cupuoqzponoclqjsmaoq.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cHVvcXpwb25vY2xxanNtYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5OTUxMjUsImV4cCI6MjA3MTU3MTEyNX0.q5VU33UtcunKsuVFDIy0vPGweMQNJSMSMpC2hf1ueuk'
      );
      
      const { data, error } = await supabase.functions.invoke('birdeye-trending');
      
      if (error) {
        console.error('Supabase function error:', error);
        const errorMessage = error.message || 'Function invocation failed';
        throw new Error(errorMessage);
      }
      
      // Check if data contains an error response from the function
      if (data && typeof data === 'object' && 'error' in data) {
        console.error('Function returned error:', data);
        throw new Error(data.error || 'Function returned an error');
      }
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid response from function:', data);
        throw new Error('Invalid response format from server');
      }
      
      console.log(`Received ${data.length} tokens from trending API`);
      
      setTokens(data);
      
      if (data.length > 0) {
        toast({
          title: "Success",
          description: `Loaded ${data.length} trending Solana tokens`,
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
    // Save to localStorage for prefilling
    localStorage.setItem('createPrefill', JSON.stringify(token));
    
    // Navigate to create page
    navigate('/create');
    onOpenChange(false);
    
    toast({
      title: "Token copied",
      description: `${token.name} data copied to create form`,
    });
  };

  const truncateMiddle = (text: string, maxLength: number = 30) => {
    if (!text || text.length <= maxLength) return text;
    const start = text.slice(0, Math.floor(maxLength / 2));
    const end = text.slice(-Math.floor(maxLength / 2));
    return `${start}...${end}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Top 10 Trending Solana Tokens
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              24h trending ranked by score. Click copy to prefill token creation form.
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchTrendingTokens}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading && tokens.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading trending tokens...</p>
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
              {tokens.map((token, index) => (
                <div
                  key={`${token.address}-${index}`}
                  className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Token Logo and Basic Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
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
                          <div className={`text-white text-xs font-bold ${token.image ? 'hidden' : ''}`}>
                            {token.symbol.slice(0, 2)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>${token.symbol}</span>
                            {(token.website || token.dexUrl) && (
                              <>
                                <span>•</span>
                                <span>{truncateMiddle(token.website || token.dexUrl || '')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Links and Copy Button */}
                    <div className="flex items-center space-x-2">
                      {token.website && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={token.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {token.twitter && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={token.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {token.telegram && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={token.telegram} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {token.dexUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a href={token.dexUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleCopyToken(token)}
                        size="sm"
                        style={{ backgroundColor: '#ccbe43', color: 'black' }}
                        className="hover:opacity-90"
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