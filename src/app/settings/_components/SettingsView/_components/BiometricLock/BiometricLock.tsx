"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Switch } from "@/src/components/Switch";
import { TileInput } from "@/src/components/TileInput";
import {
  disableBiometrics,
  enableBiometrics,
  getBiometricsServerSnapshot,
  getBiometricsSnapshot,
  hasPlatformAuthenticator,
  subscribeBiometrics,
} from "@/src/lib/biometrics";
import { LOCK_AFTER_MINUTES } from "@/src/lib/platform/unlocked";
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
      <TileInput label="Unlock with biometrics" htmlFor="biometricLock">
        <Switch
          id="biometricLock"
          checked={isEnabled}
          disabled={isBusy || !isAvailable}
          onCheckedChange={(checked) => void toggle(checked)}
          label="Unlock with biometrics"
        />
      </TileInput>
      <LockNote role={error === null ? undefined : "alert"}>
        {error ??
          (isAvailable
            ? `The ledger locks itself after ${LOCK_AFTER_MINUTES} minutes, when you leave the tab and when the app closes. The password always opens it if biometrics will not.`
            : UNSUPPORTED)}
      </LockNote>
    </>
  );
}
