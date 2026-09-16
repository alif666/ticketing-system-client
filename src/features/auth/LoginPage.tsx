import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell min-h-screen px-4 py-8 text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between">
        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1fr_446px]">
          <section className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_12px_rgb(253_186_116)]" />
              Internal support operations
            </span>
            <h1 className="mt-8 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl">
              A brighter workspace for tracking support, delivery, and verification.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/75">
              Keep teams aligned with a clearer issue flow, clearer project ownership, and a dashboard that feels modern from the first click.
            </p>
          </section>

          <Card className="login-card rounded-[1.75rem] border-white/30 p-2 text-foreground">
            <CardHeader className="px-7 pb-4 pt-7 sm:px-8 sm:pt-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-orange-100 text-2xl shadow-inner">🛠️</div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">Support tracker</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to the Pridesys IT support workspace.</p>
            </CardHeader>
            <CardContent className="px-7 pb-8 sm:px-8">
              <form onSubmit={submit} className="space-y-5">
                <label className="block space-y-2 text-sm font-semibold">Email Address
                  <Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="mt-1 h-11 border-slate-300 bg-white/80" />
                </label>
                <label className="block space-y-2 text-sm font-semibold">Password
                  <Input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="mt-1 h-11 border-slate-300 bg-white/80" />
                </label>
                {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <Button type="submit" className="h-12 w-full rounded-full bg-gradient-to-r from-sky-800 to-sky-500 text-base font-semibold shadow-lg shadow-sky-900/20" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <p className="pb-3 text-center text-xs text-white/70">© 2026 Pridesys IT Ltd. All rights reserved.</p>
      </div>
    </main>
  );
}
