import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export type ClientOption = { id: number; name: string; active: boolean };
type ClientPage = { content: ClientOption[] };

export function useClients(enabled: boolean) {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    apiFetch<ClientPage>("/api/clients?page=0&size=100")
      .then((result) => { if (!cancelled) setClients(result.content.filter((client) => client.active)); })
      .catch((exception) => { if (!cancelled) setError(exception instanceof Error ? exception.message : "Unable to load clients"); });
    return () => { cancelled = true; };
  }, [enabled]);
  return { clients, error };
}
