import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import type { Module, PageResponse, Project } from "./types";

const DEFAULT_PAGE_SIZE = 8;

export function useProjects() {
  const [projectPage, setProjectPage] = useState(0);
  const [projectPageSize, setProjectPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [projectResult, setProjectResult] =
    useState<PageResponse<Project> | null>(null);
  const [modulePage, setModulePage] = useState(0);
  const [modulePageSize, setModulePageSizeState] = useState(DEFAULT_PAGE_SIZE);
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

  const loadProjects = useCallback(async (page: number, size: number) => {
    const result = await apiFetch<PageResponse<Project>>(
      `/api/projects?page=${page}&size=${size}`,
    );
    setProjectResult(result);
    setSelectedProjectId((current) =>
      current && result.content.some((project) => project.id === current)
        ? current
        : (result.content[0]?.id ?? null),
    );
  }, []);

  const loadModules = useCallback(async (projectId: number, page: number, size: number) => {
    setModulesLoading(true);
    setModulesError("");
    try {
      setModuleResult(
        await apiFetch<PageResponse<Module>>(
          `/api/projects/${projectId}/modules?page=${page}&size=${size}`,
        ),
      );
    } finally {
      setModulesLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects(projectPage, projectPageSize)
      .catch((exception) =>
        setError(
          exception instanceof Error
            ? exception.message
            : "Unable to load projects",
        ),
      )
      .finally(() => setLoading(false));
  }, [loadProjects, projectPage, projectPageSize]);

  useEffect(() => {
    if (!selectedProjectId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadModules(selectedProjectId, modulePage, modulePageSize).catch((exception) =>
      setModulesError(
        exception instanceof Error
          ? exception.message
          : "Unable to load modules",
      ),
    );
  }, [loadModules, modulePage, modulePageSize, selectedProjectId]);

  const selectProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    setModulePage(0);
  };
  const setProjectPageSize = (size: number) => {
    setProjectPage(0);
    setProjectPageSizeState(size);
  };
  const setModulePageSize = (size: number) => {
    setModulePage(0);
    setModulePageSizeState(size);
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
    await loadProjects(projectPage, projectPageSize);
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
    await loadProjects(projectPage, projectPageSize);
  };
  const createModule = async (name: string, description: string) => {
    if (!selectedProjectId) return;
    await apiFetch(`/api/projects/${selectedProjectId}/modules`, {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
    await loadModules(selectedProjectId, modulePage, modulePageSize);
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
    await loadModules(selectedProjectId, modulePage, modulePageSize);
  };
  const deleteModule = async (moduleId: number) => {
    if (!selectedProjectId) return;
    await apiFetch(`/api/projects/${selectedProjectId}/modules/${moduleId}`, {
      method: "DELETE",
    });
    await loadModules(selectedProjectId, modulePage, modulePageSize);
  };

  return {
    projects: projectResult?.content ?? [],
    modules: moduleResult?.content ?? [],
    projectPage,
    projectPageSize,
    projectTotalPages: projectResult?.totalPages ?? 0,
    modulePage,
    modulePageSize,
    moduleTotalPages: moduleResult?.totalPages ?? 0,
    selectedProjectId,
    selectProject,
    setProjectPage,
    setProjectPageSize,
    setModulePage,
    setModulePageSize,
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
