export function isDevUnlocked() {
  return (
    process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_UNLOCKED_IN_DEV === "true"
  );
}
