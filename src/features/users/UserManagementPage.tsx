import { Pencil, Plus, Search, ShieldCheck, UserRound, UserX, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormDialog } from "../../components/layout/FormDialog";
import { PaginationControls } from "../../components/layout/PaginationControls";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useAuth } from "../auth/AuthContext";
import { UserForm } from "./components/UserForm";
import { useUsers } from "./useUsers";
import type { ManagedUser } from "./types";

export function UserManagementPage() {
  const { user } = useAuth();
  const users = useUsers();
  const [formUser, setFormUser] = useState<ManagedUser | "create" | null>(null);
  const [deactivating, setDeactivating] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);
  const [deleteError, setDeleteError] = useState("");

  if (user?.role !== "APP_ADMIN" && user?.role !== "CLIENT_ADMIN") return <Card><CardContent className="py-12 text-center"><UserX className="mx-auto h-8 w-8 text-muted-foreground" /><h1 className="mt-3 font-semibold">User management unavailable</h1><p className="mt-1 text-sm text-muted-foreground">You do not have permission to manage users.</p></CardContent></Card>;

  async function save(payload: { email?: string; name: string; role?: string; clientId?: number; mobile?: string; designation?: string; office?: string; active?: boolean }) {
    if (formUser && formUser !== "create") await users.updateUser(formUser.id, { name: payload.name, mobile: payload.mobile ?? "", designation: payload.designation ?? "", office: payload.office ?? "", active: payload.active ?? true });
    else await users.createUser({ email: payload.email ?? "", name: payload.name, role: payload.role ?? "CLIENT_USER", ...(payload.clientId ? { clientId: payload.clientId } : {}) });
  }

  async function deactivate() {
    if (!deactivating) return;
    try { await users.deactivateUser(deactivating.id); setDeactivating(null); } catch { /* list error remains available after reload */ }
  }

  async function remove() {
    if (!deleting) return;
    try { await users.deleteUser(deleting.id); setDeleting(null); setDeleteError(""); } catch (exception) { setDeleteError(exception instanceof Error ? exception.message : "Unable to delete user"); }
  }

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Administration</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">User management</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Manage people, roles, and account status within your administration scope.</p></div><Button type="button" onClick={() => setFormUser("create")}><Plus className="mr-2 h-4 w-4" />New user</Button></div>
    <Card><CardContent className="p-4"><label className="relative block max-w-xl"><span className="sr-only">Search users</span><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input aria-label="Search users" value={users.query} onChange={(event) => users.search(event.target.value)} placeholder="Search by name or email" className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label></CardContent></Card>
    {users.error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{users.error}</p>}
    <Card className="mt-5"><CardHeader className="flex-row items-center justify-between gap-3 border-b"><div><h2 className="font-semibold">People</h2><p className="text-xs text-muted-foreground">{users.totalElements} user{users.totalElements === 1 ? "" : "s"} in your scope.</p></div><ShieldCheck className="h-5 w-5 text-primary" /></CardHeader><CardContent className="pt-5">{users.loading ? <p className="py-10 text-center text-sm text-muted-foreground">Loading users…</p> : users.users.length ? <div className="divide-y rounded-xl border">{users.users.map((managedUser) => <UserRow key={managedUser.id} user={managedUser} canDelete={user.role === "APP_ADMIN"} disabled={users.actionLoading} onEdit={() => setFormUser(managedUser)} onDeactivate={() => setDeactivating(managedUser)} onDelete={() => setDeleting(managedUser)} />)}</div> : <div className="rounded-xl border border-dashed p-12 text-center"><UserRound className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">No users found</p><p className="mt-1 text-sm text-muted-foreground">Try a different search term or create a user.</p></div>}<PaginationControls page={users.page} totalPages={users.totalPages} pageSize={users.pageSize} pageSizeOptions={[10, 20, 50]} onPageChange={users.setPage} onPageSizeChange={users.setPageSize} /></CardContent></Card>
    <FormDialog open={formUser !== null} onOpenChange={(open) => { if (!open) setFormUser(null); }} title={formUser === "create" ? "Create user" : "Edit user"} description={formUser === "create" ? "Add a person within your administration scope." : "Update profile details and account status."}>{user && <UserForm key={formUser === "create" ? "create" : formUser?.id} user={formUser !== "create" && formUser ? formUser : undefined} currentUser={user} onSave={save} onCancel={() => setFormUser(null)} />}</FormDialog>
    <Dialog open={deactivating !== null} onOpenChange={(open) => { if (!open) setDeactivating(null); }}><DialogContent><DialogHeader><DialogTitle>Deactivate user?</DialogTitle><DialogDescription>{deactivating?.name} will no longer be able to sign in. Existing records will remain available.</DialogDescription></DialogHeader><DialogFooter><Button type="button" onClick={() => setDeactivating(null)} className="bg-secondary text-secondary-foreground">Cancel</Button><Button type="button" disabled={users.actionLoading} onClick={() => void deactivate()} className="bg-red-600 text-white hover:bg-red-700">Deactivate user</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={deleting !== null} onOpenChange={(open) => { if (!open) { setDeleting(null); setDeleteError(""); } }}><DialogContent><DialogHeader><DialogTitle>Delete user permanently?</DialogTitle><DialogDescription>{deleting?.name} will be removed only if they have no reported issues. Users with issues must be deactivated instead.</DialogDescription></DialogHeader>{deleteError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{deleteError}</p>}<DialogFooter><Button type="button" onClick={() => { setDeleting(null); setDeleteError(""); }} className="bg-secondary text-secondary-foreground">Cancel</Button><Button type="button" disabled={users.actionLoading} onClick={() => void remove()} className="bg-red-600 text-white hover:bg-red-700">Delete user</Button></DialogFooter></DialogContent></Dialog>
  </main>;
}

function UserRow({ user, canDelete, disabled, onEdit, onDeactivate, onDelete }: { user: ManagedUser; canDelete: boolean; disabled: boolean; onEdit: () => void; onDeactivate: () => void; onDelete: () => void }) {
  return <div className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(10rem,0.8fr)_auto] sm:items-center sm:px-5"><div className="min-w-0"><p className="truncate font-semibold">{user.name}</p><p className="truncate text-sm text-muted-foreground">{user.email}</p><p className="mt-1 text-xs text-muted-foreground">{user.designation || user.office || "No profile details"}</p></div><div><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">{user.role.replace("_", " ")}</span><span className={`ml-2 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${user.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{user.active ? "Active" : "Inactive"}</span></div><div className="flex justify-end gap-1 border-t pt-2 sm:border-0 sm:pt-0"><button type="button" disabled={disabled} aria-label={`Edit ${user.name}`} onClick={onEdit} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>{user.active && <button type="button" disabled={disabled} aria-label={`Deactivate ${user.name}`} onClick={onDeactivate} className="rounded-md p-2 text-red-600 hover:bg-red-50"><UserX className="h-4 w-4" /></button>}{canDelete && <button type="button" disabled={disabled} aria-label={`Delete ${user.name}`} onClick={onDelete} className="rounded-md p-2 text-red-800 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>}</div></div>;
}
