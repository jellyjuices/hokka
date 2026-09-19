const COOKIE_NAME = "hokka_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const encoder = new TextEncoder();

export const SESSION_COOKIE = COOKIE_NAME;

function sessionSecret() {
  return process.env.SESSION_SECRET ?? "";
}

function password() {
  return process.env.PASSWORD ?? "";
}

export function isSessionConfigured() {
  return sessionSecret() !== "" && password() !== "";
}

function toBase64Url(bytes: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function passwordDigest() {
  return toBase64Url(await crypto.subtle.digest("SHA-256", encoder.encode(password())));
}

async function sign(stamp: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const payload = `${stamp}.${await passwordDigest()}`;
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

function isSameString(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function createSessionCookie() {
  if (!isSessionConfigured()) {
    throw new Error("The session is not configured: set PASSWORD and SESSION_SECRET");
  }
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const token = `${expiresAt}.${await sign(String(expiresAt))}`;
  const flags = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];
  if (process.env.NODE_ENV === "production") flags.push("Secure");
  return flags.join("; ");
}

export async function isValidSessionToken(token: string | undefined) {
  if (!isSessionConfigured() || !token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const stamp = token.slice(0, separator);
  const expiresAt = Number(stamp);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 <= Date.now()) return false;

  return isSameString(token.slice(separator + 1), await sign(stamp));
}
