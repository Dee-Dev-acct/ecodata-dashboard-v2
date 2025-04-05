import { useEffect, useState } from 'react';
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Loader2, Info, CreditCard, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// The payment form that users will fill out
const CheckoutForm = ({ donationType, donationAmount }: { donationType: 'one-time' | 'monthly'; donationAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Use the appropriate method based on donation type
      const { error } = donationType === 'one-time' 
        ? await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: window.location.origin + '/donation-success',
            },
          })
        : await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: window.location.origin + '/subscription-success',
            },
          });

      if (error) {
        toast({
          title: "Payment failed",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
        setIsLoading(false);
      }
      // Otherwise, the page will redirect to the success URL
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="space-y-4 mt-6">
        <div className="flex items-start space-x-2">
          <Checkbox id="gift-aid" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="gift-aid"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Claim Gift Aid (UK taxpayers only)
            </Label>
            <p className="text-xs text-muted-foreground">
              By checking this box, I confirm I am a UK taxpayer and understand that if I pay less Income Tax and/or Capital 
              Gains Tax than the amount of Gift Aid claimed on all my donations in that tax year, it's my responsibility to pay any difference.
            </p>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Donate ${donationType === 'one-time' ? `£${donationAmount}` : `£${donationAmount} monthly`}`
        )}
      </Button>
      
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <CreditCard className="h-4 w-4" />
        <span>Secure payment processing by Stripe</span>
      </div>
    </form>
  );
};

// The main Checkout component that wraps everything
export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [donationAmount, setDonationAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState(25);
  const [showCustomAmount, setShowCustomAmount] = useState(false);

  const params = useParams<{ goalId?: string }>();
  const { goalId } = params;
  const { toast } = useToast();
  
  // Handle changes in the custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCustomAmount(value);
      setDonationAmount(value);
    }
  };
  
  // Switch between predefined amounts and custom amount
  const toggleCustomAmount = () => {
    setShowCustomAmount(!showCustomAmount);
    if (!showCustomAmount) {
      setDonationAmount(customAmount);
    }
  };
  
  // Select a predefined amount
  const selectAmount = (amount: number) => {
    setDonationAmount(amount);
    setShowCustomAmount(false);
  };
  
  // Create PaymentIntent or SetupIntent when the checkout parameters change
  useEffect(() => {
    // Function to create the payment intent
    const createPaymentIntent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = donationType === 'one-time' 
          ? '/api/create-payment-intent' 
          : '/api/create-subscription';
        
        const response = await apiRequest('POST', endpoint, { 
          amount: donationAmount,
          goalId: goalId || undefined
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        setError(error.message || 'Failed to initialize payment. Please try again.');
        toast({
          title: "Error",
          description: error.message || "Failed to set up payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only create a payment intent if we have a valid amount
    if (donationAmount > 0) {
      createPaymentIntent();
    }
  }, [donationType, donationAmount, goalId, toast]);

  // Stripe Elements appearance options
  const appearance = {
    theme: 'stripe' as 'stripe',
    variables: {
      colorPrimary: '#2A9D8F', // Match our brand color
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Make a Donation</h1>
                
                <Tabs defaultValue="one-time" className="mb-8" onValueChange={(value) => setDonationType(value as 'one-time' | 'monthly')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="one-time">One-time Donation</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Subscription</TabsTrigger>
                  </TabsList>
                  <TabsContent value="one-time" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Help us make an immediate impact</h3>
                      <p className="text-muted-foreground">
                        Your one-time donation will help fund crucial environmental data projects 
                        that create lasting changes in our communities.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="monthly" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Become a monthly supporter</h3>
                      <p className="text-muted-foreground">
                        Join our community of monthly donors to help us plan and sustain
                        long-term projects for continuous environmental impact.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Select donation amount</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[10, 25, 50, 100].map((amount) => (
                      <Button
                        key={amount}
                        variant={donationAmount === amount && !showCustomAmount ? "default" : "outline"}
                        onClick={() => selectAmount(amount)}
                        className="font-semibold text-lg"
                      >
                        £{amount}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="custom-amount"
                      checked={showCustomAmount}
                      onCheckedChange={toggleCustomAmount}
                    />
                    <Label htmlFor="custom-amount">Custom amount</Label>
                  </div>
                  
                  {showCustomAmount && (
                    <div className="flex items-center space-x-2 mb-6">
                      <span className="text-xl font-medium">£</span>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="text-lg"
                        placeholder="Enter amount"
                      />
                    </div>
                  )}
                </div>
                
                <div className="my-8">
                  <Separator />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Payment details</h3>
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Setting up secure payment...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-center">
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                      <CheckoutForm donationType={donationType} donationAmount={donationAmount} />
                    </Elements>
                  ) : null}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                    <CardDescription>How your donation helps our mission</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Environmental Data Collection</h4>
                        <p className="text-sm text-muted-foreground">
                          Funds advanced sensor networks and monitoring stations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Community Education</h4>
                        <p className="text-sm text-muted-foreground">
                          Supports public workshops and educational programs.
                        </p>
                      </div>
                    </div>
                    
                    {goalId && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Funding specific project</h4>
                        <p className="text-sm">
                          Your donation will be directed to the project you selected.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col items-start space-y-4">
                    <div className="w-full">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Your donation</span>
                        <span className="text-sm font-bold">£{donationAmount}</span>
                      </div>
                      <div className={cn(
                        "bg-primary/10 rounded-full h-2 w-full overflow-hidden",
                        donationAmount >= 100 && "bg-primary/30"
                      )}>
                        <div 
                          className="bg-primary h-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(donationAmount, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">£10</span>
                        <span className="text-xs text-muted-foreground">£100+</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      We're committed to transparency. 85% of your donation goes directly to programs, 
                      10% to administration, and 5% to fundraising efforts.
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}