# Active Charge Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface the `actively_charging` binary_sensor in the card UI (status pill, SoC shimmer, banner) and swap the "Charge now" button to "Stop charge" while current is flowing.

**Architecture:** All changes live in two LitElement components (`ev-status`, `ev-actions`) and the two lang JSON files. No new files. No integration changes. Stop-charge for plan-driven flow calls `switch.turn_off` on the master `smart_charging_enabled` entity (yields the existing `cancelled` state, then Resume reappears).

**Tech Stack:** Lit 3, TypeScript, Vitest + jsdom.

**Spec:** `docs/superpowers/specs/2026-05-24-active-charge-visibility-design.md`

---

## File Map

- Modify: `src/components/ev-status.ts` — add `chargingNow` derivation, "Charging now" pill in `.controls`, `.charging` class + shimmer keyframes on `.soc-fill`.
- Modify: `src/components/ev-actions.ts` — add `chargingNow` derivation, charging-now banner, Stop-charge button branch.
- Modify: `src/lang/en.json` — add `labels.charging_now`, `labels.charging_now_banner`, `actions.stop_charge`.
- Modify: `src/lang/da.json` — same keys, Danish translations.
- Modify: `tests/actions.test.ts` — add suites for charging-now banner and Stop-charge button.
- Create: `tests/status.test.ts` — new test file (no existing ev-status tests).

The default `actively_charging` state in `tests/helpers/stub-hass.ts` is `"ok"` (line 50 of stub-hass.ts), which evaluates as false for `=== "on"`. Existing tests are unaffected.

---

### Task 1: Status tile — Charging now pill

**Files:**
- Modify: `src/components/ev-status.ts`
- Create: `tests/status.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/status.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run tests/status.test.ts`
Expected: FAIL — `.pill-charging` not found.

- [ ] **Step 3: Add `chargingNow` derivation and pill markup**

In `src/components/ev-status.ts`, inside `render()`, after the `forceCountdown` line and before the `soc` declaration, add:

```ts
    const chargingNow =
      this.hass.states[this.entities.activelyCharging]?.state === "on";
```

Then inside `.controls`, immediately before the existing `<span class="pill" ...>plan-status</span>` block, add:

```ts
            ${chargingNow
              ? html`<span
                  class="pill pill-charging"
                  aria-label="Charging now"
                >
                  <span class="pill-dot pulse" aria-hidden="true"></span>
                  Charging now
                </span>`
              : ""}
```

Add CSS rules to the `static override styles` block (after the existing `.pill-dot` rule):

```css
    .pill-charging {
      background: rgba(34,197,94,0.22);
      color: ${unsafeCSS(cssVar("success", "#16a34a"))};
    }
    @media (prefers-reduced-motion: no-preference) {
      .pill-dot.pulse {
        animation: chargingPulse 1.2s ease-in-out infinite;
      }
    }
    @keyframes chargingPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.6); opacity: 0.55; }
    }
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run tests/status.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Run full suite — no regressions**

Run: `npx vitest run`
Expected: all existing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ev-status.ts tests/status.test.ts
git commit -m "feat(status): show pulsing Charging now pill when active

Surface the actively_charging binary_sensor as a green pulsing pill
in the status tile header. Respects prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Status tile — SoC fill shimmer

**Files:**
- Modify: `src/components/ev-status.ts`
- Modify: `tests/status.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/status.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run tests/status.test.ts`
Expected: FAIL — fill missing `.charging` class.

- [ ] **Step 3: Add shimmer class + keyframes**

In `src/components/ev-status.ts`, change the existing `.soc-fill` div to add `chargingNow`-driven class:

Find:

```ts
                  <div class="soc-fill" style="width:${Math.max(0, Math.min(100, soc))}%"></div>
```

Replace with:

```ts
                  <div class="soc-fill ${chargingNow ? "charging" : ""}" style="width:${Math.max(0, Math.min(100, soc))}%"></div>
