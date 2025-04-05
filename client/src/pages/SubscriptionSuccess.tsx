import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Loader2, Leaf, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EcoLoader } from '@/components/ui/eco-loader';
import { motion } from "framer-motion";
import { apiRequest } from '@/lib/queryClient';

// Animation variants
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

export default function SubscriptionSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Extract the session_id from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setIsLoading(false);
      return;
    }

    const verifySubscription = async () => {
      try {
        // Make a request to verify the subscription using the session ID
        const response = await apiRequest('GET', `/api/subscriptions/verify/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify subscription');
        }
        
        const data = await response.json();
        
        if (data.paymentStatus === 'paid' || data.status === 'complete') {
          setStatus('success');
          setSubscriptionDetails({
            amount: data.amount,
            currency: data.currency || 'GBP',
            interval: data.mode === 'subscription' ? 'recurring' : 'one-time',
            email: data.customerEmail,
            name: data.customerName,
            date: new Date().toLocaleDateString()
          });
        } else if (data.paymentStatus === 'unpaid' || data.status === 'incomplete') {
          setStatus('processing');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying subscription:', error);
        setStatus('error');
        toast({
          title: "Verification Error",
          description: "There was a problem verifying your subscription. The subscription may still have been processed.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifySubscription();
  }, [toast]);

  // Render appropriate content based on status
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <EcoLoader size={48} />
          <p className="mt-4 text-muted-foreground">Verifying your subscription...</p>
        </div>
      );
    }

    if (status === 'success') {
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
                <CardTitle className="text-center text-2xl">Subscription Confirmed!</CardTitle>
                <CardDescription className="text-center mt-2">
                  Thank you for your recurring support of our environmental data initiatives.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div variants={item} className="flex justify-center py-4">
                <div className="flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                  <CalendarClock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200">Recurring Support</span>
                </div>
              </motion.div>
              
              {subscriptionDetails && (
                <motion.div variants={item} className="text-center text-muted-foreground">
                  <p>A receipt has been sent to your email address.</p>
                  <p className="mt-2">Start Date: {subscriptionDetails.date}</p>
                </motion.div>
              )}
              
              <motion.div variants={item} className="bg-green-100 dark:bg-green-900/30 p-4 rounded-md mt-2">
                <h3 className="font-medium text-center mb-2 text-green-800 dark:text-green-200">What happens next?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                    <span>You'll receive regular updates on the impact your donation is making</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                    <span>You can manage your subscription from your account dashboard at any time</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                    <span>Your support helps us collect and analyze vital environmental data</span>
                  </li>
                </ul>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <motion.div variants={item} className="w-full">
                <Button className="w-full" onClick={() => navigate("/")}>
                  Return to Home
                </Button>
              </motion.div>
              <motion.div variants={item} className="w-full">
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      );
    }

    if (status === 'processing') {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <Loader2 className="h-6 w-6 text-yellow-600 dark:text-yellow-400 animate-spin" />
              </div>
            </div>
            <CardTitle className="text-center">Subscription Processing</CardTitle>
            <CardDescription className="text-center mt-2">
              Your subscription is being set up. This may take a few moments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              We'll send you an email confirmation once your subscription is active.
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
          <CardTitle className="text-center">Subscription Error</CardTitle>
          <CardDescription className="text-center mt-2">
            We encountered an issue setting up your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your card may not have been charged. Please try again or contact us for assistance.
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
      <h1 className="text-3xl font-bold text-center mb-8">Subscription Status</h1>
      {renderContent()}
    </div>
  );
}