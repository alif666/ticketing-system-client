import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ProfilePage } from "./features/auth/ProfilePage";
import { ForgotPasswordPage } from "./features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/ResetPasswordPage";
import { AppShell } from "./components/layout/AppShell";
import { PlaceholderPage } from "./features/shared/PlaceholderPage";
import { ProjectsWorkspace } from "./features/projects/ProjectsWorkspace";
import { IssuesWorkspace } from "./features/issues/IssuesWorkspace";

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  return user ? (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route
          path="/projects"
          element={
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
              <ProjectsWorkspace />
            </main>
          }
        />
        <Route
          path="/issues"
          element={
            <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10">
              <IssuesWorkspace />
            </main>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/users"
          element={
            <PlaceholderPage
              title="User management"
              description="User listing, role assignment, deactivation, and client-scoped administration will be added in the administration increment."
            />
          }
        />
        <Route
          path="/verification"
          element={
            <PlaceholderPage
              title="Verification queue"
              description="Pending verification, approval, rejection, and audit decisions will be added with the issue workflow."
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<ProtectedRoutes />} />
      </Routes>
    </AuthProvider>
  );
}
