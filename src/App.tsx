import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";

function ProtectedRoutes() {
  const { user } = useAuth();
  return user ? <Routes><Route path="/" element={<DashboardPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes> : <Navigate to="/login" replace />;
}

export default function App() {
  return <AuthProvider><Routes><Route path="/login" element={<LoginPage />} /><Route path="*" element={<ProtectedRoutes />} /></Routes></AuthProvider>;
}
