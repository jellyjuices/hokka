// Every biometric call answers with a message to show the person, or null when
// it worked. The screen never needs the underlying DOMException.
export type BiometricFailure = string | null;
