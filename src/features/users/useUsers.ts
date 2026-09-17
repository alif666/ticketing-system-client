import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import type { ManagedUser, ManagedUserPage } from "./types";

const DEFAULT_PAGE_SIZE = 20;

export function useUsers() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [result, setResult] = useState<ManagedUserPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        q: query.trim(),
        page: String(page),
        size: String(pageSize),
      });
      setResult(await apiFetch<ManagedUserPage>(`/api/users?${params}`));
    } catch (exception) {
      setError(
        exception instanceof Error ? exception.message : "Unable to load users",
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const search = (value: string) => {
    setPage(0);
    setQuery(value);
  };
  const setPageSize = (size: number) => {
    setPage(0);
    setPageSizeState(size);
  };

  const createUser = async (payload: { email: string; name: string; role: string; clientId?: number }) => {
    setActionLoading(true);
    try {
      await apiFetch<ManagedUser>("/api/users", { method: "POST", body: JSON.stringify(payload) });
      await load();
    } finally {
      setActionLoading(false);
    }
  };
  const updateUser = async (id: number, payload: { name: string; mobile: string; designation: string; office: string; active: boolean }) => {
    setActionLoading(true);
    try {
      await apiFetch<ManagedUser>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
      await load();
    } finally {
      setActionLoading(false);
    }
  };
  const deactivateUser = async (id: number) => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/users/${id}/deactivate`, { method: "POST" });
      await load();
    } finally {
      setActionLoading(false);
    }
  };
  const deleteUser = async (id: number) => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setActionLoading(false);
    }
  };

  return {
    query,
    users: result?.content ?? [],
    page,
    pageSize,
    totalPages: result?.totalPages ?? 0,
    totalElements: result?.totalElements ?? 0,
    loading,
    actionLoading,
    error,
    search,
    setPage,
    setPageSize,
    createUser,
    updateUser,
    deactivateUser,
    deleteUser,
    reload: load,
  };
}
