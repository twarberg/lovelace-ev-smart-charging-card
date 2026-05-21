import type { HassLocale } from "../types.js";

export function formatCurrency(amount: number | null | undefined, unit: string | null, _locale: string): string {
  if (amount == null) return "—";
  const fixed = amount.toFixed(2);
  return unit ? `${fixed} ${unit}` : fixed;
}

function localeArg(locale: HassLocale | undefined): string | string[] {
  if (!locale) return [];
  if (locale.time_format === "system") return [];
  return locale.language;
}

function hour12Opt(locale: HassLocale | undefined): boolean | undefined {
  const fmt = locale?.time_format;
  if (fmt === "24") return false;
  if (fmt === "am_pm") return true;
  return undefined;
}

export function formatHourMinute(iso: string, locale?: HassLocale): string {
  return new Date(iso).toLocaleTimeString(localeArg(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: hour12Opt(locale),
  });
}

export function formatTimeRange(startIso: string, endIso: string, locale?: HassLocale): string {
  return `${formatHourMinute(startIso, locale)}–${formatHourMinute(endIso, locale)}`;
}

export function formatDateTime(iso: string, locale?: HassLocale): string {
  return new Date(iso).toLocaleString(localeArg(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: hour12Opt(locale),
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatKwh(value: number): string {
  return `${value.toFixed(1)} kWh`;
}

export function stripPerKwh(unit: string | null | undefined): string | null {
  if (unit == null) return null;
  const m = /^(.+?)\s*\/\s*kwh$/i.exec(unit.trim());
  return m ? (m[1] ?? unit).trim() : unit;
}
