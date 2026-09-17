import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { Project } from "../types";

export function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project?: Project;
  onSave: (
    name: string,
    shortCode: string,
    description: string,
    active: boolean,
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(project?.name ?? "");
  const [shortCode, setShortCode] = useState(project?.shortCode ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [active, setActive] = useState(project?.active ?? true);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await onSave(name, shortCode, description, active);
      onCancel();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to save project",
      );
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium">
          Project name
          <Input
            required
            placeholder="Project name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm font-medium">
          Short code
          <Input
            required
            disabled={Boolean(project)}
            placeholder="CODE"
            value={shortCode}
            onChange={(event) => setShortCode(event.target.value.toUpperCase())}
          />
        </label>
        <label className="space-y-1 text-sm font-medium sm:col-span-2">
          Description
          <Input
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>
      {project && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
          />
          Active project
        </label>
      )}
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
        <Button>{project ? "Save changes" : "Create project"}</Button>
      </div>
    </form>
  );
}
