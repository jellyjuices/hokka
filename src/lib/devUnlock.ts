// A local-development bypass for both locks: the API gate in middleware and the
// screen in front of it. NEXT_PUBLIC_ is required because the screen is a client
// component, and `next build` pins NODE_ENV to "production", so the flag cannot
// be turned on in a deployed build however the variable is set there.
export function isDevUnlocked() {
  return (
    process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_UNLOCKED_IN_DEV === "true"
  );
}
