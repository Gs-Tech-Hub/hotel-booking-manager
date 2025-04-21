"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { strapiService } from "@/utils/dataEndPoint";

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

// Toggle this to true for verbose debugging
const DEBUG = true;

const log = (...args: any[]) => {
  if (DEBUG) console.log("[AUTH]", ...args);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const initializeAuth = useCallback(async () => {
    log("Initializing auth...");
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      const storedJwt = localStorage.getItem('jwt');

      if (storedUser && storedJwt) {
        try {
          const isValid = await strapiService.verifyToken(storedJwt);
          if (isValid?.valid) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            log("User set from storage:", userData);
          } else {
            log("Token invalid, clearing storage...");
            localStorage.removeItem('user');
            localStorage.removeItem('jwt');
            setUser(null);
          }
        } catch (err) {
          console.error("Token verification error:", err);
          localStorage.removeItem('user');
          localStorage.removeItem('jwt');
          setUser(null);
        }
      } else {
        log("No valid auth data found in storage.");
        setUser(null);
      }
    } catch (err) {
      console.error("Auth initialization failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    log("Attempting login...");
    try {
      setLoading(true);
      const verifiedUser = await strapiService.loginUser(email, password);
      log("Login response:", verifiedUser);

      if (!verifiedUser?.jwt) {
        throw new Error("Invalid credentials: missing JWT");
      }

      const userWithRole = await strapiService.getUserProfileWithRole(verifiedUser.user.id);
      log("Fetched user profile with role:", userWithRole);

      if (!userWithRole?.role) {
        throw new Error("User role information is missing");
      }

      const userData: User = {
        name: userWithRole.username || email,
        email: userWithRole.email,
        image: userWithRole.image,
        role: userWithRole.role.type as User["role"],
      };

      // Store user data and JWT in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('jwt', verifiedUser.jwt);

      setUser(userData);
      log("User logged in and set:", userData);

      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get("redirect") || roleToDefaultPageMap[userData.role] || "/";
      log("Redirecting to:", redirectPath);

      router.replace(redirectPath);
    } catch (error: any) {
      console.error("Login error:", error);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
      throw new Error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    log("Logging out...");
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
      setUser(null);
      router.replace("/auth/sign-in");
      log("User logged out, redirected to sign-in.");
    } catch (err) {
      console.warn("Logout cleanup failed:", err);
    }
  };

  const defaultLandingPage = useMemo(() => {
    const landing = user ? roleToDefaultPageMap[user.role] : null;
    log("Computed default landing page:", landing);
    return landing;
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
