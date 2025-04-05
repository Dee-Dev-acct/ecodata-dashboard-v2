import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, Calendar, BarChart, Recycle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

// Impact component to show the effect of subscriptions
const SubscriptionImpact = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg my-6">
      <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">Your Subscription Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Calendar className="h-8 w-8 text-blue-600 mb-2" />
          <span className="text-sm text-center">Provides sustained funding for ongoing projects</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <BarChart className="h-8 w-8 text-emerald-600 mb-2" />
          <span className="text-sm text-center">Enables long-term data collection and analysis</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Recycle className="h-8 w-8 text-green-600 mb-2" />
          <span className="text-sm text-center">Supports sustainable growth of our initiatives</span>
        </div>
      </div>
    </div>
  );
};

interface SubscriptionDetails {
  status: string;
  paymentStatus: string;
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    interval: string;
  } | null;
  amount: string | null;
  currency: string;
  customerEmail: string;
  customerName: string;
  mode: string;
}

const SubscriptionSuccess = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, params] = useLocation();
  
  useEffect(() => {
    // Show a toast notification when the page loads
    toast({
      title: "Subscription Confirmed!",
      description: "Thank you for your recurring support of ECODATA CIC.",
    });
    
    // Get session ID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // Verify the subscription with our API
      apiRequest("GET", `/api/subscriptions/verify/${sessionId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to verify subscription');
          }
          return response.json();
        })
        .then(data => {
          setSubscriptionDetails(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error verifying subscription:", err);
          setError("We couldn't verify your subscription details. Please contact support.");
          setLoading(false);
        });
    } else {
      // No session ID provided
      setError("No subscription information found. Please contact support if you believe this is an error.");
      setLoading(false);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-center">Processing your subscription...</h2>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Please wait while we confirm your subscription
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-lg border-red-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Subscription Verification Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-600 mb-6">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-3xl">Thank You for Subscribing!</CardTitle>
          <CardDescription className="text-lg">
            Your recurring donation has been set up successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6 text-lg">
            <p>Thank you for your commitment to support ECODATA CIC on a recurring basis. Your sustained support is invaluable to our mission.</p>
          </div>
          
          {subscriptionDetails && subscriptionDetails.subscription && (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount:</p>
                  <p className="font-medium">
                    {subscriptionDetails.amount 
                      ? `${subscriptionDetails.currency.toUpperCase()} ${subscriptionDetails.amount}` 
                      : 'Amount not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Billing Cycle:</p>
                  <p className="font-medium capitalize">{subscriptionDetails.subscription.interval}ly</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                  <p className="font-medium capitalize">{subscriptionDetails.subscription.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing Date:</p>
                  <p className="font-medium">
                    {format(new Date(subscriptionDetails.subscription.currentPeriodEnd), 'PPP')}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <SubscriptionImpact />
          
          <p className="mb-6">
            Your recurring support will help us plan and execute long-term initiatives that create lasting positive impact on the environment and communities we serve.
          </p>
          
          <p className="mb-4 font-semibold">
            A confirmation email has been sent with your subscription details.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild>
            <Link to="/">Return to Homepage</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;