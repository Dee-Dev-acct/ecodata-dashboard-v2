import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, 
  UserPlus, 
  Key, 
  Mail, 
  User, 
  Sparkles, 
  Leaf, 
  Loader2, 
  AlertTriangle, 
  Shield, 
  Check, 
  AlertCircle, 
  Sprout, 
  TreeDeciduous 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { isAuthenticated, login, user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [formError, setFormError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if the user is already logged in and redirect
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      if (isAuthenticated && user) {
        navigate("/dashboard");
      }
      setIsCheckingAuth(false);
    }, 500);
    
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, user, navigate]);

  // Reset form error when tab changes
  useEffect(() => {
    setFormError(null);
  }, [activeTab]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleLoginSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const response = await login(values.username, values.password);
      if (response && response.user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.user.firstName || response.user.username}!`,
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.message || "Invalid username or password. Please try again.");
      
      // Focus on the first field with an error
      if (error.message?.toLowerCase().includes("username")) {
        loginForm.setFocus("username");
      } else {
        loginForm.setFocus("password");
      }
    }
  };

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    try {
      await registerMutation.mutateAsync(values);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully. Welcome to ECODATA CIC!",
        variant: "default",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Registration failed. Please try again with different credentials.");
      
      // Focus on the appropriate field based on the error message
      if (error.message?.toLowerCase().includes("username")) {
        registerForm.setFocus("username");
      } else if (error.message?.toLowerCase().includes("email")) {
        registerForm.setFocus("email");
      } else {
        registerForm.setFocus("password");
      }
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-3 shadow-lg"
          >
            <Leaf className="h-10 w-10 text-white" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-gray-600 dark:text-gray-300 font-medium"
          >
            Connecting to ECODATA CIC...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Auth form section */}
      <div className="flex flex-col justify-center w-full xl:w-1/2 p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md space-y-6 w-full"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to ECODATA CIC</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to your account or create a new one to track your impact and contributions
            </p>
          </div>

          <Card>
            <CardHeader>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              {/* Form errors display */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <TabsContent value="login" className="mt-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                placeholder="Username" 
                                disabled={loginForm.formState.isSubmitting} 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                type="password" 
                                placeholder="••••••••" 
                                disabled={loginForm.formState.isSubmitting} 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginForm.formState.isSubmitting || loginMutation.isPending}
                    >
                      {loginForm.formState.isSubmitting || loginMutation.isPending ? (
                        <>
                          <motion.div 
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mr-2 text-white"
                          >
                            <Leaf className="h-4 w-4" />
                          </motion.div>
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                placeholder="Username" 
                                disabled={registerForm.formState.isSubmitting || registerMutation.isPending} 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                type="email" 
                                placeholder="your@email.com" 
                                disabled={registerForm.formState.isSubmitting || registerMutation.isPending} 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="First Name" 
                                disabled={registerForm.formState.isSubmitting || registerMutation.isPending} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Last Name" 
                                disabled={registerForm.formState.isSubmitting || registerMutation.isPending} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                type="password" 
                                placeholder="••••••••" 
                                disabled={registerForm.formState.isSubmitting || registerMutation.isPending} 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <FormDescription className="text-xs">
                            Must be at least 8 characters with one uppercase letter and one number
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerForm.formState.isSubmitting || registerMutation.isPending}
                    >
                      {registerForm.formState.isSubmitting || registerMutation.isPending ? (
                        <>
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              ease: "easeInOut" 
                            }}
                            className="mr-2 text-white"
                          >
                            <Sprout className="h-4 w-4" />
                          </motion.div>
                          Growing your account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
          </Card>
          
          {/* Security notice */}
          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1.5">
            <Shield className="h-3 w-3" />
            <span>Your data is secure and protected</span>
          </div>
        </motion.div>
      </div>

      {/* Hero section */}
      <div className="hidden xl:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900 p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg text-center space-y-8"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight">Join our mission for environmental progress</h2>
          
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Create an account to track your contributions, access personalized impact reports, and join our community of environmental advocates.
          </p>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-amber-500" /> 
              Member Benefits
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                  <span className="text-green-700 dark:text-green-400 text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Track your donations and see your direct impact</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                  <span className="text-green-700 dark:text-green-400 text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Create a watchlist for funding goals that matter to you</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                  <span className="text-green-700 dark:text-green-400 text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Submit project proposals and collaborate with our team</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                  <span className="text-green-700 dark:text-green-400 text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Access exclusive reports and impact visualisations</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}