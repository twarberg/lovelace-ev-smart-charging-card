export function formatCurrency(amount: number | null | undefined, unit: string | null, _locale: string): string {
  if (amount == null) return "—";
  const fixed = amount.toFixed(2);
  return unit ? `${fixed} ${unit}` : fixed;
}

export function formatHourMinute(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatKwh(value: number): string {
  return `${value.toFixed(1)} kWh`;
}

export function stripPerKwh(unit: string | null | undefined): string | null {
  if (unit == null) return null;
  const m = /^(.+?)\s*\/\s*kwh$/i.exec(unit.trim());
  return m ? (m[1] ?? unit).trim() : unit;
}
