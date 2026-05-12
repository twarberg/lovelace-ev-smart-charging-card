import { describe, expect, it } from "vitest";
import "../src/components/ev-window.js";
import type { EvWindow } from "../src/components/ev-window.js";
import { stubHass } from "./helpers/stub-hass.js";
import { discover } from "../src/lib/discover.js";

async function mountWindow(hass: ReturnType<typeof stubHass>): Promise<EvWindow> {
  const ents = discover(hass, "test_dev");
  const el = document.createElement("ev-window") as EvWindow;
  el.hass = hass;
  el.entities = ents;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ev-window empty state", () => {
  it("shows 'No charging planned' when gate is inactive", async () => {
    const hass = stubHass({
      states: {
        "sensor.daily_planned_hours": { attributes: { hours: [] } },
      },
    });
    const el = await mountWindow(hass);
    const text = el.shadowRoot!.querySelector(".empty")!.textContent!.trim();
    expect(text).toBe("No charging planned");
  });

  it("shows gated message when gate is active", async () => {
    const hass = stubHass({
      states: {
        "sensor.daily_planned_hours": { attributes: { hours: [] } },
        "sensor.daily_plan_status": {
          attributes: {
            source_price_entity: "sensor.test_prices",
            charger_kw: 11.0,
            soc_entity: "sensor.test_soc",
            target_soc_entity: "number.test_target",
            min_soc_threshold: 80,
            min_soc_gate_active: true,
          },
        },
      },
    });
    const el = await mountWindow(hass);
    const text = el.shadowRoot!.querySelector(".empty")!.textContent!.trim();
    expect(text).toBe("Charging paused — SoC ≥ 80%");
  });
});
