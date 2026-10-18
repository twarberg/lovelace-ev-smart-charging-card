import { describe, expect, it } from "vitest";
import "../src/components/ev-history.js";
import { bucketTooltip, type EvHistory } from "../src/components/ev-history.js";
import { stubHass } from "./helpers/stub-hass.js";
import { discover } from "../src/lib/discover.js";

describe("bucketTooltip", () => {
  it("includes cost with currency, kWh and session count", () => {
    const text = bucketTooltip(
      { date: "2026-05-01", cost: 12.5, kwh: 22, sessions: [{ start: "a", end: "b", durationHours: 2 }] },
      "DKK",
      "en",
    );
    expect(text).toBe("2026-05-01 · Total 12.50 DKK · 22.0 kWh · 1 sessions");
  });
});

describe("ev-history currency", () => {
  it("reads cost_unit from planned_hours like the window tile", async () => {
    const hass = stubHass({
      states: { "sensor.daily_planned_hours": { state: "2", attributes: { cost_unit: "DKK" } } },
    });
    const el = document.createElement("ev-history") as EvHistory;
    el.hass = hass;
    el.entities = discover(hass, "test_dev");
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".header")!.textContent).toMatch(/DKK/);
  });
});
