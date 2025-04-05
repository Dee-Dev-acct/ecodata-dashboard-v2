import { useState, useEffect } from 'react';
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from '@/lib/queryClient';
import { EcoLoader } from '@/components/ui/eco-loader';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Schema for donation form
const donationFormSchema = z.object({
  amount: z.string().refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 1 && num <= 10000;
  }, { message: "Amount must be between £1 and £10,000" }),
  name: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  isGiftAid: z.boolean().default(false),
  giftAidName: z.string().optional(),
  giftAidAddress: z.string().optional(),
  giftAidPostcode: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

const CheckoutForm = ({ goalId }: { goalId?: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: goalId ? "50" : "25",
      name: "",
      email: "",
      isGiftAid: false,
      giftAidName: "",
      giftAidAddress: "",
      giftAidPostcode: "",
    },
  });

  const isGiftAid = form.watch("isGiftAid");

  const handleSubmit = async (data: DonationFormValues) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/donation-success",
        },
      });

      if (error) {
        setPaymentError(error.message || "An error occurred during payment");
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred during payment",
          variant: "destructive",
        });
        setIsLoading(false);
      } else {
        // The payment succeeded!
        toast({
          title: "Payment Processing",
          description: "Your payment is being processed",
        });
        // Payment was successful - Stripe will redirect to success page
      }
    } catch (error: any) {
      setPaymentError(error.message || "An error occurred during payment");
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>One-time Donation</CardTitle>
              <CardDescription>
                Support our environmental data initiatives with a one-time donation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount (£)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10000" step="0.01" placeholder="25.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the amount you'd like to donate (between £1 and £10,000)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll send your donation receipt to this email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="isGiftAid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Gift Aid
                      </FormLabel>
                      <FormDescription>
                        Boost your donation by 25p of Gift Aid for every £1 you donate. Gift Aid is
                        reclaimed by the charity from the tax you pay for the current tax year.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isGiftAid && (
                <div className="space-y-4 border p-4 rounded-md mt-2">
                  <FormField
                    control={form.control}
                    name="giftAidName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (for Gift Aid)</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="giftAidAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address (for Gift Aid)</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Example St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="giftAidPostcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode (for Gift Aid)</FormLabel>
                        <FormControl>
                          <Input placeholder="AB12 3CD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <PaymentElement />

          {paymentError && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md flex items-center gap-2 text-destructive">
              <AlertTriangle size={18} />
              <span>{paymentError}</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !stripe || !elements}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Donate £${form.getValues("amount") || "0"}`
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, params] = useRoute<{ goalId?: string }>("/checkout/:goalId?");
  const goalId = match ? params.goalId : undefined;
  const { toast } = useToast();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Default amount - this will be overridden by user input later
        const defaultAmount = goalId ? 50 : 25;

        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: defaultAmount,
          goalId
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.message || "Failed to create payment intent");
          toast({
            title: "Payment Setup Error",
            description: data.message || "There was a problem setting up the payment. Please try again.",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        toast({
          title: "Connection Error",
          description: "There was a problem connecting to the payment service. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [goalId, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <EcoLoader />
        <p className="mt-4 text-muted-foreground">Setting up your donation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-destructive/10 border border-destructive rounded-md p-6 max-w-md w-full">
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-semibold">Payment Error</h2>
          </div>
          <p className="text-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm goalId={goalId} />
    </Elements>
  );
}