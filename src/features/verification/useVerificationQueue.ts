import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import type { Issue, IssuePage } from "../issues/types";

const DEFAULT_PAGE_SIZE = 20;

export function useVerificationQueue() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [result, setResult] = useState<IssuePage | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setResult(
        await apiFetch<IssuePage>(
          `/api/issues/verification-queue?page=${page}&size=${pageSize}`,
        ),
      );
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to load the verification queue",
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const decide = async (
    issueId: number,
    decision: "approve" | "reject",
    reason: string,
  ) => {
    setActionLoading(true);
    setError("");
    try {
      await apiFetch<Issue>(
        `/api/issues/${issueId}/verification/${decision}`,
        { method: "POST", body: JSON.stringify({ reason }) },
      );
      await load();
    } catch (exception) {
      const message =
        exception instanceof Error
          ? exception.message
          : "Unable to save verification decision";
      setError(message);
      throw exception;
    } finally {
      setActionLoading(false);
    }
  };
  const setPageSize = (size: number) => {
    setPage(0);
    setPageSizeState(size);
  };

  return {
    issues: result?.content ?? [],
    page,
    pageSize,
    totalPages: result?.totalPages ?? 0,
    totalElements: result?.totalElements ?? 0,
    loading,
    actionLoading,
    error,
    setPage,
    setPageSize,
    decide,
    reload: load,
  };
}
