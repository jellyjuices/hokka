import { handleRoute, jsonError, jsonResponse } from "@/src/lib/http";
import type { EntityName } from "../entities";
import { parseEntity } from "../entities.validate";
import { saveEntity } from "./entities";

// A request body is JSON until it is checked, never a domain record. One handler means
// one place where a malformed payload is turned away before it reaches a table.
export function upsertRoute<Name extends EntityName>(entity: Name) {
  return (request: Request) =>
    handleRoute(async () => {
      const body: unknown = await request.json().catch(() => null);
      const record = parseEntity(entity, body);
      if (record === null) return jsonError(`Invalid ${entity} payload`, 400);
      return jsonResponse(await saveEntity(entity, record));
    });
}
