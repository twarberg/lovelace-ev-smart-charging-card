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

interface ConnOpts {
  plugged?: string;
  charging?: string;
  chargeNow?: string;
  chargeNowSince?: string;
  charger?: string;
}

function mountConn(o: ConnOpts): EvStatus {
  const hass = stubHass({
    states: {
      "binary_sensor.daily_plugged_in": { state: o.plugged ?? "on" },
      "binary_sensor.daily_actively_charging": { state: o.charging ?? "off" },
      "binary_sensor.daily_charge_now": {
        state: o.chargeNow ?? "off",
        last_changed: o.chargeNowSince ?? new Date(0).toISOString(),
      },
      "sensor.daily_plan_status": {
        state: "ok",
        attributes: o.charger !== undefined ? { charger_switch_entity: "switch.wallbox" } : {},
      },
      ...(o.charger !== undefined ? { "switch.wallbox": { state: o.charger } } : {}),
    },
  });
  const el = document.createElement("ev-status") as EvStatus;
  el.hass = hass;
  el.entities = discover(hass, "test_dev");
  document.body.appendChild(el);
  return el;
}

describe("ev-status connection indicators", () => {
  it("shows 'Plugged in' when plugged_in is on", async () => {
    const el = mountConn({ plugged: "on" });
    await el.updateComplete;
    const chip = el.shadowRoot!.querySelector(".conn-plug");
    expect(chip?.textContent).toMatch(/plugged in/i);
    expect(chip?.classList.contains("ok")).toBe(true);
  });

  it("shows 'Unplugged' when plugged_in is off", async () => {
    const el = mountConn({ plugged: "off" });
    await el.updateComplete;
    const chip = el.shadowRoot!.querySelector(".conn-plug");
    expect(chip?.textContent).toMatch(/unplugged/i);
    expect(chip?.classList.contains("ok")).toBe(false);
  });

  it("omits charger chip when integration exposes no charger entity", async () => {
    const el = mountConn({});
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".conn-charger")).toBeNull();
  });

  it("shows 'Charger online' when charger entity has a real state", async () => {
    const el = mountConn({ charger: "off" });
    await el.updateComplete;
    const chip = el.shadowRoot!.querySelector(".conn-charger");
    expect(chip?.textContent).toMatch(/charger online/i);
    expect(chip?.classList.contains("ok")).toBe(true);
  });

  it("shows 'Charger offline' when charger entity is unavailable", async () => {
    const el = mountConn({ charger: "unavailable" });
    await el.updateComplete;
    const chip = el.shadowRoot!.querySelector(".conn-charger");
    expect(chip?.textContent).toMatch(/charger offline/i);
    expect(chip?.classList.contains("bad")).toBe(true);
  });

  it("warns when a charge slot is active but car is not charging", async () => {
    const el = mountConn({ chargeNow: "on", charging: "off" });
    await el.updateComplete;
    const warn = el.shadowRoot!.querySelector(".conn-warning");
    expect(warn?.textContent).toMatch(/not charging/i);
  });

  it("does not warn during the grace period right after the slot starts", async () => {
    const el = mountConn({ chargeNow: "on", charging: "off", chargeNowSince: new Date().toISOString() });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".conn-warning")).toBeNull();
  });

  it("does not warn when actively charging", async () => {
    const el = mountConn({ chargeNow: "on", charging: "on" });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".conn-warning")).toBeNull();
  });

  it("does not warn when unplugged (plug chip already explains it)", async () => {
    const el = mountConn({ chargeNow: "on", charging: "off", plugged: "off" });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".conn-warning")).toBeNull();
  });
});
