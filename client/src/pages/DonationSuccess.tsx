import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const DonationSuccess = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Show a toast notification when the page loads
    toast({
      title: "Donation Successful!",
      description: "Thank you for your generous contribution to ECODATA CIC.",
    });
  }, [toast]);

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
          <p className="mb-6 text-lg">
            Your donation of <span className="font-bold">£10</span> to ECODATA CIC has been received and will help us continue our mission to provide eco-friendly data solutions for social and environmental impact.
          </p>
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