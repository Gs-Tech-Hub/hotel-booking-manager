"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll use mock data but properly set the auth state
      const mockUser = {
        name: 'John Smith',
        email,
        image: '/images/user/user-03.png',
      };

      // Set user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Set auth cookie
      document.cookie = 'auth=true; path=/; max-age=86400'; // 24 hours
      
      setUser(mockUser);
      router.push('/');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    document.cookie = 'auth=; path=/; max-age=0'; // Remove auth cookie
    setUser(null);
    router.push("/auth/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
