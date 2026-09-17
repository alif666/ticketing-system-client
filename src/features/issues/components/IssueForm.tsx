import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { Module } from "../../projects/types";
import type { Issue, IssuePriority, IssueType } from "../types";

const types: IssueType[] = ["BUG", "ENHANCEMENT", "NEW_FEATURE"];
const priorities: IssuePriority[] = [
  "VERY_LOW",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
  "URGENT",
];

type IssueFormProps = {
  issue?: Issue;
  projectId: number;
  modules: Module[];
  onSave: (payload: {
    title: string;
    description: string;
    type: IssueType;
    priority: IssuePriority;
    projectId: number;
    moduleId: number | null;
  }) => Promise<void>;
  onCancel: () => void;
};

export function IssueForm({
  issue,
  projectId,
  modules,
  onSave,
  onCancel,
}: IssueFormProps) {
  const [title, setTitle] = useState(issue?.title ?? "");
  const [description, setDescription] = useState(issue?.description ?? "");
  const [type, setType] = useState<IssueType>(issue?.type ?? "BUG");
  const [priority, setPriority] = useState<IssuePriority>(
    issue?.priority ?? "MEDIUM",
  );
  const [moduleId, setModuleId] = useState(String(issue?.moduleId ?? ""));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({
        title,
        description,
        type,
        priority,
        projectId,
        moduleId: moduleId ? Number(moduleId) : null,
      });
      onCancel();
    } catch (exception) {
      setError(
        exception instanceof Error ? exception.message : "Unable to save issue",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium md:col-span-2">
          Title
          <Input
            required
            maxLength={240}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Describe the issue briefly"
          />
        </label>
        <label className="space-y-1 text-sm font-medium md:col-span-2">
          Description
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Add context, expected behavior, and impact"
          />
        </label>
        <label className="space-y-1 text-sm font-medium">
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as IssueType)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {types.map((value) => (
              <option key={value} value={value}>
                {value.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">
          Priority
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as IssuePriority)
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {priorities.map((value) => (
              <option key={value} value={value}>
                {value.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        {!issue && (
          <label className="space-y-1 text-sm font-medium">
            Module
            <select
              value={moduleId}
              onChange={(event) => setModuleId(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Project-level issue</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={onCancel}
          className="bg-secondary text-secondary-foreground"
        >
          Cancel
        </Button>
        <Button disabled={saving}>
          {saving ? "Saving…" : issue ? "Save changes" : "Create issue"}
        </Button>
      </div>
    </form>
  );
}
