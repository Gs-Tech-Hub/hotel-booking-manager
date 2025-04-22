"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { useAuth } from "@/components/Auth/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Store the current path for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth/sign-in') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      router.replace("/auth/sign-in");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
