import { getR2Config } from "./config";

const ALGORITHM = "AWS4-HMAC-SHA256";
const SERVICE = "s3";
const REGION = "auto";
const UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string) {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function hmac(key: BufferSource, value: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value));
}

async function deriveSigningKey(secretAccessKey: string, date: string) {
  const dateKey = await hmac(encoder.encode(`AWS4${secretAccessKey}`), date);
  const regionKey = await hmac(dateKey, REGION);
  const serviceKey = await hmac(regionKey, SERVICE);
  return hmac(serviceKey, "aws4_request");
}

function encodeSegment(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function encodeObjectKey(key: string) {
  return key.split("/").map(encodeSegment).join("/");
}

function amzTimestamp(now: Date) {
  return now.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function canonicalQueryString(params: Map<string, string>) {
  return [...params.entries()]
    .sort(([left], [right]) => (left < right ? -1 : 1))
    .map(([key, value]) => `${encodeSegment(key)}=${encodeSegment(value)}`)
    .join("&");
}

export type PresignOptions = {
  method: "GET" | "PUT";
  key: string;
  expiresIn: number;
};

export async function presignR2Url({ method, key, expiresIn }: PresignOptions) {
  const config = getR2Config();
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const timestamp = amzTimestamp(new Date());
  const date = timestamp.slice(0, 8);
  const scope = `${date}/${REGION}/${SERVICE}/aws4_request`;
  const canonicalUri = `/${config.bucket}/${encodeObjectKey(key)}`;

  const params = new Map<string, string>([
    ["X-Amz-Algorithm", ALGORITHM],
    ["X-Amz-Credential", `${config.accessKeyId}/${scope}`],
    ["X-Amz-Date", timestamp],
    ["X-Amz-Expires", String(expiresIn)],
    ["X-Amz-SignedHeaders", "host"],
  ]);
  const query = canonicalQueryString(params);

  const canonicalRequest = [
    method,
    canonicalUri,
    query,
    `host:${host}\n`,
    "host",
    UNSIGNED_PAYLOAD,
  ].join("\n");

  const stringToSign = [ALGORITHM, timestamp, scope, await sha256Hex(canonicalRequest)].join("\n");
  const signingKey = await deriveSigningKey(config.secretAccessKey, date);
  const signature = toHex(await hmac(signingKey, stringToSign));

  return `https://${host}${canonicalUri}?${query}&X-Amz-Signature=${signature}`;
}
