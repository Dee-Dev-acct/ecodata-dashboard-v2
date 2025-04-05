import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Loader2, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EcoLoader } from '@/components/ui/eco-loader';
import { motion } from "framer-motion";

// Animation variants for staggered animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DonationSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'processing' | 'error'>('processing');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Extract the session_id from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    const redirectStatus = urlParams.get('redirect_status');

    const verifyPayment = async () => {
      try {
        // If we have redirect_status from Stripe, use it
        if (redirectStatus) {
          if (redirectStatus === 'succeeded') {
            setPaymentStatus('success');
            
            // Try to get more details about the donation
            if (paymentIntentId) {
              // You could add an API endpoint to fetch details about the payment
              // For now we'll just set some basic info
              setPaymentDetails({
                amount: "Thank you for your donation",
                date: new Date().toLocaleDateString(),
              });
            }
          } else if (redirectStatus === 'processing') {
            setPaymentStatus('processing');
            toast({
              title: "Payment Processing",
              description: "Your payment is still being processed. We'll update you once it's complete.",
            });
          } else {
            setPaymentStatus('error');
            toast({
              title: "Payment Failed",
              description: "There was an issue with your payment. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          // If we don't have Stripe's redirect status, set to error
          setPaymentStatus('error');
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [toast]);

  // Render appropriate content based on status
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <EcoLoader size={48} />
          <p className="mt-4 text-muted-foreground">Verifying your donation...</p>
        </div>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-md mx-auto"
        >
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <motion.div variants={item} className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </motion.div>
              <motion.div variants={item}>
                <CardTitle className="text-center text-2xl">Thank You for Your Donation!</CardTitle>
                <CardDescription className="text-center mt-2">
                  Your contribution will help us continue our environmental data initiatives.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div variants={item} className="flex justify-center py-4">
                <div className="flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                  <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200">Making a difference together</span>
                </div>
              </motion.div>
              
              {paymentDetails && (
                <motion.div variants={item} className="text-center text-muted-foreground">
                  <p>A receipt has been sent to your email address.</p>
                  <p className="mt-2">Transaction Date: {paymentDetails.date}</p>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <motion.div variants={item} className="w-full">
                <Button className="w-full" onClick={() => navigate("/")}>
                  Return to Home
                </Button>
              </motion.div>
              <motion.div variants={item} className="w-full">
                <Button variant="outline" className="w-full" onClick={() => navigate("/funding-goals")}>
                  View More Funding Goals
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      );
    }

    if (paymentStatus === 'processing') {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <Loader2 className="h-6 w-6 text-yellow-600 dark:text-yellow-400 animate-spin" />
              </div>
            </div>
            <CardTitle className="text-center">Payment Processing</CardTitle>
            <CardDescription className="text-center mt-2">
              Your payment is being processed. This may take a few moments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              We'll send you an email confirmation once the payment is complete.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="max-w-md mx-auto border-destructive/50">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-center">Payment Failed</CardTitle>
          <CardDescription className="text-center mt-2">
            We encountered an issue processing your payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your card has not been charged. Please try again or use a different payment method.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => window.history.back()}>
            Try Again
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Donation Status</h1>
      {renderContent()}
    </div>
  );
}