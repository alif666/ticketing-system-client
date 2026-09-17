import { FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { PaginationControls } from "../../../components/layout/PaginationControls";
import type { Project } from "../types";

type ProjectListProps = {
  projects: Project[];
  selectedProjectId: number | null;
  onSelect: (id: number) => void;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
};

export function ProjectList({ projects, selectedProjectId, onSelect, page, totalPages, pageSize, onPageSizeChange, onPageChange }: ProjectListProps) {
  return (
    <Card>
      <CardHeader className="border-b py-4"><div className="flex items-center gap-2"><FolderKanban className="h-4 w-4 text-primary" /><div><h3 className="font-semibold">Projects</h3><p className="text-xs text-muted-foreground">Select a workspace to manage its modules.</p></div></div></CardHeader>
      <CardContent className="pt-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <button key={project.id} type="button" onClick={() => onSelect(project.id)} className={`group min-w-0 rounded-xl border p-4 text-left transition ${project.id === selectedProjectId ? "border-primary bg-primary/[0.06] shadow-sm ring-1 ring-primary/20" : "border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40"}`}>
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{project.name}</p><p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{project.shortCode}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${project.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{project.active ? "Active" : "Inactive"}</span></div>
              <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.description || "No project description available."}</p>
              <span className={`mt-4 inline-flex text-xs font-semibold ${project.id === selectedProjectId ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>{project.id === selectedProjectId ? "Selected workspace" : "View workspace →"}</span>
            </button>
          ))}
        </div>
        <PaginationControls page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
      </CardContent>
    </Card>
  );
}
