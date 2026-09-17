import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import type { Module, PageResponse, Project } from "./types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [error, setError] = useState("");

  const loadModules = useCallback(async (projectId: number) => {
    setModulesLoading(true);
    try {
      const result = await apiFetch<PageResponse<Module>>(`/api/projects/${projectId}/modules?page=0&size=100`);
      setModules(result.content);
    } finally {
      setModulesLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect synchronizes the view with the protected REST API.
    apiFetch<PageResponse<Project>>("/api/projects?page=0&size=50")
      .then((result) => {
        setProjects(result.content);
        setSelectedProjectId(result.content[0]?.id ?? null);
      })
      .catch((exception) => setError(exception instanceof Error ? exception.message : "Unable to load projects"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadModules(selectedProjectId).catch((exception) => setError(exception instanceof Error ? exception.message : "Unable to load modules"));
  }, [selectedProjectId, loadModules]);

  const createModule = async (name: string, description: string) => {
    if (!selectedProjectId) return;
    const module = await apiFetch<Module>(`/api/projects/${selectedProjectId}/modules`, { method: "POST", body: JSON.stringify({ name, description }) });
    setModules((current) => [...current, module]);
  };

  const deleteModule = async (moduleId: number) => {
    if (!selectedProjectId) return;
    await apiFetch(`/api/projects/${selectedProjectId}/modules/${moduleId}`, { method: "DELETE" });
    setModules((current) => current.filter((module) => module.id !== moduleId));
  };

  return { projects, modules, selectedProjectId, setSelectedProjectId, loading, modulesLoading, error, createModule, deleteModule };
}
