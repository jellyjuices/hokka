export type BiometricStatus = "idle" | "prompting" | "failed";

export type PinFormProps = {
  onUnlocked: () => void;
};
