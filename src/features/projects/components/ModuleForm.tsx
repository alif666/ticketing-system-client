import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { Module } from "../types";

export function ModuleForm({ module, onSave, onCancel }: { module?: Module; onSave: (name: string, description: string, active: boolean) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState(module?.name ?? ""); const [description, setDescription] = useState(module?.description ?? ""); const [active, setActive] = useState(module?.active ?? true); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); try { await onSave(name, description, active); onCancel(); } catch (exception) { setError(exception instanceof Error ? exception.message : "Unable to save module"); } }
  return <form onSubmit={submit} className="mb-5 grid gap-3 rounded-lg border bg-muted/40 p-4 sm:grid-cols-[1fr_1fr_auto]"><Input required placeholder="Module name" value={name} onChange={(event) => setName(event.target.value)} /><Input placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} /><div className="flex gap-2"><Button>{module ? "Save" : "Create"}</Button><Button type="button" onClick={onCancel} className="bg-secondary text-secondary-foreground">Cancel</Button></div>{module && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />Active</label>}{error && <p role="alert" className="text-sm text-red-700 sm:col-span-3">{error}</p>}</form>;
}
