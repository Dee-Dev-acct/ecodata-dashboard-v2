import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const DonateButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDonation = async () => {
    setIsLoading(true);
    setErrorState(null);
    
    try {
      const response = await apiRequest("POST", "/api/create-checkout-session");
      
      // If we get an error response from the server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment service error");
      }
      
      const data = await response.json();
      
      if (!data.url) {
        throw new Error("No checkout URL returned");
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      
      // Extract detailed error message from response if available
      let errorMessage = "Unable to process donation at this time. Please try again later.";
      
      if (error.message) {
        if (error.message.includes('authentication') || error.message.includes('Authentication')) {
          errorMessage = "Payment service authentication error. Please try again later.";
        } else if (error.message.includes('checkout') || error.message.includes('payment')) {
          errorMessage = error.message;
        }
      }
      
      // Set local error state to display below button
      setErrorState(errorMessage);
      
      // Show toast notification
      toast({
        title: "Donation Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button 
        onClick={handleDonation} 
        disabled={isLoading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md px-6 py-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Donate £10"
        )}
      </Button>
      
      {errorState && (
        <div className="mt-3 text-red-500 text-sm max-w-md text-center">
          <p>{errorState}</p>
          <p className="mt-1 text-xs">
            Please check your connection or try again later. If the problem persists, please contact us.
          </p>
        </div>
      )}
    </div>
  );
};

export default DonateButton;