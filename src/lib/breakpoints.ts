export const breakpoints = {
  xsMobile: 320,
  mobile: 390,
  smTablet: 768,
  lgTablet: 1024,
  laptop: 1440,
  desktop: 1920,
  xldesktop: 2560,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function mediaUp(breakpoint: Breakpoint) {
  return `@media (min-width: ${breakpoints[breakpoint] + 1}px)`;
}

export function mediaDown(breakpoint: Breakpoint) {
  return `@media (max-width: ${breakpoints[breakpoint]}px)`;
}
