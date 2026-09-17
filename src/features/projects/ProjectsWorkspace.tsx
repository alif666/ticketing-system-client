import { useState, type FormEvent } from "react";
import { FolderKanban, Layers3, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../auth/AuthContext";
import { useProjects } from "./useProjects";

export function ProjectsWorkspace() {
  const { user } = useAuth();
  const { projects, modules, selectedProjectId, setSelectedProjectId, loading, modulesLoading, error, createModule, deleteModule } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [actionError, setActionError] = useState("");
  const canManageModules = user?.role === "APP_ADMIN" || user?.role === "CLIENT_ADMIN";
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  async function submitModule(event: FormEvent) {
    event.preventDefault();
    setActionError("");
    try {
      await createModule(name, description);
      setName(""); setDescription(""); setShowForm(false);
    } catch (exception) { setActionError(exception instanceof Error ? exception.message : "Unable to create module"); }
  }

  async function removeModule(moduleId: number) {
    if (!window.confirm("Delete this module?")) return;
    try { await deleteModule(moduleId); } catch (exception) { setActionError(exception instanceof Error ? exception.message : "Unable to delete module"); }
  }

  if (loading) return <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading projects…</CardContent></Card>;
  if (error) return <Card><CardContent className="py-10 text-center text-sm text-red-700">{error}</CardContent></Card>;
  if (!projects.length) return <Card><CardContent className="py-10 text-center"><FolderKanban className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">No projects available</p><p className="mt-1 text-sm text-muted-foreground">You will see projects here when you are granted access.</p></CardContent></Card>;

  return <div className="grid gap-6 lg:grid-cols-[280px_1fr]"><Card className="h-fit"><CardHeader><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Projects</p><h3 className="text-lg font-semibold">Your workspaces</h3></CardHeader><CardContent className="space-y-2">{projects.map((project) => <button key={project.id} type="button" onClick={() => setSelectedProjectId(project.id)} className={`w-full rounded-lg border p-3 text-left transition ${project.id === selectedProjectId ? "border-primary bg-accent" : "border-transparent hover:border-border hover:bg-muted"}`}><p className="font-medium">{project.name}</p><p className="mt-1 text-xs text-muted-foreground">{project.shortCode}</p></button>)}</CardContent></Card><Card><CardHeader className="flex-row items-start justify-between space-y-0"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Project modules</p><h3 className="mt-1 text-2xl font-semibold">{selectedProject?.name}</h3><p className="mt-1 text-sm text-muted-foreground">{selectedProject?.description || "Organize issues by functional area."}</p></div>{canManageModules && <Button onClick={() => setShowForm((visible) => !visible)} className="shrink-0"><Plus className="mr-2 h-4 w-4" />Add module</Button>}</CardHeader><CardContent>{showForm && <form onSubmit={submitModule} className="mb-5 grid gap-3 rounded-lg border bg-muted/40 p-4 sm:grid-cols-[1fr_1fr_auto]"><Input required placeholder="Module name" value={name} onChange={(event) => setName(event.target.value)} /><Input placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} /><Button>Create</Button></form>}{(actionError || error) && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{actionError || error}</p>}{modulesLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading modules…</p> : !modules.length ? <div className="rounded-lg border border-dashed p-8 text-center"><Layers3 className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 font-medium">No modules yet</p><p className="mt-1 text-sm text-muted-foreground">Create a module to organize this project’s issues.</p></div> : <div className="grid gap-3 sm:grid-cols-2">{modules.map((module) => <div key={module.id} className="rounded-lg border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{module.name}</p><p className="mt-1 text-sm text-muted-foreground">{module.description || "No description"}</p></div>{canManageModules && <button type="button" aria-label={`Delete ${module.name}`} onClick={() => removeModule(module.id)} className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>}</div></div>)}</div>}</CardContent></Card></div>;
}
