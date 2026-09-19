"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, getCurrentUser, logoutUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // موقع بار اول لود شدن اپ، دیگر localStorage نمی‌خوانیم — کوکی httpOnly را خود مرورگر
  // می‌فرستد، پس فقط از بک‌اند می‌پرسیم "الان کی لاگین است؟"
  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  function login(newUser: AuthUser) {
    setUser(newUser);
  }

  function logout() {
    return logoutUser().finally(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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