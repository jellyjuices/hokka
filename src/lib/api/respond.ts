export function jsonResponse<T>(data: T, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export function jsonError(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

export function noContent() {
  return new Response(null, { status: 204 });
}

export async function handleRoute(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return jsonError(message, 500);
  }
}
