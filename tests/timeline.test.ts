import { describe, expect, it, vi } from "vitest";
import "../src/components/ev-timeline.js";
import type { EvTimeline } from "../src/components/ev-timeline.js";
import { stubHass } from "./helpers/stub-hass.js";
import { discover } from "../src/lib/discover.js";

function makePrices() {
  const out = [];
  for (let h = 0; h < 24; h++) {
    const start = new Date(Date.UTC(2026, 4, 11, h, 0));
    const end = new Date(Date.UTC(2026, 4, 11, h + 1, 0));
    out.push({ start: start.toISOString(), end: end.toISOString(), price: 0.5 + (h % 4) * 0.1 });
  }
  return out;
}

describe("ev-timeline", () => {
  it("emits slot-click with isPlanned=true for a planned hour", async () => {
    const hass = stubHass({
      states: {
        "sensor.daily_planned_hours": {
          attributes: {
            hours: [new Date(Date.UTC(2026, 4, 11, 2, 0)).toISOString()],
            hour_prices: [0.6],
          },
        },
        "sensor.test_prices": { attributes: { prices: makePrices() } },
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

    const rect = el.shadowRoot!.querySelector<SVGElement>("[data-slot-hour='2']");
    expect(rect).toBeTruthy();
    rect!.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));

    expect(handler).toHaveBeenCalledOnce();
    const detail = (handler.mock.calls[0]![0] as CustomEvent).detail;
    expect(detail.isPlanned).toBe(true);
    expect(detail.start).toMatch(/T02:00/);
  });
});
