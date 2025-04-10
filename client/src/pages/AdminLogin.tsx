import { useState } from "react";
import { useLocation, Redirect, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already authenticated and is admin
  if (isAuthenticated && isAdmin) {
    return <Redirect to="/admin/dashboard" />;
  }

  // Redirect to home if authenticated but not admin
  if (isAuthenticated && !isAdmin) {
    return <Redirect to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard.",
        variant: "success",
      });
      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-[#F4F1DE] dark:bg-[#264653] py-16">
        <div className="w-full max-w-md p-8 bg-white dark:bg-[#1A323C] rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold mb-2">Admin Login</h1>
            <p className="text-gray-600 dark:text-[#F4F1DE]">Sign in to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 font-medium dark:text-[#F4F1DE]">Username</label>
              <input 
                type="text" 
                id="username" 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#264653] dark:text-[#F4F1DE]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-medium dark:text-[#F4F1DE]">Password</label>
              <input 
                type="password" 
                id="password" 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#264653] dark:text-[#F4F1DE]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-[#2A9D8F] hover:bg-[#1F7268] text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span>Logging in...</span>
                  <div className="ml-2">
                    <i className="fas fa-circle-notch fa-spin"></i>
                  </div>
                </>
              ) : (
                "Sign In"
              )}
            </button>
            
            <div className="mt-4 text-center">
              <Link href="/password-recovery" className="text-sm text-[#2A9D8F] hover:text-[#1F7268] dark:text-[#38B593] dark:hover:text-[#F4F1DE]">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
