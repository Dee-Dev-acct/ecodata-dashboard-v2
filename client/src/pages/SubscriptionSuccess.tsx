import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Loader2, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { apiRequest } from '@/lib/queryClient';

interface SubscriptionDetails {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  nextBillingDate: string;
  cancelUrl?: string;
}

export default function SubscriptionSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get the subscription id from the URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get('setup_intent') || url.searchParams.get('subscription');
    
    if (!sessionId) {
      setError('No subscription information found');
      setIsLoading(false);
      return;
    }
    
    // Verify the subscription and get details
    const verifySubscription = async () => {
      try {
        const response = await apiRequest('GET', `/api/subscriptions/verify/${sessionId}`);
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        console.error('Error verifying subscription:', err);
        setError(err.message || 'Could not verify your subscription. Please contact support.');
        toast({
          title: 'Error',
          description: 'There was a problem verifying your subscription. Our team has been notified.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    verifySubscription();
  }, [toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h2 className="text-xl font-medium mb-2">Setting up your subscription</h2>
              <p className="text-muted-foreground">Just a moment while we confirm your subscription...</p>
            </div>
          ) : error ? (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800">
                <CardTitle className="text-red-700 dark:text-red-400">Something went wrong</CardTitle>
                <CardDescription className="text-red-600 dark:text-red-400/80">
                  We encountered an issue with your subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  If you believe this is an error, please contact our support team with
                  reference to the time of your subscription attempt and we'll help sort things out.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
                <Button onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          ) : subscription ? (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
                <div className="flex items-center mb-2">
                  <CheckCircle className="mr-2 h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-green-700 dark:text-green-400">You're now a monthly supporter!</CardTitle>
                </div>
                <CardDescription className="text-green-600 dark:text-green-400/80">
                  Thank you for your commitment to our ongoing environmental data initiatives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly contribution</p>
                      <p className="text-xl font-bold">£{subscription.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start date</p>
                      <p className="font-medium">{formatDate(subscription.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="font-medium capitalize">{subscription.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next payment date</p>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" /> 
                        <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What happens next?</h3>
                  <p className="text-muted-foreground mb-4">
                    We've sent confirmation to your email address. Your subscription will automatically
                    renew each month, and you can cancel anytime from your account dashboard.
                  </p>
                  
                  <h4 className="font-medium">Your impact as a monthly supporter:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                    <li>Enables long-term planning for environmental data projects</li>
                    <li>Helps fund continuous sensor maintenance and data collection</li>
                    <li>Supports sustainable operational costs for our initiatives</li>
                    <li>Gives you exclusive access to our detailed impact reports</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="gap-1">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription>
                  We couldn't find information about your subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Please contact our support team if you believe this is an error or if your 
                  subscription was processed.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
                <Button onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}