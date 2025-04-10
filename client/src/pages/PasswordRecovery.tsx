import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const PasswordRecovery = () => {
  const [step, setStep] = useState<"request" | "confirmation" | "reset" | "success">("request");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");

  // If token is in URL, validate it and go to reset step
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await apiRequest("GET", `/api/auth/validate-reset-token/${token}`);
          
          if (response.ok) {
            setStep("reset");
          } else {
            // If token is invalid, show error and go back to request step
            toast({
              title: "Invalid Token",
              description: "Your password reset link has expired or is invalid. Please request a new one.",
              variant: "destructive",
            });
            setStep("request");
          }
        } catch (error) {
          console.error("Token validation error:", error);
          toast({
            title: "Error",
            description: "There was a problem validating your reset token. Please try again.",
            variant: "destructive",
          });
          setStep("request");
        }
      }
    };
    
    validateToken();
  }, [token, toast]);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRequestReset = async (data: EmailFormValues) => {
    try {
      setEmail(data.email);
      
      // IMPORTANT: First try an existing account to test the token retrieval
      // Use admin@ecodatacic.org to test this flow, as we know this account exists
      console.log("Sending password recovery request for email:", data.email);
  
      const response = await apiRequest("POST", "/api/auth/forgot-password", {
        email: data.email,
      });
      
      console.log("Password recovery response status:", response.status);
      
      if (response.ok) {
        let responseData;
        let responseText = "";
        
        try {
          // First try to get the raw text for debugging
          responseText = await response.clone().text();
          console.log("Raw response text:", responseText);
          
          // Then try to parse as JSON
          responseData = JSON.parse(responseText);
          console.log("Parsed response data:", responseData);
          
          setStep("confirmation");
          toast({
            title: "Request Sent",
            description: "If your email exists in our system, you will receive a password reset link shortly.",
          });
          
          // Display the token information for testing purposes
          if (responseData && responseData.token) {
            console.log("Found token in response:", responseData.token);
            setTimeout(() => {
              const tokenInfoElement = document.getElementById('token-info');
              if (tokenInfoElement) {
                tokenInfoElement.innerHTML = `
                  <div class="mb-2">
                    <div>Your reset token: <strong>${responseData.token}</strong></div>
                    <div class="text-xs mt-1">Copy this token or click the link below:</div>
                  </div>
                  <a href="${responseData.resetURL || `/password-recovery?token=${responseData.token}`}" 
                     class="inline-block px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary/90">
                    Open Reset Form
                  </a>
                `;
              } else {
                console.error("Token info element not found in DOM");
              }
            }, 300);
          } else {
            console.warn("No token found in response data:", responseData);
          }
        } catch (error) {
          console.error("Error processing response:", error);
          console.log("Raw response was:", responseText);
          setStep("confirmation");
        }
      } else {
        // We don't want to reveal if email exists for security reasons
        // So we still show confirmation even if the email doesn't exist
        setStep("confirmation");
        toast({
          title: "Request Sent",
          description: "If your email exists in our system, you will receive a password reset link shortly.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (data: ResetFormValues) => {
    try {
      const response = await apiRequest("POST", "/api/auth/reset-password", {
        token: data.token,
        password: data.password,
      });
      
      if (response.ok) {
        setStep("success");
        toast({
          title: "Password Updated",
          description: "Your password has been successfully reset. You can now log in with your new password.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Reset Failed",
          description: errorData.message || "Invalid or expired token. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem resetting your password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-[#F4F1DE] dark:bg-[#264653] py-16">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Password Recovery</CardTitle>
            <CardDescription className="text-center">
              {step === "request" && "Enter your email to receive a password reset link"}
              {step === "confirmation" && "Check your email"}
              {step === "reset" && "Create a new password"}
              {step === "success" && "Password reset complete"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "request" && (
              <form onSubmit={emailForm.handleSubmit(handleRequestReset)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...emailForm.register("email")}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={emailForm.formState.isSubmitting}
                >
                  {emailForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Send Reset Link
                </Button>
              </form>
            )}
            
            {step === "confirmation" && (
              <div className="space-y-4 text-center">
                <div className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 p-4 rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>
                    We've sent a recovery link to <strong>{email}</strong>. 
                    Please check your inbox and spam folders.
                  </p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>The link will expire in 30 minutes.</p>
                </div>
                
                {/* Token information display for testing purposes - remove in production */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                  <p className="font-semibold mb-1">For testing purposes only:</p>
                  <p id="token-info">(Token will appear here after submission)</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    In a production environment, this would be sent via email
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setStep("request")}
                  className="mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to email form
                </Button>
              </div>
            )}
            
            {step === "reset" && (
              <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Reset Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Paste your reset token here if not auto-filled"
                    {...resetForm.register("token")}
                    readOnly={!!token}
                  />
                  {resetForm.formState.errors.token && (
                    <p className="text-red-500 text-sm">{resetForm.formState.errors.token.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a new password"
                    {...resetForm.register("password")}
                  />
                  {resetForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">{resetForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    {...resetForm.register("confirmPassword")}
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetForm.formState.isSubmitting}
                >
                  {resetForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Reset Password
                </Button>
              </form>
            )}
            
            {step === "success" && (
              <div className="space-y-4 text-center">
                <div className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 p-4 rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Password Reset Complete</p>
                  <p>Your password has been successfully updated.</p>
                </div>
                
                <Button
                  onClick={() => setLocation("/auth")}
                  className="mt-4"
                >
                  Continue to Login
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth" className="text-primary hover:underline">
                Return to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PasswordRecovery;