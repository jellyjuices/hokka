import { assertBiometricCredential, createBiometricCredential } from "./credential";
import { forgetCredentialId, readCredentialId, saveCredentialId } from "./store";
import { hasPlatformAuthenticator } from "./support";
import type { BiometricFailure } from "./biometrics.types";

const CANCELLED = ["NotAllowedError", "AbortError"];

function isCancellation(error: unknown) {
  return error instanceof DOMException && CANCELLED.includes(error.name);
}

export async function enableBiometrics(): Promise<BiometricFailure> {
  if (!(await hasPlatformAuthenticator())) {
    return "This device has no fingerprint or face unlock to use";
  }
  try {
    const credentialId = await createBiometricCredential();
    if (credentialId === null) return "This device would not register a biometric unlock";
    saveCredentialId(credentialId);
    return null;
  } catch (error) {
    if (isCancellation(error)) return "Biometric setup was dismissed";
    return "This device would not register a biometric unlock";
  }
}

export function disableBiometrics() {
  forgetCredentialId();
}

// A failed or dismissed prompt is not an error state to recover from: the caller
// falls back to the password, which is the gate the session cookie answers to.
export async function unlockWithBiometrics(): Promise<BiometricFailure> {
  const credentialId = readCredentialId();
  if (credentialId === null) return "Biometric unlock is not set up on this device";
  try {
    if (await assertBiometricCredential(credentialId)) return null;
    return "That did not match. Use your password";
  } catch (error) {
    if (isCancellation(error)) return "Biometric unlock was dismissed. Use your password";
    return "Biometric unlock is unavailable. Use your password";
  }
}
