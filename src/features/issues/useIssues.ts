import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import type {
  Issue,
  IssueAudit,
  IssuePage,
  IssuePriority,
  IssueStage,
  IssueType,
} from "./types";

const PAGE_SIZE = 50;

type IssueFilters = {
  query: string;
  stage: IssueStage | "ALL";
  type: IssueType | "ALL";
  priority: IssuePriority | "ALL";
  moduleId: number | "ALL";
};

const initialFilters: IssueFilters = {
  query: "",
  stage: "ALL",
  type: "ALL",
  priority: "ALL",
  moduleId: "ALL",
};

export function useIssues(projectId: number | null) {
  const [filters, setFilters] = useState<IssueFilters>(initialFilters);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<IssuePage | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [audit, setAudit] = useState<IssueAudit[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const loadIssues = useCallback(async () => {
    if (!projectId) {
      setResult(null);
      setSelectedIssueId(null);
      return;
    }
    const params = new URLSearchParams({
      projectId: String(projectId),
      page: String(page),
      size: String(PAGE_SIZE),
    });
    if (filters.query.trim()) params.set("q", filters.query.trim());
    if (filters.stage !== "ALL") params.set("stage", filters.stage);
    if (filters.type !== "ALL") params.set("type", filters.type);
    if (filters.priority !== "ALL") params.set("priority", filters.priority);
    if (filters.moduleId !== "ALL")
      params.set("moduleId", String(filters.moduleId));
    setLoading(true);
    try {
      const next = await apiFetch<IssuePage>(
        `/api/issues?${params.toString()}`,
      );
      setResult(next);
      setSelectedIssueId((current) =>
        current && next.content.some((issue) => issue.id === current)
          ? current
          : (next.content[0]?.id ?? null),
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page, projectId]);

  const loadDetail = useCallback(async (issueId: number | null) => {
    if (!issueId) {
      setSelectedIssue(null);
      setAudit([]);
      return;
    }
    setDetailLoading(true);
    try {
      const [issue, history] = await Promise.all([
        apiFetch<Issue>(`/api/issues/${issueId}`),
        apiFetch<IssueAudit[]>(`/api/issues/${issueId}/audit`),
      ]);
      setSelectedIssue(issue);
      setAudit(history);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadIssues().catch((exception) =>
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to load issues",
      ),
    );
  }, [loadIssues]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDetail(selectedIssueId).catch((exception) =>
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to load issue details",
      ),
    );
  }, [loadDetail, selectedIssueId]);

  const refresh = async () => {
    await loadIssues();
    await loadDetail(selectedIssueId);
  };
  const createIssue = async (
    payload: Pick<Issue, "title" | "description" | "type" | "priority"> & {
      projectId: number;
      moduleId: number | null;
    },
  ) => {
    const created = await apiFetch<Issue>("/api/issues", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setSelectedIssueId(created.id);
    await loadIssues();
  };
  const updateIssue = async (
    issueId: number,
    payload: Pick<Issue, "title" | "description" | "type" | "priority">,
  ) => {
    const { title, description, type, priority } = payload;
    await apiFetch<Issue>(`/api/issues/${issueId}`, {
      method: "PUT",
      body: JSON.stringify({ title, description, type, priority }),
    });
    await refresh();
  };
  const moveIssue = async (issueId: number, stage: IssueStage) => {
    await apiFetch<Issue>(`/api/issues/${issueId}/stage?stage=${stage}`, {
      method: "POST",
    });
    await refresh();
  };
  const requestVerification = async (issueId: number) => {
    await apiFetch<Issue>(`/api/issues/${issueId}/verification`, {
      method: "POST",
    });
    await refresh();
  };

  return {
    issues: result?.content ?? [],
    totalPages: result?.totalPages ?? 0,
    page,
    setPage,
    filters,
    setFilters: (next: Partial<IssueFilters>) => {
      setPage(0);
      setFilters((current) => ({ ...current, ...next }));
    },
    selectedIssueId,
    selectIssue: setSelectedIssueId,
    selectedIssue,
    audit,
    loading,
    detailLoading,
    error,
    setError,
    createIssue,
    updateIssue,
    moveIssue,
    requestVerification,
  };
}
