/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "../../lib/api";
import type { LoginResponse, UserProfile } from "./types";

type ProfileUpdate = Pick<UserProfile, "name" | "mobile" | "designation" | "office">;
type AuthContextValue = { user: UserProfile | null; loading: boolean; login: (email: string, password: string) => Promise<void>; refreshProfile: () => Promise<void>; updateProfile: (profile: ProfileUpdate) => Promise<void>; changePassword: (currentPassword: string, newPassword: string) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => { try { return JSON.parse(localStorage.getItem("ticketing.user") ?? "null") as UserProfile | null; } catch { return null; } });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("ticketing.token")));
  const login = async (email: string, password: string) => {
    const result = await apiFetch<LoginResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("ticketing.token", result.token); localStorage.setItem("ticketing.user", JSON.stringify(result.user)); setUser(result.user);
  };
  const refreshProfile = async () => { const profile = await apiFetch<UserProfile>("/api/me"); localStorage.setItem("ticketing.user", JSON.stringify(profile)); setUser(profile); };
  const updateProfile = async (profile: ProfileUpdate) => { const result = await apiFetch<UserProfile>("/api/me", { method: "PATCH", body: JSON.stringify(profile) }); localStorage.setItem("ticketing.user", JSON.stringify(result)); setUser(result); };
  const changePassword = async (currentPassword: string, newPassword: string) => { await apiFetch("/api/me/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }); };
  const logout = () => { localStorage.removeItem("ticketing.token"); localStorage.removeItem("ticketing.user"); setUser(null); };
  // Session restoration is an external synchronization with the backend.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (localStorage.getItem("ticketing.token")) refreshProfile().catch(logout).finally(() => setLoading(false)); }, []);
  return <AuthContext.Provider value={useMemo(() => ({ user, loading, login, refreshProfile, updateProfile, changePassword, logout }), [user, loading])}>{children}</AuthContext.Provider>;
}

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
