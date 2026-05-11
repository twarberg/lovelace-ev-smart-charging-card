import { describe, expect, it } from "vitest";
import { formatCurrency, formatHourMinute, formatKwh, stripPerKwh } from "../src/lib/format.js";

describe("formatCurrency", () => {
  it("formats DKK with two decimals", () => {
    expect(formatCurrency(20.567, "DKK", "en")).toBe("20.57 DKK");
  });
  it("falls back to raw when unit is null", () => {
    expect(formatCurrency(20.567, null, "en")).toBe("20.57");
  });
  it("returns em-dash for null amount", () => {
    expect(formatCurrency(null, "DKK", "en")).toBe("—");
  });
});

describe("formatHourMinute", () => {
  it("local-time HH:mm from ISO", () => {
    const iso = new Date(Date.UTC(2026, 4, 11, 2, 0)).toISOString();
    expect(formatHourMinute(iso)).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("formatKwh", () => {
  it("one decimal + unit", () => {
    expect(formatKwh(11)).toBe("11.0 kWh");
    expect(formatKwh(11.456)).toBe("11.5 kWh");
  });
});

describe("stripPerKwh", () => {
  it.each([
    ["DKK/kWh", "DKK"],
    ["EUR/kWh", "EUR"],
    ["DKK / kWh", "DKK"],
    ["DKK", "DKK"],
    [null, null],
    [undefined, null],
  ])("strips %s -> %s", (input, expected) => {
    expect(stripPerKwh(input as string | null | undefined)).toBe(expected);
  });
});
