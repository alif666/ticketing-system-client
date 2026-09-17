import { FolderKanban, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { useAuth } from "../auth/AuthContext";
import { ModuleForm } from "./components/ModuleForm";
import { ModuleList } from "./components/ModuleList";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectList } from "./components/ProjectList";
import { useProjects } from "./useProjects";

export function ProjectsWorkspace() {
  const { user } = useAuth();
  const { projects, modules, selectedProjectId, selectProject, projectPage, projectTotalPages, modulePage, moduleTotalPages, setProjectPage, setModulePage, loading, modulesLoading, error, createProject, updateProject, createModule, updateModule, deleteModule } = useProjects();
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [moduleForm, setModuleForm] = useState<"create" | number | null>(null);
  const [actionError, setActionError] = useState("");
  const canManageModules = user?.role === "APP_ADMIN" || user?.role === "CLIENT_ADMIN";
  const canManageProjects = user?.role === "APP_ADMIN";
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  function closeProjectForm() { setProjectFormOpen(false); setEditingProject(false); }
  function openNewProject() { setEditingProject(false); setProjectFormOpen(true); }
  function openEditProject() { if (selectedProject) { setEditingProject(true); setProjectFormOpen(true); } }
  function closeModuleForm() { setModuleForm(null); }
  function handleModuleError(exception: unknown) { setActionError(exception instanceof Error ? exception.message : "Unable to save module"); }
  async function removeModule(moduleId: number) { if (!window.confirm("Delete this module?")) return; try { await deleteModule(moduleId); } catch (exception) { handleModuleError(exception); } }

  if (loading) return <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading projects…</CardContent></Card>;
  if (error) return <Card><CardContent className="py-10 text-center text-sm text-red-700">{error}</CardContent></Card>;

  return <div className="space-y-6"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Project directory</p><h2 className="mt-1 text-xl font-semibold">Your workspaces</h2></div>{canManageProjects && <Button onClick={openNewProject}><Plus className="mr-2 h-4 w-4" />New project</Button>}</div>{projectFormOpen && <ProjectForm project={editingProject ? selectedProject : undefined} onSave={async (name, shortCode, description, active) => { if (editingProject && selectedProjectId) await updateProject(selectedProjectId, name, description, active); else await createProject(name, shortCode, description); }} onCancel={closeProjectForm} />}{!projects.length ? <Card><CardContent className="py-10 text-center"><FolderKanban className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">No projects available</p><p className="mt-1 text-sm text-muted-foreground">You will see projects here when you are granted access.</p></CardContent></Card> : <div className="grid gap-6 lg:grid-cols-[280px_1fr]"><ProjectList projects={projects} selectedProjectId={selectedProjectId} onSelect={selectProject} page={projectPage} totalPages={projectTotalPages} onPageChange={setProjectPage} /><Card><CardHeader className="flex-row items-start justify-between space-y-0"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Project modules</p><h3 className="mt-1 text-2xl font-semibold">{selectedProject?.name}</h3><p className="mt-1 text-sm text-muted-foreground">{selectedProject?.description || "Organize issues by functional area."}</p></div><div className="flex gap-2">{canManageProjects && <Button onClick={openEditProject} className="bg-secondary text-secondary-foreground"><Pencil className="mr-2 h-4 w-4" />Edit project</Button>}{canManageModules && <Button onClick={() => setModuleForm("create")}><Plus className="mr-2 h-4 w-4" />Add module</Button>}</div></CardHeader><CardContent>{moduleForm !== null && <ModuleForm module={typeof moduleForm === "number" ? modules.find((module) => module.id === moduleForm) : undefined} onSave={async (name, description, active) => { try { if (typeof moduleForm === "number") await updateModule(moduleForm, name, description, active); else await createModule(name, description); closeModuleForm(); setActionError(""); } catch (exception) { handleModuleError(exception); } }} onCancel={closeModuleForm} />}{actionError && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}{modulesLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading modules…</p> : <ModuleList modules={modules} canManage={canManageModules} onEdit={setModuleForm} onDelete={removeModule} page={modulePage} totalPages={moduleTotalPages} onPageChange={setModulePage} />}</CardContent></Card></div>}</div>;
}
