import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrendingToken {
  name: string;
  symbol: string;
  image: string;
  description: string;
  metadata: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  chain: string;
  tokenAddress: string;
}

interface TrendingTokensPreviewProps {
  tokens: TrendingToken[];
  onUseToken: (token: TrendingToken) => void;
  onUseAll: () => void;
  onClose: () => void;
}

const TrendingTokensPreview = ({ tokens, onUseToken, onUseAll, onClose }: TrendingTokensPreviewProps) => {
  const { toast } = useToast();

  const handleUseToken = (token: TrendingToken) => {
    onUseToken(token);
    toast({
      title: "Token data copied",
      description: `${token.name} (${token.symbol}) data has been copied to the form`,
    });
  };

  const handleUseAll = () => {
    onUseAll();
    toast({
      title: "Bulk import complete",
      description: `All ${tokens.length} tokens have been prepared for creation`,
    });
  };

  const getMetadataLinks = (metadata: TrendingToken['metadata']) => {
    const links = [];
    if (metadata.website) links.push({ type: 'website', url: metadata.website, icon: ExternalLink });
    if (metadata.twitter) links.push({ type: 'twitter', url: metadata.twitter, icon: ExternalLink });
    if (metadata.telegram) links.push({ type: 'telegram', url: metadata.telegram, icon: Users });
    if (metadata.discord) links.push({ type: 'discord', url: metadata.discord, icon: Users });
    return links;
  };

  return (
    <Card className="border-border bg-card/30 backdrop-blur-lg shadow-2xl max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          🔥 Trending Tokens <Badge variant="secondary" className="ml-2">6h Solana</Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleUseAll} variant="default" size="sm">
            Use All ({tokens.length})
          </Button>
          <Button onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {tokens.map((token, index) => (
          <div
            key={`${token.symbol}-${index}`}
            className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card/50 hover:bg-card/70 transition-all duration-200"
          >
            {/* Token Logo */}
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden flex-shrink-0">
              {token.image ? (
                <img 
                  src={token.image} 
                  alt={`${token.name} logo`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = token.symbol.slice(0, 2);
                  }}
                />
              ) : (
                <span className="text-white font-bold text-sm">{token.symbol.slice(0, 2)}</span>
              )}
            </div>

            {/* Token Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{token.name}</h3>
                <Badge variant="outline" className="text-xs">${token.symbol}</Badge>
              </div>
              
              {token.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{token.description}</p>
              )}
              
              {/* Metadata Links */}
              <div className="flex gap-1 flex-wrap">
                {getMetadataLinks(token.metadata).map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs hover:bg-primary/20 transition-colors"
                  >
                    <link.icon className="w-3 h-3" />
                    {link.type}
                  </a>
                ))}
              </div>
            </div>

            {/* Use Button */}
            <Button
              onClick={() => handleUseToken(token)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
              Use
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingTokensPreview;