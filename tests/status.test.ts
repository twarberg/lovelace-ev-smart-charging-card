import { describe, expect, it } from "vitest";
import "../src/components/ev-status.js";
import type { EvStatus } from "../src/components/ev-status.js";
import { stubHass } from "./helpers/stub-hass.js";
import { discover } from "../src/lib/discover.js";

function mount(activelyCharging: "on" | "off"): EvStatus {
  const hass = stubHass({
    states: {
      "binary_sensor.daily_actively_charging": { state: activelyCharging },
      "binary_sensor.daily_plugged_in": { state: "on" },
    },
  });
  const ents = discover(hass, "test_dev");
  const el = document.createElement("ev-status") as EvStatus;
  el.hass = hass;
  el.entities = ents;
  document.body.appendChild(el);
  return el;
}

describe("ev-status charging-now pill", () => {
  it("renders a 'Charging now' pill when actively_charging is on", async () => {
    const el = mount("on");
    await el.updateComplete;
    const pill = el.shadowRoot!.querySelector(".pill-charging");
    expect(pill).not.toBeNull();
    expect(pill!.textContent).toMatch(/charging now/i);
  });

  it("does not render the charging-now pill when actively_charging is off", async () => {
    const el = mount("off");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".pill-charging")).toBeNull();
  });
});

describe("ev-status soc shimmer", () => {
  it("adds .charging class to .soc-fill while actively charging", async () => {
    const hass = stubHass({
      states: {
        "binary_sensor.daily_actively_charging": { state: "on" },
        "binary_sensor.daily_plugged_in": { state: "on" },
        "sensor.daily_plan_status": {
          state: "ok",
          attributes: {
            source_price_entity: "sensor.test_prices",
            charger_kw: 11.0,
            soc_entity: "sensor.test_soc",
            target_soc_entity: "number.test_target",
          },
        },
        "sensor.test_soc": { state: "42" },
        "number.test_target": { state: "80" },
      },
    });
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-status") as EvStatus;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;
    const fill = el.shadowRoot!.querySelector(".soc-fill");
    expect(fill).not.toBeNull();
    expect(fill!.classList.contains("charging")).toBe(true);
  });

  it("omits the .charging class when not actively charging", async () => {
    const hass = stubHass({
      states: {
        "binary_sensor.daily_actively_charging": { state: "off" },
        "binary_sensor.daily_plugged_in": { state: "on" },
        "sensor.test_soc": { state: "42" },
        "number.test_target": { state: "80" },
      },
    });
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-status") as EvStatus;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;
    const fill = el.shadowRoot!.querySelector(".soc-fill");
    expect(fill).not.toBeNull();
    expect(fill!.classList.contains("charging")).toBe(false);
  });
});
