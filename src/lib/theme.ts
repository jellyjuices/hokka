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
