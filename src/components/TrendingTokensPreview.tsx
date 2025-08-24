import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Twitter, MessageCircle, Hash } from "lucide-react";

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

interface TrendingTokensPreviewProps {
  tokens: TrendingToken[];
  onUseToken: (token: TrendingToken) => void;
  onUseAll: () => void;
}

export const TrendingTokensPreview = ({ tokens, onUseToken, onUseAll }: TrendingTokensPreviewProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (tokens.length === 0) return null;

  return (
    <Card className="border-border bg-card/30 backdrop-blur-lg shadow-2xl mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trending Tokens (6h)</h3>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {tokens.length} tokens
            </Badge>
            <Button 
              onClick={onUseAll}
              size="sm"
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow"
            >
              Use All
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tokens.map((token, index) => (
            <div 
              key={token.tokenAddress}
              className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background/50 hover:bg-background/70 transition-all duration-200"
            >
              {/* Token Image */}
              <div className="flex-shrink-0">
                <img 
                  src={token.image} 
                  alt={token.name}
                  className="w-10 h-10 rounded-full object-cover bg-muted"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-token.png';
                  }}
                />
              </div>
              
              {/* Token Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{token.name}</h4>
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    ${token.symbol}
                  </Badge>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {truncateText(token.description, 80)}
                </p>
                
                {/* Metadata Links */}
                <div className="flex items-center gap-2">
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
                onClick={() => onUseToken(token)}
                size="sm"
                variant="outline"
                className="flex-shrink-0"
              >
                Use
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};