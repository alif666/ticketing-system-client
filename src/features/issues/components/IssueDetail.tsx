import { ArrowRight, Clock3, Pencil, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { useAuth } from "../../auth/AuthContext";
import type { Module } from "../../projects/types";
import { formatStage } from "./issueStages";
import { IssueForm } from "./IssueForm";
import type { Issue, IssueStage } from "../types";

const nextStages: Partial<Record<IssueStage, IssueStage[]>> = {
  SUBMITTED: ["RECEIVED", "DECLINED"],
  RECEIVED: ["UNDER_DEVELOPMENT"],
  UNDER_DEVELOPMENT: ["TESTING", "RESOLVED"],
  TESTING: ["DEPLOYED", "RESOLVED"],
  DEPLOYED: ["RESOLVED"],
};

export function IssueDetail({
  issue,
  audit,
  modules,
  loading,
  onUpdate,
  onMove,
  onVerify,
}: {
  issue: Issue | null;
  audit: {
    id: number;
    action: string;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    createdAt: string;
  }[];
  modules: Module[];
  loading: boolean;
  onUpdate: (
    id: number,
    payload: Pick<Issue, "title" | "description" | "type" | "priority">,
  ) => Promise<void>;
  onMove: (id: number, stage: IssueStage) => Promise<void>;
  onVerify: (id: number) => Promise<void>;
}) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  if (loading)
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading issue details…
        </CardContent>
      </Card>
    );
  if (!issue)
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Select an issue to view its details.
        </CardContent>
      </Card>
    );
  const canEdit = user?.role !== "CLIENT_USER" || issue.reporterId === user.id;
  const canRequestVerification =
    user?.role !== "CLIENT_USER" || issue.reporterId === user.id;
  const transitions: IssueStage[] =
    user?.role === "CLIENT_USER"
      ? issue.stage === "SUBMITTED" && issue.reporterId === user.id
        ? ["DECLINED", "RESOLVED"]
        : []
      : (nextStages[issue.stage] ?? []);
  async function action(work: () => Promise<void>) {
    setError("");
    try {
      await work();
      setEditing(false);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to update issue",
      );
    }
  }
  return (
    <Card>
      <CardHeader className="gap-4 border-b sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Issue #{issue.id}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{issue.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatStage(issue.stage)} · {issue.priority.replace("_", " ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="bg-secondary text-secondary-foreground"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {canRequestVerification &&
            issue.verificationStatus !== "PENDING_VERIFICATION" && (
              <Button
                type="button"
                onClick={() => action(() => onVerify(issue.id))}
              >
                <Send className="mr-2 h-4 w-4" />
                Request verification
              </Button>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {editing ? (
          <IssueForm
            issue={issue}
            projectId={issue.projectId}
            modules={modules}
            onSave={(payload) => onUpdate(issue.id, payload)}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="rounded-lg bg-muted/50 p-4 text-sm leading-6 whitespace-pre-wrap">
              {issue.description}
            </div>
            <div className="flex flex-wrap gap-2">
              {transitions.map((stage) => (
                <Button
                  key={stage}
                  type="button"
                  onClick={() => action(() => onMove(issue.id, stage))}
                  className="bg-secondary text-secondary-foreground"
                >
                  Move to {formatStage(stage)}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ))}
            </div>
            {issue.verificationStatus !== "NOT_REQUIRED" && (
              <p className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                <ShieldCheck className="h-4 w-4" />
                Verification: {issue.verificationStatus.replace("_", " ")}
              </p>
            )}
          </>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-md bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="h-4 w-4 text-primary" />
            Audit history
          </h3>
          <div className="mt-3 space-y-2">
            {audit.length ? (
              audit.map((entry) => (
                <div key={entry.id} className="rounded-lg border p-3 text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">
                      {entry.action}
                      {entry.fieldName ? ` · ${entry.fieldName}` : ""}
                    </span>
                    <time className="text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {entry.oldValue && (
                    <p className="mt-1 text-muted-foreground">
                      {entry.oldValue} → {entry.newValue}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No audit entries yet.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
