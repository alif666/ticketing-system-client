import { CheckCircle2, Clock3, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { PaginationControls } from "../../components/layout/PaginationControls";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { formatDate } from "../../lib/date";
import { useAuth } from "../auth/AuthContext";
import { formatStage } from "../issues/components/issueStages";
import type { Issue } from "../issues/types";
import { useVerificationQueue } from "./useVerificationQueue";

export function VerificationQueuePage() {
  const { user } = useAuth();
  const queue = useVerificationQueue();
  const [rejecting, setRejecting] = useState<Issue | null>(null);
  const [reason, setReason] = useState("");
  const [dialogError, setDialogError] = useState("");

  if (user?.role !== "APP_ADMIN" && user?.role !== "CLIENT_ADMIN") {
    return <Card><CardContent className="py-12 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" /><h1 className="mt-3 font-semibold">Verification queue unavailable</h1><p className="mt-1 text-sm text-muted-foreground">You do not have permission to review issues.</p></CardContent></Card>;
  }

  async function approve(issue: Issue) {
    try {
      await queue.decide(issue.id, "approve", "Approved after verification");
    } catch {
      // The hook exposes the actionable error message in the page alert.
    }
  }

  async function reject() {
    if (!rejecting || !reason.trim()) {
      setDialogError("A rejection reason is required.");
      return;
    }
    try {
      await queue.decide(rejecting.id, "reject", reason.trim());
      setRejecting(null);
      setReason("");
      setDialogError("");
    } catch {
      // Keep the dialog open so the reviewer can retry.
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quality workflow</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Verification queue</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Review issues submitted for verification and record an approval or rework decision.</p></div>
        <Button type="button" onClick={() => void queue.reload()} disabled={queue.loading || queue.actionLoading} className="bg-secondary text-secondary-foreground"><RefreshCw className={`mr-2 h-4 w-4 ${queue.loading ? "animate-spin" : ""}`} />Refresh</Button>
      </div>
      {queue.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{queue.error}</p>}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 border-b"><div><h2 className="font-semibold">Pending review</h2><p className="text-xs text-muted-foreground">{queue.totalElements} issue{queue.totalElements === 1 ? "" : "s"} awaiting a decision.</p></div><ShieldCheck className="h-5 w-5 text-primary" /></CardHeader>
        <CardContent className="pt-5">
          {queue.loading ? <p className="py-10 text-center text-sm text-muted-foreground">Loading verification queue…</p> : queue.issues.length ? <div className="space-y-3">{queue.issues.map((issue) => <QueueItem key={issue.id} issue={issue} disabled={queue.actionLoading} onApprove={() => void approve(issue)} onReject={() => { setRejecting(issue); setReason(""); setDialogError(""); }} />)}</div> : <div className="rounded-xl border border-dashed p-12 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" /><p className="mt-3 font-medium">Queue is clear</p><p className="mt-1 text-sm text-muted-foreground">There are no issues waiting for verification.</p></div>}
          <PaginationControls page={queue.page} totalPages={queue.totalPages} pageSize={queue.pageSize} pageSizeOptions={[10, 20, 50]} onPageChange={queue.setPage} onPageSizeChange={queue.setPageSize} />
        </CardContent>
      </Card>
      <Dialog open={rejecting !== null} onOpenChange={(open) => { if (!open && !queue.actionLoading) { setRejecting(null); setDialogError(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject verification?</DialogTitle><DialogDescription>Send this issue back for rework with a clear reason for the reporter.</DialogDescription></DialogHeader>
          <label className="space-y-2 text-sm font-medium">Reason<Input autoFocus required value={reason} maxLength={500} placeholder="Explain what needs to be addressed" onChange={(event) => { setReason(event.target.value); setDialogError(""); }} /></label>
          {dialogError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{dialogError}</p>}
          <DialogFooter><Button type="button" disabled={queue.actionLoading} onClick={() => setRejecting(null)} className="bg-secondary text-secondary-foreground">Cancel</Button><Button type="button" disabled={queue.actionLoading} onClick={() => void reject()} className="bg-red-600 text-white hover:bg-red-700">Reject issue</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function QueueItem({ issue, disabled, onApprove, onReject }: { issue: Issue; disabled: boolean; onApprove: () => void; onReject: () => void }) {
  return <article className="rounded-xl border p-4 transition hover:border-primary/40 hover:shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-primary">Issue #{issue.id}</span><span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">Pending verification</span></div><h3 className="mt-2 truncate text-base font-semibold">{issue.title}</h3><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>{formatStage(issue.stage)}</span><span>{issue.type.replace("_", " ")}</span><span>{issue.priority.replace("_", " ")}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{formatDate(issue.updatedAt)}</span></div></div><div className="flex shrink-0 flex-wrap gap-2"><Button type="button" disabled={disabled} onClick={onApprove}><CheckCircle2 className="mr-2 h-4 w-4" />Approve</Button><Button type="button" disabled={disabled} onClick={onReject} className="bg-secondary text-secondary-foreground"><XCircle className="mr-2 h-4 w-4" />Reject</Button></div></div></article>;
}
