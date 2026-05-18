# Charge-now confirmation dialog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gate `smart_ev_charging.force_charge_now` behind an explicit confirmation modal so misclicks no longer bypass the price plan.

**Architecture:** Introduce a reusable `<ev-confirm-dialog>` Lit component modelled on the existing `<ev-deadline-picker>`. `<ev-actions>` opens it when the Charge-now button is clicked, and only fires the service after the user accepts. Cancel and backdrop click close the dialog without side effects.

**Tech Stack:** Lit 3, TypeScript, Vitest + happy-dom. Existing patterns from `src/components/ev-deadline-picker.ts` and `tests/actions.test.ts` are reused.

---

## File Structure

| File | Action | Responsibility |
| --- | --- | --- |
| `src/components/ev-confirm-dialog.ts` | Create | Generic confirm modal: backdrop, dialog card, title/body/buttons, `confirm-accept`/`confirm-cancel` events, tone variants. |
| `src/components/ev-actions.ts` | Modify | Open the dialog on Charge-now click, fire `force_charge_now` only after accept. |
| `tests/confirm-dialog.test.ts` | Create | Unit tests for the new component: open/close, events, label/tone props, backdrop behaviour. |
| `tests/actions.test.ts` | Modify | Add tests covering the confirmation flow: click does not call service, accept calls service, cancel does not. |

---

## Task 1: `<ev-confirm-dialog>` component — render + basic markup (TDD)

**Files:**
- Create: `src/components/ev-confirm-dialog.ts`
- Create: `tests/confirm-dialog.test.ts`

- [ ] **Step 1: Write the failing render test**

Create `tests/confirm-dialog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import "../src/components/ev-confirm-dialog.js";
import type { EvConfirmDialog } from "../src/components/ev-confirm-dialog.js";

function mount(props: Partial<EvConfirmDialog> = {}): EvConfirmDialog {
  const el = document.createElement("ev-confirm-dialog") as EvConfirmDialog;
  Object.assign(el, props);
  document.body.appendChild(el);
  return el;
}

describe("ev-confirm-dialog rendering", () => {
  it("renders nothing when open is false", async () => {
    const el = mount({ open: false, title: "T", body: "B" });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".dialog")).toBeNull();
  });

  it("renders title, body, and labels when open", async () => {
    const el = mount({
      open: true,
      title: "Force charge now?",
      body: "Ignores the price plan.",
      confirmLabel: "Charge now",
      cancelLabel: "Cancel",
    });
    await el.updateComplete;
    const root = el.shadowRoot!;
    expect(root.querySelector(".title")!.textContent).toBe("Force charge now?");
    expect(root.querySelector(".subtitle")!.textContent!.trim()).toBe("Ignores the price plan.");
    expect(root.querySelector<HTMLButtonElement>("button.primary")!.textContent!.trim()).toBe("Charge now");
    expect(root.querySelector<HTMLButtonElement>("button.cancel")!.textContent!.trim()).toBe("Cancel");
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- tests/confirm-dialog.test.ts`
Expected: FAIL — `ev-confirm-dialog` module does not exist.

- [ ] **Step 3: Create the component with minimal render**

Create `src/components/ev-confirm-dialog.ts`:

