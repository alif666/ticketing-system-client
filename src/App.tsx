import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ProfilePage } from "./features/auth/ProfilePage";
import { ForgotPasswordPage } from "./features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/ResetPasswordPage";

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading workspace…</div>;
  return user ? <Routes><Route path="/" element={<DashboardPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes> : <Navigate to="/login" replace />;
}

export default function App() {
  return <AuthProvider><Routes><Route path="/login" element={<LoginPage />} /><Route path="/forgot-password" element={<ForgotPasswordPage />} /><Route path="/reset-password" element={<ResetPasswordPage />} /><Route path="*" element={<ProtectedRoutes />} /></Routes></AuthProvider>;
}
