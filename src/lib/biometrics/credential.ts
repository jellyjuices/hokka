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

export async function assertBiometricCredential(credentialId: string, signal?: AbortSignal) {
  const assertion = await navigator.credentials.get({
    signal,
    publicKey: {
      challenge: randomBytes(32),
      rpId: window.location.hostname,
      allowCredentials: [{ type: "public-key", id: fromBase64Url(credentialId) }],
      userVerification: "required",
      timeout: TIMEOUT,
    },
  });
  return assertion instanceof PublicKeyCredential;
}
