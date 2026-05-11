// Centralized list of HA CSS variables we depend on. Used by components to keep
// theming consistent. Any value not present in the active theme falls back to
// the second argument.

export const VARS = {
  primary: "--primary-color",
  primaryText: "--primary-text-color",
  secondaryText: "--secondary-text-color",
  divider: "--divider-color",
  cardBg: "--card-background-color",
  success: "--success-color",
  warning: "--warning-color",
  error: "--error-color",
} as const;

export function cssVar(name: keyof typeof VARS, fallback: string): string {
  return `var(${VARS[name]}, ${fallback})`;
}