```ts
import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";

export type ConfirmTone = "primary" | "warning" | "danger";

@customElement("ev-confirm-dialog")
export class EvConfirmDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = "";
  @property({ type: String }) body = "";
  @property({ type: String }) confirmLabel = "Confirm";
  @property({ type: String }) cancelLabel = "Cancel";
  @property({ type: String }) tone: ConfirmTone = "primary";

  static override styles = css`
    :host { display: contents; }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }
    .dialog {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      padding: 22px 22px 18px;
      border-radius: 14px;
      min-width: 300px;
      max-width: 92vw;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.30);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .title {
      font-size: 1.05em;
      font-weight: 600;
      color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
    }
    .subtitle {
      font-size: 0.85em;
      color: ${unsafeCSS(cssVar("secondaryText", "#475569"))};
      line-height: 1.35;
    }
    .row {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    button {
      padding: 9px 16px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.92em;
      font-weight: 500;
      transition: filter .12s;
      border: 1px solid transparent;
    }
    button:hover { filter: brightness(0.95); }
    button:focus-visible {
      outline: 2px solid ${unsafeCSS(cssVar("primary", "#3b82f6"))};
      outline-offset: 2px;
    }
    button.cancel {
      background: transparent;
      border: 1px solid ${unsafeCSS(cssVar("divider", "#e5e7eb"))};
      color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
    }
    button.primary { color: white; }
    button.primary.primary-tone { background: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; }
    button.primary.warning-tone { background: ${unsafeCSS(cssVar("warning", "#d97706"))}; }
    button.primary.danger-tone  { background: ${unsafeCSS(cssVar("error", "#ef4444"))}; }
  `;

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" @click=${this._onBackdrop} role="presentation">
        <div
          class="dialog"
          @click=${(e: Event) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cnf-title"
          aria-describedby="cnf-desc"
        >
          <div class="title" id="cnf-title">${this.title}</div>
          <div class="subtitle" id="cnf-desc">${this.body}</div>
          <div class="row">
            <button class="cancel" @click=${this._cancel}>${this.cancelLabel}</button>
            <button class="primary ${this.tone}-tone" @click=${this._confirm}>${this.confirmLabel}</button>
          </div>
        </div>
      </div>
    `;
  }

  private _onBackdrop = () => this._cancel();

  private _cancel = () => {
    this.open = false;
    this.dispatchEvent(new CustomEvent("confirm-cancel", { bubbles: true, composed: true }));
  };

  private _confirm = () => {
    this.open = false;
    this.dispatchEvent(new CustomEvent("confirm-accept", { bubbles: true, composed: true }));
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-confirm-dialog": EvConfirmDialog;
  }
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- tests/confirm-dialog.test.ts`
Expected: both tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ev-confirm-dialog.ts tests/confirm-dialog.test.ts
git commit -m "feat(confirm-dialog): add reusable ev-confirm-dialog component"
```

---

## Task 2: `<ev-confirm-dialog>` — accept / cancel / backdrop behaviour (TDD)

**Files:**
- Modify: `tests/confirm-dialog.test.ts`
- (component already complete from Task 1 — these tests verify its event behaviour)

- [ ] **Step 1: Write failing event tests**

Append to `tests/confirm-dialog.test.ts`:

```ts
describe("ev-confirm-dialog events", () => {
  it("primary click dispatches confirm-accept and closes", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const accepts: Event[] = [];
    el.addEventListener("confirm-accept", (e) => accepts.push(e));

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.primary")!.click();
    await el.updateComplete;

    expect(accepts.length).toBe(1);
    expect(el.open).toBe(false);
  });

  it("cancel click dispatches confirm-cancel and closes", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.cancel")!.click();
    await el.updateComplete;

    expect(cancels.length).toBe(1);
    expect(el.open).toBe(false);
  });

  it("backdrop click cancels", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    el.shadowRoot!.querySelector<HTMLElement>(".backdrop")!.click();
    await el.updateComplete;

    expect(cancels.length).toBe(1);
    expect(el.open).toBe(false);
  });

  it("clicking inside the dialog does not cancel", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    el.shadowRoot!.querySelector<HTMLElement>(".dialog")!.click();
    await el.updateComplete;

    expect(cancels.length).toBe(0);
    expect(el.open).toBe(true);
  });
});

describe("ev-confirm-dialog tone variants", () => {
  it("applies warning-tone class when tone='warning'", async () => {
    const el = mount({ open: true, title: "T", body: "B", tone: "warning" });
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.primary")!;
    expect(btn.classList.contains("warning-tone")).toBe(true);
    expect(btn.classList.contains("primary-tone")).toBe(false);
  });

  it("defaults to primary-tone", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.primary")!;
    expect(btn.classList.contains("primary-tone")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npm test -- tests/confirm-dialog.test.ts`
Expected: all tests PASS (component implementation from Task 1 already satisfies them).

If any of the event tests fail, the component is wrong — fix `_confirm`/`_cancel` in `src/components/ev-confirm-dialog.ts` before continuing. Do NOT loosen the test.

- [ ] **Step 3: Commit**

```bash
git add tests/confirm-dialog.test.ts
git commit -m "test(confirm-dialog): cover accept, cancel, backdrop, and tone variants"
```

---

## Task 3: Wire `<ev-confirm-dialog>` into `<ev-actions>` (TDD)

**Files:**
- Modify: `tests/actions.test.ts`
- Modify: `src/components/ev-actions.ts`

- [ ] **Step 1: Add failing integration tests**

Append a new `describe` block to `tests/actions.test.ts` after the existing ones:

