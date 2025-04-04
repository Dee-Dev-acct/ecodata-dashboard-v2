import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertNewsletterSubscriber } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const { toast } = useToast();

  const { mutate: subscribe, isPending } = useMutation({
    mutationFn: async (data: InsertNewsletterSubscriber) => {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "success",
      });
      setEmail("");
      setConsent(false);
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "There was an error subscribing to the newsletter.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive emails.",
        variant: "destructive",
      });
      return;
    }
    
    // Honeypot is hidden in the DOM, not in state
    subscribe({ email, consent });
  };

  return (
    <section className="py-12 bg-[#2A9D8F]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-heading font-bold mb-4 text-white">Subscribe to Our Newsletter</h2>
          <p className="text-white text-opacity-90 mb-6">
            Stay updated with our latest projects, research insights, and environmental data trends.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            {/* Honeypot field for spam protection */}
            <div className="hidden">
              <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-white text-[#2A9D8F] hover:bg-[#F4F1DE] font-medium rounded-lg transition-colors flex items-center justify-center"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span>Subscribing</span>
                    <div className="ml-2">
                      <i className="fas fa-circle-notch fa-spin"></i>
                    </div>
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            
            <div className="mt-3 text-sm text-white text-opacity-80">
              <label className="flex items-center justify-center cursor-pointer">
                <input 
                  type="checkbox" 
                  required 
                  className="mr-2"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I agree to receive emails and can unsubscribe at any time.
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
