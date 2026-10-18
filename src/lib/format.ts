import type { DeviceEntities, HassLocale, HomeAssistant } from "../types.js";

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

export function formatPricePerKwh(price: number, unit: string | null): string {
  const fixed = price.toFixed(2);
  return unit ? `${fixed} ${unit}/kWh` : fixed;
}

export function formatKwh(value: number): string {
  return `${value.toFixed(1)} kWh`;
}

export function stripPerKwh(unit: string | null | undefined): string | null {
  if (unit == null) return null;
  const m = /^(.+?)\s*\/\s*kwh$/i.exec(unit.trim());
  return m ? (m[1] ?? unit).trim() : unit;
}

// The integration derives cost_unit from the price entity's
// unit_of_measurement and leaves it null when that is missing. Fall back to
// the price entity's own currency hints so amounts still carry a currency.
export function resolveCostUnit(hass: HomeAssistant, entities: DeviceEntities): string | null {
  const fromPlan = hass.states[entities.plannedHours]?.attributes.cost_unit;
  if (typeof fromPlan === "string" && fromPlan.trim()) return fromPlan.trim();
  const priceAttrs = entities.priceEntity ? hass.states[entities.priceEntity]?.attributes : undefined;
  const currency = priceAttrs?.currency;
  if (typeof currency === "string" && currency.trim()) return currency.trim();
  const uom = priceAttrs?.unit_of_measurement;
  return typeof uom === "string" && uom.trim() ? stripPerKwh(uom) : null;
}
