import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PoundSterling } from "lucide-react";

const MIN_DONATION = 1;
const MAX_DONATION = 500;

const DonateButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(10);
  const [inputValue, setInputValue] = useState<string>("10");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Validate the donation amount
  useEffect(() => {
    if (amount < MIN_DONATION) {
      setValidationError(`Minimum donation amount is £${MIN_DONATION}`);
    } else if (amount > MAX_DONATION) {
      setValidationError(`Maximum donation amount is £${MAX_DONATION}`);
    } else {
      setValidationError(null);
    }
  }, [amount]);

  // Handle input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Convert to number and validate
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAmount(numValue);
    } else {
      setAmount(0);
    }
  };

  const handleDonation = async () => {
    // Validate before proceeding
    if (validationError || amount < MIN_DONATION || amount > MAX_DONATION) {
      setErrorState(validationError || "Please enter a valid donation amount");
      toast({
        title: "Invalid Amount",
        description: validationError || "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrorState(null);
    
    try {
      const response = await apiRequest("POST", "/api/create-checkout-session", { amount });
      
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

  const isButtonDisabled = isLoading || !!validationError || amount < MIN_DONATION || amount > MAX_DONATION;

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <div className="space-y-4 w-full mb-4">
        <div className="space-y-2">
          <Label htmlFor="donation-amount" className="font-medium">
            Enter donation amount (£)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <PoundSterling className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              id="donation-amount"
              type="number"
              min={MIN_DONATION}
              max={MAX_DONATION}
              step="0.01"
              value={inputValue}
              onChange={handleAmountChange}
              className="pl-9"
              placeholder="10.00"
              disabled={isLoading}
            />
          </div>
          {validationError && (
            <p className="text-red-500 text-sm">{validationError}</p>
          )}
        </div>
      </div>
      
      <Button 
        onClick={handleDonation} 
        disabled={isButtonDisabled}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md px-6 py-2 w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Donate £${amount.toFixed(2)} to ECODATA CIC`
        )}
      </Button>
      
      {errorState && !validationError && (
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