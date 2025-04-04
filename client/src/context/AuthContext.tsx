import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { login as authLogin, logout as authLogout, isAuthenticated, getUserFromToken } from "@/lib/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: number; username: string; role: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null);
  
  useEffect(() => {
    // Check for existing authentication on initial load
    if (isAuthenticated()) {
      const userData = getUserFromToken();
      setUser(userData);
    }
  }, []);
  
  const login = async (username: string, password: string) => {
    try {
      const response = await authLogin({ username, password });
      setUser(response.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  
  const logout = () => {
    authLogout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        isAdmin: user?.role === 'admin'
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
