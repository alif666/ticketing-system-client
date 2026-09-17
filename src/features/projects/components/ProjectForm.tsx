import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { Project } from "../types";

export function ProjectForm({ project, onSave, onCancel }: { project?: Project; onSave: (name: string, shortCode: string, description: string, active: boolean) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState(project?.name ?? ""); const [shortCode, setShortCode] = useState(project?.shortCode ?? ""); const [description, setDescription] = useState(project?.description ?? ""); const [active, setActive] = useState(project?.active ?? true); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); try { await onSave(name, shortCode, description, active); onCancel(); } catch (exception) { setError(exception instanceof Error ? exception.message : "Unable to save project"); } }
  return <Card><CardHeader><h3 className="font-semibold">{project ? "Edit project" : "Create project"}</h3></CardHeader><CardContent><form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_140px_1fr_auto]"><Input required placeholder="Project name" value={name} onChange={(event) => setName(event.target.value)} /><Input required disabled={Boolean(project)} placeholder="Short code" value={shortCode} onChange={(event) => setShortCode(event.target.value.toUpperCase())} /><Input placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} /><div className="flex gap-2"><Button>{project ? "Save" : "Create"}</Button><Button type="button" onClick={onCancel} className="bg-secondary text-secondary-foreground">Cancel</Button></div>{project && <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />Active project</label>}{error && <p role="alert" className="text-sm text-red-700 sm:col-span-4">{error}</p>}</form></CardContent></Card>;
}
