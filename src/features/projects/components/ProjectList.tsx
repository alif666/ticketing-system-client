import { Card, CardContent } from "../../../components/ui/card";
import type { Project } from "../types";
import { Pagination } from "./Pagination";

export function ProjectList({ projects, selectedProjectId, onSelect, page, totalPages, onPageChange }: { projects: Project[]; selectedProjectId: number | null; onSelect: (id: number) => void; page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return <Card className="h-fit"><CardContent className="space-y-2 pt-6">{projects.map((project) => <button key={project.id} type="button" onClick={() => onSelect(project.id)} className={`w-full rounded-lg border p-3 text-left transition ${project.id === selectedProjectId ? "border-primary bg-accent" : "border-transparent hover:border-border hover:bg-muted"}`}><div className="flex items-center justify-between gap-2"><p className="font-medium">{project.name}</p><span className={`text-[10px] font-bold uppercase ${project.active ? "text-emerald-700" : "text-muted-foreground"}`}>{project.active ? "Active" : "Inactive"}</span></div><p className="mt-1 text-xs text-muted-foreground">{project.shortCode}</p></button>)}<Pagination page={page} totalPages={totalPages} onChange={onPageChange} /></CardContent></Card>;
}