```

In the `styles` block, find the existing `.soc-fill` rule (which contains `height: 100%; border-radius: 999px; background: linear-gradient(...); transition: width .35s ease;`) and add two declarations inside it: `position: relative;` and `overflow: hidden;`.

Then add these new sibling rules immediately after the `.soc-fill` rule:

```css
    .soc-fill.charging::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        115deg,
        transparent 0%,
        rgba(255,255,255,0.0) 30%,
        rgba(255,255,255,0.55) 50%,
        rgba(255,255,255,0.0) 70%,
        transparent 100%
      );
      background-size: 200% 100%;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      .soc-fill.charging::before {
        animation: socShimmer 1.8s linear infinite;
      }
    }
    @keyframes socShimmer {
      from { background-position: 200% 0; }
      to { background-position: -100% 0; }
    }
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run tests/status.test.ts`
Expected: PASS (4 tests total in the file).

- [ ] **Step 5: Commit**

```bash
git add src/components/ev-status.ts tests/status.test.ts
git commit -m "feat(status): shimmer the SoC fill while actively charging

Adds a moving diagonal sheen across the SoC progress fill when the
actively_charging sensor is on. Disabled under prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Actions tile — Charging now banner

**Files:**
- Modify: `src/components/ev-actions.ts`
- Modify: `tests/actions.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `tests/actions.test.ts`:

```ts
describe("ev-actions charging-now banner", () => {
  function mount(activelyCharging: "on" | "off", planStatus = "ok"): EvActions {
    const hass = stubHass({
      states: {
        "binary_sensor.daily_actively_charging": { state: activelyCharging },
        "binary_sensor.daily_plugged_in": { state: "on" },
        "sensor.daily_plan_status": {
          state: planStatus,
          attributes: { override_mode: null, override_until: null },
        },
      },
    });
    const ents = discover(hass, "test_dev");
    const el = document.createElement("ev-actions") as EvActions;
    el.hass = hass;
    el.entities = ents;
    document.body.appendChild(el);
    return el;
  }

  it("renders the charging-now banner when actively charging", async () => {
    const el = mount("on");
    await el.updateComplete;
    const banner = el.shadowRoot!.querySelector(".banner-charging");
    expect(banner).not.toBeNull();
    expect(banner!.textContent).toMatch(/charging now/i);
  });

  it("hides the charging-now banner when not charging", async () => {
    const el = mount("off");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".banner-charging")).toBeNull();
  });

  it("hides the charging-now banner when status is cancelled", async () => {
    const el = mount("on", "cancelled");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".banner-charging")).toBeNull();
    const cancelledBanner = el.shadowRoot!.querySelector(".banner");
    expect(cancelledBanner!.textContent).toMatch(/cancelled/i);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run tests/actions.test.ts -t "charging-now banner"`
Expected: FAIL — `.banner-charging` not found.

- [ ] **Step 3: Add `chargingNow` derivation + banner**

In `src/components/ev-actions.ts`, inside `render()`, after the existing `forceActive` line, add:

```ts
    const chargingNow =
      this.hass.states[this.entities.activelyCharging]?.state === "on";
```

Inside the returned template, immediately after the existing cancelled-banner block:

```ts
        ${cancelled
          ? html`<div class="banner" role="status">
              <ha-icon icon="mdi:hand-back-left"></ha-icon>
              <span class="banner-text">Charging cancelled — flipped off manually. Resume to re-enable smart charging.</span>
            </div>`
          : ""}
```

Add:

```ts
        ${chargingNow && !cancelled
          ? html`<div class="banner banner-charging" role="status">
              <ha-icon icon="mdi:flash"></ha-icon>
              <span class="banner-text">Charging now</span>
            </div>`
          : ""}
```

Add CSS in the `static override styles` block, after the existing `.banner-text` rule:

```css
    .banner-charging {
      background: rgba(34,197,94,0.15);
      color: ${unsafeCSS(cssVar("success", "#16a34a"))};
    }
    .banner-charging .banner-text { color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))}; }
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx vitest run tests/actions.test.ts -t "charging-now banner"`
Expected: PASS (3 tests).

- [ ] **Step 5: Run full suite — no regressions**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ev-actions.ts tests/actions.test.ts
git commit -m "feat(actions): show charging-now banner above buttons

Renders a green full-width banner above the action buttons whenever
the actively_charging sensor is on and the plan is not cancelled.
Cancelled state still wins (cancelled banner remains the only banner).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Actions tile — Stop charge button (plan-driven)

**Files:**
- Modify: `src/components/ev-actions.ts`
- Modify: `tests/actions.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `tests/actions.test.ts`:

