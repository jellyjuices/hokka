import { fromBase64Url, toBase64Url } from "@/src/lib/base64url";

const RP_NAME = "Hokka";
const ACCOUNT_NAME = "Hokka ledger";
const TIMEOUT = 60 * 1000;
const ES256 = -7;
const RS256 = -257;

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

export async function createBiometricCredential() {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: randomBytes(32),
      rp: { name: RP_NAME, id: window.location.hostname },
      user: { id: randomBytes(16), name: ACCOUNT_NAME, displayName: RP_NAME },
      pubKeyCredParams: [
        { type: "public-key", alg: ES256 },
        { type: "public-key", alg: RS256 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "discouraged",
        userVerification: "required",
      },
      attestation: "none",
      timeout: TIMEOUT,
    },
  });
  if (!(credential instanceof PublicKeyCredential)) return null;
  return toBase64Url(credential.rawId);
}

// The transport hint is what keeps the sheet on this device. Without it WebKit
// weighs a security key and a phone over the air as well, and an enrolment that
// is neither raises no prompt at all rather than refusing. An abort signal is no
// help here either: WebKit ignores it and the request it was meant to cancel goes
// on blocking every later one, so a request is left to finish on its own.
export async function assertBiometricCredential(credentialId: string) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomBytes(32),
      rpId: window.location.hostname,
      allowCredentials: [
        { type: "public-key", id: fromBase64Url(credentialId), transports: ["internal"] },
      ],
      userVerification: "required",
      timeout: TIMEOUT,
    },
  });
  if (!(assertion instanceof PublicKeyCredential)) return false;
  return toBase64Url(assertion.rawId) === credentialId;
}
