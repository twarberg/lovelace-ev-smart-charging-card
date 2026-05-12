import { describe, expect, it, vi } from "vitest";
import "../src/components/ev-timeline.js";
import type { EvTimeline } from "../src/components/ev-timeline.js";
import { stubHass } from "./helpers/stub-hass.js";
import { discover } from "../src/lib/discover.js";

function makePrices() {
  const out = [];
  const baseDate = new Date();
  baseDate.setUTCHours(0, 0, 0, 0);
  for (let h = 0; h < 24; h++) {
    const start = new Date(baseDate.getTime() + h * 3_600_000);
    const end = new Date(start.getTime() + 3_600_000);
    out.push({ start: start.toISOString(), end: end.toISOString(), price: 0.5 + (h % 4) * 0.1 });
  }
  return out;
}

describe("ev-timeline", () => {
  it("emits slot-click with isPlanned=true for a planned hour", async () => {
    const prices = makePrices();
    // Find the first future slot to plan (after filtering by _prices())
    const now = Date.now();
    const futureSlots = prices.filter((p) => new Date(p.end).getTime() > now);
    const plannedStart = futureSlots[0]!.start;
    const hass = stubHass({
      states: {
        "sensor.daily_planned_hours": {
          attributes: {
            hours: [plannedStart],
            hour_prices: [0.6],
          },
        },
        "sensor.test_prices": { attributes: { prices } },
      },
    });
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-timeline") as EvTimeline;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;

    const handler = vi.fn();
    el.addEventListener("slot-click", handler as EventListener);

    const rect = el.shadowRoot!.querySelector<SVGElement>("[data-slot-hour='0']");
    expect(rect).toBeTruthy();
    rect!.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));

    expect(handler).toHaveBeenCalledOnce();
    const detail = (handler.mock.calls[0]![0] as CustomEvent).detail;
    expect(detail.isPlanned).toBe(true);
    expect(detail.start).toBe(plannedStart);
  });
});
