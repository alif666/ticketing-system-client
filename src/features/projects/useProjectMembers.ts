import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import type { ManagedUser, ManagedUserPage } from "../users/types";
import type { PageResponse } from "./types";

export function useProjectMembers(projectId: number | null, enabled: boolean) {
  const [members, setMembers] = useState<ManagedUser[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled || !projectId) return;
    setLoading(true);
    setError("");
    try {
      const [memberPage, userPage] = await Promise.all([
        apiFetch<PageResponse<ManagedUser>>(`/api/projects/${projectId}/members?page=${page}&size=10`),
        apiFetch<ManagedUserPage>("/api/users?page=0&size=100"),
      ]);
      setMembers(memberPage.content);
      setTotalPages(memberPage.totalPages);
      setUsers(userPage.content);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to load project members");
    } finally {
      setLoading(false);
    }
  }, [enabled, page, projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const addMember = async (userId: number) => {
    if (!projectId) return;
    setActionLoading(true);
    try {
      await apiFetch(`/api/projects/${projectId}/members/${userId}`, { method: "PUT" });
      await load();
    } finally { setActionLoading(false); }
  };

  const removeMember = async (userId: number) => {
    if (!projectId) return;
    setActionLoading(true);
    try {
      await apiFetch(`/api/projects/${projectId}/members/${userId}`, { method: "DELETE" });
      await load();
    } finally { setActionLoading(false); }
  };

  const memberIds = new Set(members.map((member) => member.id));
  return { members, availableUsers: users.filter((user) => user.active && user.role !== "APP_ADMIN" && !memberIds.has(user.id)), page, totalPages, loading, actionLoading, error, setPage, addMember, removeMember, reload: load };
}
