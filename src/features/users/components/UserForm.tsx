import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { UserProfile } from "../../auth/types";
import type { ManagedUser } from "../types";

type UserFormProps = {
  user?: ManagedUser;
  currentUser: UserProfile;
  onSave: (payload: { email?: string; name: string; role?: string; clientId?: number; mobile?: string; designation?: string; office?: string; active?: boolean }) => Promise<void>;
  onCancel: () => void;
};

export function UserForm({ user, currentUser, onSave, onCancel }: UserFormProps) {
  const editing = Boolean(user);
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<"APP_ADMIN" | "CLIENT_ADMIN" | "CLIENT_USER">(user?.role ?? "CLIENT_USER");
  const [clientId, setClientId] = useState(currentUser.clientId ? String(currentUser.clientId) : "");
  const [mobile, setMobile] = useState(user?.mobile ?? "");
  const [designation, setDesignation] = useState(user?.designation ?? "");
  const [office, setOffice] = useState(user?.office ?? "");
  const [active, setActive] = useState(user?.active ?? true);
  const [error, setError] = useState("");
  const roles = currentUser.role === "APP_ADMIN" ? ["APP_ADMIN", "CLIENT_ADMIN", "CLIENT_USER"] : ["CLIENT_ADMIN", "CLIENT_USER"];

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      if (editing) await onSave({ name, mobile, designation, office, active });
      else await onSave({ email, name, role, ...(clientId ? { clientId: Number(clientId) } : {}) });
      onCancel();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to save user");
    }
  }

  return <form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2">{!editing && <label className="space-y-1 text-sm font-medium">Email<Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}<label className={`space-y-1 text-sm font-medium ${editing ? "sm:col-span-2" : ""}`}>Name<Input required value={name} onChange={(event) => setName(event.target.value)} /></label>{!editing && <><label className="space-y-1 text-sm font-medium">Role<select value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{roles.map((option) => <option key={option} value={option}>{option.replace("_", " ")}</option>)}</select></label>{currentUser.role === "APP_ADMIN" && <label className="space-y-1 text-sm font-medium">Client ID<Input type="number" min="1" value={clientId} onChange={(event) => setClientId(event.target.value)} placeholder="Required for client users" /></label>}</>}{editing && <><label className="space-y-1 text-sm font-medium">Mobile<Input value={mobile} onChange={(event) => setMobile(event.target.value)} /></label><label className="space-y-1 text-sm font-medium">Designation<Input value={designation} onChange={(event) => setDesignation(event.target.value)} /></label><label className="space-y-1 text-sm font-medium sm:col-span-2">Office<Input value={office} onChange={(event) => setOffice(event.target.value)} /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active user</label></>}</div>{error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-2"><Button type="button" onClick={onCancel} className="bg-secondary text-secondary-foreground">Cancel</Button><Button disabled={false}>{editing ? "Save changes" : "Create user"}</Button></div></form>;
}
