"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredToken, removeStoredToken } from "../http";
import { APP_CONFIG } from "../config";

interface StoredUserData {
  id: number | string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<StoredUserData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const syncAuth = () => {
    const token = getStoredToken();
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const stored = localStorage.getItem(APP_CONFIG.userStorageKey);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        // Fallback básico si solo hay token
        setCurrentUser({ id: 1, name: "Usuario", email: "", role: "user" });
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    syncAuth();

    // Escuchar eventos de cambio de autenticación
    window.addEventListener("storage", syncAuth);
    window.addEventListener("dailyspace_auth_change", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("dailyspace_auth_change", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    removeStoredToken();
    setCurrentUser(null);
    window.dispatchEvent(new Event("dailyspace_auth_change"));
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-2 border-[#ffe066] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
        >
          <span className="text-2xl transition-transform group-hover:rotate-12 duration-200">
            ✨
          </span>
          <span className="text-xl font-extrabold text-[#d97706] tracking-tight">
            DailySpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#292524]">
          <Link
            href="/"
            className={`transition-colors hover:text-[#d97706] ${
              pathname === "/" ? "text-[#d97706] font-bold" : ""
            }`}
          >
            Para ti
          </Link>

          {isMounted && currentUser ? (
            <>
              <Link
                href="/mis-comentarios"
                className={`transition-colors hover:text-[#d97706] ${
                  pathname === "/mis-comentarios"
                    ? "text-[#d97706] font-bold"
                    : ""
                }`}
              >
                Mis Comentarios
              </Link>

              {currentUser.role === "admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 transition-colors ${
                    pathname === "/admin" ? "ring-2 ring-purple-400" : ""
                  }`}
                >
                  <span>🛡️</span>
                  <span>Administración</span>
                </Link>
              )}

              <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
                <span className="text-xs font-bold text-amber-900 bg-[#fff9db] border border-[#ffe066] px-3 py-1 rounded-full flex items-center gap-1">
                  <span>👤</span>
                  <span>@{currentUser.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-xs font-semibold text-[#d97706] border border-[#d97706] rounded-md hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 pl-2">
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-semibold text-[#d97706] border border-[#d97706] rounded-lg hover:bg-amber-50 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="px-4 py-1.5 text-sm font-semibold text-white bg-[#d97706] rounded-lg hover:bg-[#b45309] shadow-sm transition-colors"
              >
                Crear Cuenta
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-[#292524] hover:bg-amber-50 focus:outline-none cursor-pointer"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-amber-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-semibold text-[#292524] hover:text-[#d97706]"
          >
            Para ti
          </Link>

          {isMounted && currentUser ? (
            <>
              <Link
                href="/mis-comentarios"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm font-semibold text-[#292524] hover:text-[#d97706]"
              >
                Mis Comentarios
              </Link>

              {currentUser.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm font-bold text-purple-700"
                >
                  🛡️ Panel de Administración
                </Link>
              )}

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-sm font-bold text-amber-900">
                  👤 @{currentUser.name}
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1 text-xs font-semibold text-[#d97706] border border-[#d97706] rounded-md"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center py-2 text-sm font-semibold text-[#d97706] border border-[#d97706] rounded-lg"
              >
                Ingresar
              </Link>
              <Link
                href="/registro"
                onClick={() => setIsOpen(false)}
                className="text-center py-2 text-sm font-semibold text-white bg-[#d97706] rounded-lg"
              >
                Registro
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
