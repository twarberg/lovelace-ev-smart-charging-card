import { describe, expect, it } from "vitest";
import "../src/components/ev-actions.js";
import type { EvActions } from "../src/components/ev-actions.js";
import { stubHass } from "./helpers/stub-hass.js";
import { discover } from "../src/lib/discover.js";

function withOneOffActive(hass: ReturnType<typeof stubHass>): ReturnType<typeof stubHass> {
  hass.states["sensor.daily_effective_departure"] = {
    entity_id: "sensor.daily_effective_departure",
    state: "06:00",
    attributes: { source: "one_off" },
    last_changed: new Date(0).toISOString(),
    last_updated: new Date(0).toISOString(),
  };
  return hass;
}

describe("ev-actions charge-now plugged-in guard", () => {
  it("disables Charge now when plugged_in is off", async () => {
    const hass = stubHass({
      states: { "binary_sensor.daily_plugged_in": { state: "off" } },
    });
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.charge")!;
    expect(btn.disabled).toBe(true);
    expect(btn.title).toMatch(/unplugged/i);
  });

  it("enables Charge now when plugged_in is on", async () => {
    const hass = stubHass({
      states: { "binary_sensor.daily_plugged_in": { state: "on" } },
    });
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.charge")!;
    expect(btn.disabled).toBe(false);
  });
});

describe("ev-actions clear-override loading state", () => {
  it("disables the clear button and shows spinner while service call is pending", async () => {
    const hass = withOneOffActive(stubHass());

    let resolveCall!: () => void;
    const pending = new Promise<void>((res) => { resolveCall = res; });
    hass.callService = () => pending;

    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;

    const clearBtn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.clear")!;
    expect(clearBtn.disabled).toBe(false);
    expect(clearBtn.textContent!.trim()).toBe("Clear");

    clearBtn.click();
    await el.updateComplete;

    const busyBtn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.clear")!;
    expect(busyBtn.disabled).toBe(true);
    expect(busyBtn.getAttribute("aria-busy")).toBe("true");
    expect(busyBtn.classList.contains("spinning")).toBe(true);
    expect(busyBtn.textContent!.trim()).toBe("Clearing…");

    resolveCall();
    await pending;
    // _clearing is reset after a 400ms minimum-spin timeout; advance time and re-check.
    await new Promise((r) => setTimeout(r, 450));
    await el.updateComplete;

    const settledBtn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.clear")!;
    expect(settledBtn.disabled).toBe(false);
    expect(settledBtn.getAttribute("aria-busy")).toBe("false");
  });

  it("ignores re-clicks while a call is in flight", async () => {
    const hass = withOneOffActive(stubHass());

    let callCount = 0;
    let resolveCall!: () => void;
    const pending = new Promise<void>((res) => { resolveCall = res; });
    hass.callService = () => {
      callCount += 1;
      return pending;
    };

    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;

    const clearBtn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.clear")!;
    clearBtn.click();
    await el.updateComplete;
    // A second click while the first is in flight must NOT trigger another call.
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.clear")!.click();
    await el.updateComplete;
    expect(callCount).toBe(1);

    resolveCall();
    await pending;
  });
});

describe("ev-actions force-charge-now confirmation", () => {
  function mountActionsPluggedIn() {
    const hass = stubHass({
      states: { "binary_sensor.daily_plugged_in": { state: "on" } },
    });
    const calls: Array<{ domain: string; service: string; data: unknown; target: unknown }> = [];
    hass.callService = async (domain, service, data, target) => {
      calls.push({ domain, service, data, target });
    };
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    return { el, calls };
  }

  it("does not call the service on first click; opens the confirm dialog", async () => {
    const { el, calls } = mountActionsPluggedIn();
    await el.updateComplete;

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.charge")!.click();
    await el.updateComplete;

    expect(calls).toEqual([]);
    const dlg = el.shadowRoot!.querySelector("ev-confirm-dialog") as HTMLElement & { open: boolean };
    expect(dlg).not.toBeNull();
    expect(dlg.open).toBe(true);
  });

  it("calls force_charge_now exactly once after the user confirms", async () => {
    const { el, calls } = mountActionsPluggedIn();
    await el.updateComplete;

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.charge")!.click();
    await el.updateComplete;

    const dlg = el.shadowRoot!.querySelector("ev-confirm-dialog") as HTMLElement & { open: boolean };
    dlg.dispatchEvent(new CustomEvent("confirm-accept", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(calls.length).toBe(1);
    const call = calls[0]!;
    expect(call.domain).toBe("smart_ev_charging");
    expect(call.service).toBe("force_charge_now");
    expect(call.target).toEqual({ entity_id: "sensor.daily_plan_status" });
    expect(dlg.open).toBe(false);
  });

  it("does not call the service if the user cancels", async () => {
    const { el, calls } = mountActionsPluggedIn();
    await el.updateComplete;

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.charge")!.click();
    await el.updateComplete;

    const dlg = el.shadowRoot!.querySelector("ev-confirm-dialog") as HTMLElement & { open: boolean };
    dlg.dispatchEvent(new CustomEvent("confirm-cancel", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(calls).toEqual([]);
    expect(dlg.open).toBe(false);
  });
});
