# Charge-now confirmation dialog

Date: 2026-05-18

## Problem

The "Charge now" button in `ev-actions` fires `smart_ev_charging.force_charge_now` immediately on click. This bypasses cheap-hour optimisation and can cost the user money. A single misclick on a tile-style card is easy and irreversible (the override has to be cleared manually via the underlying integration). A confirmation step prevents accidental triggers without adding meaningful friction for intentional use.

## Goals

- Require explicit confirmation before calling `force_charge_now`.
- Match the visual language of the existing `ev-deadline-picker` modal so the card stays coherent.
- Keep the existing unplugged guard (button disabled when `pluggedIn` is off) and the existing tooltip behaviour.
- Provide a reusable confirm component so future destructive actions can adopt the same UX without duplicating modal code.

## Non-goals

- Localisation of dialog copy. The other strings in `ev-actions` are literal English (`Charge now`, `Set departure`, `Clear`); the lang files are not wired through `ev-actions` today, and rewiring them is out of scope.
- Replacing or refactoring `ev-deadline-picker`. It has a different control surface (time input) and is left alone.
- Persisting a "don't ask me again" preference. YAGNI for a single button.

## Design

### New component: `ev-confirm-dialog`

Path: `src/components/ev-confirm-dialog.ts`

A generic confirmation modal modelled directly on `ev-deadline-picker`'s backdrop/dialog/button-row structure, minus the time input.

**Properties**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` (reflect) | `false` | Controls visibility. |
| `title` | `string` | `""` | Heading shown in the dialog. |
| `body` | `string` | `""` | Description paragraph under the title. |
| `confirmLabel` | `string` | `"Confirm"` | Text on the primary action button. |
| `cancelLabel` | `string` | `"Cancel"` | Text on the secondary action button. |
| `tone` | `"primary" \| "warning" \| "danger"` | `"primary"` | Selects the primary-button colour scheme. |

**Events**

| Event | When |
| --- | --- |
| `confirm-accept` | User clicks the primary button. Component sets `open = false` before dispatching. |
| `confirm-cancel` | User clicks Cancel or the backdrop. Component sets `open = false` before dispatching. |

Both events `bubbles: true, composed: true` so consumers in light DOM can listen.

**Styling**

- Reuse the same CSS structure as `ev-deadline-picker`: fixed backdrop with blur, centred dialog card, theme-aware colours via `cssVar`.
- Tone variants on the primary button:
  - `primary` → existing `cssVar("primary", "#3b82f6")` blue.
  - `warning` → `cssVar("warning", "#d97706")` orange (matches the `.charge` button).
  - `danger` → `cssVar("error", "#ef4444")` red.
- Backdrop click triggers cancel (same behaviour as the deadline picker).
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`/`aria-describedby` mirroring the deadline picker.

### `ev-actions` integration

- Add `@state() private _confirmOpen = false;`.
- `_chargeNow` is rewritten to open the dialog only:
  ```ts
  private _chargeNow = () => {
    this._confirmOpen = true;
  };
  ```
- New handler invokes the service after the user accepts:
  ```ts
  private _onChargeConfirm = () => {
    this._confirmOpen = false;
    void this.hass.callService("smart_ev_charging", "force_charge_now", {}, this._target());
  };
  ```
- `_onChargeCancel = () => { this._confirmOpen = false; };`
- Render the dialog next to the existing `ev-deadline-picker`:
  ```html
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
- The existing `?disabled=${unplugged}` on the Charge-now button stays. A disabled button cannot fire `_chargeNow`, so the dialog never opens while unplugged.

### Data flow

```
user click → _chargeNow → _confirmOpen = true
                      ↓
             <ev-confirm-dialog open>
                ↓                  ↓
        confirm-accept       confirm-cancel
                ↓                  ↓
        _onChargeConfirm     _onChargeCancel
                ↓                  ↓
   hass.callService(...)    no service call
                ↓                  ↓
             dialog closed in both branches
```

### Accessibility

- Dialog uses `role="dialog"` + `aria-modal="true"` (matches deadline picker).
- Primary button receives focus when dialog opens — implemented via `updated()` lifecycle in `ev-confirm-dialog`, focusing the primary button when `open` flips to `true`. (Same approach is not currently used by `ev-deadline-picker`, but adding it here costs little and improves keyboard UX.)
- `Esc` key triggers cancel via a `keydown` listener attached while open.

## Testing

Extend `tests/actions.test.ts`:

1. **Confirmation gates the service call** — render `ev-actions` plugged in, click `button.charge`, assert `hass.callService` was not called and `ev-confirm-dialog` has `open` truthy.
2. **Accept fires the service** — open the dialog as above, dispatch `confirm-accept` from the dialog (or click its primary button), assert exactly one `force_charge_now` call with `entity_id: planStatus`.
3. **Cancel does not fire the service** — open dialog, dispatch `confirm-cancel`, assert no call and dialog closed.
4. **Disabled state still blocks** — existing unplugged test stays as-is. The disabled `?disabled` attribute already suppresses click events; no extra assertion needed beyond confirming the dialog is not rendered (`open` false) when the button is disabled.

New file `tests/confirm-dialog.test.ts`:

1. Renders nothing when `open` is false.
2. Renders title, body, confirm/cancel labels when `open` is true.
3. Primary click dispatches `confirm-accept` and flips `open` to false.
4. Cancel click and backdrop click dispatch `confirm-cancel`.
5. Tone prop changes the primary button class.

## Error handling

`hass.callService` returns a promise. The existing `_chargeNow` ignored the result (`void ...`); the new `_onChargeConfirm` keeps that behaviour. No new failure surface is introduced. Closing the dialog before awaiting the call matches the current "fire and forget" UX and avoids the dialog appearing to hang if the back-end is slow.

## Rollout

Single PR. No feature flag — UX-only change behind an existing button. Manual smoke test in Home Assistant: open card, click Charge now plugged in, confirm dialog appears, accept fires service, cancel does nothing.

## Open questions

None at design time. Wording confirmed with the user; tone defaults agreed; non-goals scoped.
