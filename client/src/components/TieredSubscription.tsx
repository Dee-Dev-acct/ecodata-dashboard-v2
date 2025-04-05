import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SubscriptionFormData {
  email: string;
  consent: boolean;
  subscriptionTier: string;
  interests: string[];
}

const interestOptions = [
  { id: "sustainability", label: "Sustainability" },
  { id: "technology", label: "Technology" },
  { id: "policy", label: "Policy & Regulation" },
  { id: "research", label: "Research & Innovation" },
  { id: "caseStudies", label: "Case Studies" }
];

const tiers = [
  {
    id: "basic",
    name: "Basic",
    description: "Monthly newsletter with industry updates and ECODATA news",
    features: [
      "Monthly newsletter",
      "Public event invitations",
      "Blog post notifications"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Enhanced content for industry professionals",
    features: [
      "Bi-weekly newsletter",
      "Industry trend analysis",
      "Priority event registration",
      "Technical insights"
    ]
  },
  {
    id: "research",
    name: "Research",
    description: "In-depth research and analysis for academics and researchers",
    features: [
      "Weekly specialized content",
      "Research paper highlights",
      "Data analysis reports",
      "Early access to studies",
      "Collaboration opportunities"
    ]
  }
];

export default function TieredSubscription() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    email: "",
    consent: false,
    subscriptionTier: "basic",
    interests: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, consent: e.target.checked });
  };

  const handleTierChange = (tierId: string) => {
    setFormData({ ...formData, subscriptionTier: tierId });
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interestId = e.target.value;
    if (e.target.checked) {
      setFormData({ ...formData, interests: [...formData.interests, interestId] });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter(id => id !== interestId)
      });
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      // Validate email and consent
      if (!validateEmail(formData.email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return;
      }
      if (!formData.consent) {
        toast({
          title: "Consent required",
          description: "Please agree to the privacy policy.",
          variant: "destructive"
        });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", formData);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      // Reset form
      setFormData({
        email: "",
        consent: false,
        subscriptionTier: "basic",
        interests: []
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Step 1: Your Details</h3>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleEmailChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1E293B] dark:border-gray-700"
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div className="mt-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleConsentChange}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
            required
          />
          <label className="ml-2 block text-sm" htmlFor="consent">
            I agree to receive news and updates from ECODATA CIC. We value your privacy and will never share your information with third parties.
          </label>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={goToNextStep}
          className="px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#2A9D8F]/90 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Step 2: Choose Your Subscription</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              formData.subscriptionTier === tier.id 
                ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 ring-2 ring-[#2A9D8F]' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => handleTierChange(tier.id)}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id={`tier-${tier.id}`}
                name="subscriptionTier"
                value={tier.id}
                checked={formData.subscriptionTier === tier.id}
                onChange={() => handleTierChange(tier.id)}
                className="h-4 w-4 text-[#2A9D8F] focus:ring-[#2A9D8F]"
              />
              <label htmlFor={`tier-${tier.id}`} className="ml-2 text-lg font-medium">
                {tier.name}
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{tier.description}</p>
            <ul className="text-sm space-y-1">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#2A9D8F] mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goToNextStep}
          className="px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#2A9D8F]/90 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Step 3: Select Your Interests</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Choose the topics you're interested in to receive more relevant content.
      </p>
      
      <div className="grid gap-3 md:grid-cols-2">
        {interestOptions.map((interest) => (
          <div key={interest.id} className="flex items-center">
            <input
              type="checkbox"
              id={`interest-${interest.id}`}
              value={interest.id}
              checked={formData.interests.includes(interest.id)}
              onChange={handleInterestChange}
              className="h-4 w-4 rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
            />
            <label htmlFor={`interest-${interest.id}`} className="ml-2 text-sm">
              {interest.label}
            </label>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#2A9D8F]/90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-[#1E293B] rounded-lg shadow-md overflow-hidden">
      <div className="p-1 bg-gradient-to-r from-[#2A9D8F] via-[#457B9D] to-[#4CAF50]"></div>
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Stay informed about sustainable technology, impact metrics, and the latest from ECODATA CIC.
        </p>
        
        {/* Progress indicator */}
        <div className="relative mb-8">
          <div className="flex mb-2 justify-between">
            <div 
              className={`text-xs font-medium ${
                currentStep >= 1 ? "text-[#2A9D8F]" : "text-gray-500"
              }`}
            >
              Details
            </div>
            <div 
              className={`text-xs font-medium ${
                currentStep >= 2 ? "text-[#2A9D8F]" : "text-gray-500"
              }`}
            >
              Subscription
            </div>
            <div 
              className={`text-xs font-medium ${
                currentStep >= 3 ? "text-[#2A9D8F]" : "text-gray-500"
              }`}
            >
              Interests
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
            <div 
              style={{ width: `${(currentStep - 1) * 50}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#2A9D8F] transition-all duration-300"
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </form>
        
        {/* Social proof counter */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join our community of over <span className="font-semibold text-[#2A9D8F]">1,200</span> subscribers
          </p>
        </div>
      </div>
    </div>
  );
}