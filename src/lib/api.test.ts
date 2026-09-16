import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./api";

describe("apiFetch", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), clear: () => values.clear(), removeItem: (key: string) => values.delete(key) });
  });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it("adds the persisted bearer token and parses a successful response", async () => {
    localStorage.setItem("ticketing.token", "test-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "UP" }), { status: 200 })));
    await expect(apiFetch<{ status: string }>("/api/health")).resolves.toEqual({ status: "UP" });
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/api/health", expect.objectContaining({ headers: expect.any(Headers) }));
    const request = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    expect((request.headers as Headers).get("Authorization")).toBe("Bearer test-token");
  });

  it("surfaces the API error message for failed responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Authentication is required" }), { status: 401 })));
    await expect(apiFetch("/api/me")).rejects.toThrow("Authentication is required");
  });
});
