"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'receptionist' | 'manager' | 'bar' | 'kitchen' | 'games';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  defaultLandingPage: string | null;
}

const roleToDefaultPageMap: Record<User["role"], string> = {
  admin: "/",
  receptionist: "/",
  manager: "/",
  bar: "/bar",
  kitchen: "/kitchen",
  games: "/games",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
      const mockUser = {
        name: 'John Smith',
        email,
        image: '/images/user/user-03.png',
        role: 'bar',
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      document.cookie = 'auth=true; path=/; max-age=86400';

      const loggedInUser: User = {
        name: mockUser.name,
        email: mockUser.email,
        image: mockUser.image,
        role: mockUser.role as User['role'],
      };

      setUser(loggedInUser);

      // Redirect to role-based landing
      const landing = roleToDefaultPageMap[loggedInUser.role] || "/";
      router.push(landing);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    document.cookie = 'auth=; path=/; max-age=0';
    setUser(null);
    router.push("/auth/sign-in");
  };

  const defaultLandingPage = useMemo(() => {
    return user ? roleToDefaultPageMap[user.role] : null;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, defaultLandingPage }}>
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