```ts
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
    expect(calls[0].domain).toBe("smart_ev_charging");
    expect(calls[0].service).toBe("force_charge_now");
    expect(calls[0].target).toEqual({ entity_id: "sensor.daily_plan_status" });
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
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- tests/actions.test.ts`
Expected: the three new tests FAIL. The first one fails because `_chargeNow` still calls the service directly; the second fails because `confirm-accept` is not wired; the third fails because no dialog is rendered.

- [ ] **Step 3: Update `<ev-actions>` to use the confirm dialog**

In `src/components/ev-actions.ts`:

Add the import near the top with the other component imports:

```ts
import "./ev-confirm-dialog.js";
```

Add a new `@state` field beside `_clearing`:

```ts
@state() private _confirmOpen = false;
```

Replace the existing `_chargeNow` handler:

```ts
private _chargeNow = () => {
  void this.hass.callService("smart_ev_charging", "force_charge_now", {}, this._target());
};
```

with:

```ts
private _chargeNow = () => {
  this._confirmOpen = true;
};

private _onChargeConfirm = () => {
  this._confirmOpen = false;
  void this.hass.callService("smart_ev_charging", "force_charge_now", {}, this._target());
};

private _onChargeCancel = () => {
  this._confirmOpen = false;
};
```

In the `render()` method, immediately after the existing `<ev-deadline-picker>` element, add the dialog:

```ts
<ev-confirm-dialog
  .open=${this._confirmOpen}
  title="Force charge now?"
  body="Ignores the price plan and charges until target SoC or unplug."
  confirmLabel="Charge now"
  tone="warning"
  @confirm-accept=${this._onChargeConfirm}
  @confirm-cancel=${this._onChargeCancel}
></ev-confirm-dialog>
```

- [ ] **Step 4: Run the tests and verify everything passes**

Run: `npm test -- tests/actions.test.ts tests/confirm-dialog.test.ts`
Expected: all tests in both files PASS, including the two existing unplugged-guard tests (which still verify `button.charge` is disabled) and the clear-override loading-state tests.

- [ ] **Step 5: Run the full suite + typecheck**

Run: `npm test`
Expected: full vitest run, all tests PASS.

Run: `npm run typecheck`
Expected: clean exit, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ev-actions.ts tests/actions.test.ts
git commit -m "feat(actions): require confirmation before force-charge-now"
```

---

## Task 4: Manual smoke test in Home Assistant

**Files:** none (verification only).

- [ ] **Step 1: Build the bundle**

Run: `npm run build`
Expected: rollup produces `dist/ev-smart-charging-card.js` without errors.

- [ ] **Step 2: Load the built file into your Home Assistant dev instance**

Replace the existing card resource with the freshly built `dist/ev-smart-charging-card.js` (the project's usual dev-loop — copy to `www/` or whichever path your HA instance uses).

- [ ] **Step 3: Smoke test the four cases**

1. Car plugged in → click **Charge now** → confirm dialog appears with title `Force charge now?`, body about price plan, orange `Charge now` button, grey `Cancel` button.
2. Click **Cancel** → dialog closes; no integration activity (verify in HA Developer Tools → Services log or by watching `binary_sensor.*_charge_now`).
3. Click **Charge now** in the card → confirm in dialog → `smart_ev_charging.force_charge_now` fires once; the integration override engages.
4. Car unplugged → `Charge now` button is disabled and grey; clicking does nothing; dialog never appears.

If any of these behave wrong, stop and fix before proceeding.

- [ ] **Step 4: No commit needed**

This task verifies behaviour; no code changes.

---

## Task 5: Open the pull request

**Files:** none.

- [ ] **Step 1: Push the branch**

Run: `git push -u origin feat/charge-now-confirm`
Expected: branch published.

- [ ] **Step 2: Open the PR**

Run:

```bash
gh pr create --title "feat(actions): confirm before force-charging" --body "$(cat <<'EOF'
## Summary
- Adds a reusable `<ev-confirm-dialog>` Lit component modelled on `<ev-deadline-picker>`.
- Requires explicit confirmation before `smart_ev_charging.force_charge_now` fires from the card.
- Cancel and backdrop click close the dialog without side effects; unplugged guard unchanged.

## Test plan
- [ ] `npm test` passes (new `tests/confirm-dialog.test.ts` + extended `tests/actions.test.ts`).
- [ ] `npm run typecheck` clean.
- [ ] Smoke test in Home Assistant: confirm dialog appears, cancel does nothing, confirm fires the service, unplugged still blocks.
EOF
)"
```

Expected: PR URL returned. Done.
