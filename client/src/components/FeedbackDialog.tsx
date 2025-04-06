import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThumbsUp } from "lucide-react";

const feedbackSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  feedback: z.string().optional(),
  category: z.enum(["general", "content", "usability", "design", "performance"]).default("general"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const FeedbackDialog = ({ 
  buttonText = "Give Feedback",
  buttonVariant = "default" as const,
  buttonSize = "default" as const,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const defaultValues: Partial<FeedbackFormValues> = {
    rating: undefined,
    feedback: "",
    category: "general",
  };
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues,
  });
  
  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormValues) => {
      const currentUrl = window.location.pathname;
      
      const response = await apiRequest("POST", "/api/feedback", {
        ...data,
        pageUrl: currentUrl,
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      form.reset(defaultValues);
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
      console.error("Feedback submission error:", error);
    },
  });
  
  function onSubmit(data: FeedbackFormValues) {
    feedbackMutation.mutate(data);
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve our website by sharing your thoughts.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="general" />
                        </FormControl>
                        <FormLabel className="font-normal">General</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="content" />
                        </FormControl>
                        <FormLabel className="font-normal">Content</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="usability" />
                        </FormControl>
                        <FormLabel className="font-normal">Usability</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="design" />
                        </FormControl>
                        <FormLabel className="font-normal">Design</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="performance" />
                        </FormControl>
                        <FormLabel className="font-normal">Performance</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How would you rate your experience?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <FormItem key={rating}>
                          <FormControl>
                            <RadioGroupItem 
                              value={rating.toString()} 
                              id={`rating-${rating}`} 
                              className="sr-only" 
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`rating-${rating}`}
                            className={`
                              flex h-10 w-10 items-center justify-center rounded-full 
                              transition-colors
                              ${field.value === rating 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-muted'
                              }
                            `}
                          >
                            {rating}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    1 = Poor, 5 = Excellent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional feedback (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your experience..." 
                      {...field} 
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={feedbackMutation.isPending}
                className="w-full"
              >
                {feedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Standalone component for the floating feedback button
export const FloatingFeedbackButton = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <FeedbackDialog 
        buttonText="Feedback" 
        buttonVariant="default"
        buttonSize="default"
      />
    </div>
  );
};

// Simple thumbs up button for inline feedback
export const QuickFeedbackButton = () => {
  const { toast } = useToast();
  const [clicked, setClicked] = useState(false);
  
  const quickFeedbackMutation = useMutation({
    mutationFn: async () => {
      const currentUrl = window.location.pathname;
      
      const response = await apiRequest("POST", "/api/feedback", {
        rating: 5, // Highest rating
        category: "general",
        pageUrl: currentUrl,
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thanks for your feedback!",
        description: "We're glad you found this helpful.",
      });
      setClicked(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback.",
        variant: "destructive",
      });
      console.error("Quick feedback error:", error);
    },
  });
  
  const handleClick = () => {
    if (!clicked) {
      quickFeedbackMutation.mutate();
    }
  };
  
  return (
    <Button 
      onClick={handleClick} 
      variant="ghost" 
      size="sm" 
      className={`flex items-center gap-1 ${clicked ? 'text-green-600' : ''}`}
      disabled={clicked || quickFeedbackMutation.isPending}
    >
      <ThumbsUp className="h-4 w-4" />
      <span>{clicked ? "Thanks!" : "Was this helpful?"}</span>
    </Button>
  );
};