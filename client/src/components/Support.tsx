import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import GiftAidForm from '@/components/GiftAidForm';
import { Heart, Leaf, CreditCard, Recycle } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";

const Support = () => {
  const { toast } = useToast();
  const [donationAmount, setDonationAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [processing, setProcessing] = useState<boolean>(false);
  const [isGiftAid, setIsGiftAid] = useState<boolean>(false);
  const [giftAidName, setGiftAidName] = useState<string>('');
  const [giftAidAddress, setGiftAidAddress] = useState<string>('');
  const [giftAidPostcode, setGiftAidPostcode] = useState<string>('');

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input with up to 2 decimal places
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure there's only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }
    
    setCustomAmount(value);
    
    // Update donation amount if the custom value is valid
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      setDonationAmount(numericValue);
    }
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const amount = value[0];
    setDonationAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleDonation = async () => {
    if (donationAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    if (donationAmount > 500) {
      toast({
        title: "Amount Too Large",
        description: "For donations over £500, please contact us directly.",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessing(true);

      // Prepare gift aid data if applicable
      const giftAidData = isGiftAid ? {
        name: giftAidName,
        address: giftAidAddress,
        postcode: giftAidPostcode
      } : null;
      
      // Call appropriate API endpoint based on donation type
      const endpoint = donationType === 'one-time' 
        ? '/api/create-checkout-session' 
        : '/api/create-subscription';
      
      const response = await apiRequest("POST", endpoint, {
        amount: donationAmount,
        giftAid: isGiftAid,
        giftAidData
      });

      if (!response.ok) {
        throw new Error('Failed to process donation');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error processing donation:", error);
      
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section id="support" className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your donations help us continue our work to provide data-driven environmental solutions and create positive impact for communities and ecosystems.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="text-red-500 mr-2 h-6 w-6" />
                <span>Donate to ECODATA CIC</span>
              </CardTitle>
              <CardDescription>
                Support our work with a tax-deductible donation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="one-time" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="one-time"
                    onClick={() => setDonationType('one-time')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    One-time Donation
                  </TabsTrigger>
                  <TabsTrigger 
                    value="monthly" 
                    onClick={() => setDonationType('monthly')}
                  >
                    <Recycle className="h-4 w-4 mr-2" />
                    Monthly Support
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="one-time">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="donation-amount" className="text-base font-medium mb-2 block">
                        Select Donation Amount
                      </Label>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[5, 10, 20, 50].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={donationAmount === amount ? "default" : "outline"}
                            onClick={() => {
                              setDonationAmount(amount);
                              setCustomAmount(amount.toString());
                            }}
                            className="h-12"
                          >
                            £{amount}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <Label htmlFor="custom-amount">Custom Amount (£)</Label>
                        <Input
                          id="custom-amount"
                          type="text"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                        />
                      </div>
                      
                      <div className="mt-6">
                        <Label htmlFor="donation-slider" className="text-sm">
                          Adjust Donation:
                        </Label>
                        <Slider
                          id="donation-slider"
                          min={1}
                          max={100}
                          step={1}
                          value={[donationAmount]}
                          onValueChange={handleSliderChange}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>£1</span>
                          <span>£25</span>
                          <span>£50</span>
                          <span>£75</span>
                          <span>£100</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <GiftAidForm
                        isGiftAid={isGiftAid}
                        setIsGiftAid={setIsGiftAid}
                        giftAidName={giftAidName}
                        setGiftAidName={setGiftAidName}
                        giftAidAddress={giftAidAddress}
                        setGiftAidAddress={setGiftAidAddress}
                        giftAidPostcode={giftAidPostcode}
                        setGiftAidPostcode={setGiftAidPostcode}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        Select Monthly Donation
                      </Label>
                      
                      <RadioGroup defaultValue="10" className="grid grid-cols-1 gap-4 mt-4">
                        {[
                          { value: '5', label: '£5 per month', description: 'Basic support for our operations' },
                          { value: '10', label: '£10 per month', description: 'Fund data collection equipment' },
                          { value: '20', label: '£20 per month', description: 'Support a regional monitoring program' },
                          { value: '50', label: '£50 per month', description: 'Enable advanced data analysis' }
                        ].map((option) => (
                          <div key={option.value} className="relative">
                            <RadioGroupItem
                              value={option.value}
                              id={`monthly-${option.value}`}
                              className="peer sr-only"
                              onClick={() => {
                                setDonationAmount(parseInt(option.value));
                                setCustomAmount(option.value);
                              }}
                            />
                            <Label
                              htmlFor={`monthly-${option.value}`}
                              className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                            >
                              <span className="font-medium">{option.label}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{option.description}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <div className="space-y-4 mt-6">
                        <Label htmlFor="custom-monthly-amount">Custom Monthly Amount (£)</Label>
                        <Input
                          id="custom-monthly-amount"
                          type="text"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <GiftAidForm
                        isGiftAid={isGiftAid}
                        setIsGiftAid={setIsGiftAid}
                        giftAidName={giftAidName}
                        setGiftAidName={setGiftAidName}
                        giftAidAddress={giftAidAddress}
                        setGiftAidAddress={setGiftAidAddress}
                        giftAidPostcode={giftAidPostcode}
                        setGiftAidPostcode={setGiftAidPostcode}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                onClick={handleDonation} 
                disabled={processing}
                className="w-full h-12 text-lg"
              >
                {processing ? (
                  <>
                    <span className="animate-spin mr-2">⚪</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" />
                    {donationType === 'one-time' ? 'Donate' : 'Subscribe'} £{donationAmount.toFixed(2)}
                  </>
                )}
              </Button>
              <p className="text-xs text-center mt-4 text-gray-500">
                Secure payment processing by Stripe. Your financial information is never stored on our servers.
              </p>
            </CardFooter>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We publish annual reports on how funds are allocated to maximise impact.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tax Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  As a Community Interest Company, your donations may qualify for tax relief.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Direct Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your support directly funds data collection, analysis, and community projects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;