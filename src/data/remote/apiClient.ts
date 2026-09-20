import { clearUnlocked } from "@/src/lib/platform/unlocked";

const NOT_IMPLEMENTED = 501;
const UNAUTHORIZED = 401;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

function jsonHeaders(headers: HeadersInit | undefined): HeadersInit {
  const merged = new Headers(headers);
  merged.set("Content-Type", "application/json");
  return merged;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: jsonHeaders(init.headers),
      cache: "no-store",
    });
  } catch (error) {
    throw new NetworkError(error instanceof Error ? error.message : "Request failed");
  }

  if (!response.ok) {
    if (response.status === UNAUTHORIZED) clearUnlocked();
    const message = await response.text().catch(() => response.statusText);
    throw new ApiError(message || response.statusText, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function putBinary(url: string, blob: Blob, contentType: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    throw new NetworkError(error instanceof Error ? error.message : "Upload failed");
  }
  if (!response.ok) throw new ApiError(`Upload failed with ${response.status}`, response.status);
}

export function isRetryable(error: unknown) {
  if (error instanceof NetworkError) return true;
  if (error instanceof ApiError) {
    if (error.status === NOT_IMPLEMENTED) return false;
    return error.status >= 500 || error.status === 429;
  }
  return false;
}
