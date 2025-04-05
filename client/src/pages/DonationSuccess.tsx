import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, TreePine, Droplets, Leaf, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Impact component to show the effect of donations
const DonationImpact = () => {
  return (
    <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg my-6">
      <h3 className="text-lg font-semibold mb-3 text-emerald-800 dark:text-emerald-200">Your Donation Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <TreePine className="h-8 w-8 text-emerald-600 mb-2" />
          <span className="text-sm text-center">Contributes to our reforestation data initiatives</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Droplets className="h-8 w-8 text-blue-600 mb-2" />
          <span className="text-sm text-center">Supports water quality monitoring projects</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Leaf className="h-8 w-8 text-green-600 mb-2" />
          <span className="text-sm text-center">Helps fund sustainable development research</span>
        </div>
      </div>
    </div>
  );
};

interface DonationDetails {
  status: string;
  paymentStatus: string;
  amount: string | null;
  currency: string;
  customerEmail: string;
  customerName: string;
  mode: string;
}

const DonationSuccess = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Show a toast notification when the page loads
    toast({
      title: "Donation Successful!",
      description: "Thank you for your generous contribution to ECODATA CIC.",
    });
    
    // Get session ID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // Verify the donation with our API
      apiRequest("GET", `/api/donations/verify/${sessionId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to verify donation');
          }
          return response.json();
        })
        .then(data => {
          setDonationDetails(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error verifying donation:", err);
          setError("We couldn't verify your donation details. Please contact support.");
          setLoading(false);
        });
    } else {
      // No session ID - just show the thank you page with a brief delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-center">Processing your donation...</h2>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Please wait while we confirm your generous contribution
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-lg border-red-300">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Donation Verification Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-600 mb-6">{error}</p>
            <p>Your donation may still have been processed successfully. If you have any questions, please contact our support team.</p>
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
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
          <CardTitle className="text-3xl">Donation Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your generous contribution
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {donationDetails && (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Donation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount:</p>
                  <p className="font-medium">
                    {donationDetails.amount 
                      ? `${donationDetails.currency.toUpperCase()} ${donationDetails.amount}` 
                      : 'Amount not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                  <p className="font-medium capitalize">{donationDetails.paymentStatus}</p>
                </div>
                {donationDetails.customerName && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name:</p>
                    <p className="font-medium">{donationDetails.customerName}</p>
                  </div>
                )}
                {donationDetails.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email:</p>
                    <p className="font-medium">{donationDetails.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <p className="mb-6 text-lg">
            Your donation to ECODATA CIC has been received and will help us continue our mission to provide eco-friendly data solutions for social and environmental impact.
          </p>
          
          <DonationImpact />
          
          <p className="mb-6">
            We truly appreciate your support. Your contribution will help us expand our services and increase our positive impact on communities and the environment.
          </p>
          <p className="mb-4 font-semibold">
            A receipt has been sent to your email address.
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

export default DonationSuccess;