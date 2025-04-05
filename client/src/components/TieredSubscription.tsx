import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Shield, BarChart, Database } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import GiftAidForm from '@/components/GiftAidForm';

interface TierProps {
  title: string;
  price: number;
  frequency: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const SubscriptionTier: React.FC<TierProps> = ({
  title,
  price,
  frequency,
  description,
  features,
  icon,
  popular = false
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isGiftAid, setIsGiftAid] = useState<boolean>(false);
  const [giftAidName, setGiftAidName] = useState<string>('');
  const [giftAidAddress, setGiftAidAddress] = useState<string>('');
  const [giftAidPostcode, setGiftAidPostcode] = useState<string>('');

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Prepare gift aid data if applicable
      const giftAidData = isGiftAid ? {
        name: giftAidName,
        address: giftAidAddress,
        postcode: giftAidPostcode
      } : null;
      
      const response = await apiRequest("POST", "/api/create-subscription", {
        amount: price,
        tier: title.toLowerCase(),
        giftAid: isGiftAid,
        giftAidData
      });

      if (!response.ok) {
        throw new Error('Failed to process subscription');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error processing subscription:", error);
      
      toast({
        title: "Subscription Failed",
        description: "There was an error setting up your subscription. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`h-full flex flex-col ${popular ? 'border-primary shadow-lg' : 'border-muted shadow'}`}>
      {popular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-3xl font-bold">£{price}</span>
          <span className="text-muted-foreground">/{frequency}</span>
        </div>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
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
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubscribe}
          disabled={loading}
          variant={popular ? "default" : "outline"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Subscribe Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const TieredSubscription: React.FC = () => {
  const tiers = [
    {
      title: "Basic",
      price: 5,
      frequency: "month",
      description: "Essential support for our environmental data initiatives",
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      features: [
        "Monthly project updates",
        "Name listed on our supporters page",
        "Access to quarterly reports",
        "Invitation to annual online event"
      ]
    },
    {
      title: "Professional",
      price: 20,
      frequency: "month",
      description: "Enhanced engagement with our data-driven environmental projects",
      icon: <BarChart className="h-5 w-5 text-emerald-500" />,
      popular: true,
      features: [
        "All Basic tier benefits",
        "Quarterly detailed impact reports",
        "Bi-monthly project insights newsletter",
        "Behind-the-scenes project updates",
        "Recognition in annual reports"
      ]
    },
    {
      title: "Research",
      price: 50,
      frequency: "month",
      description: "Premium access to our comprehensive environmental data resources",
      icon: <Database className="h-5 w-5 text-indigo-500" />,
      features: [
        "All Professional tier benefits",
        "Priority access to new datasets",
        "Monthly deep-dive analysis reports",
        "Acknowledgement in research publications",
        "Annual private briefing with our team",
        "Input on future research priorities"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Support Our Work</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose a subscription tier that aligns with your commitment to supporting environmental data science and our mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <SubscriptionTier key={index} {...tier} />
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">How Your Subscription Makes a Difference</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your recurring support enables us to plan long-term projects, invest in better data collection tools, 
            and develop innovative approaches to using data for environmental and social impact.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sustained Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Regular funding allows us to maintain continuous data collection and analysis across all our projects.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Growth & Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Predictable income helps us invest in new technologies and methodologies that enhance our impact.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Our subscribers form a community of supporters who help shape our future direction and priorities.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TieredSubscription;