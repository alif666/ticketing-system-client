import { ArrowUpRight, FolderKanban, Plus, Ticket, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">
            Good to see you again, {user?.name?.split(" ")[0]}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Your workspace
          </h1>
        </div>
        <Link
          to="/issues"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          View issue board <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Ticket className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Issue board</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">
              Create and track delivery work
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Move issues through each stage with a clear audit trail.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Projects</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">—</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Projects are available from the left navigation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Plus className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Next action</p>
          </CardHeader>
          <CardContent>
            <Link
              to="/issues"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Open issue board
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Review submissions and keep delivery moving.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <FolderKanban className="h-4 w-4" />
              Project workspaces
            </div>
            <h2 className="mt-2 text-xl font-semibold">
              Keep delivery moving with clear ownership.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Browse projects and organize the issues your team is responsible
              for.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Open projects
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
