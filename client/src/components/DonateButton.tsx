import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const DonateButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDonation = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-checkout-session");
      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "Unable to process donation at this time. Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default DonateButton;