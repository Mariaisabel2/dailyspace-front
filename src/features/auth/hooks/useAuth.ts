"use client";

import { useState, useEffect, useCallback } from "react";
import { User, LoginDto, RegisterDto } from "../domain/auth";
import { authService } from "../services/authService";
import { authStorage } from "../services/authStorage";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(() => {
    try {
      const storedToken = authStorage.getToken();
      const storedUser = authStorage.getUser();
      setToken(storedToken);
      setUser(storedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    const handleAuthChange = () => {
      loadSession();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("dailyspace_auth_change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("dailyspace_auth_change", handleAuthChange);
    };
  }, [loadSession]);

  const login = async (dto: LoginDto) => {
    setIsLoading(true);
    try {
      const response = await authService.login(dto);
      setUser(response.user);
      setToken(response.token);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (dto: RegisterDto) => {
    setIsLoading(true);
    try {
      const response = await authService.register(dto);
      setUser(response.user);
      setToken(response.token);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };
}
