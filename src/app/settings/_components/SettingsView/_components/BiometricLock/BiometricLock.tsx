"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Switch } from "@/src/components/Switch";
import { InputShell } from "@/src/components/Input";
import {
  disableBiometrics,
  enableBiometrics,
  getBiometricsServerSnapshot,
  getBiometricsSnapshot,
  hasPlatformAuthenticator,
  subscribeBiometrics,
} from "@/src/lib/biometrics";
import { LockNote } from "./BiometricLock.styles";

const UNSUPPORTED = "This device has no fingerprint or face unlock, so the password stands alone.";

export function BiometricLock() {
  const isEnabled = useSyncExternalStore(
    subscribeBiometrics,
    getBiometricsSnapshot,
    getBiometricsServerSnapshot,
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void hasPlatformAuthenticator().then((available) => {
      if (isCurrent) setIsAvailable(available);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  async function toggle(checked: boolean) {
    setError(null);
    if (!checked) {
      disableBiometrics();
      return;
    }
    setIsBusy(true);
    setError(await enableBiometrics());
    setIsBusy(false);
  }

  return (
    <>
      <InputShell
        variant="filled"
        label="Unlock with biometrics"
        htmlFor="biometricLock"
        isPressable
      >
        <Switch
          id="biometricLock"
          checked={isEnabled}
          disabled={isBusy || !isAvailable}
          onCheckedChange={(checked) => void toggle(checked)}
          label="Unlock with biometrics"
        />
      </InputShell>
      <LockNote role={error === null ? undefined : "alert"}>
        {error ?? (isAvailable || UNSUPPORTED)}
      </LockNote>
    </>
  );
}