```ts
describe("ev-actions stop-charge (plan-driven)", () => {
  function mount(opts: { actively: "on" | "off"; force?: boolean; cancelled?: boolean }) {
    const overrideMode = opts.force ? "force" : null;
    const planStatus = opts.cancelled ? "cancelled" : "ok";
    const hass = stubHass({
      states: {
        "binary_sensor.daily_actively_charging": { state: opts.actively },
        "binary_sensor.daily_plugged_in": { state: "on" },
        "sensor.daily_plan_status": {
          state: planStatus,
          attributes: { override_mode: overrideMode, override_until: null },
        },
      },
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

  it("shows Stop charge when actively charging from the plan (no force)", async () => {
    const { el } = mount({ actively: "on" });
    await el.updateComplete;
    const stopBtn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.stop");
    expect(stopBtn).not.toBeNull();
    expect(stopBtn!.textContent!.trim()).toMatch(/stop charge/i);
    expect(el.shadowRoot!.querySelector("button.charge")).toBeNull();
    expect(el.shadowRoot!.querySelector("button.stop-force")).toBeNull();
  });

  it("calls switch.turn_off on the smart-charging entity when clicked", async () => {
    const { el, calls } = mount({ actively: "on" });
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.stop")!.click();
    await el.updateComplete;
    expect(calls).toHaveLength(1);
    expect(calls[0].domain).toBe("switch");
    expect(calls[0].service).toBe("turn_off");
    expect(calls[0].target).toEqual({ entity_id: "switch.daily_smart_charging_enabled" });
  });

  it("prefers Stop force charge over Stop charge when force override is active", async () => {
    const { el } = mount({ actively: "on", force: true });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.stop-force")).not.toBeNull();
    expect(el.shadowRoot!.querySelector("button.stop")).toBeNull();
  });

  it("does not render Stop charge when status is cancelled (Resume wins)", async () => {
    const { el } = mount({ actively: "on", cancelled: true });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.stop")).toBeNull();
    expect(el.shadowRoot!.querySelector("button.resume")).not.toBeNull();
  });

  it("falls back to Charge now when not actively charging", async () => {
    const { el } = mount({ actively: "off" });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.charge")).not.toBeNull();
    expect(el.shadowRoot!.querySelector("button.stop")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx vitest run tests/actions.test.ts -t "stop-charge"`
Expected: FAIL — `button.stop` does not exist.

- [ ] **Step 3: Restructure the button precedence + add handler**

In `src/components/ev-actions.ts`, replace the existing button-precedence block (the `${cancelled ? ... : forceActive ? ... : html\`<button class="charge"...>\`}` chain) with this four-way precedence:

```ts
        ${cancelled
          ? html`<button
              class="resume ${this._resuming ? "spinning" : ""}"
              title="Clear cancel override and resume smart charging."
              aria-label="Resume plan"
              aria-busy=${this._resuming ? "true" : "false"}
              ?disabled=${this._resuming}
              @click=${this._resumePlan}
            >
              <ha-icon icon="${this._resuming ? "mdi:loading" : "mdi:play-circle-outline"}"></ha-icon>
              ${this._resuming ? "Resuming…" : "Resume"}
            </button>`
          : forceActive
            ? html`<button
                class="stop-force ${this._resuming ? "spinning" : ""}"
                title="Stop force charging and return to the smart plan."
                aria-label="Stop force charge"
                aria-busy=${this._resuming ? "true" : "false"}
                ?disabled=${this._resuming}
                @click=${this._resumePlan}
              >
                <ha-icon icon="${this._resuming ? "mdi:loading" : "mdi:stop-circle-outline"}"></ha-icon>
                ${this._resuming ? "Stopping…" : "Stop force charge"}
              </button>`
            : chargingNow
              ? html`<button
                  class="stop ${this._stopping ? "spinning" : ""}"
                  title="Stop the current charge by turning smart charging off."
                  aria-label="Stop charge"
                  aria-busy=${this._stopping ? "true" : "false"}
                  ?disabled=${this._stopping}
                  @click=${this._stopCharge}
                >
                  <ha-icon icon="${this._stopping ? "mdi:loading" : "mdi:stop-circle-outline"}"></ha-icon>
                  ${this._stopping ? "Stopping…" : "Stop charge"}
                </button>`
              : html`<button
                  class="charge"
                  title="${unplugged
                    ? "Car is unplugged — plug in to force charge."
                    : "Charge immediately, ignoring the price plan, until target SoC or unplug."}"
                  aria-label="Charge now"
                  ?disabled=${unplugged}
                  @click=${this._chargeNow}
                >
                  <ha-icon icon="mdi:flash"></ha-icon> Charge now
                </button>`}
```

