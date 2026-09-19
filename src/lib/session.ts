// The session is a signed expiry stamp, not a store: there is one user, so there is
// nothing to look up. Signing with PASSWORD means changing the password ends every
// session that was opened with the old one.
const COOKIE_NAME = "hokka_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const encoder = new TextEncoder();

export const SESSION_COOKIE = COOKIE_NAME;

function secret() {
  return process.env.PASSWORD ?? "";
}

async function signingKey(value: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(value),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toBase64Url(bytes: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, value: string) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(value),
    encoder.encode(payload),
  );
  return toBase64Url(signature);
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
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const token = `${expiresAt}.${await sign(String(expiresAt), secret())}`;
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
  const value = secret();
  if (value === "" || !token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const stamp = token.slice(0, separator);
  const expiresAt = Number(stamp);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 <= Date.now()) return false;

  return isSameString(token.slice(separator + 1), await sign(stamp, value));
}
