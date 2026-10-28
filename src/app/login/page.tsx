"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@/features/common/components";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfbf7]">
        <span className="text-sm font-semibold text-[#78716c]">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf7]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
