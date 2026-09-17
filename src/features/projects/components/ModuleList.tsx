import { Layers3, Pencil, Trash2 } from "lucide-react";
import type { Module } from "../types";
import { Pagination } from "./Pagination";

type ModuleListProps = {
  modules: Module[];
  canManage: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ModuleList({ modules, canManage, onEdit, onDelete, page, totalPages, onPageChange }: ModuleListProps) {
  if (!modules.length) return <div className="rounded-xl border border-dashed p-10 text-center"><Layers3 className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 font-medium">No modules yet</p><p className="mt-1 text-sm text-muted-foreground">Create a module to organize this project&apos;s issues.</p></div>;
  return <><div className="divide-y rounded-xl border">{modules.map((module) => <div key={module.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(11rem,0.8fr)_minmax(0,1.8fr)_auto] sm:items-center sm:px-5"><div className="min-w-0"><p className="truncate font-semibold">{module.name}</p><span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${module.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{module.active ? "Active" : "Inactive"}</span></div><p className="line-clamp-2 min-w-0 text-sm leading-6 text-muted-foreground">{module.description || "No description provided."}</p>{canManage && <div className="flex shrink-0 justify-end gap-1 border-t pt-2 sm:border-0 sm:pt-0"><button type="button" aria-label={`Edit ${module.name}`} onClick={() => onEdit(module.id)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button><button type="button" aria-label={`Delete ${module.name}`} onClick={() => onDelete(module.id)} className="rounded-md p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>}</div>)}</div><Pagination page={page} totalPages={totalPages} onChange={onPageChange} /></>;
}
