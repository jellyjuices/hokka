"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/src/components/Button";
import { Field, TextInput } from "@/src/components/Field";
import { Icon } from "@/src/components/Icon";
import {
  PinError,
  PinHeading,
  PinIdentity,
  PinIntro,
  PinMark,
  PinPanel,
  PinScreen,
} from "./PinForm.styles";
import { verifyPassword } from "./PinForm.verify";
import type { PinFormProps } from "./PinForm.types";

export function PinForm({ onUnlocked }: PinFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isChecking || password === "") return;
    setIsChecking(true);
    setError(null);
    const message = await verifyPassword(password);
    if (message === null) {
      onUnlocked();
      return;
    }
    setError(message);
    setPassword("");
    setIsChecking(false);
  }

  return (
    <PinScreen>
      <PinPanel onSubmit={submit}>
        <PinIdentity>
          <PinMark>
            <Icon name="lock" size={24} />
          </PinMark>
          <PinHeading>Hokka</PinHeading>
          <PinIntro>Enter the password to open your ledger on this device.</PinIntro>
        </PinIdentity>
        <Field label="Password" htmlFor="unlock-password">
          <TextInput
            id="unlock-password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {error && <PinError role="alert">{error}</PinError>}
        <Button type="submit" isBlock disabled={isChecking || password === ""}>
          {isChecking ? "Checking" : "Unlock"}
        </Button>
      </PinPanel>
    </PinScreen>
  );
}
