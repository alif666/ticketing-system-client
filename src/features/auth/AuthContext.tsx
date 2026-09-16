/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "../../lib/api";
import type { LoginResponse, UserProfile } from "./types";

type AuthContextValue = { user: UserProfile | null; login: (email: string, password: string) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => JSON.parse(localStorage.getItem("ticketing.user") ?? "null"));
  const login = async (email: string, password: string) => {
    const result = await apiFetch<LoginResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("ticketing.token", result.token); localStorage.setItem("ticketing.user", JSON.stringify(result.user)); setUser(result.user);
  };
  const logout = () => { localStorage.removeItem("ticketing.token"); localStorage.removeItem("ticketing.user"); setUser(null); };
  return <AuthContext.Provider value={useMemo(() => ({ user, login, logout }), [user])}>{children}</AuthContext.Provider>;
}

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