Add the `_stopping` state alongside the existing `@state` declarations near the top of the class:

```ts
  @state() private _stopping = false;
```

Add the `_stopCharge` handler alongside the existing handlers:

```ts
  private _stopCharge = async () => {
    if (this._stopping) return;
    this._stopping = true;
    try {
      await this.hass.callService(
        "switch",
        "turn_off",
        undefined,
        { entity_id: this.entities.smartCharging },
      );
    } finally {
      setTimeout(() => { this._stopping = false; }, 400);
    }
  };
```

Add CSS for `.stop` next to the existing `.stop-force` rule:

```css
    button.stop { background: rgba(239,68,68,0.15); color: ${unsafeCSS(cssVar("error", "#ef4444"))}; }
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx vitest run tests/actions.test.ts -t "stop-charge"`
Expected: PASS (5 tests).

- [ ] **Step 5: Run full suite — no regressions**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ev-actions.ts tests/actions.test.ts
git commit -m "feat(actions): swap Charge now for Stop charge while charging

When actively_charging is on and no force override is active, the
primary action becomes Stop charge, which turns the smart-charging
master switch off (yielding the existing cancelled state and Resume
affordance). Force-charge and cancelled paths keep their existing
buttons.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: i18n keys

**Files:**
- Modify: `src/lang/en.json`
- Modify: `src/lang/da.json`

Note: components currently use hardcoded English; lang files are not yet consumed at runtime (no imports of `src/lang/index.ts` exist in the codebase). The keys are added now for parity with the existing `cancelled_banner` / `force_charging` entries and to make future i18n wiring trivial.

- [ ] **Step 1: Add English keys**

In `src/lang/en.json`, add to `actions`:

```json
    "stop_charge": "Stop charge",
```

Add to `labels`:

```json
    "charging_now": "Charging now",
    "charging_now_banner": "Charging now",
```

Final file should preserve trailing-comma rules of JSON (no trailing commas). Re-check after editing.

- [ ] **Step 2: Add Danish keys**

In `src/lang/da.json`, add to `actions`:

```json
    "stop_charge": "Stop opladning",
```

Add to `labels`:

```json
    "charging_now": "Oplader nu",
    "charging_now_banner": "Oplader nu",
```

- [ ] **Step 3: Verify JSON parses**

Run: `node -e "require('./src/lang/en.json'); require('./src/lang/da.json'); console.log('ok');"`
Expected: `ok`

- [ ] **Step 4: Run full suite**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lang/en.json src/lang/da.json
git commit -m "i18n: add charging_now and stop_charge keys

Adds en/da entries for the new active-charge affordances. Components
still render hardcoded strings today; keys land in the lang files for
parity with the existing cancelled_banner / force_charging entries.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Build + smoke verify

**Files:** none

- [ ] **Step 1: Type-check + build**

Run: `npm run build`
Expected: build succeeds (writes to `dist/`).

- [ ] **Step 2: Run full suite one last time**

Run: `npx vitest run`
Expected: all green.

- [ ] **Step 3: Report**

Summarize: which files changed, which test counts moved, any leftover follow-ups (none expected).
