export function isBiometricsSupported() {
  return typeof window !== "undefined" && typeof window.PublicKeyCredential === "function";
}

export async function hasPlatformAuthenticator() {
  if (!isBiometricsSupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}
