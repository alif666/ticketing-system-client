import {
  Download,
  FileText,
  MessageCircle,
  Pencil,
  Paperclip,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useAuth } from "../../auth/AuthContext";
import { useIssueCollaboration } from "./useIssueCollaboration";
import type { Attachment } from "./types";

const allowedTypes = new Set([
  "image/png",
  "image/jpeg",
  "application/pdf",
  "text/plain",
  "application/zip",
]);

export function IssueCollaboration({ issueId }: { issueId: number }) {
  const { user } = useAuth();
  const collaboration = useIssueCollaboration(issueId);
  const [commentBody, setCommentBody] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitComment(event: FormEvent) {
    event.preventDefault();
    if (!commentBody.trim()) return;
    setSaving(true);
    try {
      if (editingComment)
        await collaboration.updateComment(editingComment, editingBody);
      else await collaboration.createComment(commentBody);
      setCommentBody("");
      setEditingComment(null);
      setEditingBody("");
    } catch (exception) {
      collaboration.setError(
        exception instanceof Error
          ? exception.message
          : "Unable to save comment",
      );
    } finally {
      setSaving(false);
    }
  }

  function beginEdit(commentId: number, body: string) {
    setEditingComment(commentId);
    setEditingBody(body);
    setCommentBody(body);
  }

  async function removeComment(commentId: number) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await collaboration.deleteComment(commentId);
    } catch (exception) {
      collaboration.setError(
        exception instanceof Error
          ? exception.message
          : "Unable to delete comment",
      );
    }
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024 || !allowedTypes.has(file.type)) {
      collaboration.setError(
        "Attachment must be a PNG, JPEG, PDF, text, or ZIP file up to 10 MB.",
      );
      return;
    }
    try {
      await collaboration.uploadAttachment(file);
    } catch (exception) {
      collaboration.setError(
        exception instanceof Error
          ? exception.message
          : "Unable to upload attachment",
      );
    }
  }

  async function download(attachment: Attachment) {
    try {
      await collaboration.downloadAttachment(attachment);
    } catch (exception) {
      collaboration.setError(
        exception instanceof Error
          ? exception.message
          : "Unable to download attachment",
      );
    }
  }

  async function removeAttachment(attachment: Attachment) {
    if (!window.confirm("Delete this attachment?")) return;
    try {
      await collaboration.deleteAttachment(attachment.id);
    } catch (exception) {
      collaboration.setError(
        exception instanceof Error
          ? exception.message
          : "Unable to delete attachment",
      );
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <MessageCircle className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Comments</h3>
            <p className="text-xs text-muted-foreground">
              Keep context with the issue.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={submitComment} className="space-y-2">
            <textarea
              required
              value={commentBody}
              onChange={(event) => {
                setCommentBody(event.target.value);
                if (editingComment) setEditingBody(event.target.value);
              }}
              maxLength={10000}
              rows={3}
              placeholder="Write a comment…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex justify-end gap-2">
              {editingComment && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditingComment(null);
                    setEditingBody("");
                    setCommentBody("");
                  }}
                  className="bg-secondary text-secondary-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel edit
                </Button>
              )}
              <Button disabled={saving}>
                <Send className="mr-2 h-4 w-4" />
                {editingComment ? "Save comment" : "Add comment"}
              </Button>
            </div>
          </form>
          {collaboration.loading ? (
            <p className="text-sm text-muted-foreground">Loading comments…</p>
          ) : collaboration.comments.length ? (
            <div className="space-y-3">
              {collaboration.comments.map((comment) => {
                const canManage =
                  comment.authorId === user?.id || user?.role === "APP_ADMIN";
                return (
                  <article
                    key={comment.id}
                    className="rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold">
                          User #{comment.authorId}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                          {comment.edited && " · edited"}
                        </p>
                      </div>
                      {canManage && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => beginEdit(comment.id, comment.body)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                            aria-label="Edit comment"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeComment(comment.id)}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                            aria-label="Delete comment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {comment.body}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
          {collaboration.error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 p-3 text-sm text-red-700"
            >
              {collaboration.error}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Paperclip className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Attachments</h3>
            <p className="text-xs text-muted-foreground">
              Share supporting files up to 10 MB.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-5 text-sm font-medium text-primary hover:bg-primary/10">
            <Input
              type="file"
              accept="image/png,image/jpeg,application/pdf,text/plain,application/zip"
              onChange={upload}
              className="sr-only"
            />
            <Paperclip className="h-4 w-4" />
            Upload attachment
          </label>
          {collaboration.loading ? (
            <p className="text-sm text-muted-foreground">
              Loading attachments…
            </p>
          ) : collaboration.attachments.length ? (
            <div className="space-y-2">
              {collaboration.attachments.map((attachment) => {
                const canDelete =
                  attachment.uploaderId === user?.id ||
                  user?.role === "APP_ADMIN";
                return (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {attachment.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(attachment.sizeBytes)} ·{" "}
                          {new Date(attachment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => download(attachment)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                        aria-label={`Download ${attachment.originalName}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment)}
                          className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${attachment.originalName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No attachments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
