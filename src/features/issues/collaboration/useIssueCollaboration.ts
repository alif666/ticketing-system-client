import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL, apiFetch } from "../../../lib/api";
import type { Attachment, Comment } from "./types";
import type { PageResponse } from "../../projects/types";

export function useIssueCollaboration(issueId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [commentPage, attachmentPage] = await Promise.all([
        apiFetch<PageResponse<Comment>>(
          `/api/issues/${issueId}/comments?page=0&size=100`,
        ),
        apiFetch<PageResponse<Attachment>>(
          `/api/issues/${issueId}/attachments?page=0&size=100`,
        ),
      ]);
      setComments(commentPage.content);
      setAttachments(attachmentPage.content);
      setError("");
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().catch((exception) =>
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to load collaboration data",
      ),
    );
  }, [load]);

  const createComment = async (body: string) => {
    await apiFetch<Comment>(`/api/issues/${issueId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
    await load();
  };
  const updateComment = async (commentId: number, body: string) => {
    await apiFetch<Comment>(`/api/issues/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
    await load();
  };
  const deleteComment = async (commentId: number) => {
    await apiFetch(`/api/issues/comments/${commentId}`, { method: "DELETE" });
    await load();
  };
  const uploadAttachment = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    await apiFetch<Attachment>(`/api/issues/${issueId}/attachments`, {
      method: "POST",
      body: form,
    });
    await load();
  };
  const downloadAttachment = async (attachment: Attachment) => {
    const response = await fetch(
      `${API_BASE_URL}/api/issues/attachments/${attachment.id}/download`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ticketing.token") ?? ""}`,
        },
      },
    );
    if (!response.ok) throw new Error(`Download failed (${response.status})`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const deleteAttachment = async (attachmentId: number) => {
    await apiFetch(`/api/issues/attachments/${attachmentId}`, {
      method: "DELETE",
    });
    await load();
  };

  return {
    comments,
    attachments,
    loading,
    error,
    setError,
    createComment,
    updateComment,
    deleteComment,
    uploadAttachment,
    downloadAttachment,
    deleteAttachment,
  };
}
