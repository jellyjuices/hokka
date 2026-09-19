"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/src/components/Button";
import { Icon } from "@/src/components/Icon";
import { TileInput } from "@/src/components/TileInput";
import {
  PinChoice,
  PinError,
  PinMark,
  PinPanel,
  PinReveal,
  PinScreen,
  PinValue,
} from "./PinForm.styles";
import { verifyPassword } from "./PinForm.verify";
import { useBiometricUnlock } from "./useBiometricUnlock";
import { useUnlockWarmup } from "./useUnlockWarmup";
import type { PinFormProps } from "./PinForm.types";

export function PinForm({ onUnlocked }: PinFormProps) {
  useUnlockWarmup();
  const biometrics = useBiometricUnlock(onUnlocked);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const message = error ?? biometrics.error;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isChecking || password === "") return;
    setIsChecking(true);
    setError(null);
    const failure = await verifyPassword(password);
    if (failure === null) {
      onUnlocked();
      return;
    }
    setError(failure);
    setPassword("");
    setIsChecking(false);
  }

  return (
    <PinScreen>
      <PinPanel onSubmit={submit}>
        <PinMark src="/logo/logo-full.svg" alt="Hokka" width={72} height={72} priority />
        <TileInput onClick={() => passwordRef.current?.focus()}>
          <PinValue
            ref={passwordRef}
            id="unlock-password"
            name="password"
            type={isRevealed ? "text" : "password"}
            autoComplete="current-password"
            aria-label="Password"
            placeholder="Enter your password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PinReveal
            type="button"
            aria-label={isRevealed ? "Hide password" : "Show password"}
            aria-pressed={isRevealed}
            onClick={() => setIsRevealed((revealed) => !revealed)}
          >
            <Icon name={isRevealed ? "eyeOff" : "eye"} />
          </PinReveal>
        </TileInput>
        {message && <PinError role="alert">{message}</PinError>}
        <PinChoice>
          <Button type="submit" isBlock disabled={isChecking || password === ""}>
            {isChecking ? "Checking" : "Unlock"}
          </Button>
          {biometrics.isEnrolled && (
            <Button type="button" tone="ghost" isBlock onClick={() => void biometrics.attempt()}>
              {biometrics.status === "prompting" ? "Waiting for you" : "Use biometrics"}
            </Button>
          )}
        </PinChoice>
      </PinPanel>
    </PinScreen>
  );
}
