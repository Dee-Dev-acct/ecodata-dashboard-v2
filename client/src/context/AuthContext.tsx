import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { login as authLogin, logout as authLogout, isAuthenticated, getUserFromToken } from "@/lib/auth";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// User interface
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
  interests?: string[];
  watchlist?: string[];
  notificationsEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Registration data interface
interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  isAdmin: boolean;
  registerMutation: UseMutationResult<any, Error, RegisterData>;
  loginMutation: UseMutationResult<LoginResponse, Error, { username: string; password: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for existing authentication on initial load
    if (isAuthenticated()) {
      const userData = getUserFromToken();
      if (userData) {
        // Convert to User type with required fields
        const userWithRequiredFields: User = {
          id: userData.id,
          username: userData.username,
          role: userData.role,
          email: 'user@example.com', // Provide default when not available from token
        };
        setUser(userWithRequiredFields);
      }
    }
  }, []);
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await authLogin(credentials);
      return response;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    }
  });
  
  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return await response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error: Error) => {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const login = async (username: string, password: string) => {
    try {
      const response = await loginMutation.mutateAsync({ username, password });
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  
  const logout = () => {
    authLogout();
    setUser(null);
    queryClient.invalidateQueries();
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        registerMutation,
        loginMutation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
