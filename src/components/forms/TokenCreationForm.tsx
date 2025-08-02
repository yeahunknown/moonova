import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ArrowLeft, ArrowRight, Rocket, Globe, Twitter, MessageCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const tokenSchema = z.object({
  name: z.string().min(2, "Token name must be at least 2 characters"),
  symbol: z.string().min(2, "Token symbol must be at least 2 characters"),
  supply: z.string()
    .regex(/^\d+$/, "Only numbers allowed")
    .refine((val) => Number(val) <= 1000000000, "Max supply is 1,000,000,000"),
  decimals: z.array(z.number()),
  description: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().regex(/^@/, "Must start with @").optional().or(z.literal("")),
  telegram: z.string().regex(/^t\.me\//, "Must start with t.me/").optional().or(z.literal("")),
  addMetadata: z.boolean(),
  burnable: z.boolean(),
  mintable: z.boolean(),
  transactionTax: z.array(z.number()),
  revokeFreezeAuth: z.boolean(),
  revokeMintAuth: z.boolean(),
  revokeMetadataAuth: z.boolean(),
});

type TokenFormData = z.infer<typeof tokenSchema>;

interface TokenCreationFormProps {
  step: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (data: TokenFormData) => void;
}

const TokenCreationForm = ({ step, onNext, onPrevious, onSubmit }: TokenCreationFormProps) => {
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      supply: "",
      decimals: [9],
      description: "",
      website: "",
      twitter: "",
      telegram: "",
      addMetadata: false,
      burnable: false,
      mintable: false,
      transactionTax: [0],
      revokeFreezeAuth: false,
      revokeMintAuth: false,
      revokeMetadataAuth: false,
    },
  });

  const { watch, setValue } = form;
  const formData = watch();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    if (!["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
      alert("Only PNG, JPG, and SVG files are allowed");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate randomized loading
    const duration = Math.random() * 2000 + 1000; // 1-3 seconds
    const interval = 50;
    const increment = (100 * interval) / duration;

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + increment + Math.random() * 5;
        if (next >= 100) {
          clearInterval(progressInterval);
          // Convert file to URL for preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedLogo(e.target?.result as string);
            setIsUploading(false);
            setUploadProgress(0);
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return next;
      });
    }, interval);
  };

  const calculateCost = () => {
    let cost = 0.1; // Base token creation
    if (formData.addMetadata) cost += 0.1;
    if (formData.revokeFreezeAuth) cost += 0.1;
    if (formData.revokeMintAuth) cost += 0.1;
    if (formData.revokeMetadataAuth) cost += 0.1;
    return cost.toFixed(1);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof TokenFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["name", "symbol", "supply"];
    } else if (step === 2) {
      fieldsToValidate = ["description"];
      if (formData.addMetadata) {
        fieldsToValidate.push("website", "twitter", "telegram");
      }
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      onNext();
    }
  };

  const handleSubmit = (data: TokenFormData) => {
    onSubmit(data);
  };

  const renderStep1 = () => (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Basic Information</h2>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Solana COIN"
                      {...field}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="zzz"
                      {...field}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Supply</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1000000000"
                      {...field}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimals: {field.value[0]}</FormLabel>
                  <FormControl>
                    <Slider
                      value={field.value}
                      onValueChange={field.onChange}
                      max={9}
                      min={0}
                      step={1}
                      className="transition-all duration-300 hover:scale-105"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Token Preview */}
      <Card className="border-border bg-gradient-subtle shadow-elegant">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Token Preview</h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                {uploadedLogo ? (
                  <img src={uploadedLogo} alt="Token logo" className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <Rocket className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="text-center">
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
                <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm">Pre-launch</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <Card className="border-border bg-card/50 backdrop-blur-sm max-w-2xl mx-auto shadow-elegant">
      <CardContent className="p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Token Details</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg transition-all duration-200 hover:shadow-lg">
            <div>
              <Label>Add Metadata (Website, Twitter, Telegram)</Label>
              <p className="text-sm text-muted-foreground">+0.1 SOL</p>
            </div>
            <Switch
              checked={formData.addMetadata}
              onCheckedChange={(checked) => setValue("addMetadata", checked)}
            />
          </div>

          {formData.addMetadata && (
            <div className="space-y-4 animate-fade-in">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://yourtoken.com"
                        {...field}
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@yourtoken"
                        {...field}
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Telegram
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="t.me/yourtoken"
                        {...field}
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your meme coin..."
                    {...field}
                    className="min-h-32 transition-all duration-200 focus:scale-105"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label>Token Logo Upload</Label>
            <div className="mt-2 relative">
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-all duration-300 hover:scale-105 cursor-pointer">
                {uploadedLogo && !isUploading ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={uploadedLogo} 
                      alt="Token logo" 
                      className="w-16 h-16 rounded-full object-cover mb-4 shadow-lg"
                    />
                    <p className="text-muted-foreground">Logo uploaded successfully</p>
                    <p className="text-sm text-muted-foreground mt-1">Click to change</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Upload your token logo</p>
                    <p className="text-sm text-muted-foreground mt-1">Max 2MB • PNG, JPG, SVG</p>
                  </>
                )}
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{Math.round(uploadProgress)}% uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="border-border bg-card/50 backdrop-blur-sm shadow-elegant">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Advanced Settings</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded transition-all duration-200 hover:shadow-lg">
                <Label>Burnable</Label>
                <Switch
                  checked={formData.burnable}
                  onCheckedChange={(checked) => setValue("burnable", checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded transition-all duration-200 hover:shadow-lg">
                <Label>Mintable</Label>
                <Switch
                  checked={formData.mintable}
                  onCheckedChange={(checked) => setValue("mintable", checked)}
                />
              </div>
            </div>

            <div>
              <Label>Transaction Tax: {formData.transactionTax[0]}%</Label>
              <Slider
                value={formData.transactionTax}
                onValueChange={(value) => setValue("transactionTax", value)}
                max={10}
                min={0}
                step={0.1}
                className="mt-2 transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Authority Revokes</h3>
              <div className="flex items-center justify-between p-3 border border-border rounded transition-all duration-200 hover:shadow-lg">
                <div>
                  <Label>Revoke Freeze</Label>
                  <p className="text-sm text-muted-foreground">+0.1 SOL</p>
                </div>
                <Switch
                  checked={formData.revokeFreezeAuth}
                  onCheckedChange={(checked) => setValue("revokeFreezeAuth", checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded transition-all duration-200 hover:shadow-lg">
                <div>
                  <Label>Revoke Mint</Label>
                  <p className="text-sm text-muted-foreground">+0.1 SOL</p>
                </div>
                <Switch
                  checked={formData.revokeMintAuth}
                  onCheckedChange={(checked) => setValue("revokeMintAuth", checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded transition-all duration-200 hover:shadow-lg">
                <div>
                  <Label>Revoke Metadata</Label>
                  <p className="text-sm text-muted-foreground">+0.1 SOL</p>
                </div>
                <Switch
                  checked={formData.revokeMetadataAuth}
                  onCheckedChange={(checked) => setValue("revokeMetadataAuth", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card className="border-border bg-gradient-subtle shadow-elegant">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Cost Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2">
              <span>Token Creation:</span>
              <span>0.1 SOL</span>
            </div>
            {formData.addMetadata && (
              <div className="flex justify-between py-2 animate-fade-in">
                <span>Metadata:</span>
                <span>0.1 SOL</span>
              </div>
            )}
            {formData.revokeFreezeAuth && (
              <div className="flex justify-between py-2 animate-fade-in">
                <span>Revoke Freeze:</span>
                <span>0.1 SOL</span>
              </div>
            )}
            {formData.revokeMintAuth && (
              <div className="flex justify-between py-2 animate-fade-in">
                <span>Revoke Mint:</span>
                <span>0.1 SOL</span>
              </div>
            )}
            {formData.revokeMetadataAuth && (
              <div className="flex justify-between py-2 animate-fade-in">
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="transition-all duration-500 ease-in-out">
          {step === 1 && (
            <div className="animate-fade-in">
              {renderStep1()}
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-in">
              {renderStep2()}
            </div>
          )}
          {step === 3 && (
            <div className="animate-fade-in">
              {renderStep3()}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={step === 1}
            className="flex items-center transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-gradient-primary hover:opacity-90 flex items-center transition-all duration-200 hover:scale-105 shadow-glow"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="bg-gradient-primary hover:opacity-90 shadow-glow flex items-center transition-all duration-200 hover:scale-105"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Create Token
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TokenCreationForm;