import { Filter, Plus, RefreshCw, Search, Ticket } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { FormDialog } from "../../components/layout/FormDialog";
import { PaginationControls } from "../../components/layout/PaginationControls";
import { useAuth } from "../auth/AuthContext";
import { useProjects } from "../projects/useProjects";
import { IssueBoard } from "./components/IssueBoard";
import { IssueDetail } from "./components/IssueDetail";
import { IssueForm } from "./components/IssueForm";
import { administrativeTransitions } from "./components/issueStages";
import type { Issue, IssueStage } from "./types";
import { useIssues } from "./useIssues";

export function IssuesWorkspace() {
  const { user } = useAuth();
  const projects = useProjects();
  const issues = useIssues(projects.selectedProjectId);
  const [formOpen, setFormOpen] = useState(false);
  const selectedProject = projects.projects.find(
    (project) => project.id === projects.selectedProjectId,
  );

  function canMove(issue: Issue, stage: IssueStage) {
    if (user?.role === "CLIENT_USER") {
      return (
        issue.reporterId === user.id &&
        issue.stage === "SUBMITTED" &&
        (stage === "DECLINED" || stage === "RESOLVED")
      );
    }
    return administrativeTransitions[issue.stage]?.includes(stage) ?? false;
  }

  function canDrag(issue: Issue) {
    return [
      "RECEIVED",
      "UNDER_DEVELOPMENT",
      "TESTING",
      "DEPLOYED",
      "DECLINED",
      "RESOLVED",
    ].some((stage) => canMove(issue, stage as IssueStage));
  }

  if (projects.loading)
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Loading issue workspaces…
        </CardContent>
      </Card>
    );
  if (projects.error)
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-red-700">
          {projects.error}
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Issue operations
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Issue board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track delivery from submission through resolution.
          </p>
        </div>
        {selectedProject && (
          <Button onClick={() => setFormOpen((value) => !value)}>
            <Plus className="mr-2 h-4 w-4" />
            New issue
          </Button>
        )}
      </header>
      <Card>
        <CardContent className="grid min-w-0 grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[minmax(220px,1fr)_repeat(5,minmax(140px,180px))_auto]">
          <label className="relative min-w-0">
            <span className="sr-only">Search issues</span>
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              value={issues.filters.query}
              onChange={(event) =>
                issues.setFilters({ query: event.target.value })
              }
              placeholder="Search issues"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <select
            aria-label="Project"
            value={projects.selectedProjectId ?? ""}
            onChange={(event) => {
              projects.selectProject(Number(event.target.value));
              issues.setFilters({ moduleId: "ALL" });
            }}
            className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm"
          >
            {projects.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Module"
            value={issues.filters.moduleId}
            onChange={(event) =>
              issues.setFilters({
                moduleId:
                  event.target.value === "ALL"
                    ? "ALL"
                    : Number(event.target.value),
              })
            }
            className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All modules</option>
            {projects.modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Stage"
            value={issues.filters.stage}
            onChange={(event) =>
              issues.setFilters({
                stage: event.target.value as typeof issues.filters.stage,
              })
            }
            className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All stages</option>
            {[
              "SUBMITTED",
              "RECEIVED",
              "UNDER_DEVELOPMENT",
              "TESTING",
              "DEPLOYED",
              "DECLINED",
              "RESOLVED",
            ].map((stage) => (
              <option key={stage} value={stage}>
                {stage.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <select
            aria-label="Type"
            value={issues.filters.type}
            onChange={(event) =>
              issues.setFilters({
                type: event.target.value as typeof issues.filters.type,
              })
            }
            className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All types</option>
            {["BUG", "ENHANCEMENT", "NEW_FEATURE"].map((type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <select
            aria-label="Priority"
            value={issues.filters.priority}
            onChange={(event) =>
              issues.setFilters({
                priority: event.target.value as typeof issues.filters.priority,
              })
            }
            className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All priorities</option>
            {["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH", "URGENT"].map(
              (priority) => (
                <option key={priority} value={priority}>
                  {priority.replaceAll("_", " ")}
                </option>
              ),
            )}
          </select>
        </CardContent>
        <div className="flex justify-end border-t bg-muted/30 px-4 py-3">
          <Button
            type="button"
            onClick={() =>
              issues.setFilters({
                query: "",
                stage: "ALL",
                type: "ALL",
                priority: "ALL",
                moduleId: "ALL",
              })
            }
            className="bg-secondary text-secondary-foreground"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset filters
          </Button>
        </div>
      </Card>
      {selectedProject && (
        <FormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Create issue"
          description={`Add a new issue to ${selectedProject.name}.`}
        >
          <IssueForm
            projectId={selectedProject.id}
            modules={projects.modules}
            onSave={async (payload) => {
              await issues.createIssue(payload);
              setFormOpen(false);
            }}
            onCancel={() => setFormOpen(false)}
          />
        </FormDialog>
      )}
      {!projects.projects.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No project access yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Join a project before creating or viewing issues.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4 text-primary" />
            {selectedProject?.name}
            <span className="text-xs font-normal text-muted-foreground">
              {issues.issues.length} issues on this page
            </span>
          </div>
          {issues.error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 p-3 text-sm text-red-700"
            >
              {issues.error}
            </p>
          )}
          {issues.loading ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Loading issues…
              </CardContent>
            </Card>
          ) : (
            <div className="h-[min(70vh,720px)] min-h-[420px] overflow-auto rounded-xl border bg-background p-3 pb-4">
              <IssueBoard
                issues={issues.issues}
                selectedIssueId={issues.selectedIssueId}
                onSelect={issues.selectIssue}
                canMove={canMove}
                canDrag={canDrag}
                onMove={issues.moveIssue}
              />
            </div>
          )}
          <PaginationControls page={issues.page} totalPages={issues.totalPages} pageSize={issues.pageSize} pageSizeOptions={[10, 25, 50]} onPageChange={issues.setPage} onPageSizeChange={issues.setPageSize} />
          {issues.selectedIssue && (
            <IssueDetail
              issue={issues.selectedIssue}
              audit={issues.audit}
              modules={projects.modules}
              loading={issues.detailLoading}
              onUpdate={(id, payload) => issues.updateIssue(id, payload)}
              onMove={issues.moveIssue}
              onVerify={issues.requestVerification}
            />
          )}
        </>
      )}
    </div>
  );
}
