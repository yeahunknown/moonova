import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Upload, ArrowLeft, ArrowRight } from "lucide-react";

const CreateToken = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: [9],
    addMetadata: false,
    description: "",
    burnable: false,
    mintable: false,
    transactionTax: [0],
    revokeFreezeAuth: false,
    revokeMintAuth: false,
    revokeMetadataAuth: false,
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const progressPercentage = (step / 3) * 100;

  const calculateCost = () => {
    let cost = 0.1; // Base token creation
    if (formData.addMetadata) cost += 0.1;
    if (formData.revokeFreezeAuth) cost += 0.1;
    if (formData.revokeMintAuth) cost += 0.1;
    if (formData.revokeMetadataAuth) cost += 0.1;
    return cost.toFixed(1);
  };

  const renderStep1 = () => (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="tokenName">Token Name</Label>
              <Input
                id="tokenName"
                placeholder="Solana COIN"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input
                id="tokenSymbol"
                placeholder="zzz"
                value={formData.symbol}
                onChange={(e) => updateFormData("symbol", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="totalSupply">Total Supply</Label>
              <Input
                id="totalSupply"
                placeholder="1000000000"
                value={formData.supply}
                onChange={(e) => updateFormData("supply", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Decimals: {formData.decimals[0]}</Label>
              <Slider
                value={formData.decimals}
                onValueChange={(value) => updateFormData("decimals", value)}
                max={9}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-border bg-gradient-subtle">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Token Preview</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{formData.name || "Your Token"}</h3>
                <p className="text-muted-foreground">${formData.symbol || "TOKEN"}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supply:</span>
                <span>{formData.supply ? Number(formData.supply).toLocaleString() : "1,000,000,000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Decimals:</span>
                <span>{formData.decimals[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span>Solana</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="px-2 py-1 bg-success/20 text-success rounded text-sm">Ready to launch</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <Card className="border-border bg-card/50 backdrop-blur-sm max-w-2xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Token Details</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <Label>Add Metadata (Website, Twitter, Telegram)</Label>
              <p className="text-sm text-muted-foreground">+0.1 SOL</p>
            </div>
            <Switch
              checked={formData.addMetadata}
              onCheckedChange={(checked) => updateFormData("addMetadata", checked)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your meme coin..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              className="mt-2 min-h-32"
            />
          </div>

          <div>
            <Label>Token Logo Upload</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Upload your token logo</p>
              <p className="text-sm text-muted-foreground mt-1">Max 2MB • PNG, JPG, SVG</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Settings */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Advanced Settings</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Burnable</Label>
                <Switch
                  checked={formData.burnable}
                  onCheckedChange={(checked) => updateFormData("burnable", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mintable</Label>
                <Switch
                  checked={formData.mintable}
                  onCheckedChange={(checked) => updateFormData("mintable", checked)}
                />
              </div>
            </div>

            <div>
              <Label>Transaction Tax: {formData.transactionTax[0]}%</Label>
              <Slider
                value={formData.transactionTax}
                onValueChange={(value) => updateFormData("transactionTax", value)}
                max={10}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Authority Revokes</h3>
              <div className="flex items-center justify-between p-3 border border-border rounded">
                <div>
                  <Label>Revoke Freeze</Label>
                  <p className="text-sm text-muted-foreground">+0.1 SOL</p>
                </div>
                <Switch
                  checked={formData.revokeFreezeAuth}
                  onCheckedChange={(checked) => updateFormData("revokeFreezeAuth", checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded">
                <div>
                  <Label>Revoke Mint</Label>
                  <p className="text-sm text-muted-foreground">+0.1 SOL</p>
                </div>
                <Switch
                  checked={formData.revokeMintAuth}
                  onCheckedChange={(checked) => updateFormData("revokeMintAuth", checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded">
                <div>
                  <Label>Revoke Metadata</Label>
                  <p className="text-sm text-muted-foreground">+0.1 SOL</p>
                </div>
                <Switch
                  checked={formData.revokeMetadataAuth}
                  onCheckedChange={(checked) => updateFormData("revokeMetadataAuth", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card className="border-border bg-gradient-subtle">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Cost Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2">
              <span>Token Creation:</span>
              <span>0.1 SOL</span>
            </div>
            {formData.addMetadata && (
              <div className="flex justify-between py-2">
                <span>Metadata:</span>
                <span>0.1 SOL</span>
              </div>
            )}
            {formData.revokeFreezeAuth && (
              <div className="flex justify-between py-2">
                <span>Revoke Freeze:</span>
                <span>0.1 SOL</span>
              </div>
            )}
            {formData.revokeMintAuth && (
              <div className="flex justify-between py-2">
                <span>Revoke Mint:</span>
                <span>0.1 SOL</span>
              </div>
            )}
            {formData.revokeMetadataAuth && (
              <div className="flex justify-between py-2">
                <span>Revoke Metadata:</span>
                <span>0.1 SOL</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm text-muted-foreground">
              <span>Network Fee:</span>
              <span>~0.000005 SOL</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between py-2 text-lg font-semibold">
              <span>Total:</span>
              <span>{calculateCost()} SOL</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Create Your <span className="bg-gradient-primary bg-clip-text text-transparent">Token</span>
              </h1>
              <p className="text-muted-foreground">Follow the 3-step process to launch your token</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Step {step} of 3</span>
                <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {step < 3 ? (
                <Button
                  onClick={() => setStep(Math.min(3, step + 1))}
                  className="bg-gradient-primary hover:opacity-90 flex items-center"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-gradient-primary hover:opacity-90 shadow-glow flex items-center">
                  <Rocket className="mr-2 h-4 w-4" />
                  Create Token
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateToken;