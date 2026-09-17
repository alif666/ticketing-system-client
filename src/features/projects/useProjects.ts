import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import type { Module, PageResponse, Project } from "./types";

const PROJECT_PAGE_SIZE = 8;
const MODULE_PAGE_SIZE = 8;

export function useProjects() {
  const [projectPage, setProjectPage] = useState(0);
  const [projectResult, setProjectResult] =
    useState<PageResponse<Project> | null>(null);
  const [modulePage, setModulePage] = useState(0);
  const [moduleResult, setModuleResult] = useState<PageResponse<Module> | null>(
    null,
  );
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [modulesError, setModulesError] = useState("");
  const [error, setError] = useState("");

  const loadProjects = useCallback(async (page: number) => {
    const result = await apiFetch<PageResponse<Project>>(
      `/api/projects?page=${page}&size=${PROJECT_PAGE_SIZE}`,
    );
    setProjectResult(result);
    setSelectedProjectId((current) =>
      current && result.content.some((project) => project.id === current)
        ? current
        : (result.content[0]?.id ?? null),
    );
  }, []);

  const loadModules = useCallback(async (projectId: number, page: number) => {
    setModulesLoading(true);
    setModulesError("");
    try {
      setModuleResult(
        await apiFetch<PageResponse<Module>>(
          `/api/projects/${projectId}/modules?page=${page}&size=${MODULE_PAGE_SIZE}`,
        ),
      );
    } finally {
      setModulesLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects(projectPage)
      .catch((exception) =>
        setError(
          exception instanceof Error
            ? exception.message
            : "Unable to load projects",
        ),
      )
      .finally(() => setLoading(false));
  }, [loadProjects, projectPage]);

  useEffect(() => {
    if (!selectedProjectId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadModules(selectedProjectId, modulePage).catch((exception) =>
      setModulesError(
        exception instanceof Error
          ? exception.message
          : "Unable to load modules",
      ),
    );
  }, [loadModules, modulePage, selectedProjectId]);

  const selectProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    setModulePage(0);
  };
  const createProject = async (
    name: string,
    shortCode: string,
    description: string,
  ) => {
    const project = await apiFetch<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name, shortCode, description }),
    });
    await loadProjects(projectPage);
    setSelectedProjectId(project.id);
  };
  const updateProject = async (
    projectId: number,
    name: string,
    description: string,
    active: boolean,
  ) => {
    await apiFetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({ name, description, active }),
    });
    await loadProjects(projectPage);
  };
  const createModule = async (name: string, description: string) => {
    if (!selectedProjectId) return;
    await apiFetch(`/api/projects/${selectedProjectId}/modules`, {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
    await loadModules(selectedProjectId, modulePage);
  };
  const updateModule = async (
    moduleId: number,
    name: string,
    description: string,
    active: boolean,
  ) => {
    if (!selectedProjectId) return;
    await apiFetch(`/api/projects/${selectedProjectId}/modules/${moduleId}`, {
      method: "PATCH",
      body: JSON.stringify({ name, description, active }),
    });
    await loadModules(selectedProjectId, modulePage);
  };
  const deleteModule = async (moduleId: number) => {
    if (!selectedProjectId) return;
    await apiFetch(`/api/projects/${selectedProjectId}/modules/${moduleId}`, {
      method: "DELETE",
    });
    await loadModules(selectedProjectId, modulePage);
  };

  return {
    projects: projectResult?.content ?? [],
    modules: moduleResult?.content ?? [],
    projectPage,
    projectTotalPages: projectResult?.totalPages ?? 0,
    modulePage,
    moduleTotalPages: moduleResult?.totalPages ?? 0,
    selectedProjectId,
    selectProject,
    setProjectPage,
    setModulePage,
    loading,
    modulesLoading,
    modulesError,
    error,
    createProject,
    updateProject,
    createModule,
    updateModule,
    deleteModule,
  };
}
