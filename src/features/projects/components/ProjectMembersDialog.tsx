import { UserPlus, UserRound, UserRoundMinus } from "lucide-react";
import { FormDialog } from "../../../components/layout/FormDialog";
import { PaginationControls } from "../../../components/layout/PaginationControls";
import { Button } from "../../../components/ui/button";
import { useProjectMembers } from "../useProjectMembers";

export function ProjectMembersDialog({ open, projectId, projectName, onClose }: { open: boolean; projectId: number | null; projectName?: string; onClose: () => void }) {
  const state = useProjectMembers(projectId, open);
  return <FormDialog open={open} onOpenChange={(value) => { if (!value) onClose(); }} title="Manage project members" description={`Grant ${projectName ?? "this project"} access to client administrators and staff.`}>
    {state.error && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    {state.loading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading members…</p> : <div className="space-y-6">
      <section><div className="mb-2 flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" /><h3 className="font-semibold">Current members</h3></div>{state.members.length ? <div className="divide-y rounded-lg border">{state.members.map((member) => <div key={member.id} className="flex items-center justify-between gap-3 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{member.name}</p><p className="truncate text-xs text-muted-foreground">{member.email} · {member.role.replace("_", " ")}</p></div><Button type="button" disabled={state.actionLoading} onClick={() => void state.removeMember(member.id)} className="shrink-0 bg-secondary text-secondary-foreground"><UserRoundMinus className="mr-1.5 h-4 w-4" />Remove</Button></div>)}</div> : <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No members assigned yet.</p>}<PaginationControls page={state.page} totalPages={state.totalPages} pageSize={10} pageSizeOptions={[10]} onPageChange={state.setPage} onPageSizeChange={() => undefined} /></section>
      <section><div className="mb-2 flex items-center gap-2"><UserPlus className="h-4 w-4 text-primary" /><h3 className="font-semibold">Available client users</h3></div>{state.availableUsers.length ? <div className="divide-y rounded-lg border">{state.availableUsers.map((user) => <div key={user.id} className="flex items-center justify-between gap-3 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email} · {user.role.replace("_", " ")}</p></div><Button type="button" disabled={state.actionLoading} onClick={() => void state.addMember(user.id)}><UserPlus className="mr-1.5 h-4 w-4" />Assign</Button></div>)}</div> : <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">All active client users are already assigned.</p>}</section>
    </div>}
  </FormDialog>;
}
