import { useAuth } from "@/context/AuthContext";
import { Leaf, TreeDeciduous } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FullPageLoader, MultiLeafLoader } from "@/components/ui/eco-loader";

interface ProtectedRouteProps {
  path: string;
  component: React.FC;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Short delay to allow auth check to complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Slightly longer to show the animation
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-6">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-4 shadow-lg"
            >
              <TreeDeciduous className="h-12 w-12 text-white" />
            </motion.div>
            
            <div className="space-y-2">
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-xl font-medium text-primary"
              >
                Verifying access
              </motion.h3>
              
              <MultiLeafLoader size={16} className="mt-4" />
            </div>
          </div>
        </div>
      </Route>
    );
  }

  if (!isAuthenticated) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}