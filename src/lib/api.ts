export type ApiErrorPayload = {
  error?: { code?: string; message?: string };
  message?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(path, { ...init, headers, credentials: "include" });
  const raw = (await response.json().catch(() => null)) as ({ data?: T } & ApiErrorPayload) | T | null;
  if (!response.ok) {
    const payload = raw as ApiErrorPayload | null;
    throw new ApiError(
      response.status,
      payload?.error?.message ?? payload?.message ?? "The academy could not complete this request.",
      payload?.error?.code,
    );
  }
  if (raw && typeof raw === "object" && "data" in raw) return (raw as { data: T }).data;
  return raw as T;
}
