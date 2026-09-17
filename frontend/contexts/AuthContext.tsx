"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // موقع بار اول لود شدن اپ، ببین آیا قبلاً Login کرده بودیم (از localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem("dokan_token");
    const storedUser = localStorage.getItem("dokan_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  function login(newUser: AuthUser, newToken: string) {
    localStorage.setItem("dokan_token", newToken);
    localStorage.setItem("dokan_user", JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("dokan_token");
    localStorage.removeItem("dokan_user");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}