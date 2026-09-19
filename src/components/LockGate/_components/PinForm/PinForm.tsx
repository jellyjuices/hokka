"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/src/components/Button";
import { Field, TextInput } from "@/src/components/Field";
import { Icon } from "@/src/components/Icon";
import {
  PinChoice,
  PinError,
  PinHeading,
  PinIdentity,
  PinIntro,
  PinMark,
  PinPanel,
  PinReveal,
  PinRevealToggle,
  PinScreen,
} from "./PinForm.styles";
import { verifyPassword } from "./PinForm.verify";
import { useBiometricUnlock } from "./useBiometricUnlock";
import type { PinFormProps } from "./PinForm.types";

export function PinForm({ onUnlocked }: PinFormProps) {
  const biometrics = useBiometricUnlock(onUnlocked);
  const [isPasswordRequested, setIsPasswordRequested] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isPasswordShown =
    !biometrics.isEnrolled || biometrics.status === "failed" || isPasswordRequested;
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
        <PinIdentity>
          <PinMark>
            <Icon name={isPasswordShown ? "lock" : "biometrics"} size={24} weight="fill" />
          </PinMark>
          <PinHeading>Hokka</PinHeading>
          <PinIntro>
            {isPasswordShown
              ? "Enter the password to open your ledger on this device."
              : "Confirm it is you to open your ledger on this device."}
          </PinIntro>
        </PinIdentity>
        {isPasswordShown && (
          <Field label="Password" htmlFor="unlock-password">
            <PinReveal>
              <TextInput
                id="unlock-password"
                name="password"
                type={isVisible ? "text" : "password"}
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <PinRevealToggle
                type="button"
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="unlock-password"
                onClick={() => setIsVisible((visible) => !visible)}
              >
                <Icon name={isVisible ? "eyeOff" : "eye"} size={20} />
              </PinRevealToggle>
            </PinReveal>
          </Field>
        )}
        {message && <PinError role="alert">{message}</PinError>}
        {isPasswordShown ? (
          <PinChoice>
            <Button type="submit" isBlock disabled={isChecking || password === ""}>
              {isChecking ? "Checking" : "Unlock"}
            </Button>
            {biometrics.isEnrolled && (
              <Button
                type="button"
                tone="ghost"
                isBlock
                leadingIcon="biometrics"
                disabled={biometrics.status === "prompting"}
                onClick={() => void biometrics.attempt()}
              >
                {biometrics.status === "failed" ? "Try biometrics again" : "Use biometrics"}
              </Button>
            )}
          </PinChoice>
        ) : (
          <PinChoice>
            <Button
              type="button"
              isBlock
              leadingIcon="biometrics"
              disabled={biometrics.status === "prompting"}
              onClick={() => void biometrics.attempt()}
            >
              {biometrics.status === "prompting" ? "Waiting for you" : "Unlock with biometrics"}
            </Button>
            <Button type="button" tone="ghost" isBlock onClick={() => setIsPasswordRequested(true)}>
              Use password instead
            </Button>
          </PinChoice>
        )}
      </PinPanel>
    </PinScreen>
  );
}
