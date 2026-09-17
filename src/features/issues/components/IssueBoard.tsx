import { CalendarDays, CircleAlert, MessageSquareText } from "lucide-react";
import type { Issue, IssueStage } from "../types";
import { boardStages, formatStage } from "./issueStages";

const priorityStyles: Record<Issue["priority"], string> = {
  VERY_LOW: "bg-slate-100 text-slate-600",
  LOW: "bg-sky-100 text-sky-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  VERY_HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export function IssueBoard({
  issues,
  selectedIssueId,
  onSelect,
  canMove,
  canDrag,
  onMove,
}: {
  issues: Issue[];
  selectedIssueId: number | null;
  onSelect: (id: number) => void;
  canMove: (issue: Issue, stage: IssueStage) => boolean;
  canDrag: (issue: Issue) => boolean;
  onMove: (issueId: number, stage: IssueStage) => Promise<void>;
}) {
  const columns = [
    ...boardStages,
    ...(issues.some((issue) => issue.stage === "DECLINED")
      ? ["DECLINED" as const]
      : []),
  ];
  return (
    <div className="grid min-w-[1280px] grid-cols-7 gap-3">
      {columns.map((stage) => {
        const columnIssues = issues.filter((issue) => issue.stage === stage);
        return (
          <section
            key={stage}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const issueId = Number(
                event.dataTransfer.getData("text/issue-id"),
              );
              const issue = issues.find(
                (candidate) => candidate.id === issueId,
              );
              if (issue && issue.stage !== stage && canMove(issue, stage)) {
                void onMove(issue.id, stage);
              }
            }}
            className="min-h-56 rounded-xl bg-muted/70 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {formatStage(stage)}
              </h3>
              <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold">
                {columnIssues.length}
              </span>
            </div>
            <div className="space-y-3">
              {columnIssues.map((issue) => (
                <button
                  type="button"
                  draggable={canDrag(issue)}
                  onDragStart={(event) =>
                    event.dataTransfer.setData(
                      "text/issue-id",
                      String(issue.id),
                    )
                  }
                  key={issue.id}
                  onClick={() => onSelect(issue.id)}
                  className={`w-full rounded-lg border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selectedIssueId === issue.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="line-clamp-2 text-sm font-semibold">
                      {issue.title}
                    </span>
                    <CircleAlert className="h-4 w-4 shrink-0 text-primary" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${priorityStyles[issue.priority]}`}
                    >
                      {issue.priority.replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(issue.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {issue.verificationStatus === "PENDING_VERIFICATION" && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                      <MessageSquareText className="h-3 w-3" />
                      Pending verification
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
