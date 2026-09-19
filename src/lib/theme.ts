import { css } from "@emotion/react";
import isPropValid from "@emotion/is-prop-valid";

export const theme = {
  surface: {
    primary: "var(--surface-primary)",
    secondary: "var(--surface-secondary)",
    tint: "var(--surface-tint)",
    accent: "var(--surface-accent)",
    accentSecondary: "var(--surface-accent-secondary)",
  },

  foreground: {
    primary: "var(--foreground-primary)",
    secondary: "var(--foreground-secondary)",
    inverse: "var(--foreground-inverse)",
    disabled: "var(--foreground-disabled)",
    accent: "var(--foreground-accent)",
  },

  categoryColor: {
    moss: "var(--category-moss)",
    indigo: "var(--category-indigo)",
    teal: "var(--category-teal)",
    amber: "var(--category-amber)",
    sky: "var(--category-sky)",
    plum: "var(--category-plum)",
    slate: "var(--category-slate)",
    rose: "var(--category-rose)",
  },

  fontFamily: {
    display: "var(--font-family-display)",
    text: "var(--font-family-text)",
  },

  fontSize: {
    "xs": "var(--font-size-xs)",
    "sm": "var(--font-size-sm)",
    "md": "var(--font-size-md)",
    "lg": "var(--font-size-lg)",
    "xl": "var(--font-size-xl)",
    "2xl": "var(--font-size-2xl)",
    "3xl": "var(--font-size-3xl)",
    "4xl": "var(--font-size-4xl)",
    "5xl": "var(--font-size-5xl)",
  },

  borderRadius: {
    xs: "var(--border-radius-xs)",
    sm: "var(--border-radius-sm)",
    md: "var(--border-radius-md)",
    lg: "var(--border-radius-lg)",
    xl: "var(--border-radius-xl)",
    full: "var(--border-radius-full)",
  },

  space: {
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
  },

  layout: {
    gutter: "var(--page-gutter)",
    railGap: "var(--rail-gap)",
    railWidth: "var(--rail-width)",
    railWidthCollapsed: "var(--rail-width-collapsed)",
    contentMax: "var(--content-max)",
    columns: "var(--grid-columns)",
    gapX: "var(--grid-gap-x)",
    gapY: "var(--grid-gap-y)",
  },

  motion: {
    fast: "var(--duration-fast)",
    base: "var(--duration)",
    slow: "var(--duration-slow)",
  },
} as const;

export type Theme = typeof theme;

export type CategoryColor = keyof typeof theme.categoryColor;

// Every field that shows a number wears this: digits on one column width so a
// list of amounts lines up, and tracking pulled back under the global 0.02em so
// a large total does not read as spaced out. The child rule is there because
// the global `*` selector beats inheritance, so text wrapped in a span would
// otherwise keep the positive tracking.
export const numeric = css`
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;

  & > * {
    letter-spacing: inherit;
  }
`;

export function hoverFill(background: string) {
  return `color-mix(in srgb, ${background}, ${theme.foreground.primary} 5%)`;
}

export function categoryTint(color: string) {
  return `color-mix(in srgb, ${color} 12%, ${theme.surface.primary})`;
}

export const transientProps = {
  shouldForwardProp: (prop: string) => !prop.startsWith("$") && isPropValid(prop),
};
