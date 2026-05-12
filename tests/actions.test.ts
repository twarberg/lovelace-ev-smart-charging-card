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

  it("dispatches override-cleared event after successful call", async () => {
    const hass = withOneOffActive(stubHass());
    let resolveCall!: () => void;
    hass.callService = () => new Promise((res) => { resolveCall = () => res(); });

    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    await el.updateComplete;

    let fired = false;
    el.addEventListener("override-cleared", () => { fired = true; });

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.clear")!.click();
    await el.updateComplete;
    expect(fired).toBe(false);
    resolveCall();
    await new Promise((r) => setTimeout(r, 0));
    expect(fired).toBe(true);
  });

  it("hides the Clear button when optimisticOverrideCleared is true", async () => {
    const hass = withOneOffActive(stubHass());
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    el.optimisticOverrideCleared = true;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.clear")).toBeNull();
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
